# AERION

## Current State
- First-person 3D city explorer with WASD + mouse look controls
- Player spawns at (0, 35, 120) facing Mega Tower
- AirTraffic (20 taxis + 40 drones) already animate via clock.getElapsedTime() — always moving
- No mobile controls; no intro orbit; PLAYER_HEIGHT = 35

## Requested Changes (Diff)

### Add
- Intro cinematic orbit: camera orbits the Mega Tower at radius 120, height 40, for exactly ONE full rotation (~7 seconds) on scene load
- After orbit completes OR player touches/clicks, transition seamlessly to first-person mode at spawn (0, 40, 120)
- GameControlsContext: shared ref-based state for joystick, look delta, and skipOrbit signal between MobileControls and FirstPersonController
- MobileControls component (DOM overlay, outside Canvas):
  - Left half: virtual joystick (circle base + draggable thumb) for movement
  - Right half: invisible swipe area for look rotation
  - Semi-transparent, minimal, only rendered on touch devices
  - Any touch during orbit skips it immediately
- HUD: hide desktop hint on touch devices; show mobile hint instead

### Modify
- PLAYER_HEIGHT: 35 → 40
- FirstPersonController: integrate orbit phase, first-person phase, touch joystick input, touch look input
- Scene.tsx: update Canvas initial camera position to [0, 40, 120]
- App.tsx: wrap with GameControlsProvider, render MobileControls alongside Scene and HUD

### Remove
- Nothing removed from city geometry or air traffic

## Implementation Plan
1. Create `src/frontend/src/context/GameControlsContext.tsx` — ref-based shared state
2. Rewrite `FirstPersonController.tsx` — orbit phase + first-person phase + joystick/look input
3. Create `src/frontend/src/components/MobileControls.tsx` — touch joystick + swipe look overlay
4. Update `HUD.tsx` — detect touch device, show appropriate controls hint
5. Update `Scene.tsx` — camera initial position to [0, 40, 120]
6. Update `App.tsx` — add GameControlsProvider wrapper + MobileControls render
