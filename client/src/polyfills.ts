/**
 * Browser polyfills for Node.js APIs
 * This file handles polyfilling Node.js built-ins for browser compatibility
 */

// Polyfill Buffer for @ton/core compatibility
if (typeof window !== "undefined" && !globalThis.Buffer) {
  // @ton/core requires a real Buffer implementation
  // Using buffer package which is already in dependencies
  import('buffer').then(({ Buffer }) => {
    globalThis.Buffer = Buffer;
  }).catch((err) => {
    console.warn("Failed to load Buffer polyfill:", err);
    // Fallback minimal implementation
    globalThis.Buffer = {
      isBuffer: () => false,
      alloc: (size: number) => new Uint8Array(size),
      from: (data: any) => new Uint8Array(data),
    } as any;
  });
}

// Polyfill global if it doesn't exist
if (typeof window !== "undefined" && typeof global === "undefined") {
  globalThis.global = globalThis;
}

export {};
