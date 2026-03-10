import { HUD } from "./components/HUD";
import { Scene } from "./components/Scene";

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#050810" }}>
      <Scene />
      <HUD />
    </div>
  );
}
