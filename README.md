# 🖐️ Gesture Controlled System

A real-time hand gesture recognition system built with **MediaPipe**, **FastAPI**, and **React**. Control volume, slides, and media playback using just your hand gestures — no keyboard or mouse needed!

---

## 👥 Team

| Name | Role |
|------|------|
| Yash Khanavkar | Backend Developer |
| Shubhaan Banerjee | Frontend Developer |
| Janhavi Ahire | Frontend Developer |

---

## 🎯 Gestures & Actions

| Gesture | Hand Sign | Action |
|---------|-----------|--------|
| Thumbs Up | 👍 | 🔊 Volume Up (+10%) |
| Fist | ✊ | 🔇 Volume Down (-10%) |
| Peace | ✌️ | ⏭️ Next Slide |
| Pointing | ☝️ | ⏮️ Previous Slide |
| Open Hand | 🖐️ | ⏸️ Pause / Stop |
| Call Me | 🤙 | ▶️ Play / Resume |

---

## 🛠️ Tech Stack

### Backend
- **Python** — Core language
- **FastAPI** — WebSocket server
- **MediaPipe** — Hand landmark detection
- **OpenCV** — Frame processing

### Frontend
- **React** — UI framework
- **Vite** — Build tool
- **WebSocket API** — Real-time communication with backend

---

## 📁 Project Structure
gesture-controlled-system/
├── backend/
│   ├── main.py              # FastAPI server + WebSocket
│   ├── gesture.py           # MediaPipe + gesture classifier
│   ├── requirements.txt     # Python dependencies
│   └── hand_landmarker.task # MediaPipe model file
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main UI + action handlers
│   │   ├── useGesture.js    # WebSocket + webcam hook
│   │   ├── LandmarkOverlay.jsx # Hand landmark drawing
│   │   └── App.css          # Styles
│   ├── package.json
│   └── vite.config.js
└── README.md
---

## 🚀 Running Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- A webcam

### Step 1 — Clone the repo
```bash
git clone https://github.com/Alphaa1556/gesture-controlled-system.git
cd gesture-controlled-system
```

### Step 2 — Start the Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
Backend runs on **http://localhost:8000**

> Note: On first run, the MediaPipe hand landmark model (~25MB) will be downloaded automatically.

### Step 3 — Start the Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on **http://localhost:5173**

### Step 4 — Open the app
Go to **http://localhost:5173** in your browser and allow webcam access.

---

## ⚙️ How It Works

1. The **frontend** captures webcam frames every 100ms
2. Each frame is encoded as base64 JPEG and sent over **WebSocket** to the backend
3. The **backend** runs MediaPipe hand landmark detection on each frame
4. 21 hand landmarks are analyzed to classify the gesture
5. The gesture result is sent back to the frontend over WebSocket
6. The **frontend** displays the gesture and triggers the corresponding action

---

## 🔌 API Reference

### WebSocket — `ws://localhost:8000/ws/gesture`

**Send (Frontend → Backend):**
```json
{ "frame": "<base64 encoded JPEG>" }
```

**Receive (Backend → Frontend):**
```json
{
  "gesture": "thumbs_up",
  "landmarks": [
    { "x": 0.5, "y": 0.3, "z": -0.02 },
    ...
  ]
}
```

### REST Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/gestures` | List all supported gestures |

---

## 🐛 Common Issues

| Issue | Fix |
|-------|-----|
| `Disconnected — run the backend!` | Run `uvicorn main:app --reload` in the `backend/` folder |
| `mediapipe has no attribute solutions` | Run `pip install mediapipe==0.10.33` |
| Frontend shows blank page | Run `npm install` then `npm run dev` in `frontend/` folder |
| Gestures not detecting | Make sure your hand is clearly visible and well lit |

---

## 📝 Dependencies

### Backend (`requirements.txt`)
fastapi
uvicorn
mediapipe==0.10.33
opencv-python
websockets
python-multipart
numpy

### Frontend
react
vite
