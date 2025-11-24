/**
 * Browser polyfills for Node.js APIs
 * This file handles polyfilling Node.js built-ins for browser compatibility
 */

// Polyfill Buffer for @ton/core compatibility
if (typeof window !== "undefined" && !globalThis.Buffer) {
  // Use a simple polyfill buffer - @ton/core only needs the existence of Buffer
  // For actual buffer operations, this would use a real polyfill library
  globalThis.Buffer = {
    isBuffer: () => false,
    alloc: () => null,
    from: () => null,
  } as any;
}

// Polyfill global if it doesn't exist
if (typeof window !== "undefined" && typeof global === "undefined") {
  globalThis.global = globalThis;
}

export {};
