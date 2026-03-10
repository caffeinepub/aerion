import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export function DistantSkylineRing() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 90;

  const matrices = useMemo(() => {
    const mats: THREE.Matrix4[] = [];
    let seed = 99371;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      return (seed >>> 0) / 0xffffffff;
    };

    const clusterCount = 12;
    for (let c = 0; c < clusterCount; c++) {
      const clusterAngle = (c / clusterCount) * Math.PI * 2;
      const buildingsInCluster = Math.round(5 + rand() * 4);
      for (let b = 0; b < buildingsInCluster && mats.length < count; b++) {
        const angleOffset = (rand() - 0.5) * 0.45;
        const angle = clusterAngle + angleOffset;
        const radius = 650 + rand() * 100;
        const w = 8 + rand() * 14;
        const d = 8 + rand() * 14;
        const h = 40 + rand() * 140;

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
        color="#060810"
        emissive="#0a1820"
        emissiveIntensity={0.04}
        metalness={0.95}
        roughness={0.5}
      />
    </instancedMesh>
  );
}
