import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

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

// Instanced mesh for a single material type (box buildings)
function InstancedBoxBuildings({
  buildings,
  color,
  emissive,
  emissiveIntensity,
  metalness,
  roughness,
  transparent,
  opacity,
}: {
  buildings: BuildingConfig[];
  color: string;
  emissive: string;
  emissiveIntensity: number;
  metalness: number;
  roughness: number;
  transparent?: boolean;
  opacity?: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!meshRef.current || buildings.length === 0) return;
    const mat = new THREE.Matrix4();
    buildings.forEach((b, i) => {
      mat.compose(
        new THREE.Vector3(b.x, b.height / 2, b.z),
        new THREE.Quaternion(),
        new THREE.Vector3(b.width, b.height, b.depth),
      );
      meshRef.current!.setMatrixAt(i, mat);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [buildings]);

  if (buildings.length === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, buildings.length]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        metalness={metalness}
        roughness={roughness}
        transparent={transparent}
        opacity={opacity ?? 1}
      />
    </instancedMesh>
  );
}

export function SkyscraperCluster({
  position,
  platformRadius,
  seed = 0,
  buildingCount = 16,
}: SkyscraperClusterProps) {
  const buildings = useMemo(() => {
    const rand = seededRandom(seed + platformRadius * 100);
    const result: BuildingConfig[] = [];

    // Spread across 3 rings, slightly beyond platform edge for 360° coverage
    const rings = [
      { count: Math.floor(buildingCount * 0.35), rMin: 0.08, rMax: 0.42 },
      { count: Math.floor(buildingCount * 0.4), rMin: 0.42, rMax: 0.72 },
      { count: Math.ceil(buildingCount * 0.25), rMin: 0.72, rMax: 1.05 },
    ];

    let bIdx = 0;
    for (const ring of rings) {
      for (let bi = 0; bi < ring.count; bi++) {
        const angleOffset = rand() * Math.PI * 2;
        const angle = (bi / ring.count) * Math.PI * 2 + angleOffset;
        const r =
          platformRadius * (ring.rMin + rand() * (ring.rMax - ring.rMin));
        const type = Math.floor(rand() * 6);
        result.push({
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
    return result;
  }, [seed, platformRadius, buildingCount]);

  // Split by instanced groups
  const metallicBuildings = useMemo(
    () => buildings.filter((b) => b.type === 0),
    [buildings],
  );
  const glassBuildings = useMemo(
    () => buildings.filter((b) => b.type === 1),
    [buildings],
  );
  const cyanBuildings = useMemo(
    () => buildings.filter((b) => b.type === 2),
    [buildings],
  );
  const goldBuildings = useMemo(
    () => buildings.filter((b) => b.type === 3),
    [buildings],
  );
  const spireBuildings = useMemo(
    () => buildings.filter((b) => b.type === 4),
    [buildings],
  );
  const steppedBuildings = useMemo(
    () => buildings.filter((b) => b.type === 5),
    [buildings],
  );

  return (
    <group position={position}>
      {/* Instanced box buildings per material */}
      <InstancedBoxBuildings
        buildings={metallicBuildings}
        color="#e8ecf0"
        emissive="#001020"
        emissiveIntensity={0.15}
        metalness={0.65}
        roughness={0.25}
      />
      <InstancedBoxBuildings
        buildings={glassBuildings}
        color="#1a2030"
        emissive="#00e5ff"
        emissiveIntensity={0.5}
        metalness={0.85}
        roughness={0.1}
        transparent
        opacity={0.88}
      />
      <InstancedBoxBuildings
        buildings={cyanBuildings}
        color="#0d1e2a"
        emissive="#00e5ff"
        emissiveIntensity={0.55}
        metalness={0.8}
        roughness={0.1}
      />
      <InstancedBoxBuildings
        buildings={goldBuildings}
        color="#1a1000"
        emissive="#ffd700"
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.1}
      />

      {/* Spire buildings — slender box, rendered individually */}
      {spireBuildings.map((b) => (
        <group key={b.key}>
          <mesh position={[b.x, b.height / 2, b.z]}>
            <boxGeometry args={[b.width * 0.4, b.height, b.depth * 0.4]} />
            <meshStandardMaterial
              color="#c8d4e0"
              metalness={0.75}
              roughness={0.2}
              emissive="#00e5ff"
              emissiveIntensity={0.2}
            />
          </mesh>
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
          <mesh position={[b.x, b.height + 10, b.z]}>
            <coneGeometry args={[0.3, 8, 4]} />
            <meshStandardMaterial
              color="#e8ecf0"
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        </group>
      ))}

      {/* Stepped buildings — multi-part, rendered individually */}
      {steppedBuildings.map((b) => (
        <group key={b.key}>
          <mesh position={[b.x, b.height * 0.15, b.z]}>
            <boxGeometry args={[b.width, b.height * 0.3, b.depth]} />
            <meshStandardMaterial
              color="#14181e"
              metalness={0.9}
              roughness={0.15}
              emissive="#ffd700"
              emissiveIntensity={0.2}
            />
          </mesh>
          <mesh position={[b.x, b.height * 0.55, b.z]}>
            <boxGeometry
              args={[b.width * 0.75, b.height * 0.4, b.depth * 0.75]}
            />
            <meshStandardMaterial
              color="#14181e"
              metalness={0.9}
              roughness={0.15}
              emissive="#ffd700"
              emissiveIntensity={0.28}
            />
          </mesh>
          <mesh position={[b.x, b.height * 0.85, b.z]}>
            <boxGeometry
              args={[b.width * 0.5, b.height * 0.3, b.depth * 0.5]}
            />
            <meshStandardMaterial
              color="#14181e"
              metalness={0.9}
              roughness={0.15}
              emissive="#ffd700"
              emissiveIntensity={0.4}
            />
          </mesh>
          <mesh position={[b.x, b.height * 0.3 + 0.5, b.z]}>
            <torusGeometry args={[b.width * 0.55, 0.25, 4, 24]} />
            <meshStandardMaterial
              color="#003344"
              emissive="#ffd700"
              emissiveIntensity={0.6}
            />
          </mesh>
          <mesh position={[b.x, b.height * 0.75 + 0.5, b.z]}>
            <torusGeometry args={[b.width * 0.41, 0.25, 4, 24]} />
            <meshStandardMaterial
              color="#003344"
              emissive="#ffd700"
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>
      ))}

      {/* Rooftop antennas for tall non-stepped, non-spire buildings */}
      {[
        ...metallicBuildings,
        ...glassBuildings,
        ...cyanBuildings,
        ...goldBuildings,
      ]
        .filter((b) => b.height > 50)
        .map((b) => (
          <mesh key={`ant-${b.key}`} position={[b.x, b.height + 6, b.z]}>
            <cylinderGeometry args={[0.12, 0.12, 12, 5]} />
            <meshStandardMaterial
              color="#003344"
              emissive="#00e5ff"
              emissiveIntensity={0.8}
            />
          </mesh>
        ))}
    </group>
  );
}
