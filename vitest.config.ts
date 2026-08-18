import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

// Sync assets for tests
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
} catch (e) {
  // ignore
}

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [],
    include: ["tests/vitest/**/*.{test,spec}.{ts,tsx}", "src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
