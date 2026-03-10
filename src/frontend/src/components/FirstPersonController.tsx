import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { useGameControls } from "../context/GameControlsContext";

const PLAYER_HEIGHT = 40;
const MOVE_SPEED = 28;
const MAX_RADIUS = 280;
const PITCH_LIMIT = Math.PI / 2 - 0.05;

const ORBIT_RADIUS = 120;
const ORBIT_HEIGHT = 40;
const ORBIT_DURATION = 7; // seconds for exactly one full rotation
const LOOK_TARGET = new THREE.Vector3(0, 30, 0);

type Phase = "orbit" | "firstperson";

export function FirstPersonController() {
  const { camera, gl } = useThree();
  const controls = useGameControls();

  const keys = useRef<Record<string, boolean>>({});
  const yaw = useRef(Math.PI);
  const pitch = useRef(0);
  const isLocked = useRef(false);
  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));
  const phase = useRef<Phase>("orbit");
  const orbitTime = useRef(0);

  // Initialize camera at orbit start position
  useEffect(() => {
    camera.rotation.order = "YXZ";
    camera.position.set(0, ORBIT_HEIGHT, ORBIT_RADIUS);
    camera.lookAt(LOOK_TARGET);
  }, [camera]);

  const enterFirstPerson = useCallback(() => {
    if (phase.current !== "orbit") return;
    phase.current = "firstperson";
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    yaw.current = Math.atan2(-dir.x, -dir.z);
    pitch.current = Math.asin(Math.max(-1, Math.min(1, dir.y)));
  }, [camera]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = gl.domElement;

    const onClick = () => {
      if (phase.current === "orbit") {
        enterFirstPerson();
      }
      canvas.requestPointerLock();
    };

    const onPointerLockChange = () => {
      isLocked.current = document.pointerLockElement === canvas;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isLocked.current) return;
      if (phase.current !== "firstperson") return;
      const sensitivity = 0.0018;
      yaw.current -= e.movementX * sensitivity;
      pitch.current -= e.movementY * sensitivity;
      pitch.current = Math.max(
        -PITCH_LIMIT,
        Math.min(PITCH_LIMIT, pitch.current),
      );
    };

    canvas.addEventListener("click", onClick);
    document.addEventListener("pointerlockchange", onPointerLockChange);
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      canvas.removeEventListener("click", onClick);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [gl, enterFirstPerson]);

  useFrame((_, delta) => {
    // Check mobile skip signal
    if (controls.current.skipOrbit && phase.current === "orbit") {
      controls.current.skipOrbit = false;
      enterFirstPerson();
    }

    // ── Orbit phase ───────────────────────────────────────────────────
    if (phase.current === "orbit") {
      orbitTime.current += delta;
      const progress = Math.min(orbitTime.current / ORBIT_DURATION, 1);

      if (progress >= 1) {
        // Orbit complete — seamlessly enter first-person at start position
        camera.position.set(0, PLAYER_HEIGHT, ORBIT_RADIUS);
        yaw.current = Math.PI;
        pitch.current = 0;
        phase.current = "firstperson";
        return;
      }

      const angle = progress * Math.PI * 2;
      camera.position.x = Math.sin(angle) * ORBIT_RADIUS;
      camera.position.y = ORBIT_HEIGHT;
      camera.position.z = Math.cos(angle) * ORBIT_RADIUS;
      camera.lookAt(LOOK_TARGET);
      return;
    }

    // ── First-person phase ──────────────────────────────────────────────

    // Consume touch look delta
    const ld = controls.current.lookDelta;
    if (ld.x !== 0 || ld.y !== 0) {
      const touchSensitivity = 0.0025;
      yaw.current -= ld.x * touchSensitivity;
      pitch.current -= ld.y * touchSensitivity;
      pitch.current = Math.max(
        -PITCH_LIMIT,
        Math.min(PITCH_LIMIT, pitch.current),
      );
      controls.current.lookDelta = { x: 0, y: 0 };
    }

    // Apply rotation
    euler.current.set(pitch.current, yaw.current, 0, "YXZ");
    camera.quaternion.setFromEuler(euler.current);

    // Movement: keyboard + joystick
    const moveDir = new THREE.Vector3();
    const k = keys.current;
    if (k.KeyW || k.ArrowUp) moveDir.z -= 1;
    if (k.KeyS || k.ArrowDown) moveDir.z += 1;
    if (k.KeyA || k.ArrowLeft) moveDir.x -= 1;
    if (k.KeyD || k.ArrowRight) moveDir.x += 1;

    const joy = controls.current.joystick;
    if (Math.abs(joy.x) > 0.08 || Math.abs(joy.y) > 0.08) {
      moveDir.x += joy.x;
      moveDir.z -= joy.y; // joystick forward (+y) → move forward (−z in world)
    }

    if (moveDir.lengthSq() > 0) {
      moveDir.normalize();
      const yawQuat = new THREE.Quaternion();
      yawQuat.setFromEuler(new THREE.Euler(0, yaw.current, 0, "YXZ"));
      moveDir.applyQuaternion(yawQuat);
      moveDir.multiplyScalar(MOVE_SPEED * delta);

      camera.position.x += moveDir.x;
      camera.position.z += moveDir.z;
    }

    // Keep player height fixed
    camera.position.y = PLAYER_HEIGHT;

    // Clamp to max radius
    const xz = new THREE.Vector2(camera.position.x, camera.position.z);
    if (xz.length() > MAX_RADIUS) {
      xz.setLength(MAX_RADIUS);
      camera.position.x = xz.x;
      camera.position.z = xz.y;
    }
  });

  return null;
}
