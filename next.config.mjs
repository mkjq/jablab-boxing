import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Auto-sync/copy assets from root to public/images/ on startup/build
function syncAssets() {
  try {
    const rootDir = path.resolve(__dirname, "..");
    const publicDir = path.resolve(__dirname, "public");
    const imagesDir = path.join(publicDir, "images");
    const coachesDir = path.join(imagesDir, "coaches");

    if (!fs.existsSync(coachesDir)) {
      fs.mkdirSync(coachesDir, { recursive: true });
    }

    const assetMappings = [
      {
        src: path.join(rootDir, "logo club.jpg"),
        dest: path.join(imagesDir, "logo.jpg"),
      },
      {
        src: path.join(rootDir, "صورة الكابتن عدي الهنداوي.png"),
        dest: path.join(coachesDir, "odai.png"),
      },
      {
        src: path.join(rootDir, "صورة الكابتن عبدالله البوريني.png"),
        dest: path.join(coachesDir, "abdullah.png"),
      },
      {
        src: path.join(rootDir, "صورة الكابتن محمد التلاوي.png"),
        dest: path.join(coachesDir, "mohammad.png"),
      },
      {
        src: path.join(rootDir, "الكابتن ضياء الحارثي.png"),
        dest: path.join(coachesDir, "diaa.png"),
      },
    ];

    for (const mapping of assetMappings) {
      if (fs.existsSync(mapping.src)) {
        fs.copyFileSync(mapping.src, mapping.dest);
      }
    }
  } catch (err) {
    console.warn("Asset sync notice:", err.message);
  }
}

syncAssets();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
