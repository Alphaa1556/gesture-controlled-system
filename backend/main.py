from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from gesture import process_frame
import base64
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
            try:
                data = await websocket.receive_text()
                payload = json.loads(data)

                # Validate frame exists
                if "frame" not in payload or not payload["frame"]:
                    await websocket.send_text(json.dumps({
                        "gesture": "none", "landmarks": []
                    }))
                    continue

                # Clean and decode base64
                frame_data = payload["frame"]
                # Remove data URL prefix if present
                if "," in frame_data:
                    frame_data = frame_data.split(",")[1]

                # Add padding if needed
                missing_padding = len(frame_data) % 4
                if missing_padding:
                    frame_data += "=" * (4 - missing_padding)

                frame_bytes = base64.b64decode(frame_data)

                if len(frame_bytes) == 0:
                    await websocket.send_text(json.dumps({
                        "gesture": "none", "landmarks": []
                    }))
                    continue

                result = process_frame(frame_bytes)
                await websocket.send_text(json.dumps(result))

            except json.JSONDecodeError:
                continue
            except Exception as e:
                print(f"Frame error: {e}")
                await websocket.send_text(json.dumps({
                    "gesture": "none", "landmarks": []
                }))
                continue

    except WebSocketDisconnect:
        print("Client disconnected")