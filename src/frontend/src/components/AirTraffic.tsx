import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";

interface VehicleConfig {
  id: string;
  orbitRadius: number;
  orbitRadiusY: number;
  speed: number;
  phase: number;
  baseY: number;
  type: "taxi" | "drone";
  color: string;
  scale: number;
}

const VEHICLES: VehicleConfig[] = [
  // ── Air Taxis (20 total) ──────────────────────────────────────────────────
  {
    id: "t0",
    orbitRadius: 90,
    orbitRadiusY: 60,
    speed: 0.18,
    phase: 0.0,
    baseY: 55,
    type: "taxi",
    color: "#00e5ff",
    scale: 1.0,
  },
  {
    id: "t1",
    orbitRadius: 130,
    orbitRadiusY: 80,
    speed: 0.13,
    phase: 1.2,
    baseY: 48,
    type: "taxi",
    color: "#ffd700",
    scale: 1.1,
  },
  {
    id: "t2",
    orbitRadius: 160,
    orbitRadiusY: 100,
    speed: 0.1,
    phase: 2.4,
    baseY: 60,
    type: "taxi",
    color: "#00e5ff",
    scale: 0.9,
  },
  {
    id: "t3",
    orbitRadius: 75,
    orbitRadiusY: 50,
    speed: 0.22,
    phase: 3.6,
    baseY: 42,
    type: "taxi",
    color: "#ffd700",
    scale: 1.0,
  },
  {
    id: "t4",
    orbitRadius: 110,
    orbitRadiusY: 70,
    speed: 0.15,
    phase: 0.8,
    baseY: 52,
    type: "taxi",
    color: "#00e5ff",
    scale: 1.2,
  },
  {
    id: "t5",
    orbitRadius: 145,
    orbitRadiusY: 90,
    speed: 0.12,
    phase: 4.2,
    baseY: 58,
    type: "taxi",
    color: "#ffd700",
    scale: 0.85,
  },
  {
    id: "t6",
    orbitRadius: 95,
    orbitRadiusY: 65,
    speed: 0.2,
    phase: 1.6,
    baseY: 45,
    type: "taxi",
    color: "#00e5ff",
    scale: 1.05,
  },
  {
    id: "t7",
    orbitRadius: 120,
    orbitRadiusY: 75,
    speed: 0.14,
    phase: 3.0,
    baseY: 50,
    type: "taxi",
    color: "#ffd700",
    scale: 0.95,
  },
  {
    id: "t8",
    orbitRadius: 170,
    orbitRadiusY: 110,
    speed: 0.11,
    phase: 0.5,
    baseY: 62,
    type: "taxi",
    color: "#00e5ff",
    scale: 1.15,
  },
  {
    id: "t9",
    orbitRadius: 80,
    orbitRadiusY: 55,
    speed: 0.19,
    phase: 2.1,
    baseY: 46,
    type: "taxi",
    color: "#ffd700",
    scale: 0.88,
  },
  {
    id: "t10",
    orbitRadius: 155,
    orbitRadiusY: 95,
    speed: 0.105,
    phase: 3.8,
    baseY: 56,
    type: "taxi",
    color: "#00e5ff",
    scale: 1.0,
  },
  {
    id: "t11",
    orbitRadius: 100,
    orbitRadiusY: 68,
    speed: 0.17,
    phase: 1.0,
    baseY: 44,
    type: "taxi",
    color: "#ffd700",
    scale: 1.1,
  },
  {
    id: "t12",
    orbitRadius: 180,
    orbitRadiusY: 115,
    speed: 0.1,
    phase: 4.8,
    baseY: 65,
    type: "taxi",
    color: "#00e5ff",
    scale: 0.92,
  },
  {
    id: "t13",
    orbitRadius: 60,
    orbitRadiusY: 44,
    speed: 0.21,
    phase: 2.7,
    baseY: 40,
    type: "taxi",
    color: "#ffd700",
    scale: 1.0,
  },
  {
    id: "t14",
    orbitRadius: 140,
    orbitRadiusY: 85,
    speed: 0.13,
    phase: 5.1,
    baseY: 54,
    type: "taxi",
    color: "#00e5ff",
    scale: 0.97,
  },
  // 5 high-altitude taxis
  {
    id: "t15",
    orbitRadius: 210,
    orbitRadiusY: 130,
    speed: 0.09,
    phase: 1.4,
    baseY: 68,
    type: "taxi",
    color: "#ffd700",
    scale: 1.1,
  },
  {
    id: "t16",
    orbitRadius: 245,
    orbitRadiusY: 155,
    speed: 0.085,
    phase: 3.2,
    baseY: 74,
    type: "taxi",
    color: "#00e5ff",
    scale: 0.95,
  },
  {
    id: "t17",
    orbitRadius: 190,
    orbitRadiusY: 120,
    speed: 0.1,
    phase: 5.5,
    baseY: 62,
    type: "taxi",
    color: "#ffd700",
    scale: 1.05,
  },
  {
    id: "t18",
    orbitRadius: 275,
    orbitRadiusY: 170,
    speed: 0.08,
    phase: 0.2,
    baseY: 80,
    type: "taxi",
    color: "#00e5ff",
    scale: 1.2,
  },
  {
    id: "t19",
    orbitRadius: 230,
    orbitRadiusY: 142,
    speed: 0.11,
    phase: 4.0,
    baseY: 72,
    type: "taxi",
    color: "#ffd700",
    scale: 0.88,
  },

  // ── Diagonal crossing air taxis ───────────────────────────────────────────
  {
    id: "td0",
    orbitRadius: 105,
    orbitRadiusY: 55,
    speed: 0.14,
    phase: 0.7,
    baseY: 52,
    type: "taxi",
    color: "#00e5ff",
    scale: 0.95,
  },
  {
    id: "td1",
    orbitRadius: 55,
    orbitRadiusY: 130,
    speed: 0.11,
    phase: 2.3,
    baseY: 58,
    type: "taxi",
    color: "#ffd700",
    scale: 1.0,
  },
  {
    id: "td2",
    orbitRadius: 140,
    orbitRadiusY: 70,
    speed: 0.13,
    phase: 4.1,
    baseY: 48,
    type: "taxi",
    color: "#00e5ff",
    scale: 0.9,
  },
  {
    id: "td3",
    orbitRadius: 80,
    orbitRadiusY: 160,
    speed: 0.1,
    phase: 1.5,
    baseY: 63,
    type: "taxi",
    color: "#ffd700",
    scale: 1.05,
  },
  {
    id: "td4",
    orbitRadius: 165,
    orbitRadiusY: 85,
    speed: 0.12,
    phase: 3.8,
    baseY: 54,
    type: "taxi",
    color: "#00e5ff",
    scale: 0.85,
  },

  // ── Drones (40 total) ─────────────────────────────────────────────────────
  {
    id: "d0",
    orbitRadius: 55,
    orbitRadiusY: 55,
    speed: 0.35,
    phase: 0.5,
    baseY: 30,
    type: "drone",
    color: "#00e5ff",
    scale: 1.0,
  },
  {
    id: "d1",
    orbitRadius: 70,
    orbitRadiusY: 45,
    speed: 0.4,
    phase: 1.1,
    baseY: 28,
    type: "drone",
    color: "#ffffff",
    scale: 0.8,
  },
  {
    id: "d2",
    orbitRadius: 85,
    orbitRadiusY: 55,
    speed: 0.3,
    phase: 2.0,
    baseY: 35,
    type: "drone",
    color: "#00e5ff",
    scale: 1.2,
  },
  {
    id: "d3",
    orbitRadius: 65,
    orbitRadiusY: 40,
    speed: 0.45,
    phase: 3.1,
    baseY: 26,
    type: "drone",
    color: "#ffd700",
    scale: 0.9,
  },
  {
    id: "d4",
    orbitRadius: 100,
    orbitRadiusY: 60,
    speed: 0.28,
    phase: 4.0,
    baseY: 38,
    type: "drone",
    color: "#00e5ff",
    scale: 1.1,
  },
  {
    id: "d5",
    orbitRadius: 48,
    orbitRadiusY: 35,
    speed: 0.5,
    phase: 0.3,
    baseY: 25,
    type: "drone",
    color: "#ffffff",
    scale: 0.7,
  },
  {
    id: "d6",
    orbitRadius: 78,
    orbitRadiusY: 50,
    speed: 0.33,
    phase: 2.8,
    baseY: 32,
    type: "drone",
    color: "#ffd700",
    scale: 1.0,
  },
  {
    id: "d7",
    orbitRadius: 115,
    orbitRadiusY: 70,
    speed: 0.25,
    phase: 1.5,
    baseY: 40,
    type: "drone",
    color: "#00e5ff",
    scale: 0.85,
  },
  {
    id: "d8",
    orbitRadius: 60,
    orbitRadiusY: 42,
    speed: 0.42,
    phase: 3.7,
    baseY: 27,
    type: "drone",
    color: "#ffffff",
    scale: 0.75,
  },
  {
    id: "d9",
    orbitRadius: 92,
    orbitRadiusY: 58,
    speed: 0.32,
    phase: 0.9,
    baseY: 36,
    type: "drone",
    color: "#ffd700",
    scale: 0.95,
  },
  {
    id: "d10",
    orbitRadius: 135,
    orbitRadiusY: 82,
    speed: 0.16,
    phase: 2.2,
    baseY: 44,
    type: "drone",
    color: "#00e5ff",
    scale: 1.0,
  },
  {
    id: "d11",
    orbitRadius: 50,
    orbitRadiusY: 38,
    speed: 0.48,
    phase: 4.5,
    baseY: 29,
    type: "drone",
    color: "#ffffff",
    scale: 0.65,
  },
  {
    id: "d12",
    orbitRadius: 72,
    orbitRadiusY: 48,
    speed: 0.38,
    phase: 1.3,
    baseY: 31,
    type: "drone",
    color: "#00e5ff",
    scale: 0.9,
  },
  {
    id: "d13",
    orbitRadius: 108,
    orbitRadiusY: 65,
    speed: 0.27,
    phase: 3.3,
    baseY: 37,
    type: "drone",
    color: "#ffd700",
    scale: 1.05,
  },
  {
    id: "d14",
    orbitRadius: 45,
    orbitRadiusY: 33,
    speed: 0.5,
    phase: 0.7,
    baseY: 24,
    type: "drone",
    color: "#ffffff",
    scale: 0.7,
  },
  {
    id: "d15",
    orbitRadius: 88,
    orbitRadiusY: 54,
    speed: 0.31,
    phase: 2.5,
    baseY: 34,
    type: "drone",
    color: "#00e5ff",
    scale: 0.8,
  },
  {
    id: "d16",
    orbitRadius: 125,
    orbitRadiusY: 76,
    speed: 0.22,
    phase: 4.1,
    baseY: 41,
    type: "drone",
    color: "#ffd700",
    scale: 0.95,
  },
  {
    id: "d17",
    orbitRadius: 58,
    orbitRadiusY: 40,
    speed: 0.44,
    phase: 1.8,
    baseY: 28,
    type: "drone",
    color: "#ffffff",
    scale: 0.75,
  },
  {
    id: "d18",
    orbitRadius: 98,
    orbitRadiusY: 62,
    speed: 0.29,
    phase: 3.5,
    baseY: 39,
    type: "drone",
    color: "#00e5ff",
    scale: 1.0,
  },
  {
    id: "d19",
    orbitRadius: 150,
    orbitRadiusY: 92,
    speed: 0.15,
    phase: 5.3,
    baseY: 48,
    type: "drone",
    color: "#ffd700",
    scale: 0.85,
  },
  // 20 new drones — low altitude near buildings
  {
    id: "d20",
    orbitRadius: 42,
    orbitRadiusY: 30,
    speed: 0.52,
    phase: 0.4,
    baseY: 18,
    type: "drone",
    color: "#00e5ff",
    scale: 0.75,
  },
  {
    id: "d21",
    orbitRadius: 63,
    orbitRadiusY: 44,
    speed: 0.47,
    phase: 2.0,
    baseY: 22,
    type: "drone",
    color: "#ffffff",
    scale: 0.65,
  },
  {
    id: "d22",
    orbitRadius: 80,
    orbitRadiusY: 52,
    speed: 0.38,
    phase: 1.1,
    baseY: 15,
    type: "drone",
    color: "#ffd700",
    scale: 0.7,
  },
  {
    id: "d23",
    orbitRadius: 55,
    orbitRadiusY: 36,
    speed: 0.45,
    phase: 3.8,
    baseY: 20,
    type: "drone",
    color: "#00e5ff",
    scale: 0.8,
  },
  {
    id: "d24",
    orbitRadius: 105,
    orbitRadiusY: 66,
    speed: 0.3,
    phase: 0.9,
    baseY: 33,
    type: "drone",
    color: "#ffffff",
    scale: 0.9,
  },
  {
    id: "d25",
    orbitRadius: 47,
    orbitRadiusY: 32,
    speed: 0.5,
    phase: 4.4,
    baseY: 17,
    type: "drone",
    color: "#ffd700",
    scale: 0.6,
  },
  {
    id: "d26",
    orbitRadius: 72,
    orbitRadiusY: 46,
    speed: 0.42,
    phase: 2.3,
    baseY: 26,
    type: "drone",
    color: "#00e5ff",
    scale: 0.85,
  },
  {
    id: "d27",
    orbitRadius: 90,
    orbitRadiusY: 58,
    speed: 0.35,
    phase: 5.0,
    baseY: 30,
    type: "drone",
    color: "#ffffff",
    scale: 0.7,
  },
  {
    id: "d28",
    orbitRadius: 120,
    orbitRadiusY: 74,
    speed: 0.25,
    phase: 1.5,
    baseY: 38,
    type: "drone",
    color: "#ffd700",
    scale: 0.95,
  },
  {
    id: "d29",
    orbitRadius: 52,
    orbitRadiusY: 37,
    speed: 0.48,
    phase: 3.1,
    baseY: 20,
    type: "drone",
    color: "#00e5ff",
    scale: 0.65,
  },
  {
    id: "d30",
    orbitRadius: 68,
    orbitRadiusY: 44,
    speed: 0.4,
    phase: 0.6,
    baseY: 24,
    type: "drone",
    color: "#ffffff",
    scale: 0.75,
  },
  {
    id: "d31",
    orbitRadius: 96,
    orbitRadiusY: 60,
    speed: 0.32,
    phase: 2.7,
    baseY: 32,
    type: "drone",
    color: "#ffd700",
    scale: 0.85,
  },
  {
    id: "d32",
    orbitRadius: 44,
    orbitRadiusY: 30,
    speed: 0.52,
    phase: 4.9,
    baseY: 18,
    type: "drone",
    color: "#00e5ff",
    scale: 0.6,
  },
  {
    id: "d33",
    orbitRadius: 115,
    orbitRadiusY: 70,
    speed: 0.28,
    phase: 1.2,
    baseY: 36,
    type: "drone",
    color: "#ffffff",
    scale: 0.8,
  },
  {
    id: "d34",
    orbitRadius: 76,
    orbitRadiusY: 50,
    speed: 0.39,
    phase: 3.4,
    baseY: 27,
    type: "drone",
    color: "#ffd700",
    scale: 0.7,
  },
  {
    id: "d35",
    orbitRadius: 58,
    orbitRadiusY: 40,
    speed: 0.44,
    phase: 0.1,
    baseY: 22,
    type: "drone",
    color: "#00e5ff",
    scale: 0.75,
  },
  {
    id: "d36",
    orbitRadius: 132,
    orbitRadiusY: 82,
    speed: 0.22,
    phase: 2.6,
    baseY: 40,
    type: "drone",
    color: "#ffffff",
    scale: 0.9,
  },
  {
    id: "d37",
    orbitRadius: 50,
    orbitRadiusY: 34,
    speed: 0.5,
    phase: 5.6,
    baseY: 16,
    type: "drone",
    color: "#ffd700",
    scale: 0.65,
  },
  {
    id: "d38",
    orbitRadius: 85,
    orbitRadiusY: 54,
    speed: 0.36,
    phase: 1.9,
    baseY: 29,
    type: "drone",
    color: "#00e5ff",
    scale: 0.8,
  },
  {
    id: "d39",
    orbitRadius: 110,
    orbitRadiusY: 68,
    speed: 0.27,
    phase: 4.2,
    baseY: 35,
    type: "drone",
    color: "#ffffff",
    scale: 0.85,
  },

  // ── Diagonal crossing drones ──────────────────────────────────────────────
  {
    id: "dd0",
    orbitRadius: 95,
    orbitRadiusY: 48,
    speed: 0.38,
    phase: 0.6,
    baseY: 32,
    type: "drone",
    color: "#00e5ff",
    scale: 0.75,
  },
  {
    id: "dd1",
    orbitRadius: 48,
    orbitRadiusY: 105,
    speed: 0.42,
    phase: 2.1,
    baseY: 28,
    type: "drone",
    color: "#ffffff",
    scale: 0.7,
  },
  {
    id: "dd2",
    orbitRadius: 120,
    orbitRadiusY: 58,
    speed: 0.31,
    phase: 3.5,
    baseY: 38,
    type: "drone",
    color: "#ffd700",
    scale: 0.8,
  },
  {
    id: "dd3",
    orbitRadius: 62,
    orbitRadiusY: 115,
    speed: 0.36,
    phase: 1.0,
    baseY: 35,
    type: "drone",
    color: "#00e5ff",
    scale: 0.65,
  },
  {
    id: "dd4",
    orbitRadius: 88,
    orbitRadiusY: 42,
    speed: 0.44,
    phase: 4.7,
    baseY: 30,
    type: "drone",
    color: "#ffffff",
    scale: 0.7,
  },
  {
    id: "dd5",
    orbitRadius: 40,
    orbitRadiusY: 92,
    speed: 0.4,
    phase: 0.3,
    baseY: 36,
    type: "drone",
    color: "#ffd700",
    scale: 0.75,
  },
];

const ROTOR_KEYS = ["pp", "pn", "np", "nn"] as const;
const ROTOR_OFFSETS: [number, number, number][] = [
  [1, 0, 1],
  [1, 0, -1],
  [-1, 0, 1],
  [-1, 0, -1],
];

function AirTaxi({ config }: { config: VehicleConfig }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * config.speed + config.phase;
    ref.current.position.x = Math.cos(t) * config.orbitRadius;
    ref.current.position.z = Math.sin(t) * config.orbitRadiusY;
    ref.current.position.y = config.baseY + Math.sin(t * 2.3) * 4;
    ref.current.rotation.y = -t + Math.PI / 2;
  });

  const s = config.scale;
  return (
    <group ref={ref}>
      <mesh scale={[s, s, s]}>
        <boxGeometry args={[6, 1.8, 3]} />
        <meshStandardMaterial
          color="#1c2840"
          metalness={0.8}
          roughness={0.15}
          emissive={config.color}
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[1.5 * s, 1.2 * s, 0]} scale={[s, s, s]}>
        <sphereGeometry args={[1.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#1a2030"
          metalness={0.9}
          roughness={0.05}
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh position={[0, 0, 2.2 * s]} scale={[s, s, s]}>
        <cylinderGeometry args={[0.5, 0.6, 1.5, 8]} />
        <meshStandardMaterial
          color="#003344"
          emissive={config.color}
          emissiveIntensity={0.9}
        />
      </mesh>
      <mesh position={[0, 0, -2.2 * s]} scale={[s, s, s]}>
        <cylinderGeometry args={[0.5, 0.6, 1.5, 8]} />
        <meshStandardMaterial
          color="#003344"
          emissive={config.color}
          emissiveIntensity={0.9}
        />
      </mesh>
      <pointLight color={config.color} intensity={1.5} distance={20} />
    </group>
  );
}

function Drone({ config }: { config: VehicleConfig }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * config.speed + config.phase;
    ref.current.position.x = Math.cos(t) * config.orbitRadius;
    ref.current.position.z = Math.sin(t) * config.orbitRadiusY;
    ref.current.position.y = config.baseY + Math.sin(t * 3.1) * 3;
    ref.current.rotation.y = t * 2;
  });

  const s = config.scale;
  return (
    <group ref={ref}>
      <mesh scale={[s, s, s]}>
        <boxGeometry args={[1.4, 0.5, 1.4]} />
        <meshStandardMaterial
          color="#1c2840"
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>
      {ROTOR_OFFSETS.map(([rx, , rz], ri) => (
        <mesh
          key={ROTOR_KEYS[ri]}
          position={[rx * 1.2 * s, 0.3 * s, rz * 1.2 * s]}
          scale={[s, s, s]}
        >
          <cylinderGeometry args={[0.7, 0.7, 0.1, 8]} />
          <meshStandardMaterial
            color="#003344"
            emissive={config.color}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.5 * s, 0]} scale={[s, s, s]}>
        <sphereGeometry args={[0.2, 6, 4]} />
        <meshStandardMaterial
          color="#000000"
          emissive={config.color}
          emissiveIntensity={1.5}
        />
      </mesh>
      <pointLight color={config.color} intensity={0.8} distance={12} />
    </group>
  );
}

export function AirTraffic() {
  return (
    <group>
      {VEHICLES.map((v) =>
        v.type === "taxi" ? (
          <AirTaxi key={v.id} config={v} />
        ) : (
          <Drone key={v.id} config={v} />
        ),
      )}
    </group>
  );
}
