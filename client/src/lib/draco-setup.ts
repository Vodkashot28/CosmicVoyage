import { useGLTF } from '@react-three/drei';

/**
 * Initialize Draco decompression for .glb models
 * Currently disabled - models will load uncompressed for MVP
 * Can be re-enabled after models are regenerated with proper compression
 */
export function initDracoDecoder() {
  // Draco disabled temporarily - models load uncompressed
  // useGLTF.setDecoderPath('/draco/');
  console.log('[Draco] Disabled for MVP - loading uncompressed models');
}
