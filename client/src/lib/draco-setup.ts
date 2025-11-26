import { useGLTF } from '@react-three/drei';

/**
 * Initialize Draco decompression for .glb models
 * MUST be called before any models load
 * Enables Level 10 compression decompression on client devices
 */
export function initDracoDecoder() {
  try {
    // Set Draco decoder path - required for decompressing Draco-compressed .glb files
    useGLTF.setDecoderPath('/draco/');
    console.log('[Draco] Decoder path initialized at /draco/');
  } catch (error) {
    console.error('[Draco] Failed to initialize decoder:', error);
  }
}
