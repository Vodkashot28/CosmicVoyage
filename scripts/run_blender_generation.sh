
#!/bin/bash

# Install Blender if not present
if ! command -v blender &> /dev/null; then
    echo "Installing Blender..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux installation
        wget https://download.blender.org/release/Blender3.6/blender-3.6.5-linux-x64.tar.xz
        tar -xf blender-3.6.5-linux-x64.tar.xz
        export PATH="$PATH:$(pwd)/blender-3.6.5-linux-x64"
    fi
fi

# Create models directory if it doesn't exist
mkdir -p client/public/models

# Run Blender in background mode to generate models
echo "🚀 Generating celestial body models with Blender..."
blender --background --python scripts/generate_celestial_models.py

echo "✅ Model generation complete!"
echo "📁 Check client/public/models/ for all .glb files"
