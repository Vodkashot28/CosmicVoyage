"""
SpaceAI → Game Integration
Generates a static JSON snapshot that the Node.js game can import at build time.

Run:  python src/game_integration.py
Output: ../client/public/spaceai-classifications.json
        ../client/public/spaceai-quiz.json
"""

import json
import sys
from pathlib import Path

ROOT       = Path(__file__).parent.parent
GAME_ROOT  = ROOT.parent / "client" / "public"

# Inline solar system data (mirrors bodies.ts) so this script is self-contained
SOLAR_BODIES = [
    {"id": "sun",     "name": "Sun",     "orbital_period": 0,       "axial_tilt": 7.25,   "mass": 1.989e30, "radius": 695700,  "known_type": "Star"},
    {"id": "mercury", "name": "Mercury", "orbital_period": 87.97,   "axial_tilt": 0.03,   "mass": 3.30e23,  "radius": 2439.7,  "known_type": "Planet"},
    {"id": "venus",   "name": "Venus",   "orbital_period": 224.7,   "axial_tilt": 177.4,  "mass": 4.87e24,  "radius": 6051.8,  "known_type": "Planet"},
    {"id": "earth",   "name": "Earth",   "orbital_period": 365.25,  "axial_tilt": 23.44,  "mass": 5.97e24,  "radius": 6371.0,  "known_type": "Planet"},
    {"id": "mars",    "name": "Mars",    "orbital_period": 686.97,  "axial_tilt": 25.19,  "mass": 6.42e23,  "radius": 3389.5,  "known_type": "Planet"},
    {"id": "jupiter", "name": "Jupiter", "orbital_period": 4332.59, "axial_tilt": 3.13,   "mass": 1.90e27,  "radius": 69911.0, "known_type": "Planet"},
    {"id": "saturn",  "name": "Saturn",  "orbital_period": 10759.22,"axial_tilt": 26.73,  "mass": 5.68e26,  "radius": 58232.0, "known_type": "Planet"},
    {"id": "uranus",  "name": "Uranus",  "orbital_period": 30688.5, "axial_tilt": 97.77,  "mass": 8.68e25,  "radius": 25362.0, "known_type": "Planet"},
    {"id": "neptune", "name": "Neptune", "orbital_period": 60182.0, "axial_tilt": 28.32,  "mass": 1.02e26,  "radius": 24622.0, "known_type": "Planet"},
]

QUIZ_TEMPLATES = [
    {
        "question": "What type of object has an orbital period of ~{period} days and axial tilt of ~{tilt}°?",
        "answer_key": "known_type",
        "hint": "Think about its size ({radius} km radius) and mass relative to Earth.",
    },
    {
        "question": "Which body in our solar system has the largest axial tilt (~{tilt}°), causing extreme seasons?",
        "answer_key": "name",
        "hint": "This planet essentially orbits the Sun on its side.",
    },
    {
        "question": "True or False: An object with a {period}-day orbital period is classified as a Planet.",
        "answer_key": "is_planet",
        "hint": "Planets have cleared their orbital neighbourhood.",
    },
]


def classify_all():
    """Run predictor on all solar bodies, return results."""
    try:
        sys.path.insert(0, str(ROOT / "src"))
        from predict import CelestialPredictor
        predictor = CelestialPredictor()
    except FileNotFoundError:
        print("⚠️  No trained model found — using known_type as classification.")
        predictor = None

    results = []
    for body in SOLAR_BODIES:
        if predictor and body["orbital_period"] > 0:
            label = predictor.predict(
                body["orbital_period"], body["axial_tilt"], body["mass"], body["radius"]
            )
            proba = predictor.predict_proba(
                body["orbital_period"], body["axial_tilt"], body["mass"], body["radius"]
            )
            confidence = round(max(proba.values()), 4)
        else:
            label      = body["known_type"]
            proba      = {body["known_type"]: 1.0}
            confidence = 1.0

        results.append({
            "id":           body["id"],
            "name":         body["name"],
            "known_type":   body["known_type"],
            "ai_label":     label,
            "confidence":   confidence,
            "probabilities": proba,
            "match":        label == body["known_type"],
        })
        status = "✅" if label == body["known_type"] else "⚠️ "
        print(f"  {status} {body['name']:10s}  known={body['known_type']:12s}  ai={label:12s}  conf={confidence:.2f}")

    return results


def generate_quiz(classifications: list) -> list:
    """Create educational quiz questions from classification results."""
    quiz = []
    for body in SOLAR_BODIES:
        if body["orbital_period"] == 0:
            continue
        quiz.append({
            "id":       body["id"],
            "question": f"What type of celestial object is {body['name']}?",
            "options": ["Planet", "DwarfPlanet", "Asteroid", "Moon", "Star"],
            "answer":   body["known_type"],
            "hint":     f"Its orbital period is {body['orbital_period']:.0f} days and radius is {body['radius']:.0f} km.",
            "ai_confidence": next(
                (c["confidence"] for c in classifications if c["id"] == body["id"]), None
            ),
        })
    return quiz


def main():
    print("🌌 SpaceAI Game Integration")
    print("   Classifying solar system bodies...\n")

    classifications = classify_all()
    quiz            = generate_quiz(classifications)

    GAME_ROOT.mkdir(parents=True, exist_ok=True)

    clf_path  = GAME_ROOT / "spaceai-classifications.json"
    quiz_path = GAME_ROOT / "spaceai-quiz.json"

    clf_path.write_text(json.dumps({"generated_at": str(__import__("datetime").datetime.utcnow()),
                                     "bodies": classifications}, indent=2))
    quiz_path.write_text(json.dumps({"questions": quiz}, indent=2))

    acc = sum(1 for c in classifications if c["match"]) / len(classifications) * 100
    print(f"\n📊 Classification accuracy on known labels: {acc:.0f}%")
    print(f"💾 {clf_path}")
    print(f"💾 {quiz_path}")
    print("\nImport in your game:")
    print("  import data from '/spaceai-classifications.json'")
    print("  import quiz from '/spaceai-quiz.json'")


if __name__ == "__main__":
    main()
