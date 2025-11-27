"""
Setup and train celestial classifier
Creates sample dataset and trains DecisionTreeClassifier
"""
import os
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

# Ensure directories exist
os.makedirs("../data", exist_ok=True)
os.makedirs("../models", exist_ok=True)

# Create sample dataset
data = {
    "orbital_period": [365, 27.3, 687, 4332, 11.9, 248],
    "axial_tilt": [23.5, 6.7, 25.2, 3.1, 0.0, 119.6],
    "mass": [5.97e24, 7.35e22, 6.42e23, 1.90e27, 3.30e23, 1.31e22],
    "type": ["Planet", "Moon", "Planet", "Planet", "Asteroid", "DwarfPlanet"]
}
df = pd.DataFrame(data)
csv_path = "../data/celestial_objects.csv"
df.to_csv(csv_path, index=False)
print(f"✓ Dataset created: {csv_path}")

# Load dataset
df = pd.read_csv(csv_path)
X = df[['orbital_period', 'axial_tilt', 'mass']]
y = df['type']

# Train model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
model = DecisionTreeClassifier(random_state=42)
model.fit(X_train, y_train)

# Evaluate
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)

# Save model
model_path = "../models/celestial_classifier_dt.pkl"
joblib.dump(model, model_path)

print(f"✓ Model trained with accuracy: {accuracy:.2f}")
print(f"✓ Model saved: {model_path}")
print(f"\nDataset: {csv_path}")
print(f"Samples: {len(df)}")
print(f"\nObject types: {df['type'].value_counts().to_dict()}")
