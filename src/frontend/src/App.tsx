import { HUD } from "./components/HUD";
import { MobileControls } from "./components/MobileControls";
import { Scene } from "./components/Scene";
import { GameControlsProvider } from "./context/GameControlsContext";

export default function App() {
  return (
    <GameControlsProvider>
      <div style={{ width: "100vw", height: "100vh", background: "#050810" }}>
        <Scene />
        <HUD />
        <MobileControls />
      </div>
    </GameControlsProvider>
  );
}
