
import { useEffect } from 'react';

export function ModelDiagnostics() {
  useEffect(() => {
    // Test all model paths
    const modelPaths = [
      '/models/sun.glb',
      '/models/mercury.glb',
      '/models/venus.glb',
      '/models/earth.glb'
    ];

    console.log('[ModelDiagnostics] 🔍 Starting model verification...');

    modelPaths.forEach(path => {
      fetch(path, { method: 'HEAD' })
        .then(r => {
          console.log(`[ModelDiagnostics] ${path}:`, {
            status: r.status,
            ok: r.ok,
            contentType: r.headers.get('content-type'),
            contentLength: r.headers.get('content-length')
          });
        })
        .catch(e => {
          console.error(`[ModelDiagnostics] ❌ ${path} fetch error:`, e);
        });
    });
  }, []);

  return null;
}
