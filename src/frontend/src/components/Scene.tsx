import { Canvas } from "@react-three/fiber";
import { AirTraffic } from "./AirTraffic";
import { Atmosphere } from "./Atmosphere";
import { CentralPlatform } from "./CentralPlatform";
import { FirstPersonController } from "./FirstPersonController";
import { MegaTower } from "./MegaTower";
import { OUTER_POSITIONS, OuterPlatforms } from "./OuterPlatforms";
import { SkyBridge } from "./SkyBridge";
import { SkyscraperCluster } from "./SkyscraperCluster";

const BRIDGE_KEYS = ["br0", "br1", "br2", "br3"] as const;
const CLUSTER_KEYS = ["cl0", "cl1", "cl2", "cl3"] as const;

export function Scene() {
  return (
    <Canvas
      camera={{ fov: 75, near: 0.1, far: 900, position: [0, 18, 60] }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true }}
    >
      <Atmosphere />
      <CentralPlatform />
      <OuterPlatforms />
      <MegaTower />

      {/* Central platform — dense skyline, 35 buildings */}
      <SkyscraperCluster
        position={[0, 8, 0]}
        platformRadius={56}
        seed={42}
        buildingCount={35}
      />

      {/* Outer platform skyscrapers — 17 each */}
      {OUTER_POSITIONS.map((pos, i) => (
        <SkyscraperCluster
          key={CLUSTER_KEYS[i]}
          position={[pos[0], pos[1] + 6, pos[2]]}
          platformRadius={36}
          seed={i * 31 + 13}
          buildingCount={17}
        />
      ))}

      {/* Sky bridges to each outer platform */}
      {OUTER_POSITIONS.map((pos, i) => (
        <SkyBridge key={BRIDGE_KEYS[i]} targetPosition={pos} />
      ))}

      <AirTraffic />
      <FirstPersonController />
    </Canvas>
  );
}
