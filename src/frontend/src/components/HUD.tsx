import { useEffect, useState } from "react";

export function HUD() {
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const onLock = () => setLocked(true);
    const onUnlock = () => setLocked(false);
    document.addEventListener("pointerlockchange", onLock);
    document.addEventListener("pointerlockchange", onUnlock);

    const handler = () => {
      setLocked(document.pointerLockElement !== null);
    };
    document.addEventListener("pointerlockchange", handler);
    return () => {
      document.removeEventListener("pointerlockchange", handler);
    };
  }, []);

  return (
    <>
      {/* Controls hint */}
      <div
        data-ocid="hud.panel"
        style={{
          position: "fixed",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(220, 235, 255, 0.75)",
          fontSize: "13px",
          letterSpacing: "0.12em",
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 400,
          textTransform: "uppercase",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          textShadow: "0 0 20px rgba(0, 229, 255, 0.4)",
          background: "rgba(5, 8, 16, 0.5)",
          padding: "8px 20px",
          borderRadius: "24px",
          border: "1px solid rgba(0, 229, 255, 0.2)",
        }}
      >
        {locked
          ? "WASD — Move   ·   Mouse — Look   ·   ESC to release"
          : "WASD — Move   ·   Mouse — Look   ·   Click to capture mouse"}
      </div>

      {/* Title watermark */}
      <div
        style={{
          position: "fixed",
          top: "24px",
          left: "32px",
          color: "rgba(220, 235, 255, 0.6)",
          fontSize: "22px",
          letterSpacing: "0.4em",
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 200,
          pointerEvents: "none",
          textShadow: "0 0 30px rgba(0, 229, 255, 0.5)",
        }}
      >
        AERION
      </div>
    </>
  );
}
