import { CinematicBuilding } from "./CinematicBuilding";

function lcgRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

// 6 asymmetric cluster centers (degrees → radians)
const CLUSTER_CENTERS_DEG = [15, 78, 140, 195, 248, 310];
const CLUSTER_SIZES = [7, 8, 7, 6, 7, 7]; // total = 42

export function CinematicBuildingRing() {
  const buildings: Array<{
    id: number;
    position: [number, number, number];
    seed: number;
    height: number;
    width: number;
  }> = [];

  let buildingId = 0;

  CLUSTER_CENTERS_DEG.forEach((centerDeg, ci) => {
    const count = CLUSTER_SIZES[ci];
    const centerRad = (centerDeg * Math.PI) / 180;
    // Alternating inner/outer radii per cluster for depth
    const baseRadius = ci % 2 === 0 ? 75 : 90;

    for (let i = 0; i < count; i++) {
      const seed = 7777 + buildingId * 137;
      const rand = lcgRand(seed);

      // Angular spread within cluster: ~22° spread with jitter
      const spreadRad = (22 * Math.PI) / 180;
      const angularOffset =
        (i / (count - 1) - 0.5) * spreadRad + (rand() - 0.5) * 0.12;
      const angle = centerRad + angularOffset;

      // Radius varies per building for depth overlap effect
      const radiusJitter = (rand() - 0.5) * 40;
      const radius = baseRadius + radiusJitter + (rand() - 0.5) * 10;
      const clampedRadius = Math.max(65, Math.min(130, radius));

      const height = 35 + rand() * 110; // 35–145
      const width = 6 + rand() * 12; // 6–18

      const x = Math.cos(angle) * clampedRadius;
      const z = Math.sin(angle) * clampedRadius;

      buildings.push({
        id: buildingId,
        position: [x, 0, z],
        seed,
        height,
        width,
      });

      buildingId++;
    }
  });

  return (
    <group>
      {buildings.map((b) => (
        <CinematicBuilding
          key={b.id}
          position={b.position}
          seed={b.seed}
          height={b.height}
          width={b.width}
        />
      ))}
    </group>
  );
}
