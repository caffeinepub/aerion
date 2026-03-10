import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";

interface GroundVehicleConfig {
  id: string;
  orbitRadius: number;
  orbitRadiusZ: number;
  speed: number;
  phase: number;
  baseY: number;
  color: string;
}

// 8 vehicles on central plaza paths
// 8 vehicles on outer platform perimeters
const GROUND_VEHICLES: GroundVehicleConfig[] = [
  // Central plaza vehicles (y=1.5, small radii 22–50)
  {
    id: "gv0",
    orbitRadius: 28,
    orbitRadiusZ: 22,
    speed: 0.14,
    phase: 0.0,
    baseY: 1.5,
    color: "#00e5ff",
  },
  {
    id: "gv1",
    orbitRadius: 38,
    orbitRadiusZ: 32,
    speed: 0.11,
    phase: 1.8,
    baseY: 1.5,
    color: "#ffd700",
  },
  {
    id: "gv2",
    orbitRadius: 22,
    orbitRadiusZ: 18,
    speed: 0.18,
    phase: 3.5,
    baseY: 1.5,
    color: "#ffffff",
  },
  {
    id: "gv3",
    orbitRadius: 46,
    orbitRadiusZ: 40,
    speed: 0.09,
    phase: 0.9,
    baseY: 1.5,
    color: "#00e5ff",
  },
  {
    id: "gv4",
    orbitRadius: 32,
    orbitRadiusZ: 26,
    speed: 0.15,
    phase: 4.2,
    baseY: 1.5,
    color: "#ffd700",
  },
  {
    id: "gv5",
    orbitRadius: 42,
    orbitRadiusZ: 36,
    speed: 0.1,
    phase: 2.1,
    baseY: 1.5,
    color: "#ffffff",
  },
  {
    id: "gv6",
    orbitRadius: 26,
    orbitRadiusZ: 20,
    speed: 0.17,
    phase: 5.0,
    baseY: 1.5,
    color: "#00e5ff",
  },
  {
    id: "gv7",
    orbitRadius: 50,
    orbitRadiusZ: 44,
    speed: 0.08,
    phase: 1.3,
    baseY: 1.5,
    color: "#ffd700",
  },
  // Outer platform edge vehicles (larger radii ~155–175, y=9 matching platform height)
  {
    id: "gv8",
    orbitRadius: 158,
    orbitRadiusZ: 158,
    speed: 0.055,
    phase: 0.0,
    baseY: 9,
    color: "#00e5ff",
  },
  {
    id: "gv9",
    orbitRadius: 165,
    orbitRadiusZ: 155,
    speed: 0.048,
    phase: 2.4,
    baseY: 9,
    color: "#ffd700",
  },
  {
    id: "gv10",
    orbitRadius: 172,
    orbitRadiusZ: 162,
    speed: 0.06,
    phase: 4.8,
    baseY: 9,
    color: "#ffffff",
  },
  {
    id: "gv11",
    orbitRadius: 160,
    orbitRadiusZ: 168,
    speed: 0.052,
    phase: 1.6,
    baseY: 9,
    color: "#00e5ff",
  },
  {
    id: "gv12",
    orbitRadius: 168,
    orbitRadiusZ: 158,
    speed: 0.044,
    phase: 3.2,
    baseY: 9,
    color: "#ffd700",
  },
  {
    id: "gv13",
    orbitRadius: 155,
    orbitRadiusZ: 165,
    speed: 0.057,
    phase: 5.4,
    baseY: 9,
    color: "#ffffff",
  },
  {
    id: "gv14",
    orbitRadius: 175,
    orbitRadiusZ: 160,
    speed: 0.05,
    phase: 0.8,
    baseY: 9,
    color: "#00e5ff",
  },
  {
    id: "gv15",
    orbitRadius: 162,
    orbitRadiusZ: 170,
    speed: 0.046,
    phase: 2.9,
    baseY: 9,
    color: "#ffd700",
  },
];

function GroundVehicle({ config }: { config: GroundVehicleConfig }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * config.speed + config.phase;
    ref.current.position.x = Math.cos(t) * config.orbitRadius;
    ref.current.position.z = Math.sin(t) * config.orbitRadiusZ;
    ref.current.position.y = config.baseY;
    ref.current.rotation.y = -t + Math.PI / 2;
  });

  return (
    <group ref={ref}>
      {/* Main body — low profile maglev car */}
      <mesh>
        <boxGeometry args={[4.5, 0.9, 2.0]} />
        <meshStandardMaterial
          color="#141c28"
          metalness={0.92}
          roughness={0.08}
          emissive={config.color}
          emissiveIntensity={0.08}
        />
      </mesh>
      {/* Canopy */}
      <mesh position={[0.3, 0.7, 0]}>
        <boxGeometry args={[2.2, 0.6, 1.6]} />
        <meshStandardMaterial
          color="#0d1520"
          metalness={0.95}
          roughness={0.04}
          transparent
          opacity={0.75}
        />
      </mesh>
      {/* Front headlights */}
      <mesh position={[2.4, 0.1, 0.6]}>
        <boxGeometry args={[0.15, 0.25, 0.4]} />
        <meshStandardMaterial
          color="#000000"
          emissive={config.color}
          emissiveIntensity={2.5}
        />
      </mesh>
      <mesh position={[2.4, 0.1, -0.6]}>
        <boxGeometry args={[0.15, 0.25, 0.4]} />
        <meshStandardMaterial
          color="#000000"
          emissive={config.color}
          emissiveIntensity={2.5}
        />
      </mesh>
      {/* Underbody glow strip */}
      <mesh position={[0, -0.46, 0]}>
        <boxGeometry args={[4.0, 0.06, 1.6]} />
        <meshStandardMaterial
          color="#000000"
          emissive={config.color}
          emissiveIntensity={1.2}
        />
      </mesh>
      <pointLight color={config.color} intensity={0.6} distance={10} />
    </group>
  );
}

export function GroundTraffic() {
  return (
    <group>
      {GROUND_VEHICLES.map((v) => (
        <GroundVehicle key={v.id} config={v} />
      ))}
    </group>
  );
}
