# Gesture Controlled System

A real-time gesture recognition system using MediaPipe + FastAPI backend and a React frontend.

## Team
- Backend: Yash Khanavkar — `backend/`
- Frontend: Shubhaan Banerjee, Janhavi Ahire — `frontend/`

## Running locally
### Backend
cd backend && pip install -r requirements.txt && uvicorn main:app --reload

### Frontend
cd frontend && npm install && npm run dev

## Gestures supported
| Gesture | Action |
|---------|--------|
| Open hand | Stop / pause |
| Fist | Select |
| Pointing | Move cursor |
| Peace ✌️ | Next slide |
| Thumbs up | Confirm |
| Call me 🤙 | Volume up |
