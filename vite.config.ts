// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import glsl from "vite-plugin-glsl";
import { visualizer } from "rollup-plugin-visualizer"; // Performance analysis

// Helper to correctly get __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    glsl(), // Add GLSL shader support
    // Bundle visualizer for performance analysis (requires npm install -D rollup-plugin-visualizer)
    visualizer({ filename: "stats.html", open: false }), 
  ],

  // --- Path Resolution and Polyfills ---
  resolve: {
    alias: {
      // Standard application aliases
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      
      // Required Polyfills for TON/Crypto libraries (must have packages installed)
      // 'buffer' must be installed: npm install buffer
      'buffer': 'buffer/',
      // 'stream-browserify' must be installed: npm install stream-browserify
      'stream': 'stream-browserify', 
      // 'util' must be installed: npm install util
      'util': 'util',
    },
  },

  // --- Environment & Global Polyfills (Crucial Fix) ---
  // Uses the simple string literal fix to satisfy ESBuild's strict requirements for 'define'
  define: {
    // Defines 'global' as the browser's global scope
    global: 'globalThis',
  },

  // --- Project Structure ---
  // Root points to the 'client' directory where your index.html resides
  root: path.resolve(__dirname, "client"),
  
  // --- Build Configuration ---
  build: {
    // Output directory for the final build
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    
    // Performance: Raise chunk size warning limit
    chunkSizeWarningLimit: 1000, // 1MB limit

    // Performance: Vendor Chunking Strategy
    rollupOptions: {
      output: {
        // Manually split large vendor libraries into separate chunks for better caching
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Group specific packages for isolated caching
            if (id.includes('react') || id.includes('react-dom')) return 'vendor_react';
            if (id.includes('@tonconnect')) return 'vendor_tonconnect';
            if (id.includes('framer-motion')) return 'vendor_motion';
            // Default group for all other node_modules
            return 'vendor_shared';
          }
        },
      },
    },
  },

  // --- Asset Handling ---
  // Ensures all necessary 3D/Audio assets are included in the build
  assetsInclude: ["**/*.gltf", "**/*.glb", "**/*.mp3", "**/*.ogg", "**/*.wav"],
  base: "/", 
});
