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
  colorGroup: number;
}

function createWindowTex(seed: number): THREE.DataTexture {
  const w = 128;
  const h = 256;
  const data = new Uint8Array(w * h * 4);
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  for (let i = 0; i < w * h * 4; i += 4) {
    data[i] = 3;
    data[i + 1] = 4;
    data[i + 2] = 7;
    data[i + 3] = 255;
  }
  const cols = 8;
  const rows = 32;
  const winW = Math.floor(w / cols);
  const winH = Math.floor(h / rows);
  for (let row = 0; row < rows; row++) {
    // 70% floors lit
    const floorLit = rand() < 0.7;
    for (let col = 0; col < cols; col++) {
      const lit = floorLit ? rand() < 0.9 : rand() < 0.04;
      if (!lit) continue;
      const t = rand();
      // Warm white — near white with amber tint
      const r = Math.floor(248 + t * 7);
      const g = Math.floor(208 + t * 37);
      const b = Math.floor(120 + t * 80);
      const sx = col * winW + 1;
      const sy = row * winH + 1;
      const ex = sx + winW - 2;
      const ey = sy + winH - 2;
      for (let py = sy; py < ey && py < h; py++) {
        for (let px = sx; px < ex && px < w; px++) {
          const idx = (py * w + px) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255;
        }
      }
    }
  }
  const tex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
  tex.needsUpdate = true;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function InstancedBuildings({
  buildings,
  color,
  emissive,
  emissiveIntensity,
  metalness,
  roughness,
  emissiveMap,
  transparent,
  opacity,
}: {
  buildings: BuildingConfig[];
  color: string;
  emissive: string;
  emissiveIntensity: number;
  metalness: number;
  roughness: number;
  emissiveMap?: THREE.DataTexture;
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
        emissiveMap={emissiveMap}
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
        const colorGroup = Math.floor(rand() * 5);
        const widthVar = 3 + rand() * 9;
        result.push({
          key: `b${seed}-${bIdx++}`,
          x: Math.cos(angle) * r,
          z: Math.sin(angle) * r,
          width: widthVar,
          depth: 3 + rand() * 9,
          height: 15 + rand() * 110,
          colorGroup,
        });
      }
    }
    return result;
  }, [seed, platformRadius, buildingCount]);

  const tex0 = useMemo(() => createWindowTex(seed * 7 + 1), [seed]);
  const tex1 = useMemo(() => createWindowTex(seed * 13 + 5), [seed]);
  const tex2 = useMemo(() => createWindowTex(seed * 31 + 9), [seed]);

  const g0 = useMemo(
    () => buildings.filter((b) => b.colorGroup === 0),
    [buildings],
  );
  const g1 = useMemo(
    () => buildings.filter((b) => b.colorGroup === 1),
    [buildings],
  );
  const g2 = useMemo(
    () => buildings.filter((b) => b.colorGroup === 2),
    [buildings],
  );
  const g3 = useMemo(
    () => buildings.filter((b) => b.colorGroup === 3),
    [buildings],
  );
  const g4 = useMemo(
    () => buildings.filter((b) => b.colorGroup === 4),
    [buildings],
  );

  return (
    <group position={position}>
      {/* Dark graphite steel — warm white windows */}
      <InstancedBuildings
        buildings={g0}
        color="#040608"
        emissive="#fff5e0"
        emissiveIntensity={2.8}
        emissiveMap={tex0}
        metalness={0.92}
        roughness={0.1}
      />
      {/* Deep blue-black glass */}
      <InstancedBuildings
        buildings={g1}
        color="#030810"
        emissive="#ffe8c0"
        emissiveIntensity={3.2}
        emissiveMap={tex1}
        metalness={0.95}
        roughness={0.04}
        transparent
        opacity={0.94}
      />
      {/* Dark concrete */}
      <InstancedBuildings
        buildings={g2}
        color="#070707"
        emissive="#ffd8a0"
        emissiveIntensity={2.4}
        emissiveMap={tex2}
        metalness={0.25}
        roughness={0.65}
      />
      {/* Dark charcoal */}
      <InstancedBuildings
        buildings={g3}
        color="#050708"
        emissive="#fff0d0"
        emissiveIntensity={2.6}
        emissiveMap={tex0}
        metalness={0.84}
        roughness={0.22}
      />
      {/* Very dark tinted glass — brightest windows */}
      <InstancedBuildings
        buildings={g4}
        color="#030610"
        emissive="#fffae8"
        emissiveIntensity={3.6}
        emissiveMap={tex1}
        metalness={0.97}
        roughness={0.02}
        transparent
        opacity={0.92}
      />
    </group>
  );
}
