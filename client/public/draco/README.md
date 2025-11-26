# Draco Decompression Files

This directory contains the Draco compression library files needed to decompress .glb models.

These are provided by @react-three/drei and should be automatically available at:
`/draco/draco_decoder.js`
`/draco/draco_decoder.wasm`

If models fail to load with "Draco" errors, ensure these files are copied to this directory from:
`node_modules/three/examples/js/libs/draco/`
