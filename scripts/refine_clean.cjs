const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const brainDir = 'C:/Users/Lenovo/.gemini/antigravity-ide/brain/9e3d7003-12b6-43fc-bf5c-e1486e5149f4';
const outputDir = path.join(__dirname, '..', 'scratch');

async function processSilver() {
  const inputPath = path.join(brainDir, 'badge_silver_clean_1789241782393.jpg');
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

  for (let x = 0; x < width; x++) { push(x, 0); push(x, height - 1); }
  for (let y = 0; y < height; y++) { push(0, y); push(width - 1, y); }

  let head = 0;
  while (head < queue.length) {
    const idx = queue[head++];
    const x = idx % width;
    const y = Math.floor(idx / width);
    const p = idx * 4;

    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    // Silver metal is bright gray/white (r ≈ g ≈ b and high lum).
    // The purple halo is dark or violet (b > r && b > g, or low lum).
    const isSilverMetal = (lum > 140 && Math.abs(r - g) < 40 && Math.abs(g - b) < 40);
    const isBg = !isSilverMetal && (lum < 110 || (b > r + 15 && b > g + 15 && lum < 150));

    if (isBg) {
      if (lum < 40) {
        data[p + 3] = 0;
      } else if (lum < 110) {
        const factor = (lum - 40) / 70;
        data[p + 3] = Math.round(factor * 200 * (1 - (b - Math.min(r,g))/255));
        if (data[p+3] < 30) data[p+3] = 0;
      } else {
        data[p + 3] = 0;
      }
      push(x + 1, y);
      push(x - 1, y);
      push(x, y + 1);
      push(x, y - 1);
    }
  }

  await sharp(data, { raw: info }).png().toFile(path.join(outputDir, 'refined-silver.png'));
  console.log('Saved refined-silver.png');
}

async function processChampion() {
  const inputPath = path.join(brainDir, 'badge_champion_1789240615864.jpg');
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

  for (let x = 0; x < width; x++) { push(x, 0); push(x, height - 1); }
  for (let y = 0; y < height; y++) { push(0, y); push(width - 1, y); }

  let head = 0;
  while (head < queue.length) {
    const idx = queue[head++];
    const x = idx % width;
    const y = Math.floor(idx / width);
    const p = idx * 4;

    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    // Gold metal is bright (lum > 130).
    // Flare background is darker orange (lum < 100 or low contrast).
    const isGold = lum > 120 && r > 120 && g > 90;
    const isBlade = lum > 110 && Math.abs(r - b) < 30; // sword steel
    const isBg = (!isGold && !isBlade && lum < 95);

    if (isBg) {
      if (lum < 35) {
        data[p + 3] = 0;
      } else {
        const factor = (lum - 35) / 60;
        data[p + 3] = Math.round(factor * 150);
        if (data[p + 3] < 30) data[p + 3] = 0;
      }
      push(x + 1, y);
      push(x - 1, y);
      push(x, y + 1);
      push(x, y - 1);
    }
  }

  await sharp(data, { raw: info }).png().toFile(path.join(outputDir, 'refined-champion.png'));
  console.log('Saved refined-champion.png');
}

async function processMythic() {
  const inputPath = path.join(brainDir, 'badge_mythic_1789240763018.jpg');
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

  for (let x = 0; x < width; x++) { push(x, 0); push(x, height - 1); }
  for (let y = 0; y < height; y++) { push(0, y); push(width - 1, y); }

  let head = 0;
  while (head < queue.length) {
    const idx = queue[head++];
    const x = idx % width;
    const y = Math.floor(idx / width);
    const p = idx * 4;

    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    // Wing feathers & gold rim: lum > 100 or vibrant
    const isSolid = lum > 100 || (r > 130 && g > 90); // gold or bright wing
    const isBg = !isSolid && lum < 80;

    if (isBg) {
      if (lum < 30) {
        data[p + 3] = 0;
      } else {
        const factor = (lum - 30) / 50;
        data[p + 3] = Math.round(factor * 180);
        if (data[p + 3] < 30) data[p + 3] = 0;
      }
      push(x + 1, y);
      push(x - 1, y);
      push(x, y + 1);
      push(x, y - 1);
    }
  }

  await sharp(data, { raw: info }).png().toFile(path.join(outputDir, 'refined-mythic.png'));
  console.log('Saved refined-mythic.png');
}

async function run() {
  await processSilver();
  await processChampion();
  await processMythic();
}
run().catch(console.error);
