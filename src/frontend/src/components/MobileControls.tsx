import { useEffect, useRef, useState } from "react";
import { useGameControls } from "../context/GameControlsContext";

const JOYSTICK_RADIUS = 48;

export function MobileControls() {
  const controls = useGameControls();
  const [isTouch, setIsTouch] = useState(false);

  // Joystick visual state
  const [thumbOffset, setThumbOffset] = useState({ x: 0, y: 0 });
  const joystickTouchId = useRef<number | null>(null);
  const joystickBase = useRef<{ x: number; y: number } | null>(null);
  const thumbActive = useRef(false);

  // Look swipe state
  const lookTouchId = useRef<number | null>(null);
  const lastLook = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouch(hasTouch);
  }, []);

  useEffect(() => {
    if (!isTouch) return;

    const onStart = (e: TouchEvent) => {
      for (const t of Array.from(e.changedTouches)) {
        const leftSide = t.clientX < window.innerWidth / 2;
        if (leftSide && joystickTouchId.current === null) {
          joystickTouchId.current = t.identifier;
          joystickBase.current = { x: t.clientX, y: t.clientY };
          thumbActive.current = true;
          controls.current.skipOrbit = true;
        } else if (!leftSide && lookTouchId.current === null) {
          lookTouchId.current = t.identifier;
          lastLook.current = { x: t.clientX, y: t.clientY };
          controls.current.skipOrbit = true;
        }
      }
    };

    const onMove = (e: TouchEvent) => {
      for (const t of Array.from(e.changedTouches)) {
        if (t.identifier === joystickTouchId.current && joystickBase.current) {
          const dx = t.clientX - joystickBase.current.x;
          const dy = t.clientY - joystickBase.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const clamp = Math.min(dist, JOYSTICK_RADIUS) / JOYSTICK_RADIUS;
          const nx = dist > 0 ? (dx / dist) * clamp : 0;
          const ny = dist > 0 ? (dy / dist) * clamp : 0;
          // joystick.y: screen-up = negative dy = +1 forward
          controls.current.joystick = { x: nx, y: -ny };
          setThumbOffset({ x: nx * JOYSTICK_RADIUS, y: ny * JOYSTICK_RADIUS });
        }
        if (t.identifier === lookTouchId.current && lastLook.current) {
          const dx = t.clientX - lastLook.current.x;
          const dy = t.clientY - lastLook.current.y;
          controls.current.lookDelta.x += dx;
          controls.current.lookDelta.y += dy;
          lastLook.current = { x: t.clientX, y: t.clientY };
        }
      }
    };

    const onEnd = (e: TouchEvent) => {
      for (const t of Array.from(e.changedTouches)) {
        if (t.identifier === joystickTouchId.current) {
          joystickTouchId.current = null;
          joystickBase.current = null;
          thumbActive.current = false;
          controls.current.joystick = { x: 0, y: 0 };
          setThumbOffset({ x: 0, y: 0 });
        }
        if (t.identifier === lookTouchId.current) {
          lookTouchId.current = null;
          lastLook.current = null;
        }
      }
    };

    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchmove", onMove, { passive: true });
    document.addEventListener("touchend", onEnd, { passive: true });
    document.addEventListener("touchcancel", onEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("touchcancel", onEnd);
    };
  }, [isTouch, controls]);

  if (!isTouch) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 50,
        userSelect: "none",
      }}
    >
      {/* Left joystick */}
      <div
        style={{
          position: "absolute",
          bottom: 88,
          left: 40,
          width: JOYSTICK_RADIUS * 2,
          height: JOYSTICK_RADIUS * 2,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.06)",
          border: "1.5px solid rgba(0, 229, 255, 0.22)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 16px rgba(0, 229, 255, 0.08)",
        }}
      >
        {/* Thumb */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(0, 229, 255, 0.22)",
            border: "1.5px solid rgba(0, 229, 255, 0.45)",
            transform: `translate(${thumbOffset.x}px, ${thumbOffset.y}px)`,
            transition: thumbActive.current
              ? "none"
              : "transform 0.12s ease-out",
            boxShadow: "0 0 8px rgba(0, 229, 255, 0.3)",
          }}
        />
      </div>

      {/* Right look area hint (faint arc indicator) */}
      <div
        style={{
          position: "absolute",
          bottom: 88,
          right: 40,
          width: JOYSTICK_RADIUS * 2,
          height: JOYSTICK_RADIUS * 2,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.04)",
          border: "1.5px solid rgba(255, 215, 0, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 12px rgba(255, 215, 0, 0.06)",
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "rgba(255, 215, 0, 0.15)",
            border: "1px solid rgba(255, 215, 0, 0.3)",
          }}
        />
      </div>

      {/* Mobile hint */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(220, 235, 255, 0.45)",
          fontSize: 11,
          letterSpacing: "0.12em",
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 400,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          textShadow: "0 0 10px rgba(0, 229, 255, 0.3)",
          pointerEvents: "none",
        }}
      >
        Left — Move · Right — Look
      </div>
    </div>
  );
}
