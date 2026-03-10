// 4 outer platforms arranged at cardinal-ish angles, 200-240 units out
export const OUTER_POSITIONS: [number, number, number][] = [
  [0, -10, -230], // North
  [230, -10, 0], // East
  [0, -10, 230], // South
  [-230, -10, 0], // West
];

const OUTER_KEYS = ["p0", "p1", "p2", "p3"] as const;

export function OuterPlatforms() {
  return (
    <group>
      {OUTER_POSITIONS.map((pos, i) => (
        <group key={OUTER_KEYS[i]} position={pos}>
          {/* Main platform disc */}
          <mesh position={[0, -3, 0]}>
            <cylinderGeometry args={[42, 38, 6, 56]} />
            <meshStandardMaterial
              color="#1c2030"
              metalness={0.75}
              roughness={0.35}
            />
          </mesh>
          {/* Top surface */}
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[42, 42, 0.4, 56]} />
            <meshStandardMaterial
              color="#20283c"
              metalness={0.8}
              roughness={0.25}
            />
          </mesh>
          {/* Cyan edge trim ring */}
          <mesh position={[0, -0.5, 0]}>
            <torusGeometry args={[42, 0.7, 8, 112]} />
            <meshStandardMaterial
              color="#003344"
              emissive="#00e5ff"
              emissiveIntensity={0.6}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          {/* Gold secondary ring */}
          <mesh position={[0, -1.5, 0]}>
            <torusGeometry args={[38, 0.4, 6, 96]} />
            <meshStandardMaterial
              color="#332200"
              emissive="#ffd700"
              emissiveIntensity={0.4}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          {/* Underside structural rings */}
          <mesh position={[0, -6.5, 0]}>
            <torusGeometry args={[36, 0.5, 6, 80]} />
            <meshStandardMaterial
              color="#141822"
              metalness={0.9}
              roughness={0.3}
            />
          </mesh>
          {/* Platform point light */}
          <pointLight
            color="#00e5ff"
            intensity={3}
            distance={140}
            position={[0, 12, 0]}
          />
        </group>
      ))}
    </group>
  );
}
