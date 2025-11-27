# SpaceAI Environment & Onboarding

## Overview
SpaceAI is the machine learning training ground for Cosmic Voyage. It operates independently as a Python project with scikit-learn, pandas, and matplotlib for training ML models on celestial data. Trained models are then integrated into the main game for educational features.

## Environment Setup

### Python Version
- Requires Python 3.7 - 3.11 (per pyproject.toml)
- Use Replit's Python environment (default 3.11)

### Dependencies
- **Core**: scikit-learn, pandas, matplotlib, joblib
- **Dev**: jupyter, notebook (for training experiments)

Install all dependencies:
```bash
cd spaceAI
poetry install
```

### Directory Purposes

| Directory | Purpose | Notes |
|-----------|---------|-------|
| `data/` | Celestial datasets (CSV/JSON) | Real astronomical parameters |
| `models/` | Trained ML models (.pkl, .h5) | Serialized scikit-learn objects |
| `notebooks/` | Jupyter training experiments | Outside forge - exploratory ML work |
| `src/` | Integration scripts | Inside temple - game connectors |

## Workflow

### Training Phase (Outside Forge)
1. Add datasets to `data/`
2. Create notebooks in `notebooks/`
3. Train models using scikit-learn
4. Evaluate accuracy & visualizations
5. Save best models to `models/` using joblib

### Integration Phase (Inside Temple)
1. Load saved models from `models/` in `src/`
2. Create prediction functions (classify objects, predict orbits)
3. Export API endpoints for game consumption
4. Connect to Cosmic Voyage main project

## Jupyter Workflow
```bash
cd spaceAI
poetry run jupyter notebook
```

Then navigate to `notebooks/` and create new experiments.

## Model Serialization
- Save scikit-learn models: `joblib.dump(model, 'models/model_name.pkl')`
- Load for inference: `joblib.load('models/model_name.pkl')`

## Integration with Cosmic Voyage
Trained models are loaded in the main project via:
- API endpoints from `src/` scripts
- Direct model loading if same Python environment
- REST service (future: dedicated model server)

## Educational Purpose
- **Learn**: Understand ML fundamentals with real data
- **Build**: Train classifiers on celestial objects
- **Play**: Use trained models in the game for educational features
- **Iterate**: Experiment with different algorithms and features

## Development Notes
- Keep notebooks exploratory and well-commented
- Model filenames should describe: `{object_type}_{algorithm}_{date}.pkl`
- Document data sources and preprocessing steps
- Test models before committing to game integration

## Next Steps
1. ✅ Project structure created
2. ⏳ Populate `data/` with celestial datasets
3. ⏳ Train first classifier in `notebooks/`
4. ⏳ Save model to `models/`
5. ⏳ Create integration script in `src/`
