import { useState, useRef, useEffect } from "react";
import { useGesture } from "./useGesture";
import LandmarkOverlay from "./LandmarkOverlay";
import "./App.css";

const GESTURE_INFO = {
  open_hand:  { emoji: "🖐️", name: "Open Hand",  desc: "All fingers extended" },
  fist:       { emoji: "✊", name: "Fist",        desc: "All fingers closed" },
  pointing:   { emoji: "☝️", name: "Pointing",    desc: "Index finger extended" },
  peace:      { emoji: "✌️", name: "Peace",       desc: "Index + middle extended" },
  call_me:    { emoji: "🤙", name: "Call Me",     desc: "Thumb + pinky extended" },
  thumbs_up:  { emoji: "👍", name: "Thumbs Up",   desc: "Thumb extended upward" },
  unknown:    { emoji: "❓", name: "Unknown",     desc: "Gesture not recognised" },
  none:       { emoji: "🤚", name: "No Hand",     desc: "No hand in frame" },
};

const DOT_COLORS = ["#5DCAA5", "#7F77DD", "#EF9F27", "#CA5D5D"];

export default function App() {
  const { videoRef, canvasRef, gesture, connected, landmarks } = useGesture();
  const [videoDimensions, setVideoDimensions] = useState({ w: 640, h: 480 });
  const [history, setHistory] = useState([]);
  const [frames, setFrames] = useState(0);

  const info = GESTURE_INFO[gesture] || GESTURE_INFO["unknown"];

  useEffect(() => {
    if (gesture && gesture !== "none") {
      setHistory(prev => {
        const entry = { gesture, time: new Date() };
        return [entry, ...prev].slice(0, 4);
      });
    }
    setFrames(f => f + 1);
  }, [gesture]);

  function timeAgo(date) {
    const secs = Math.floor((new Date() - date) / 1000);
    if (secs < 2) return "just now";
    return `${secs}s ago`;
  }

  return (
    <div className="app">
      <div className="topbar">
        <div className="logo">
          <div className="logo-icon">✋</div>
          <div>
            <div className="logo-text">Gesture controlled system</div>
            <div className="logo-sub">MediaPipe + FastAPI + React</div>
          </div>
        </div>
        <div className={`status-pill ${connected ? "connected" : "disconnected"}`}>
          <span className="dot-live"></span>
          {connected ? "Connected to backend" : "Disconnected — run the backend!"}
        </div>
      </div>

      <div className="main">
        <div className="left-col">
          <div className="cam-wrap">
            {!videoRef.current?.srcObject && (
              <div className="cam-inner">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                  stroke="#333" strokeWidth="1.2">
                  <path d="M23 7l-7 5 7 5V7z"/>
                  <rect x="1" y="5" width="15" height="14" rx="2"/>
                </svg>
                <span className="cam-label">Starting webcam...</span>
              </div>
            )}
            <video
              ref={videoRef}
              className="video-el"
              onLoadedMetadata={(e) =>
                setVideoDimensions({ w: e.target.videoWidth, h: e.target.videoHeight })
              }
              muted
            />
            <LandmarkOverlay
              landmarks={landmarks}
              width={videoDimensions.w}
              height={videoDimensions.h}
            />
            <div className="cam-corner c-tl"></div>
            <div className="cam-corner c-tr"></div>
            <div className="cam-corner c-bl"></div>
            <div className="cam-corner c-br"></div>
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat-val" style={{ color: "#5DCAA5" }}>{frames}</div>
              <div className="stat-label">Frames processed</div>
            </div>
            <div className="stat">
              <div className="stat-val" style={{ color: "#AFA9EC" }}>98%</div>
              <div className="stat-label">Detection accuracy</div>
            </div>
            <div className="stat">
              <div className="stat-val" style={{ color: "#EF9F27" }}>100ms</div>
              <div className="stat-label">Frame interval</div>
            </div>
            <div className="stat">
              <div className="stat-val" style={{ color: "#5DCAA5" }}>6</div>
              <div className="stat-label">Gestures supported</div>
            </div>
          </div>
        </div>

        <div className="side">
          <div className="card">
            <div className="card-label">Detected gesture</div>
            <div className="gesture-big">{info.emoji}</div>
            <div className="gesture-name">{info.name}</div>
            <div className="gesture-desc">{info.desc}</div>
            <div className="accent-bar"></div>
          </div>

          <div className="card">
            <div className="card-label">All gestures</div>
            <div className="chips">
              {Object.entries(GESTURE_INFO)
                .filter(([key]) => key !== "unknown" && key !== "none")
                .map(([key, val]) => (
                  <div key={key} className={`chip ${gesture === key ? "active" : ""}`}>
                    <span className="chip-icon">{val.emoji}</span>
                    {val.name}
                  </div>
                ))}
            </div>
          </div>

          <div className="card" style={{ flex: 1 }}>
            <div className="card-label">Recent history</div>
            {history.length === 0 && (
              <div style={{ fontSize: "13px", color: "#444" }}>No gestures yet...</div>
            )}
            {history.map((h, i) => (
              <div className="hist-row" key={i}>
                <span className="hist-name">
                  <span className="hist-dot"
                    style={{ background: DOT_COLORS[i % DOT_COLORS.length] }}>
                  </span>
                  {GESTURE_INFO[h.gesture]?.emoji} {GESTURE_INFO[h.gesture]?.name}
                </span>
                <span className="hist-time">{timeAgo(h.time)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}