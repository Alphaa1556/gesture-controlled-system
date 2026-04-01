from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from gesture import process_frame
import base64
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten for production
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "Gesture backend running"}

@app.get("/gestures")
def list_gestures():
    return {
        "gestures": [
            "open_hand", "fist", "pointing",
            "peace", "call_me", "thumbs_up", "unknown", "none"
        ]
    }

@app.websocket("/ws/gesture")
async def gesture_ws(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)

            # Expect: { "frame": "<base64 jpeg>" }
            frame_bytes = base64.b64decode(payload["frame"])
            result = process_frame(frame_bytes)

            await websocket.send_text(json.dumps(result))
    except WebSocketDisconnect:
        print("Client disconnected")