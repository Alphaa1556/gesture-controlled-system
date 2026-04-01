import cv2
import mediapipe as mp
import math

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.6
)

def get_finger_states(landmarks):
    """Returns [thumb, index, middle, ring, pinky] — True = extended"""
    tips = [4, 8, 12, 16, 20]
    pip  = [3, 6, 10, 14, 18]
    states = []
    # Thumb: compare x instead of y
    states.append(landmarks[4].x < landmarks[3].x)
    for i in range(1, 5):
        states.append(landmarks[tips[i]].y < landmarks[pip[i]].y)
    return states

def classify_gesture(landmarks):
    f = get_finger_states(landmarks)
    thumb, index, middle, ring, pinky = f

    if all(f):                         return "open_hand"
    if not any(f):                     return "fist"
    if index and not middle and not ring and not pinky: return "pointing"
    if index and middle and not ring and not pinky:    return "peace"
    if thumb and pinky and not index and not middle:   return "call_me"
    if thumb and not index and not middle:             return "thumbs_up"
    return "unknown"

def process_frame(frame_bytes):
    """Takes raw JPEG bytes, returns gesture + landmarks"""
    import numpy as np
    nparr = np.frombuffer(frame_bytes, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    result = hands.process(frame_rgb)
    if not result.multi_hand_landmarks:
        return {"gesture": "none", "landmarks": []}

    lm = result.multi_hand_landmarks[0].landmark
    gesture = classify_gesture(lm)
    landmarks = [{"x": l.x, "y": l.y, "z": l.z} for l in lm]

    return {"gesture": gesture, "landmarks": landmarks}