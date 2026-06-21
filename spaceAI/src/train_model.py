"""
Train celestial object classifier + orbital predictor.
Run from the spaceAI/ root:  python src/train_model.py
"""

import os
import sys
import json
import numpy as np
import pandas as pd
import joblib
from pathlib import Path
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report

ROOT = Path(__file__).parent.parent
DATA_PATH = ROOT / "data" / "celestial_objects.csv"
MODEL_DIR = ROOT / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)


def load_and_prepare(csv_path: Path):
    df = pd.read_csv(csv_path)

    # Coerce 'unknown' axial_tilt → fill with per-type median
    df["axial_tilt"] = pd.to_numeric(df["axial_tilt"], errors="coerce")
    tilt_medians = df.groupby("type")["axial_tilt"].transform("median")
    df["axial_tilt"] = df["axial_tilt"].fillna(tilt_medians)

    # Log-scale to compress large dynamic range
    df["log_mass"]   = np.log10(pd.to_numeric(df["mass"],   errors="coerce").fillna(1e10))
    df["log_radius"] = np.log10(pd.to_numeric(df["radius"], errors="coerce").fillna(1.0))
    df["log_period"] = np.log10(pd.to_numeric(df["orbital_period"], errors="coerce").fillna(365))

    features = ["log_period", "axial_tilt", "log_mass", "log_radius"]
    X = df[features].values
    y = df["type"].values
    return X, y, features, df


def train(csv_path: Path = DATA_PATH):
    print("🚀 SpaceAI — Training celestial classifier")
    print(f"   Dataset : {csv_path}")

    X, y, features, df = load_and_prepare(csv_path)

    print(f"\n📊 Dataset — {len(df)} objects")
    for t, n in df["type"].value_counts().items():
        print(f"   {t:18s} {n}")

    le     = LabelEncoder()
    y_enc  = le.fit_transform(y)
    scaler = StandardScaler()
    X_sc   = scaler.fit_transform(X)

    X_tr, X_te, y_tr, y_te = train_test_split(
        X_sc, y_enc, test_size=0.25, random_state=42, stratify=y_enc
    )

    candidates = {
        "DecisionTree":     DecisionTreeClassifier(random_state=42, max_depth=6),
        "RandomForest":     RandomForestClassifier(n_estimators=100, random_state=42),
        "GradientBoosting": GradientBoostingClassifier(n_estimators=100, random_state=42),
    }

    best_name, best_model, best_acc = None, None, 0.0
    print("\n🤖 Training candidates:")
    for name, clf in candidates.items():
        cv = cross_val_score(clf, X_sc, y_enc, cv=min(5, len(X) // 3))
        clf.fit(X_tr, y_tr)
        acc = accuracy_score(y_te, clf.predict(X_te))
        print(f"   {name:20s}  cv={cv.mean():.2f}±{cv.std():.2f}  test={acc:.2f}")
        if acc > best_acc:
            best_acc, best_name, best_model = acc, name, clf

    print(f"\n✅ Best model : {best_name}  (test accuracy {best_acc:.2f})")
    print(classification_report(y_te, best_model.predict(X_te), target_names=le.classes_))

    # Save artefacts
    joblib.dump(best_model, MODEL_DIR / "celestial_classifier.pkl")
    joblib.dump(le,         MODEL_DIR / "label_encoder.pkl")
    joblib.dump(scaler,     MODEL_DIR / "scaler.pkl")

    meta = {
        "model":    best_name,
        "accuracy": round(best_acc, 4),
        "features": features,
        "classes":  le.classes_.tolist(),
        "n_train":  int(len(X_tr)),
        "n_test":   int(len(X_te)),
    }
    (MODEL_DIR / "meta.json").write_text(json.dumps(meta, indent=2))
    print(f"\n💾 Artefacts saved → {MODEL_DIR}/")
    return meta


if __name__ == "__main__":
    csv = Path(sys.argv[1]) if len(sys.argv) > 1 else DATA_PATH
    train(csv)
