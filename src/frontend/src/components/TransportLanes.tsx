import * as THREE from "three";

// Subtle aerial traffic lane rings — thin, barely visible, like light trails
const lanes = [
  { y: 38, radius: 90, color: "#00c8c0" },
  { y: 55, radius: 130, color: "#4488ff" },
  { y: 70, radius: 160, color: "#00c8c0" },
];

export function TransportLanes() {
  return (
    <group>
      {lanes.map(({ y, radius, color }) => {
        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#000000"),
          emissive: new THREE.Color(color),
          emissiveIntensity: 0.4,
          transparent: true,
          opacity: 0.12,
          depthWrite: false,
        });
        return (
          <mesh key={`lane-${y}-${radius}`} position={[0, y, 0]}>
            <torusGeometry args={[radius, 0.12, 4, 80]} />
            <primitive object={mat} attach="material" />
          </mesh>
        );
      })}
    </group>
  );
}
