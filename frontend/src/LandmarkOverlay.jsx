export default function LandmarkOverlay({ landmarks, width, height }) {
  if (!landmarks.length) return null;

  return (
    <svg
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      viewBox={`0 0 ${width} ${height}`}
    >
      {landmarks.map((lm, i) => (
        <circle
          key={i}
          cx={lm.x * width}
          cy={lm.y * height}
          r="6"
          fill="#00ff88"
          opacity="0.85"
        />
      ))}
    </svg>
  );
}