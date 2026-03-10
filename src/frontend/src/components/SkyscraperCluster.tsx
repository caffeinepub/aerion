interface SkyscraperClusterProps {
  position: [number, number, number];
  platformRadius: number;
  seed?: number;
  buildingCount?: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface BuildingConfig {
  key: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  type: number; // 0=metallic, 1=glass, 2=cyan, 3=gold, 4=spire, 5=stepped
}

export function SkyscraperCluster({
  position,
  platformRadius,
  seed = 0,
  buildingCount = 16,
}: SkyscraperClusterProps) {
  const rand = seededRandom(seed + platformRadius * 100);

  const buildings: BuildingConfig[] = [];

  // Distribute buildings across 3 rings for density
  const rings = [
    { count: Math.floor(buildingCount * 0.35), rMin: 0.15, rMax: 0.45 },
    { count: Math.floor(buildingCount * 0.4), rMin: 0.45, rMax: 0.7 },
    { count: Math.ceil(buildingCount * 0.25), rMin: 0.7, rMax: 0.92 },
  ];

  let bIdx = 0;
  for (const ring of rings) {
    for (let bi = 0; bi < ring.count; bi++) {
      const angleOffset = rand() * Math.PI * 2;
      const angle = (bi / ring.count) * Math.PI * 2 + angleOffset;
      const r = platformRadius * (ring.rMin + rand() * (ring.rMax - ring.rMin));
      const type = Math.floor(rand() * 6);
      buildings.push({
        key: `b${seed}-${bIdx++}`,
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        width: 3 + rand() * 8,
        depth: 3 + rand() * 8,
        height: 18 + rand() * 100,
        type,
      });
    }
  }

  return (
    <group position={position}>
      {buildings.map((b) => {
        // Material properties per type
        let color = "#e8ecf0";
        let metalness = 0.65;
        let roughness = 0.25;
        let emissiveColor = "#000000";
        let emissiveIntensity = 0;
        let transparent = false;
        let opacity = 1.0;
        let windowEmissive = "#00e5ff";
        let windowIntensity = 0.25;

        if (b.type === 1) {
          // Dark glass tower
          color = "#1a2030";
          metalness = 0.85;
          roughness = 0.1;
          transparent = true;
          opacity = 0.88;
          windowEmissive = "#00e5ff";
          windowIntensity = 0.4;
        } else if (b.type === 2) {
          // Cyan accent
          color = "#0d1e2a";
          emissiveColor = "#00e5ff";
          emissiveIntensity = 0.3;
          metalness = 0.8;
          roughness = 0.1;
          windowEmissive = "#00e5ff";
          windowIntensity = 0.6;
        } else if (b.type === 3) {
          // Gold accent
          color = "#1a1000";
          emissiveColor = "#ffd700";
          emissiveIntensity = 0.3;
          metalness = 0.8;
          roughness = 0.1;
          windowEmissive = "#ffd700";
          windowIntensity = 0.6;
        } else if (b.type === 4) {
          // Spire / slender
          color = "#c8d4e0";
          metalness = 0.75;
          roughness = 0.2;
          windowEmissive = "#00e5ff";
          windowIntensity = 0.3;
        } else if (b.type === 5) {
          // Stepped / dark metallic
          color = "#14181e";
          metalness = 0.9;
          roughness = 0.15;
          windowEmissive = "#ffd700";
          windowIntensity = 0.35;
        }

        const windowBandCount = Math.floor(b.height / 8);
        const isSpire = b.type === 4;
        const isStepped = b.type === 5;
        const w = isSpire ? b.width * 0.4 : b.width;
        const d = isSpire ? b.depth * 0.4 : b.depth;

        return (
          <group key={b.key}>
            {isStepped ? (
              // Stepped tower: 3 segments, each narrower and taller
              <>
                <mesh position={[b.x, b.height * 0.15, b.z]}>
                  <boxGeometry args={[b.width, b.height * 0.3, b.depth]} />
                  <meshStandardMaterial
                    color={color}
                    metalness={metalness}
                    roughness={roughness}
                    emissive={emissiveColor}
                    emissiveIntensity={emissiveIntensity}
                  />
                </mesh>
                <mesh position={[b.x, b.height * 0.55, b.z]}>
                  <boxGeometry
                    args={[b.width * 0.75, b.height * 0.4, b.depth * 0.75]}
                  />
                  <meshStandardMaterial
                    color={color}
                    metalness={metalness}
                    roughness={roughness}
                    emissive={emissiveColor}
                    emissiveIntensity={emissiveIntensity * 1.2}
                  />
                </mesh>
                <mesh position={[b.x, b.height * 0.85, b.z]}>
                  <boxGeometry
                    args={[b.width * 0.5, b.height * 0.3, b.depth * 0.5]}
                  />
                  <meshStandardMaterial
                    color={color}
                    metalness={metalness}
                    roughness={roughness}
                    emissive={emissiveColor}
                    emissiveIntensity={emissiveIntensity * 1.5}
                  />
                </mesh>
                {/* Step glow rings */}
                <mesh position={[b.x, b.height * 0.3 + 0.5, b.z]}>
                  <torusGeometry args={[b.width * 0.55, 0.25, 4, 24]} />
                  <meshStandardMaterial
                    color="#003344"
                    emissive={windowEmissive}
                    emissiveIntensity={windowIntensity * 1.5}
                  />
                </mesh>
                <mesh position={[b.x, b.height * 0.75 + 0.5, b.z]}>
                  <torusGeometry args={[b.width * 0.41, 0.25, 4, 24]} />
                  <meshStandardMaterial
                    color="#003344"
                    emissive={windowEmissive}
                    emissiveIntensity={windowIntensity * 1.5}
                  />
                </mesh>
              </>
            ) : (
              <mesh position={[b.x, b.height / 2, b.z]}>
                <boxGeometry args={[w, b.height, d]} />
                <meshStandardMaterial
                  color={color}
                  metalness={metalness}
                  roughness={roughness}
                  emissive={emissiveColor}
                  emissiveIntensity={emissiveIntensity}
                  transparent={transparent}
                  opacity={opacity}
                />
              </mesh>
            )}

            {/* Window bands */}
            {!isStepped &&
              Array.from({ length: windowBandCount }, (_, wi) => (
                <mesh key={`${b.key}-w${wi}`} position={[b.x, 4 + wi * 8, b.z]}>
                  <boxGeometry args={[w + 0.12, 1.2, d + 0.12]} />
                  <meshStandardMaterial
                    color={b.type === 1 ? "#003344" : "#1a2030"}
                    emissive={windowEmissive}
                    emissiveIntensity={windowIntensity}
                    metalness={0.9}
                    roughness={0.05}
                    transparent
                    opacity={0.9}
                  />
                </mesh>
              ))}

            {/* Rooftop antenna for tall buildings */}
            {b.height > 50 && (
              <mesh position={[b.x, b.height + 6, b.z]}>
                <cylinderGeometry args={[0.12, 0.12, 12, 5]} />
                <meshStandardMaterial
                  color="#003344"
                  emissive="#00e5ff"
                  emissiveIntensity={0.8}
                />
              </mesh>
            )}

            {/* Spire needle tip */}
            {isSpire && (
              <mesh position={[b.x, b.height + 10, b.z]}>
                <coneGeometry args={[0.3, 8, 4]} />
                <meshStandardMaterial
                  color="#e8ecf0"
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}
