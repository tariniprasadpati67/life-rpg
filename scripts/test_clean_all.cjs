const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const brainDir = 'C:/Users/Lenovo/.gemini/antigravity-ide/brain/9e3d7003-12b6-43fc-bf5c-e1486e5149f4';
const outputDir = path.join(__dirname, '..', 'scratch');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

async function processBadge(inputPath, outName, lowThresh = 40, highThresh = 90) {
  const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const visited = new Uint8Array(width * height);
  const queue = [];

  function push(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    visited[idx] = 1;
    queue.push(idx);
  }

  // Seed borders
  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }

  let head = 0;
  while (head < queue.length) {
    const idx = queue[head++];
    const x = idx % width;
    const y = Math.floor(idx / width);
    const p = idx * 4;

    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    
    // Perceived luminance / max color channel
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const maxC = Math.max(r, Math.max(g, b));

    // If it's part of the background/glow
    if (lum <= highThresh && maxC <= highThresh * 1.3) {
      if (lum <= lowThresh) {
        data[p + 3] = 0; // completely transparent
      } else {
        const factor = (lum - lowThresh) / (highThresh - lowThresh);
        data[p + 3] = Math.round(factor * 255);
      }
      push(x + 1, y);
      push(x - 1, y);
      push(x, y + 1);
      push(x, y - 1);
    }
  }

  const outPath = path.join(outputDir, outName);
  await sharp(data, { raw: info })
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  console.log(`Saved: ${outName}`);
}

async function run() {
  await processBadge(path.join(brainDir, 'badge_novice_1789240546730.jpg'), 'test-novice.png', 25, 60);
  await processBadge(path.join(brainDir, 'badge_silver_clean_1789241782393.jpg'), 'test-silver.png', 25, 70);
  await processBadge(path.join(brainDir, 'badge_warrior_clean_1789241804568.jpg'), 'test-warrior.png', 20, 50);
  await processBadge(path.join(brainDir, 'badge_cyber_1789240597535.jpg'), 'test-cyber.png', 35, 95);
  await processBadge(path.join(brainDir, 'badge_champion_1789240615864.jpg'), 'test-champion.png', 30, 85);
  await processBadge(path.join(brainDir, 'badge_mythic_clean_1789241826400.jpg'), 'test-mythic.png', 35, 95);
}

run().catch(console.error);
