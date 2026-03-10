const UNDERSIDE_RADII = [0.6, 0.8];

export function CentralPlatform() {
  return (
    <group>
      {/* Main platform disc */}
      <mesh position={[0, -4, 0]} receiveShadow>
        <cylinderGeometry args={[62, 58, 8, 64]} />
        <meshStandardMaterial
          color="#1c2030"
          metalness={0.75}
          roughness={0.35}
        />
      </mesh>

      {/* Top surface ring detail */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[62, 62, 0.5, 64]} />
        <meshStandardMaterial color="#252d42" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Edge trim ring */}
      <mesh position={[0, -1, 0]}>
        <torusGeometry args={[62, 0.8, 8, 128]} />
        <meshStandardMaterial
          color="#003344"
          emissive="#00e5ff"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Underside structural rings */}
      {UNDERSIDE_RADII.map((r) => (
        <mesh key={`underring-${r}`} position={[0, -8, 0]}>
          <torusGeometry args={[62 * r, 0.5, 6, 64]} />
          <meshStandardMaterial
            color="#141822"
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}
