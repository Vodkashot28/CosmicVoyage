"""
Celestial Object Prediction Service
Loads trained ML model and makes predictions on celestial objects
"""

import joblib
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))


class CelestialPredictor:
    def __init__(self, model_path="../models/celestial_classifier_dt.pkl"):
        """Load trained model from disk"""
        try:
            self.model = joblib.load(model_path)
            print(f"✓ Model loaded from {model_path}")
        except FileNotFoundError:
            print(f"✗ Model not found at {model_path}")
            print("  Train a model first using: poetry run jupyter notebook notebooks/train_celestial_classifier.ipynb")
            self.model = None
    
    def predict(self, orbital_period, axial_tilt, mass):
        """
        Predict celestial object type
        
        Args:
            orbital_period: Time to complete one orbit (years)
            axial_tilt: Tilt angle relative to orbital plane (degrees)
            mass: Object mass relative to Earth
            
        Returns:
            str: Predicted object type (Planet, DwarfPlanet, Asteroid)
        """
        if self.model is None:
            return None
        
        prediction = self.model.predict([[orbital_period, axial_tilt, mass]])
        return prediction[0]
    
    def predict_batch(self, data_list):
        """
        Predict multiple objects
        
        Args:
            data_list: List of [orbital_period, axial_tilt, mass] tuples
            
        Returns:
            list: Predicted object types
        """
        if self.model is None:
            return None
        
        predictions = self.model.predict(data_list)
        return predictions.tolist()


if __name__ == "__main__":
    # Example usage
    predictor = CelestialPredictor()
    
    if predictor.model:
        # Earth's parameters: orbital_period=365 days (1 year), axial_tilt=23.5°, mass=5.97e24 kg
        print("\nExample Predictions:")
        print("-" * 50)
        
        # Single prediction
        earth_type = predictor.predict(365, 23.5, 5.97e24)
        print(f"Earth (365, 23.5, 5.97e24): {earth_type}")
        
        # Batch predictions
        test_objects = [
            (365, 23.5, 5.97e24),      # Earth
            (88, 3.39, 3.30e23),       # Mercury
            (687, 25.2, 6.42e23),      # Mars
            (4.85, 177.0, 1.34e23),    # Pluto
        ]
        
        batch_predictions = predictor.predict_batch(test_objects)
        object_names = ["Earth", "Mercury", "Mars", "Pluto"]
        
        if batch_predictions:
            for name, pred in zip(object_names, batch_predictions):
                print(f"{name}: {pred}")
