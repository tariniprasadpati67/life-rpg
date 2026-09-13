const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const brainDir = 'C:/Users/Lenovo/.gemini/antigravity-ide/brain/9e3d7003-12b6-43fc-bf5c-e1486e5149f4';
const publicBadges = path.join(__dirname, '..', 'public', 'badges');

async function inspect(filePath) {
  const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  console.log(`\n--- Inspecting: ${path.basename(filePath)} (${width}x${height}) ---`);
  // Check diagonal from (0,0) to (300, 300)
  for (let i = 0; i <= 300; i += 30) {
    const idx = (i * width + i) * 4;
    console.log(`pos (${i},${i}): R=${data[idx]}, G=${data[idx+1]}, B=${data[idx+2]}`);
  }
}

async function run() {
  await inspect(path.join(brainDir, 'badge_novice_1789240546730.jpg'));
  await inspect(path.join(brainDir, 'badge_bronze_v2_1789241738078.jpg'));
  await inspect(path.join(brainDir, 'badge_silver_1789240562632.jpg'));
  await inspect(path.join(brainDir, 'badge_warrior_clean_1789241804568.jpg'));
  await inspect(path.join(brainDir, 'badge_cyber_1789240597535.jpg'));
  await inspect(path.join(brainDir, 'badge_champion_1789240615864.jpg'));
  await inspect(path.join(brainDir, 'badge_mythic_clean_1789241826400.jpg'));
}

run();
