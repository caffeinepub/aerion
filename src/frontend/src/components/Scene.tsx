import { Canvas } from "@react-three/fiber";
import { AirTraffic } from "./AirTraffic";
import { Atmosphere } from "./Atmosphere";
import { CentralPlatform } from "./CentralPlatform";
import { CinematicBuildingRing } from "./CinematicBuildingRing";
import { DistantSkylineRing } from "./DistantSkylineRing";
import { FirstPersonController } from "./FirstPersonController";
import { GroundTraffic } from "./GroundTraffic";
import { InnerSkyBridges } from "./InnerSkyBridges";
import { MegaTower } from "./MegaTower";
import { OUTER_POSITIONS, OuterPlatforms } from "./OuterPlatforms";
import { SkyBridge } from "./SkyBridge";
import { SkyscraperCluster } from "./SkyscraperCluster";
import { TransportLanes } from "./TransportLanes";

const BRIDGE_KEYS = ["br0", "br1", "br2", "br3"] as const;
const CLUSTER_KEYS = ["cl0", "cl1", "cl2", "cl3"] as const;

export function Scene() {
  return (
    <Canvas
      camera={{ fov: 75, near: 0.1, far: 1400, position: [0, 40, 120] }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true }}
    >
      <Atmosphere />
      <CentralPlatform />
      <OuterPlatforms />
      <MegaTower />
      <CinematicBuildingRing />
      <InnerSkyBridges />
      <TransportLanes />

      {/* Central platform — dense skyline, 80 buildings */}
      <SkyscraperCluster
        position={[0, 8, 0]}
        platformRadius={56}
        seed={42}
        buildingCount={80}
      />

      {/* Outer platform skyscrapers — 25 each */}
      {OUTER_POSITIONS.map((pos, i) => (
        <SkyscraperCluster
          key={CLUSTER_KEYS[i]}
          position={[pos[0], pos[1] + 6, pos[2]]}
          platformRadius={36}
          seed={i * 31 + 13}
          buildingCount={25}
        />
      ))}

      {/* Sky bridges to each outer platform */}
      {OUTER_POSITIONS.map((pos, i) => (
        <SkyBridge key={BRIDGE_KEYS[i]} targetPosition={pos} />
      ))}

      {/* Distant city horizon silhouette ring */}
      <DistantSkylineRing />

      <AirTraffic />
      <GroundTraffic />
      <FirstPersonController />
    </Canvas>
  );
}
