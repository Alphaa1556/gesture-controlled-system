import { useEffect, useRef, useState } from "react";

export function useGesture() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const wsRef = useRef(null);
  const intervalRef = useRef(null);

  const [gesture, setGesture] = useState("none");
  const [connected, setConnected] = useState(false);
  const [landmarks, setLandmarks] = useState([]);

  useEffect(() => {
    // 1. Start webcam
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    });

    // 2. Connect to backend WebSocket
    const ws = new WebSocket("ws://localhost:8000/ws/gesture");
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setGesture(data.gesture);
      setLandmarks(data.landmarks || []);
    };

    // 3. Send a frame every 100ms
    intervalRef.current = setInterval(() => {
      if (ws.readyState !== WebSocket.OPEN) return;
      if (!videoRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);

      // Convert frame to base64 JPEG and send
      const frame = canvas.toDataURL("image/jpeg", 0.7).split(",")[1];
      ws.send(JSON.stringify({ frame }));
    }, 100);

    return () => {
      clearInterval(intervalRef.current);
      ws.close();
    };
  }, []);

  return { videoRef, canvasRef, gesture, connected, landmarks };
}