import * as THREE from "three";

function lcgRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

// Recompute the same building positions as CinematicBuildingRing uses
function getBuildingPositions() {
  const rand = lcgRand(7777);
  const count = 42;
  const positions: Array<[number, number, number]> = [];
  const heights: number[] = [];

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (rand() - 0.5) * 0.3;
    const radius = 65 + rand() * 100;
    const height = 35 + rand() * 110;
    // consume width rand
    rand();

    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    positions.push([x, 0, z]);
    heights.push(height);
  }

  return { positions, heights };
}

const bridgePairIndices = [0, 1, 8, 9, 16, 17, 24, 25, 33, 34];

export function InnerSkyBridges() {
  const { positions, heights } = getBuildingPositions();

  // 5 bridge pairs
  const pairs: Array<[number, number]> = [
    [0, 1],
    [8, 9],
    [16, 17],
    [24, 25],
    [33, 34],
  ];

  const bridges = pairs.map(([a, b]) => {
    const posA = positions[a];
    const posB = positions[b];
    const ha = heights[a];
    const hb = heights[b];

    // Place bridge at ~55% of the shorter tower's height, min 50, max 80
    const bridgeY = Math.min(80, Math.max(50, Math.min(ha, hb) * 0.55));

    const ax = posA[0];
    const az = posA[2];
    const bx = posB[0];
    const bz = posB[2];

    const midX = (ax + bx) / 2;
    const midZ = (az + bz) / 2;

    const dx = bx - ax;
    const dz = bz - az;
    const length = Math.sqrt(dx * dx + dz * dz);
    const angle = Math.atan2(dx, dz);

    return { midX, midY: bridgeY, midZ, length, angle, key: `${a}-${b}` };
  });

  const deckMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#0d1520"),
    metalness: 0.9,
    roughness: 0.15,
  });

  const railMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#001a1a"),
    emissive: new THREE.Color("#00d4c8"),
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.85,
  });

  return (
    <group>
      {bridges.map(({ midX, midY, midZ, length, angle, key }) => (
        <group key={key} position={[midX, midY, midZ]} rotation={[0, angle, 0]}>
          {/* Bridge deck */}
          <mesh>
            <boxGeometry args={[3.5, 0.5, length]} />
            <primitive object={deckMat} attach="material" />
          </mesh>
          {/* Left railing strip */}
          <mesh position={[-1.6, 0.5, 0]}>
            <boxGeometry args={[0.15, 1.0, length]} />
            <primitive object={railMat} attach="material" />
          </mesh>
          {/* Right railing strip */}
          <mesh position={[1.6, 0.5, 0]}>
            <boxGeometry args={[0.15, 1.0, length]} />
            <primitive object={railMat} attach="material" />
          </mesh>
          {/* Under-deck support beam */}
          <mesh position={[0, -0.4, 0]}>
            <boxGeometry args={[0.4, 0.3, length * 0.95]} />
            <primitive object={deckMat} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Suppress unused import warning
void bridgePairIndices;
