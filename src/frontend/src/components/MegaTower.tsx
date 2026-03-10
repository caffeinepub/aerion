const GLASS_BAND_YS = [16, 36, 56, 76, 96, 116, 136, 156, 176];
const CROWN_RING_YS = [196, 202, 208];
const CROWN_RING_RADII = [16, 13, 10];
const CROWN_RING_INTENSITIES = [1.2, 1.0, 0.8];
const WINDOW_STRIP_COUNT = 8;

export function MegaTower() {
  return (
    <group position={[0, 0, 0]}>
      {/* Base plinth */}
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[22, 8, 22]} />
        <meshStandardMaterial
          color="#e8ecf0"
          metalness={0.65}
          roughness={0.25}
        />
      </mesh>

      {/* Main shaft */}
      <mesh position={[0, 100, 0]}>
        <cylinderGeometry args={[7, 14, 192, 8]} />
        <meshStandardMaterial color="#dce4f0" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Glass bands */}
      {GLASS_BAND_YS.map((y, bi) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[14.2 - bi * 0.7, 14.2 - bi * 0.7, 2, 8]} />
          <meshStandardMaterial
            color="#1a2030"
            emissive={bi % 2 === 0 ? "#00e5ff" : "#ffd700"}
            emissiveIntensity={0.4}
            metalness={0.9}
            roughness={0.05}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      {/* Crown platform */}
      <mesh position={[0, 196, 0]}>
        <cylinderGeometry args={[18, 10, 6, 16]} />
        <meshStandardMaterial
          color="#e8ecf0"
          metalness={0.8}
          roughness={0.15}
        />
      </mesh>

      {/* Crown rings */}
      {CROWN_RING_YS.map((y, ci) => (
        <mesh key={y} position={[0, y, 0]}>
          <torusGeometry args={[CROWN_RING_RADII[ci], 0.8, 8, 64]} />
          <meshStandardMaterial
            color="#003344"
            emissive="#00e5ff"
            emissiveIntensity={CROWN_RING_INTENSITIES[ci]}
            metalness={0.9}
            roughness={0.05}
          />
        </mesh>
      ))}

      {/* Crown spire */}
      <mesh position={[0, 230, 0]}>
        <cylinderGeometry args={[0.3, 1.5, 40, 8]} />
        <meshStandardMaterial color="#e8ecf0" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Spire tip glow */}
      <mesh position={[0, 252, 0]}>
        <sphereGeometry args={[1.2, 12, 8]} />
        <meshStandardMaterial
          color="#003344"
          emissive="#00e5ff"
          emissiveIntensity={2.0}
        />
      </mesh>

      {/* Vertical gold window strips */}
      {Array.from({ length: WINDOW_STRIP_COUNT }, (_, si) => {
        const angle = (si / WINDOW_STRIP_COUNT) * Math.PI * 2;
        const x = Math.cos(angle) * 7.2;
        const z = Math.sin(angle) * 7.2;
        const keyStr = `ws-${si}`;
        return (
          <mesh key={keyStr} position={[x, 95, z]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[0.8, 160, 0.3]} />
            <meshStandardMaterial
              color="#332200"
              emissive="#ffd700"
              emissiveIntensity={0.3}
              metalness={0.8}
              roughness={0.1}
            />
          </mesh>
        );
      })}
    </group>
  );
}
