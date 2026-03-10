import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export function DistantSkylineRing() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 90;

  const matrices = useMemo(() => {
    const mats: THREE.Matrix4[] = [];
    // Seeded pseudo-random using simple LCG
    let seed = 99371;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      return (seed >>> 0) / 0xffffffff;
    };

    // Distribute in clusters around the ring
    const clusterCount = 12;
    for (let c = 0; c < clusterCount; c++) {
      const clusterAngle = (c / clusterCount) * Math.PI * 2;
      const buildingsInCluster = Math.round(5 + rand() * 4); // 5–9 per cluster
      for (let b = 0; b < buildingsInCluster && mats.length < count; b++) {
        const angleOffset = (rand() - 0.5) * 0.45;
        const angle = clusterAngle + angleOffset;
        const radius = 650 + rand() * 100; // 650–750
        const w = 8 + rand() * 14; // 8–22
        const d = 8 + rand() * 14; // 8–22
        const h = 40 + rand() * 140; // 40–180

        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = h / 2;

        const mat = new THREE.Matrix4();
        mat.compose(
          new THREE.Vector3(x, y, z),
          new THREE.Quaternion().setFromEuler(
            new THREE.Euler(0, angle + Math.PI / 2, 0),
          ),
          new THREE.Vector3(w, h, d),
        );
        mats.push(mat);
      }
    }
    return mats;
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;
    matrices.forEach((mat, i) => meshRef.current!.setMatrixAt(i, mat));
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#0a0e14"
        emissive="#00e5ff"
        emissiveIntensity={0.12}
        metalness={0.9}
        roughness={0.4}
      />
    </instancedMesh>
  );
}
