import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

const STAR_COUNT = 5000;

function Starfield() {
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const col = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.46;
      const r = 580 + Math.random() * 180;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 30;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      const t = Math.random();
      if (t < 0.55) {
        col[i * 3] = 0.88;
        col[i * 3 + 1] = 0.92;
        col[i * 3 + 2] = 1.0;
      } else if (t < 0.78) {
        col[i * 3] = 0.65;
        col[i * 3 + 1] = 0.78;
        col[i * 3 + 2] = 1.0;
      } else {
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.96;
        col[i * 3 + 2] = 0.82;
      }
    }
    return { positions: pos, colors: col };
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.9}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.85}
      />
    </points>
  );
}

export function Atmosphere() {
  const { scene } = useThree();

  useEffect(() => {
    scene.background = new THREE.Color("#010409");
  }, [scene]);

  return (
    <>
      {/* Light fog — enough for depth, not heavy */}
      <fog attach="fog" args={["#010409", 160, 800]} />

      {/* Ambient — very dark blue night */}
      <ambientLight intensity={0.12} color="#1a2540" />
      <directionalLight
        intensity={0.15}
        color="#6070a0"
        position={[200, 400, 100]}
        castShadow={false}
      />
      <hemisphereLight args={["#04091e", "#010204", 0.08]} />

      {/* Mega Tower crown glow — teal */}
      <pointLight
        intensity={3.0}
        color="#00c8c0"
        position={[0, 215, 0]}
        distance={420}
      />
      <pointLight
        intensity={1.4}
        color="#00b8b0"
        position={[0, 160, 50]}
        distance={240}
      />
      <pointLight
        intensity={1.4}
        color="#00b8b0"
        position={[0, 160, -50]}
        distance={240}
      />

      {/* Subtle warm city glow — low intensity, simulates aggregate window light */}
      <pointLight
        intensity={0.7}
        color="#c8a060"
        position={[80, 55, 0]}
        distance={200}
      />
      <pointLight
        intensity={0.7}
        color="#c8a060"
        position={[-80, 55, 0]}
        distance={200}
      />
      <pointLight
        intensity={0.7}
        color="#c8a060"
        position={[0, 55, 80]}
        distance={200}
      />
      <pointLight
        intensity={0.7}
        color="#c8a060"
        position={[0, 55, -80]}
        distance={200}
      />

      {/* Cool blue fill — sky reflection on dark glass */}
      <pointLight
        intensity={0.5}
        color="#08183a"
        position={[140, 90, 0]}
        distance={280}
      />
      <pointLight
        intensity={0.5}
        color="#08183a"
        position={[-140, 90, 0]}
        distance={280}
      />
      <pointLight
        intensity={0.5}
        color="#08183a"
        position={[0, 90, 140]}
        distance={280}
      />
      <pointLight
        intensity={0.5}
        color="#08183a"
        position={[0, 90, -140]}
        distance={280}
      />

      {/* Horizon glow — city light pollution, deep amber, subtle */}
      <mesh position={[0, -30, 0]}>
        <sphereGeometry
          args={[560, 32, 12, 0, Math.PI * 2, 0, Math.PI * 0.2]}
        />
        <meshStandardMaterial
          color="#000000"
          emissive="#9b6820"
          emissiveIntensity={0.28}
          transparent
          opacity={0.38}
          side={2}
          depthWrite={false}
        />
      </mesh>

      {/* Deep blue sky dome */}
      <mesh position={[0, 10, 0]}>
        <sphereGeometry
          args={[520, 24, 10, 0, Math.PI * 2, 0, Math.PI * 0.45]}
        />
        <meshStandardMaterial
          color="#000000"
          emissive="#020b22"
          emissiveIntensity={0.45}
          transparent
          opacity={0.4}
          side={2}
          depthWrite={false}
        />
      </mesh>

      <Starfield />
    </>
  );
}
