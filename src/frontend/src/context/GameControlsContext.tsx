import { createContext, useContext, useRef } from "react";

export interface GameControlsState {
  joystick: { x: number; y: number }; // -1 to 1 each axis; y: +1 = forward
  lookDelta: { x: number; y: number }; // accumulated px since last frame
  skipOrbit: boolean;
}

const GameControlsContext =
  createContext<React.MutableRefObject<GameControlsState> | null>(null);

export function GameControlsProvider({
  children,
}: { children: React.ReactNode }) {
  const ref = useRef<GameControlsState>({
    joystick: { x: 0, y: 0 },
    lookDelta: { x: 0, y: 0 },
    skipOrbit: false,
  });
  return (
    <GameControlsContext.Provider value={ref}>
      {children}
    </GameControlsContext.Provider>
  );
}

export function useGameControls(): React.MutableRefObject<GameControlsState> {
  const ctx = useContext(GameControlsContext);
  if (!ctx)
    throw new Error("useGameControls must be used within GameControlsProvider");
  return ctx;
}
