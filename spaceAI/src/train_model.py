
"""
Train celestial object classifier
Simple script to train and save the ML model
"""
import os
import sys
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib

def main():
    print("🚀 Starting celestial classifier training...")
    
    # Create directories
    os.makedirs("../data", exist_ok=True)
    os.makedirs("../models", exist_ok=True)
    
    # Load or create dataset
    csv_path = "../data/celestial_objects.csv"
    
    if os.path.exists(csv_path):
        print(f"📂 Loading existing dataset from {csv_path}")
        df = pd.read_csv(csv_path)
    else:
        print("📝 Creating new sample dataset...")
        data = {
            "orbital_period": [365, 27.3, 687, 4332, 11.9, 248, 1682, 10759, 30685, 60190],
            "axial_tilt": [23.5, 6.7, 25.2, 3.1, 0.0, 119.6, 97.9, 28.3, 29.6, 17.1],
            "mass": [5.97e24, 7.35e22, 6.42e23, 1.90e27, 3.30e23, 1.31e22, 8.68e25, 1.02e26, 6.42e23, 1.31e22],
            "type": ["Planet", "Moon", "Planet", "Planet", "Asteroid", "DwarfPlanet", "Planet", "Planet", "Planet", "DwarfPlanet"]
        }
        df = pd.DataFrame(data)
        df.to_csv(csv_path, index=False)
        print(f"✅ Dataset created: {csv_path}")
    
    print(f"\n📊 Dataset info:")
    print(f"   Total samples: {len(df)}")
    print(f"   Object types: {df['type'].value_counts().to_dict()}")
    
    # Prepare features and labels
    X = df[['orbital_period', 'axial_tilt', 'mass']]
    y = df['type']
    
    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42
    )
    
    print(f"\n🔀 Train/test split:")
    print(f"   Training samples: {len(X_train)}")
    print(f"   Testing samples: {len(X_test)}")
    
    # Train model
    print("\n🤖 Training DecisionTreeClassifier...")
    model = DecisionTreeClassifier(random_state=42, max_depth=5)
    model.fit(X_train, y_train)
    
    # Evaluate
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    
    print(f"\n✨ Training complete!")
    print(f"   Accuracy: {accuracy:.2%}")
    
    # Save model
    model_path = "../models/celestial_classifier.pkl"
    joblib.dump(model, model_path)
    print(f"\n💾 Model saved to: {model_path}")
    
    # Test prediction
    print("\n🔮 Testing predictions:")
    test_samples = [
        ([365, 23.5, 5.97e24], "Earth-like"),
        ([687, 25.2, 6.42e23], "Mars-like"),
        ([4332, 3.1, 1.90e27], "Jupiter-like")
    ]
    
    for features, description in test_samples:
        pred = model.predict([features])[0]
        print(f"   {description}: {pred}")
    
    print("\n✅ Training pipeline completed successfully!")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n❌ Error: {e}", file=sys.stderr)
        sys.exit(1)
