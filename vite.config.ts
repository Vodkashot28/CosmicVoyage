import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
<<<<<<< HEAD
=======
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
>>>>>>> c297bfc4245e6f3d5429419ed9a7c68f69074ccc
import { fileURLToPath } from "url";
import glsl from "vite-plugin-glsl";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
<<<<<<< HEAD
    glsl(), // GLSL shader support
=======
    runtimeErrorOverlay(),
    glsl(), // Add GLSL shader support
>>>>>>> c297bfc4245e6f3d5429419ed9a7c68f69074ccc
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
<<<<<<< HEAD
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  base: "/", // use "/" locally; set "/CosmicVoyage/" only for GitHub Pages
=======
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  // Add support for large models and audio files
>>>>>>> c297bfc4245e6f3d5429419ed9a7c68f69074ccc
  assetsInclude: ["**/*.gltf", "**/*.glb", "**/*.mp3", "**/*.ogg", "**/*.wav"],
});
