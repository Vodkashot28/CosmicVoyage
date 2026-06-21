#!/usr/bin/env bash
# SpaceAI — convenience runner
# Sets the Nix libstdc++ path so numpy/scikit-learn binary extensions load.
set -e

LIBSTDCXX=/nix/store/dj06r96j515npcqi9d8af1d1c60bx2vn-gcc-14.3.0-lib/lib
export LD_LIBRARY_PATH="$LIBSTDCXX${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

case "${1:-train}" in
  train)
    echo "🚀 Training model..."
    python3 src/train_model.py
    ;;
  integrate)
    echo "🔗 Generating game JSON..."
    python3 src/game_integration.py
    ;;
  predict)
    echo "🔮 Running predictions..."
    python3 src/predict.py
    ;;
  api)
    echo "🌐 Starting SpaceAI API on port 5001..."
    python3 src/api.py
    ;;
  all)
    echo "🌌 Running full pipeline..."
    python3 src/train_model.py
    python3 src/game_integration.py
    python3 src/predict.py
    ;;
  *)
    echo "Usage: ./train.sh [train|integrate|predict|api|all]"
    exit 1
    ;;
esac
