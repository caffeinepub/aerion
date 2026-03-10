import { useMemo } from "react";
import * as THREE from "three";
import { createWindowGridTexture } from "../utils/WindowGridTexture";

interface CinematicBuildingProps {
  position: [number, number, number];
  seed: number;
  height: number;
  width: number;
}

function lcgRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

const BODY_COLORS = ["#030507", "#040608", "#030407", "#050607", "#030506"];

const BILLBOARD_COLORS = [
  { color: "#000820", emissive: "#0055ff", intensity: 5.0 },
  { color: "#100008", emissive: "#cc0077", intensity: 4.5 },
  { color: "#080020", emissive: "#7700ff", intensity: 4.5 },
  { color: "#001008", emissive: "#00ddaa", intensity: 4.2 },
  { color: "#100800", emissive: "#ff7700", intensity: 4.0 },
  { color: "#001520", emissive: "#00aaff", intensity: 5.0 },
];

export function CinematicBuilding({
  position,
  seed,
  height,
  width,
}: CinematicBuildingProps) {
  const windowTex = useMemo(() => createWindowGridTexture(seed), [seed]);
  const rand = useMemo(() => lcgRand(seed), [seed]);
  const buildingType = useMemo(() => Math.floor(rand() * 6), [rand]);
  const colorIdx = useMemo(
    () => Math.floor(rand() * BODY_COLORS.length),
    [rand],
  );
  const bodyColor = BODY_COLORS[colorIdx];
  const metalness = useMemo(() => 0.88 + rand() * 0.1, [rand]);
  const roughness = useMemo(() => 0.01 + rand() * 0.08, [rand]);
  const hasBillboard = useMemo(() => rand() < 0.42, [rand]);
  const billboardIdx = useMemo(
    () => Math.floor(rand() * BILLBOARD_COLORS.length),
    [rand],
  );
  const billboard = BILLBOARD_COLORS[billboardIdx];

  const bodyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(bodyColor),
        metalness,
        roughness,
      }),
    [bodyColor, metalness, roughness],
  );

  // Dense window material — high emissive, warm white
  const windowMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(bodyColor),
        emissive: new THREE.Color("#fff5e0"),
        emissiveIntensity: 0.45,
        emissiveMap: windowTex,
        metalness: metalness + 0.04,
        roughness: roughness,
      }),
    [bodyColor, windowTex, metalness, roughness],
  );

  const steelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#040810"),
        metalness: 0.96,
        roughness: 0.04,
      }),
    [],
  );

  const mechMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#070a0f"),
        metalness: 0.8,
        roughness: 0.3,
      }),
    [],
  );

  const cyanEdgeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#000808"),
        emissive: new THREE.Color("#00c8c0"),
        emissiveIntensity: 1.6,
      }),
    [],
  );

  const cyanGlowMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#000c0c"),
        emissive: new THREE.Color("#00e0d8"),
        emissiveIntensity: 5.0,
      }),
    [],
  );

  const ledgeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#060810"),
        emissive: new THREE.Color("#00b8b0"),
        emissiveIntensity: 1.2,
      }),
    [],
  );

  const billboardMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(billboard.color),
        emissive: new THREE.Color(billboard.emissive),
        emissiveIntensity: billboard.intensity,
      }),
    [billboard],
  );

  const [px, py, pz] = position;
  const billboardY = height * 0.32;
  const billboardW = width * 0.6;
  const billboardH = height * 0.13;

  // Type 0 — Tapered Cylinder (Petronas-style)
  if (buildingType === 0) {
    return (
      <group position={[px, py, pz]}>
        {/* Main tapered cylinder body */}
        <mesh position={[0, height / 2, 0]}>
          <cylinderGeometry args={[width * 0.18, width * 0.44, height, 12]} />
          <primitive object={bodyMat} attach="material" />
        </mesh>
        {/* Window overlay */}
        <mesh position={[0, height / 2, 0]}>
          <cylinderGeometry
            args={[width * 0.19, width * 0.45, height * 0.96, 12]}
          />
          <primitive object={windowMat} attach="material" />
        </mesh>
        {/* Crown platform */}
        <mesh position={[0, height + 1, 0]}>
          <cylinderGeometry args={[width * 0.22, width * 0.19, 2.5, 12]} />
          <primitive object={steelMat} attach="material" />
        </mesh>
        {/* Antenna spire */}
        <mesh position={[0, height + height * 0.1 + 2, 0]}>
          <cylinderGeometry args={[0.06, 0.06, height * 0.2, 4]} />
          <primitive object={steelMat} attach="material" />
        </mesh>
        <mesh position={[0, height + height * 0.2 + 2, 0]}>
          <sphereGeometry args={[0.28, 8, 6]} />
          <primitive object={cyanGlowMat} attach="material" />
        </mesh>
        {/* Edge glow strips */}
        {([0, 1, 2, 3] as const).map((i) => {
          const a = (i / 4) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(a) * width * 0.22,
                height / 2,
                Math.sin(a) * width * 0.22,
              ]}
            >
              <boxGeometry args={[0.08, height, 0.08]} />
              <primitive object={cyanEdgeMat} attach="material" />
            </mesh>
          );
        })}
        {hasBillboard && (
          <mesh position={[0, billboardY, width * 0.26]}>
            <boxGeometry args={[billboardW, billboardH, 0.18]} />
            <primitive object={billboardMat} attach="material" />
          </mesh>
        )}
      </group>
    );
  }

  // Type 1 — Tiered Glass Monolith
  if (buildingType === 1) {
    const t1h = height * 0.44;
    const t2h = height * 0.32;
    const t3h = height * 0.24;
    return (
      <group position={[px, py, pz]}>
        <mesh position={[0, t1h / 2, 0]}>
          <boxGeometry args={[width, t1h, width]} />
          <primitive object={windowMat} attach="material" />
        </mesh>
        <mesh position={[0, t1h + 0.3, 0]}>
          <boxGeometry args={[width + 0.4, 0.5, width + 0.4]} />
          <primitive object={ledgeMat} attach="material" />
        </mesh>
        <mesh position={[0, t1h + t2h / 2, 0]}>
          <boxGeometry args={[width * 0.7, t2h, width * 0.7]} />
          <meshStandardMaterial
            color={new THREE.Color(bodyColor)}
            emissive={new THREE.Color("#fff5e0")}
            emissiveIntensity={0.38}
            emissiveMap={windowTex}
            metalness={metalness}
            roughness={roughness}
          />
        </mesh>
        <mesh position={[0, t1h + t2h + 0.25, 0]}>
          <boxGeometry args={[width * 0.72, 0.5, width * 0.72]} />
          <primitive object={ledgeMat} attach="material" />
        </mesh>
        <mesh position={[0, t1h + t2h + t3h / 2, 0]}>
          <boxGeometry args={[width * 0.46, t3h, width * 0.46]} />
          <meshStandardMaterial
            color={new THREE.Color(bodyColor)}
            emissive={new THREE.Color("#fff5e0")}
            emissiveIntensity={0.35}
            emissiveMap={windowTex}
            metalness={metalness}
            roughness={roughness}
          />
        </mesh>
        <mesh position={[width * 0.1, t1h + t2h + t3h + 1.2, width * 0.08]}>
          <boxGeometry args={[width * 0.14, 2.2, width * 0.14]} />
          <primitive object={mechMat} attach="material" />
        </mesh>
        {hasBillboard && (
          <mesh position={[0, billboardY, width * 0.52]}>
            <boxGeometry args={[billboardW, billboardH, 0.18]} />
            <primitive object={billboardMat} attach="material" />
          </mesh>
        )}
      </group>
    );
  }

  // Type 2 — Curved Glass Slab with Vertical Fins
  if (buildingType === 2) {
    return (
      <group position={[px, py, pz]}>
        <mesh position={[0, height / 2, 0]}>
          <boxGeometry args={[width * 0.58, height, width * 0.58]} />
          <primitive object={windowMat} attach="material" />
        </mesh>
        {([-0.22, -0.11, 0, 0.11, 0.22] as const).map((frac) => (
          <mesh key={frac} position={[width * frac, height / 2, 0]}>
            <boxGeometry args={[0.18, height, width * 0.6]} />
            <primitive object={steelMat} attach="material" />
          </mesh>
        ))}
        <mesh position={[0, height + height * 0.08, 0]}>
          <cylinderGeometry args={[0.05, 0.24, height * 0.16, 6]} />
          <primitive object={steelMat} attach="material" />
        </mesh>
        <mesh position={[0, height + height * 0.16, 0]}>
          <sphereGeometry args={[0.32, 8, 6]} />
          <primitive object={cyanGlowMat} attach="material" />
        </mesh>
        <mesh position={[0, height + 0.5, 0]}>
          <boxGeometry args={[width * 0.62, 1.0, width * 0.62]} />
          <primitive object={mechMat} attach="material" />
        </mesh>
        {hasBillboard && (
          <mesh position={[width * 0.32, billboardY, 0]}>
            <boxGeometry args={[0.18, billboardH, billboardW]} />
            <primitive object={billboardMat} attach="material" />
          </mesh>
        )}
      </group>
    );
  }

  // Type 3 — Stepped Glass Tower
  if (buildingType === 3) {
    const lowerH = height * 0.56;
    const upperH = height * 0.44;
    return (
      <group position={[px, py, pz]}>
        <mesh position={[0, lowerH / 2, 0]}>
          <boxGeometry args={[width, lowerH, width]} />
          <primitive object={windowMat} attach="material" />
        </mesh>
        <mesh position={[width * 0.08, lowerH + upperH / 2, width * 0.05]}>
          <boxGeometry args={[width * 0.58, upperH, width * 0.58]} />
          <meshStandardMaterial
            color={new THREE.Color(bodyColor)}
            emissive={new THREE.Color("#fff5e0")}
            emissiveIntensity={0.38}
            emissiveMap={windowTex}
            metalness={metalness}
            roughness={roughness}
            transparent
            opacity={0.97}
          />
        </mesh>
        <mesh position={[width * 0.08, lowerH + upperH + 0.4, width * 0.05]}>
          <boxGeometry args={[width * 0.6, 0.8, width * 0.6]} />
          <primitive object={ledgeMat} attach="material" />
        </mesh>
        <mesh position={[width * 0.08, lowerH + upperH + 5.5, width * 0.05]}>
          <cylinderGeometry args={[0.08, 0.08, 9, 4]} />
          <primitive object={steelMat} attach="material" />
        </mesh>
        <mesh position={[width * 0.08, lowerH + upperH + 10.2, width * 0.05]}>
          <sphereGeometry args={[0.26, 6, 4]} />
          <primitive object={cyanGlowMat} attach="material" />
        </mesh>
        {hasBillboard && (
          <mesh position={[0, billboardY, width * 0.52]}>
            <boxGeometry args={[billboardW, billboardH, 0.18]} />
            <primitive object={billboardMat} attach="material" />
          </mesh>
        )}
      </group>
    );
  }

  // Type 4 — Twin Tapered Towers (Petronas Twin style)
  if (buildingType === 4) {
    const offset = width * 0.38;
    return (
      <group position={[px, py, pz]}>
        {([-1, 1] as const).map((side) => (
          <group key={side} position={[side * offset, 0, 0]}>
            <mesh position={[0, height / 2, 0]}>
              <cylinderGeometry
                args={[width * 0.16, width * 0.32, height, 10]}
              />
              <primitive object={bodyMat} attach="material" />
            </mesh>
            <mesh position={[0, height / 2, 0]}>
              <cylinderGeometry
                args={[width * 0.17, width * 0.33, height * 0.97, 10]}
              />
              <primitive object={windowMat} attach="material" />
            </mesh>
            <mesh position={[0, height + 1.2, 0]}>
              <cylinderGeometry args={[width * 0.08, width * 0.17, 2, 8]} />
              <primitive object={steelMat} attach="material" />
            </mesh>
            <mesh position={[0, height + height * 0.12, 0]}>
              <cylinderGeometry args={[0.07, 0.07, height * 0.22, 4]} />
              <primitive object={steelMat} attach="material" />
            </mesh>
            <mesh position={[0, height + height * 0.23, 0]}>
              <sphereGeometry args={[0.22, 6, 4]} />
              <primitive object={cyanGlowMat} attach="material" />
            </mesh>
          </group>
        ))}
        {/* Sky bridge between the two towers */}
        <mesh position={[0, height * 0.58, 0]}>
          <boxGeometry args={[offset * 2, width * 0.18, width * 0.32]} />
          <primitive object={steelMat} attach="material" />
        </mesh>
        {hasBillboard && (
          <mesh position={[0, billboardY * 0.7, width * 0.36]}>
            <boxGeometry args={[billboardW * 1.3, billboardH, 0.18]} />
            <primitive object={billboardMat} attach="material" />
          </mesh>
        )}
      </group>
    );
  }

  // Type 5 — Diamond-Cut Spire Tower
  const midH = height * 0.65;
  const topH = height * 0.35;
  return (
    <group position={[px, py, pz]}>
      <mesh position={[0, midH / 2, 0]}>
        <boxGeometry args={[width * 0.9, midH, width * 0.9]} />
        <primitive object={windowMat} attach="material" />
      </mesh>
      {/* Diagonal cuts on corners */}
      {([0, 1, 2, 3] as const).map((i) => {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(a) * width * 0.42,
              midH / 2,
              Math.sin(a) * width * 0.42,
            ]}
            rotation={[0, a, 0]}
          >
            <boxGeometry args={[0.15, midH, width * 0.22]} />
            <primitive object={steelMat} attach="material" />
          </mesh>
        );
      })}
      <mesh position={[0, midH + topH / 2, 0]}>
        <cylinderGeometry args={[width * 0.12, width * 0.46, topH, 8]} />
        <meshStandardMaterial
          color={new THREE.Color(bodyColor)}
          emissive={new THREE.Color("#fff5e0")}
          emissiveIntensity={0.35}
          emissiveMap={windowTex}
          metalness={metalness}
          roughness={roughness}
        />
      </mesh>
      <mesh position={[0, midH + topH + 3.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 6, 4]} />
        <primitive object={steelMat} attach="material" />
      </mesh>
      <mesh position={[0, midH + topH + 7, 0]}>
        <sphereGeometry args={[0.24, 6, 4]} />
        <primitive object={cyanGlowMat} attach="material" />
      </mesh>
      {hasBillboard && (
        <mesh position={[0, billboardY, width * 0.46]}>
          <boxGeometry args={[billboardW, billboardH, 0.18]} />
          <primitive object={billboardMat} attach="material" />
        </mesh>
      )}
    </group>
  );
}
