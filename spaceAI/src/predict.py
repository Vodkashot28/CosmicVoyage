"""
Celestial Object Prediction Service
Loads trained ML model and classifies objects by their orbital parameters.
"""

import json
import joblib
from pathlib import Path

ROOT      = Path(__file__).parent.parent
MODEL_DIR = ROOT / "models"


class CelestialPredictor:
    def __init__(self):
        clf_path = MODEL_DIR / "celestial_classifier.pkl"
        le_path  = MODEL_DIR / "label_encoder.pkl"
        sc_path  = MODEL_DIR / "scaler.pkl"

        if not all(p.exists() for p in [clf_path, le_path, sc_path]):
            raise FileNotFoundError(
                "Trained model not found. Run:  python src/train_model.py"
            )

        self.model   = joblib.load(clf_path)
        self.encoder = joblib.load(le_path)
        self.scaler  = joblib.load(sc_path)

        meta_path = MODEL_DIR / "meta.json"
        self.meta = json.loads(meta_path.read_text()) if meta_path.exists() else {}
        print(f"Model loaded  ({self.meta.get('model','?')}, acc={self.meta.get('accuracy','?')})")

    def _prepare(self, orbital_period, axial_tilt, mass, radius):
        import math
        row = [
            math.log10(max(orbital_period, 0.01)),
            float(axial_tilt),
            math.log10(max(mass, 1e5)),
            math.log10(max(radius, 0.001)),
        ]
        return self.scaler.transform([row])

    def predict(self, orbital_period, axial_tilt, mass, radius=1000.0):
        X   = self._prepare(orbital_period, axial_tilt, mass, radius)
        idx = self.model.predict(X)[0]
        return self.encoder.inverse_transform([idx])[0]

    def predict_proba(self, orbital_period, axial_tilt, mass, radius=1000.0):
        X     = self._prepare(orbital_period, axial_tilt, mass, radius)
        proba = self.model.predict_proba(X)[0]
        return dict(zip(self.encoder.classes_, [round(float(p), 4) for p in proba]))

    def predict_batch(self, records):
        rows = [
            self._prepare(r["orbital_period"], r["axial_tilt"], r["mass"], r.get("radius", 1000.0))[0]
            for r in records
        ]
        idxs = self.model.predict(rows)
        return self.encoder.inverse_transform(idxs).tolist()


if __name__ == "__main__":
    p = CelestialPredictor()
    tests = [
        ("Earth",   365.25, 23.44, 5.97e24, 6371.0),
        ("Jupiter", 4332.0, 3.13,  1.90e27, 69911.0),
        ("Pluto",   90560.0, 119.59, 1.31e22, 1188.3),
        ("Apophis", 323.4,  180.0, 2.70e10, 0.17),
    ]
    for name, period, tilt, mass, radius in tests:
        label = p.predict(period, tilt, mass, radius)
        print(f"  {name:10s} → {label}")
