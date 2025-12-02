import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

let dracoLoader: DRACOLoader | null = null;

export function initDracoDecoder() {
  if (dracoLoader) return dracoLoader;

  try {
    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    console.log("[Draco] Decoder initialized successfully");
    return dracoLoader;
  } catch (error) {
    console.warn("[Draco] Failed to initialize, falling back to uncompressed models", error);
    return null;
  }
}