import * as THREE from "three";

export function createWindowGridTexture(seed = 12345): THREE.DataTexture {
  const width = 256;
  const height = 512;
  const data = new Uint8Array(width * height * 4);

  // Background: dark graphite glass
  for (let i = 0; i < width * height * 4; i += 4) {
    data[i] = 4;
    data[i + 1] = 6;
    data[i + 2] = 12;
    data[i + 3] = 255;
  }

  const cols = 10;
  const rows = 42;
  const winW = Math.floor(width / cols);
  const winH = Math.floor(height / rows);
  const padX = 2;
  const padY = 2;

  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };

  for (let row = 0; row < rows; row++) {
    // Only ~22% of floors have lights on
    const floorLit = rand() < 0.22;
    for (let col = 0; col < cols; col++) {
      // On a lit floor, 65% of windows lit; on dark floor, 2% (stray lights)
      const lit = floorLit ? rand() < 0.65 : rand() < 0.02;
      if (!lit) continue;

      const t = rand();
      // Warm white — real office lighting tone
      const r = Math.floor(200 + t * 40); // 200-240
      const g = Math.floor(185 + t * 40); // 185-225
      const b = Math.floor(140 + t * 60); // 140-200

      const startX = col * winW + padX;
      const startY = row * winH + padY;
      const endX = startX + winW - padX * 2;
      const endY = startY + winH - padY * 2;

      for (let py = startY; py < endY && py < height; py++) {
        for (let px = startX; px < endX && px < width; px++) {
          const idx = (py * width + px) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255;
        }
      }
    }
  }

  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}
