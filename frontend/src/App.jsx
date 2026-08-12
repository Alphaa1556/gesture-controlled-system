import { useState, useRef, useEffect, useCallback } from "react";
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

const GESTURE_ACTIONS = {
  thumbs_up:  { label: "🔊 Volume Up",     color: "#5DCAA5" },
  fist:       { label: "🔇 Volume Down",   color: "#CA5D5D" },
  peace:      { label: "⏭️ Next Slide",    color: "#7F77DD" },
  pointing:   { label: "⏮️ Prev Slide",    color: "#EF9F27" },
  open_hand:  { label: "⏸️ Pause / Stop",  color: "#AFA9EC" },
  call_me:    { label: "▶️ Play / Resume", color: "#5DCAA5" },
};

const DOT_COLORS = ["#5DCAA5", "#7F77DD", "#EF9F27", "#CA5D5D"];

export default function App() {
  const { videoRef, canvasRef, gesture, connected, landmarks } = useGesture();
  const [videoDimensions, setVideoDimensions] = useState({ w: 640, h: 480 });
  const [history, setHistory] = useState([]);
  const [frames, setFrames] = useState(0);
  const [volume, setVolume] = useState(50);
  const [actionFeedback, setActionFeedback] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [slideIndex, setSlideIndex] = useState(1);

  const prevGestureRef = useRef("none");
  const cooldownRef = useRef(false);
  const gainNodeRef = useRef(null);

  useEffect(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.value = 0.5;
    gainNodeRef.current = gainNode;
  }, []);

  const showFeedback = (msg) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(""), 1500);
  };

  const handleGestureAction = useCallback((g) => {
    if (cooldownRef.current) return;
    if (g === prevGestureRef.current) return;
    if (g === "none" || g === "unknown") return;

    prevGestureRef.current = g;
    cooldownRef.current = true;
    setTimeout(() => { cooldownRef.current = false; }, 1000);

    switch (g) {
      case "thumbs_up":
        setVolume(prev => {
          const next = Math.min(100, prev + 10);
          if (gainNodeRef.current)
            gainNodeRef.current.gain.value = next / 100;
          showFeedback(`🔊 Volume: ${next}%`);
          return next;
        });
        break;

      case "fist":
        setVolume(prev => {
          const next = Math.max(0, prev - 10);
          if (gainNodeRef.current)
            gainNodeRef.current.gain.value = next / 100;
          showFeedback(`🔉 Volume: ${next}%`);
          return next;
        });
        break;

      case "peace":
        setSlideIndex(prev => {
          const next = prev + 1;
          showFeedback(`⏭️ Slide → ${next}`);
          return next;
        });
        break;

      case "pointing":
        setSlideIndex(prev => {
          const next = Math.max(1, prev - 1);
          showFeedback(`⏮️ Slide → ${next}`);
          return next;
        });
        break;

      case "open_hand":
        setIsPlaying(false);
        showFeedback("⏸️ Paused");
        break;

      case "call_me":
        setIsPlaying(true);
        showFeedback("▶️ Playing");
        break;

      default:
        break;
    }
  }, []);

  useEffect(() => {
    handleGestureAction(gesture);
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

  const info = GESTURE_INFO[gesture] || GESTURE_INFO["unknown"];

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

      {actionFeedback && (
        <div style={{
          position: "fixed", top: "80px", left: "50%",
          transform: "translateX(-50%)",
          background: "#1a1a2e", border: "1px solid #7F77DD",
          color: "#fff", padding: "10px 24px", borderRadius: "24px",
          fontSize: "18px", fontWeight: "600", zIndex: 999,
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)"
        }}>
          {actionFeedback}
        </div>
      )}

      <div className="main">
        <div className="left-col">
          <div className="cam-wrap">
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

          <div className="stats" style={{ marginTop: "12px" }}>
            <div className="stat">
              <div className="stat-val" style={{ color: "#5DCAA5" }}>{frames}</div>
              <div className="stat-label">Frames</div>
            </div>
            <div className="stat">
              <div className="stat-val" style={{ color: "#EF9F27" }}>{volume}%</div>
              <div className="stat-label">Volume</div>
            </div>
            <div className="stat">
              <div className="stat-val" style={{ color: "#7F77DD" }}>#{slideIndex}</div>
              <div className="stat-label">Slide</div>
            </div>
            <div className="stat">
              <div className="stat-val" style={{ color: isPlaying ? "#5DCAA5" : "#CA5D5D" }}>
                {isPlaying ? "▶️" : "⏸️"}
              </div>
              <div className="stat-label">State</div>
            </div>
          </div>

          <div style={{ padding: "8px 0 0" }}>
            <div style={{ fontSize: "11px", color: "#555", marginBottom: "4px" }}>
              🔊 Volume
            </div>
            <div style={{
              height: "8px", background: "#222",
              borderRadius: "4px", overflow: "hidden"
            }}>
              <div style={{
                width: `${volume}%`, height: "100%",
                background: volume > 70 ? "#CA5D5D" : volume > 40 ? "#EF9F27" : "#5DCAA5",
                borderRadius: "4px", transition: "width 0.3s, background 0.3s"
              }} />
            </div>
          </div>
        </div>

        <div className="side">
          <div className="card">
            <div className="card-label">Detected gesture</div>
            <div className="gesture-big">{info.emoji}</div>
            <div className="gesture-name">{info.name}</div>
            <div className="gesture-desc">{info.desc}</div>
            {GESTURE_ACTIONS[gesture] && (
              <div style={{
                marginTop: "8px", fontSize: "13px", fontWeight: "600",
                color: GESTURE_ACTIONS[gesture].color
              }}>
                Action: {GESTURE_ACTIONS[gesture].label}
              </div>
            )}
            <div className="accent-bar"></div>
          </div>

          <div className="card">
            <div className="card-label">Gesture → Action map</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {Object.entries(GESTURE_ACTIONS).map(([key, val]) => (
                <div key={key} style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", fontSize: "13px",
                  padding: "4px 8px", borderRadius: "6px",
                  background: gesture === key ? "#1a1a2e" : "transparent",
                  border: gesture === key
                    ? `1px solid ${val.color}` : "1px solid transparent"
                }}>
                  <span>{GESTURE_INFO[key]?.emoji} {GESTURE_INFO[key]?.name}</span>
                  <span style={{ color: val.color }}>{val.label}</span>
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