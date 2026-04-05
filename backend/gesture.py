import cv2
import numpy as np
import mediapipe as mp
import os
import urllib.request

from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from mediapipe.tasks.python.vision import HandLandmarker, HandLandmarkerOptions, RunningMode

MODEL_PATH = "hand_landmarker.task"
if not os.path.exists(MODEL_PATH):
    print("Downloading hand landmark model...")
    urllib.request.urlretrieve(
        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        MODEL_PATH
    )
    print("Model downloaded!")

base_options = python.BaseOptions(model_asset_path=MODEL_PATH)
options = HandLandmarkerOptions(
    base_options=base_options,
    running_mode=RunningMode.IMAGE,
    num_hands=1,
    min_hand_detection_confidence=0.5,
    min_hand_presence_confidence=0.5,
    min_tracking_confidence=0.5
)
detector = HandLandmarker.create_from_options(options)


def get_finger_states(landmarks, handedness="Right"):
    states = []

    # --- Thumb ---
    thumb_tip = landmarks[4]
    thumb_mcp = landmarks[2]
    wrist     = landmarks[0]

    # Thumb up = tip is significantly above wrist
    thumb_up = thumb_tip.y < wrist.y - 0.1

    # Thumb sideways = tip is away from mcp horizontally
    if handedness == "Right":
        thumb_side = thumb_tip.x < thumb_mcp.x - 0.03
    else:
        thumb_side = thumb_tip.x > thumb_mcp.x + 0.03

    states.append(thumb_up or thumb_side)

    # --- Four fingers ---
    # Compare TIP vs PIP — more lenient detection
    finger_tips = [8, 12, 16, 20]
    finger_pip  = [6, 10, 14, 18]

    for tip, pip in zip(finger_tips, finger_pip):
        states.append(landmarks[tip].y < landmarks[pip].y - 0.02)

    return states


def classify_gesture(landmarks, handedness="Right"):
    f = get_finger_states(landmarks, handedness)
    thumb, index, middle, ring, pinky = f

    # Count how many fingers (not thumb) are extended
    fingers_up = sum([index, middle, ring, pinky])

    # Open hand — all 4 fingers extended
    if fingers_up == 4:
        return "open_hand"

    # Thumbs up — only thumb up, no fingers
    if thumb and fingers_up == 0:
        return "thumbs_up"

    # Fist — nothing extended at all
    if not thumb and fingers_up == 0:
        return "fist"

    # Peace — index + middle up, others down
    if index and middle and not ring and not pinky:
        return "peace"

    # Pointing — only index up
    if index and not middle and not ring and not pinky:
        return "pointing"

    # Call me — thumb + pinky, middle fingers down
    if thumb and pinky and not index and not middle and not ring:
        return "call_me"

    return "unknown"


def process_frame(frame_bytes):
    nparr = np.frombuffer(frame_bytes, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if frame is None:
        return {"gesture": "none", "landmarks": []}

    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=frame_rgb)

    result = detector.detect(mp_image)

    if not result.hand_landmarks:
        return {"gesture": "none", "landmarks": []}

    lm = result.hand_landmarks[0]
    handedness = result.handedness[0][0].category_name

    gesture = classify_gesture(lm, handedness)
    landmarks = [{"x": l.x, "y": l.y, "z": l.z} for l in lm]

    return {"gesture": gesture, "landmarks": landmarks}