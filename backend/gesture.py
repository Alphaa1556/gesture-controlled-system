import cv2
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import urllib.request
import os

MODEL_PATH = "hand_landmarker.task"

if not os.path.exists(MODEL_PATH):
    print("Downloading hand landmarker model...")
    urllib.request.urlretrieve(
        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        MODEL_PATH
    )
    print("Model downloaded!")

base_options = python.BaseOptions(model_asset_path=MODEL_PATH)
options = vision.HandLandmarkerOptions(
    base_options=base_options,
    num_hands=1,
    min_hand_detection_confidence=0.5,
    min_hand_presence_confidence=0.5,
    min_tracking_confidence=0.5
)
detector = vision.HandLandmarker.create_from_options(options)

def get_finger_states(landmarks):
    tips = [4, 8, 12, 16, 20]
    pip  = [3, 6, 10, 14, 18]
    states = []
    states.append(landmarks[4].x < landmarks[3].x)
    for i in range(1, 5):
        states.append(landmarks[tips[i]].y < landmarks[pip[i]].y)
    return states

def classify_gesture(landmarks):
    f = get_finger_states(landmarks)
    thumb, index, middle, ring, pinky = f

    if all(f):                                          return "open_hand"
    if not any(f):                                      return "fist"
    if index and not middle and not ring and not pinky: return "pointing"
    if index and middle and not ring and not pinky:     return "peace"
    if thumb and pinky and not index and not middle:    return "call_me"
    if thumb and not index and not middle and not ring: return "thumbs_up"
    return "unknown"

def process_frame(frame_bytes):
    try:
        nparr = np.frombuffer(frame_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            return {"gesture": "none", "landmarks": []}

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(
            image_format=mp.ImageFormat.SRGB,
            data=frame_rgb
        )

        result = detector.detect(mp_image)

        if not result.hand_landmarks:
            return {"gesture": "none", "landmarks": []}

        lm = result.hand_landmarks[0]
        gesture = classify_gesture(lm)
        landmarks_out = [{"x": l.x, "y": l.y, "z": l.z} for l in lm]

        return {"gesture": gesture, "landmarks": landmarks_out}

    except Exception as e:
        print(f"Error: {e}")
        return {"gesture": "none", "landmarks": []}