import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import glsl from "vite-plugin-glsl";

// We use this to get a string reference to the Buffer constructor
// that Vite/Rollup can correctly inject.
// NOTE: Must use 'require' here for synchronous access if not using `import()` in define
// If you face issues with `require`, fall back to the pure string literal (Option B below).
// const Buffer = require('buffer').Buffer; // Requires require() if not pure ESM

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    glsl(), // Add GLSL shader support
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      // FIX: Explicitly alias 'buffer' to the installed package
      buffer: 'buffer/',
      'stream': 'stream-browserify',
      'util': 'util',
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  // 👇 FINAL FIX: Define the global Buffer object with a simple, static string.
  // This ensures that any code that uses the global 'Buffer' or imports 'buffer'
  // gets a valid browser-compatible implementation.
  define: {
    global: 'globalThis',
    // Use the standard, stable way to define Buffer in Vite.
    'Buffer': 'Buffer' 
  },
  base: "/",
  assetsInclude: ["**/*.gltf", "**/*.glb", "**/*.mp3", "**/*.ogg", "**/*.wav"],
});
