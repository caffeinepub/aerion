import { useMemo } from "react";

const UNDERSIDE_RADII = [0.6, 0.8];

const GRID_COUNT = 8;
const GRID_SPACING = 14;
const GRID_LENGTH = 110;

const SPOKE_COUNT = 6;
const SPOKE_LENGTH = 55;

const PYLON_COUNT = 12;
const PYLON_RADIUS = 60;

function GridLines() {
  const lines = useMemo(() => {
    const result: {
      key: string;
      pos: [number, number, number];
      rot: [number, number, number];
    }[] = [];
    for (let i = 0; i < GRID_COUNT; i++) {
      const offset = (i - (GRID_COUNT - 1) / 2) * GRID_SPACING;
      result.push({
        key: `gx${i}`,
        pos: [offset, 0.12, 0],
        rot: [0, 0, 0],
      });
      result.push({
        key: `gz${i}`,
        pos: [0, 0.12, offset],
        rot: [0, Math.PI / 2, 0],
      });
    }
    return result;
  }, []);

  return (
    <>
      {lines.map((l) => (
        <mesh key={l.key} position={l.pos} rotation={l.rot}>
          <boxGeometry args={[0.3, 0.08, GRID_LENGTH]} />
          <meshStandardMaterial
            color="#1a2e40"
            emissive="#00e5ff"
            emissiveIntensity={0.25}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}
    </>
  );
}

function GlowingSpokes() {
  const spokes = useMemo(() => {
    return Array.from({ length: SPOKE_COUNT }, (_, i) => ({
      key: `spoke${i}`,
      angle: (i / SPOKE_COUNT) * Math.PI * 2,
    }));
  }, []);

  return (
    <>
      {spokes.map((s) => (
        <mesh
          key={s.key}
          position={[
            Math.cos(s.angle) * SPOKE_LENGTH * 0.5,
            0.14,
            Math.sin(s.angle) * SPOKE_LENGTH * 0.5,
          ]}
          rotation={[0, -s.angle, 0]}
        >
          <boxGeometry args={[SPOKE_LENGTH, 0.06, 0.6]} />
          <meshStandardMaterial
            color="#001a22"
            emissive="#00e5ff"
            emissiveIntensity={0.6}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
    </>
  );
}

function OuterEdgeWall() {
  return (
    <mesh position={[0, 1.25, 0]}>
      <torusGeometry args={[58, 1.2, 8, 128]} />
      <meshStandardMaterial
        color="#1c2030"
        emissive="#00e5ff"
        emissiveIntensity={0.3}
        metalness={0.85}
        roughness={0.15}
      />
    </mesh>
  );
}

function PerimeterPylons() {
  const pylons = useMemo(() => {
    return Array.from({ length: PYLON_COUNT }, (_, i) => ({
      key: `pylon${i}`,
      angle: (i / PYLON_COUNT) * Math.PI * 2,
      x: Math.cos((i / PYLON_COUNT) * Math.PI * 2) * PYLON_RADIUS,
      z: Math.sin((i / PYLON_COUNT) * Math.PI * 2) * PYLON_RADIUS,
    }));
  }, []);

  return (
    <>
      {pylons.map((p) => (
        <group key={p.key} position={[p.x, 0, p.z]}>
          <mesh position={[0, 4, 0]}>
            <boxGeometry args={[1.5, 8, 1.5]} />
            <meshStandardMaterial
              color="#14181e"
              emissive="#00e5ff"
              emissiveIntensity={0.4}
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, 8.5, 0]}>
            <boxGeometry args={[1.8, 0.6, 1.8]} />
            <meshStandardMaterial
              color="#001a22"
              emissive="#00e5ff"
              emissiveIntensity={1.2}
              metalness={0.9}
              roughness={0.05}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

// Subtle edge light strips at cardinal/diagonal positions
function EdgeLightStrips() {
  const strips = useMemo(() => {
    const angles = [0, 45, 90, 135, 180, 225];
    return angles.map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      return {
        key: `strip${i}`,
        x: Math.cos(rad) * 56,
        z: Math.sin(rad) * 56,
        rotY: rad,
      };
    });
  }, []);

  return (
    <>
      {strips.map((s) => (
        <mesh key={s.key} position={[s.x, 0.18, s.z]} rotation={[0, s.rotY, 0]}>
          <boxGeometry args={[12, 0.1, 0.4]} />
          <meshStandardMaterial
            color="#001a22"
            emissive="#00d4c8"
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}
    </>
  );
}

// Dashed lane markers radiating from center
function LaneMarkers() {
  const markers = useMemo(() => {
    const angles = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];
    return angles.flatMap((deg, ai) => {
      const rad = (deg * Math.PI) / 180;
      return [20, 33, 46].map((r, ri) => ({
        key: `lm${ai}-${ri}`,
        x: Math.cos(rad) * r,
        z: Math.sin(rad) * r,
        rotY: rad,
      }));
    });
  }, []);

  return (
    <>
      {markers.map((m) => (
        <mesh key={m.key} position={[m.x, 0.15, m.z]} rotation={[0, m.rotY, 0]}>
          <boxGeometry args={[0.3, 0.06, 3.5]} />
          <meshStandardMaterial
            color="#0a1a22"
            emissive="#1a3a4a"
            emissiveIntensity={0.4}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}
    </>
  );
}

// Illuminated utility boxes near bridge entrance zones
function UtilityBoxes() {
  const boxes = useMemo(() => {
    const angles = [45, 90, 135, 180, 225, 270, 315, 0];
    return angles.map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      const r = 54 + (i % 2) * 3;
      return {
        key: `ub${i}`,
        x: Math.cos(rad) * r,
        z: Math.sin(rad) * r,
      };
    });
  }, []);

  return (
    <>
      {boxes.map((b) => (
        <group key={b.key} position={[b.x, 0, b.z]}>
          {/* Box body */}
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[1.5, 2, 1.5]} />
            <meshStandardMaterial
              color="#14181e"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          {/* Glowing top cap */}
          <mesh position={[0, 2.05, 0]}>
            <boxGeometry args={[1.5, 0.1, 1.5]} />
            <meshStandardMaterial
              color="#001a22"
              emissive="#00d4c8"
              emissiveIntensity={0.9}
              metalness={0.9}
              roughness={0.05}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

// Low bollards near bridge connection points
function BridgeBollards() {
  const bollards = useMemo(() => {
    const angles = [45, 135, 225, 315];
    return angles.flatMap((deg, ai) => {
      const rad = (deg * Math.PI) / 180;
      return [-1, 0, 1].map((offset, oi) => {
        const sideAngle = rad + offset * 0.08;
        const r = 52 + oi * 1.5;
        return {
          key: `bb${ai}-${oi}`,
          x: Math.cos(sideAngle) * r,
          z: Math.sin(sideAngle) * r,
        };
      });
    });
  }, []);

  return (
    <>
      {bollards.map((b) => (
        <mesh key={b.key} position={[b.x, 1, b.z]}>
          <cylinderGeometry args={[0.4, 0.5, 2, 6]} />
          <meshStandardMaterial
            color="#1c2030"
            emissive="#00a8cc"
            emissiveIntensity={0.5}
            metalness={0.85}
            roughness={0.2}
          />
        </mesh>
      ))}
    </>
  );
}

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

      {/* Plaza detail — grid lines */}
      <GridLines />

      {/* Plaza detail — glowing light spokes */}
      <GlowingSpokes />

      {/* Raised outer edge wall */}
      <OuterEdgeWall />

      {/* Perimeter pylons */}
      <PerimeterPylons />

      {/* Surface infrastructure details */}
      <EdgeLightStrips />
      <LaneMarkers />
      <UtilityBoxes />
      <BridgeBollards />
    </group>
  );
}
