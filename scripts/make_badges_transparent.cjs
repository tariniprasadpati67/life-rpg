const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const badgesDir = path.join(__dirname, '..', 'public', 'badges');
const files = [
  'badge-novice.png',
  'badge-silver.png',
  'badge-warrior.png',
  'badge-cyber.png',
  'badge-champion.png',
  'badge-mythic.png'
];

async function removeBlackBackground(filePath) {
  console.log(`Processing: ${path.basename(filePath)}...`);
  const image = sharp(filePath);
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // Flood fill from border
  const visited = new Uint8Array(width * height);
  const queue = [];

  function push(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    visited[idx] = 1;
    queue.push(idx);
  }

  // Seed all borders
  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }

  let head = 0;
  const THRESHOLD_ZERO = 25;
  const THRESHOLD_MAX = 55;

  while (head < queue.length) {
    const idx = queue[head++];
    const x = idx % width;
    const y = Math.floor(idx / width);
    const p = idx * 4;

    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const maxC = Math.max(r, Math.max(g, b));

    if (maxC <= THRESHOLD_MAX) {
      if (maxC <= THRESHOLD_ZERO) {
        data[p + 3] = 0; // completely transparent
      } else {
        // smooth feathering
        const factor = (maxC - THRESHOLD_ZERO) / (THRESHOLD_MAX - THRESHOLD_ZERO);
        data[p + 3] = Math.round(factor * 255);
      }
      push(x + 1, y);
      push(x - 1, y);
      push(x, y + 1);
      push(x, y - 1);
    }
  }

  // Also do a pass on any stray isolated black pixels near the outer 20% perimeter
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const p = idx * 4;
      const r = data[p];
      const g = data[p + 1];
      const b = data[p + 2];
      const maxC = Math.max(r, Math.max(g, b));
      if (maxC < 14) {
        data[p + 3] = 0;
      }
    }
  }

  const tempOut = filePath + '.tmp.png';
  await sharp(data, { raw: info })
    .png({ compressionLevel: 9 })
    .toFile(tempOut);

  fs.unlinkSync(filePath);
  fs.renameSync(tempOut, filePath);
  console.log(`✅ Saved transparent: ${path.basename(filePath)}`);
}

async function processAll() {
  for (const f of files) {
    const fullPath = path.join(badgesDir, f);
    if (fs.existsSync(fullPath)) {
      await removeBlackBackground(fullPath);
    }
  }
  // Remove test files if any
  const testTrans = path.join(badgesDir, 'test-transparent.png');
  const testFlood = path.join(badgesDir, 'test-flood.png');
  if (fs.existsSync(testTrans)) fs.unlinkSync(testTrans);
  if (fs.existsSync(testFlood)) fs.unlinkSync(testFlood);

  console.log('🎉 All badges converted to true transparent PNGs!');
}

processAll().catch(err => {
  console.error('Error processing badges:', err);
  process.exit(1);
});
