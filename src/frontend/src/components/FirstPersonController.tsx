import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const PLAYER_HEIGHT = 18;
const MOVE_SPEED = 28;
const MAX_RADIUS = 280;
const PITCH_LIMIT = Math.PI / 2 - 0.05;

export function FirstPersonController() {
  const { camera, gl } = useThree();

  const keys = useRef<Record<string, boolean>>({});
  const yaw = useRef(Math.PI); // face toward center (negative Z)
  const pitch = useRef(0);
  const isLocked = useRef(false);
  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));

  useEffect(() => {
    camera.position.set(0, PLAYER_HEIGHT, 60);
    camera.rotation.order = "YXZ";
    // Face toward the central tower (negative Z direction)
    euler.current.set(0, Math.PI, 0, "YXZ");
    camera.quaternion.setFromEuler(euler.current);
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
      canvas.requestPointerLock();
    };

    const onPointerLockChange = () => {
      isLocked.current = document.pointerLockElement === canvas;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isLocked.current) return;
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
  }, [gl]);

  useFrame((_, delta) => {
    // Apply rotation
    euler.current.set(pitch.current, yaw.current, 0, "YXZ");
    camera.quaternion.setFromEuler(euler.current);

    // Movement
    const moveDir = new THREE.Vector3();
    const k = keys.current;
    if (k.KeyW || k.ArrowUp) moveDir.z -= 1;
    if (k.KeyS || k.ArrowDown) moveDir.z += 1;
    if (k.KeyA || k.ArrowLeft) moveDir.x -= 1;
    if (k.KeyD || k.ArrowRight) moveDir.x += 1;

    if (moveDir.lengthSq() > 0) {
      moveDir.normalize();
      const yawQuat = new THREE.Quaternion();
      yawQuat.setFromEuler(new THREE.Euler(0, yaw.current, 0, "YXZ"));
      moveDir.applyQuaternion(yawQuat);
      moveDir.multiplyScalar(MOVE_SPEED * delta);

      camera.position.x += moveDir.x;
      camera.position.z += moveDir.z;
    }

    // Keep Y fixed (walk on platform)
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
