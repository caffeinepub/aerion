import * as THREE from "three";

interface SkyBridgeProps {
  targetPosition: [number, number, number];
}

export function SkyBridge({ targetPosition }: SkyBridgeProps) {
  const end = new THREE.Vector3(targetPosition[0], 0, targetPosition[2]);
  const length = end.length();
  const mid = end.clone().multiplyScalar(0.5);
  const angle = Math.atan2(end.x, end.z);
  const bridgeLength = length - 30;
  const bridgeY = 8.5;
  const postCount = Math.floor(bridgeLength / 20);

  // Generate post z-positions as stable keys
  const posts = Array.from({ length: postCount }, (_, pi) => ({
    key: `post-${pi}`,
    z: -(bridgeLength / 2) + 10 + pi * 20,
  }));

  return (
    <group position={[mid.x, bridgeY, mid.z]} rotation={[0, angle, 0]}>
      {/* Bridge deck */}
      <mesh>
        <boxGeometry args={[12, 1.5, bridgeLength]} />
        <meshStandardMaterial
          color="#d0d8e8"
          metalness={0.65}
          roughness={0.3}
        />
      </mesh>

      {/* Left railing */}
      <mesh position={[-5.5, 2, 0]}>
        <boxGeometry args={[0.4, 3, bridgeLength]} />
        <meshStandardMaterial color="#e8ecf0" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Right railing */}
      <mesh position={[5.5, 2, 0]}>
        <boxGeometry args={[0.4, 3, bridgeLength]} />
        <meshStandardMaterial color="#e8ecf0" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Left railing glow */}
      <mesh position={[-5.5, 3.8, 0]}>
        <boxGeometry args={[0.3, 0.3, bridgeLength]} />
        <meshStandardMaterial
          color="#003344"
          emissive="#00e5ff"
          emissiveIntensity={0.7}
        />
      </mesh>

      {/* Right railing glow */}
      <mesh position={[5.5, 3.8, 0]}>
        <boxGeometry args={[0.3, 0.3, bridgeLength]} />
        <meshStandardMaterial
          color="#003344"
          emissive="#00e5ff"
          emissiveIntensity={0.7}
        />
      </mesh>

      {/* Support posts */}
      {posts.map((post) => (
        <group key={post.key}>
          <mesh position={[-5.5, -6, post.z]}>
            <boxGeometry args={[0.5, 12, 0.5]} />
            <meshStandardMaterial
              color="#c0ccd8"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[5.5, -6, post.z]}>
            <boxGeometry args={[0.5, 12, 0.5]} />
            <meshStandardMaterial
              color="#c0ccd8"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
