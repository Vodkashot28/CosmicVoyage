// src/polyfills.ts

// Must use a synchronous import to guarantee Buffer exists before any other module runs
// The build tool (Vite) ensures this synchronous import points to the installed 'buffer' package.
import { Buffer } from 'buffer'; 
import * as process from 'process'; // Synchronous import for process polyfill

/**
 * Browser polyfills for Node.js APIs
 * This file handles polyfilling Node.js built-ins for browser compatibility
 */

// 1. Polyfill Buffer for @ton/core compatibility
if (typeof window !== "undefined") {
  // Ensure the Buffer constructor is globally available
  // This must be done synchronously
  // @ts-ignore - Buffer needs to be explicitly attached to global scope for dependencies
  window.Buffer = Buffer;
}

// 2. Polyfill process (needed by many libraries, including TON's dependencies)
if (typeof window !== "undefined") {
  // @ts-ignore - Process needs to be explicitly attached to global scope
  window.process = process;
}

// 3. Polyfill global/globalThis alias
if (typeof window !== "undefined") {
  // @ts-ignore
  window.global = window;
}

export {};
