const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');
const publicImagesDir = path.resolve(__dirname, 'public', 'images');
const coachesDir = path.resolve(publicImagesDir, 'coaches');

if (!fs.existsSync(coachesDir)) {
  fs.mkdirSync(coachesDir, { recursive: true });
}

const assets = [
  {
    src: path.join(baseDir, 'logo club.jpg'),
    dest: path.join(publicImagesDir, 'logo.jpg')
  },
  {
    src: path.join(baseDir, 'صورة الكابتن عدي الهنداوي.png'),
    dest: path.join(coachesDir, 'odai.png')
  },
  {
    src: path.join(baseDir, 'صورة الكابتن محمد التلاوي.png'),
    dest: path.join(coachesDir, 'mohammad.png')
  },
  {
    src: path.join(baseDir, 'صورة الكابتن عبدالله البوريني.png'),
    dest: path.join(coachesDir, 'abdullah.png')
  },
  {
    src: path.join(baseDir, 'الكابتن ضياء الحارثي.png'),
    dest: path.join(coachesDir, 'diaa.png')
  }
];

console.log('Copying assets...');
for (const item of assets) {
  if (fs.existsSync(item.src)) {
    fs.copyFileSync(item.src, item.dest);
    const stat = fs.statSync(item.dest);
    console.log(`COPIED: ${path.basename(item.src)} -> ${item.dest} (${stat.size} bytes)`);
  } else {
    console.error(`ERROR: Source file not found: ${item.src}`);
  }
}
console.log('Done.');
