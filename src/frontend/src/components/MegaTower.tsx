const GLASS_BAND_YS = [20, 42, 64, 86, 108, 130, 152, 174, 194];
const CROWN_RING_YS = [198, 204, 210];
const CROWN_RING_RADII = [16, 13, 10];
const WINDOW_STRIP_COUNT = 8;

export function MegaTower() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[24, 8, 24]} />
        <meshStandardMaterial
          color="#090c10"
          metalness={0.88}
          roughness={0.18}
        />
      </mesh>
      <mesh position={[0, 10, 0]}>
        <boxGeometry args={[18, 4, 18]} />
        <meshStandardMaterial
          color="#0b0f15"
          metalness={0.9}
          roughness={0.14}
        />
      </mesh>
      <mesh position={[0, 106, 0]}>
        <cylinderGeometry args={[6, 13, 204, 12]} />
        <meshStandardMaterial
          color="#080c14"
          metalness={0.88}
          roughness={0.12}
        />
      </mesh>

      {GLASS_BAND_YS.map((y, bi) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry
            args={[13.2 - bi * 0.7, 13.2 - bi * 0.7, 1.2, 12]}
          />
          <meshStandardMaterial
            color="#04080e"
            emissive="#00b8b0"
            emissiveIntensity={0.18}
            metalness={0.92}
            roughness={0.04}
            transparent
            opacity={0.88}
          />
        </mesh>
      ))}

      <mesh position={[0, 198, 0]}>
        <cylinderGeometry args={[17, 9, 5, 16]} />
        <meshStandardMaterial
          color="#0c1018"
          metalness={0.88}
          roughness={0.12}
        />
      </mesh>

      {CROWN_RING_YS.map((y, ci) => (
        <mesh key={y} position={[0, y, 0]}>
          <torusGeometry args={[CROWN_RING_RADII[ci], 0.7, 8, 64]} />
          <meshStandardMaterial
            color="#001414"
            emissive="#00c8be"
            emissiveIntensity={0.9}
            metalness={0.9}
            roughness={0.04}
          />
        </mesh>
      ))}

      <mesh position={[0, 234, 0]}>
        <cylinderGeometry args={[0.2, 1.2, 42, 8]} />
        <meshStandardMaterial
          color="#0c1018"
          metalness={0.92}
          roughness={0.08}
        />
      </mesh>
      <mesh position={[0, 256, 0]}>
        <sphereGeometry args={[1.0, 10, 7]} />
        <meshStandardMaterial
          color="#001212"
          emissive="#00c8be"
          emissiveIntensity={2.5}
        />
      </mesh>

      {Array.from({ length: WINDOW_STRIP_COUNT }, (_, si) => {
        const angle = (si / WINDOW_STRIP_COUNT) * Math.PI * 2;
        const x = Math.cos(angle) * 7.0;
        const z = Math.sin(angle) * 7.0;
        const stripKey = `ws-${si}`;
        return (
          <mesh key={stripKey} position={[x, 98, z]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[0.6, 168, 0.2]} />
            <meshStandardMaterial
              color="#0e0a04"
              emissive="#f0e8d0"
              emissiveIntensity={0.22}
              metalness={0.8}
              roughness={0.1}
            />
          </mesh>
        );
      })}

      <mesh position={[0, 185, 0]}>
        <cylinderGeometry args={[8.5, 7.5, 3, 12]} />
        <meshStandardMaterial
          color="#0d1015"
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[3, 216, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 14, 4]} />
        <meshStandardMaterial color="#0c1018" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-3, 212, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 10, 4]} />
        <meshStandardMaterial color="#0c1018" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}
