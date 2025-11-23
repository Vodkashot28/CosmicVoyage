#!/bin/bash

# 1. Build the client (Vite)
echo "Building client (Vite)..."
vite build

# Check for Vite failure
if [ $? -ne 0 ]; then
  echo "Vite build failed!"
  exit 1
fi

# 2. Build the server (ESBuild)
echo "Building server (ESBuild)..."
./node_modules/esbuild/bin/esbuild server/index-prod.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Check for ESBuild failure
if [ $? -ne 0 ]; then
  echo "ESBuild failed!"
  exit 1
fi

# 3. Rename the final server file for Vercel routing
echo "Renaming server file..."
mv dist/index-prod.js dist/index.js

echo "Build script completed successfully."
