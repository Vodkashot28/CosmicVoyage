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
    def __init__(self, model_path="../models/celestial_classifier.pkl"):
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
    # Load the trained model
    model = joblib.load('models/celestial_classifier.pkl')
    
    # Example input: orbital_period, axial_tilt, mass
    sample_object = [[365, 23.5, 5.97e24]]  # Earth-like
    
    # Predict type
    prediction = model.predict(sample_object)
    print("Predicted type:", prediction[0])
    
    # Additional examples
    print("\n--- Additional Predictions ---")
    predictor = CelestialPredictor()
    
    if predictor.model:
        # Single prediction
        earth_type = predictor.predict(365, 23.5, 5.97e24)
        print(f"Earth (365, 23.5, 5.97e24): {earth_type}")
