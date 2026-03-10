import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

const STAR_COUNT = 2400;

function Starfield() {
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const col = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      // Distribute stars on a large hemisphere shell above the city
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.5; // upper hemisphere only
      const r = 500 + Math.random() * 100;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 20; // keep above horizon
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      // Subtle color variation: white/blue-white/warm white
      const t = Math.random();
      if (t < 0.6) {
        col[i * 3] = 0.9 + Math.random() * 0.1;
        col[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        col[i * 3 + 2] = 0.9 + Math.random() * 0.1;
      } else if (t < 0.8) {
        // Blue-white
        col[i * 3] = 0.7;
        col[i * 3 + 1] = 0.8;
        col[i * 3 + 2] = 1.0;
      } else {
        // Warm gold-white
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.92;
        col[i * 3 + 2] = 0.7;
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
        size={1.2}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.88}
      />
    </points>
  );
}

export function Atmosphere() {
  const { scene } = useThree();

  useEffect(() => {
    scene.background = new THREE.Color("#03050f");
  }, [scene]);

  return (
    <>
      {/* Deep space fog — tightened for denser atmosphere */}
      <fog attach="fog" args={["#06091a", 80, 480]} />

      {/* Ambient fill - slightly cool */}
      <ambientLight intensity={0.4} color="#8090c0" />

      {/* Directional moonlight - cold blue-white */}
      <directionalLight
        intensity={1.4}
        color="#c8d8f8"
        position={[120, 250, 80]}
        castShadow={false}
      />

      {/* Subtle fill from below (city bounce) */}
      <hemisphereLight args={["#1a2a4a", "#03050f", 0.35]} />

      {/* Mega Tower crown cyan glow */}
      <pointLight
        intensity={5}
        color="#00e5ff"
        position={[0, 200, 0]}
        distance={350}
      />
      <pointLight
        intensity={3.5}
        color="#00e5ff"
        position={[0, 160, 30]}
        distance={280}
      />
      <pointLight
        intensity={3.5}
        color="#00e5ff"
        position={[0, 160, -30]}
        distance={280}
      />
      <pointLight
        intensity={3}
        color="#00e5ff"
        position={[30, 160, 0]}
        distance={280}
      />
      <pointLight
        intensity={3}
        color="#00e5ff"
        position={[-30, 160, 0]}
        distance={280}
      />

      {/* Gold platform accent lights */}
      <pointLight
        intensity={2.5}
        color="#ffd700"
        position={[0, 8, -230]}
        distance={130}
      />
      <pointLight
        intensity={2.5}
        color="#ffd700"
        position={[230, 8, 0]}
        distance={130}
      />
      <pointLight
        intensity={2.5}
        color="#ffd700"
        position={[0, 8, 230]}
        distance={130}
      />
      <pointLight
        intensity={2.5}
        color="#ffd700"
        position={[-230, 8, 0]}
        distance={130}
      />

      {/* Central platform warm fill */}
      <pointLight
        intensity={2}
        color="#ffd700"
        position={[0, 15, 0]}
        distance={120}
      />

      <Starfield />
    </>
  );
}
