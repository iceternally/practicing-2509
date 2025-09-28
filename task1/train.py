import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import pickle
import json

# Load the dataset
df = pd.read_csv('data/housing.csv')

# Feature engineering
# 1. Create age of house feature
current_year = 2025  # Updated to 2025
df['house_age'] = current_year - df['year_built']

# 2. Create square footage to lot size ratio
df['footage_lot_ratio'] = df['square_footage'] / df['lot_size'].replace(0, 1)  # Avoid division by zero

features = [
    'lot_size', 'house_age', 'school_rating', 
    'distance_to_city_center', 'bedrooms', 
    'bathrooms', 'footage_lot_ratio'
]
target = 'price'

X = df[features]
y = df[target]

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features for better model performance
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Create and train the model
model = LinearRegression()
model.fit(X_train_scaled, y_train)

# Evaluate the model
train_score = model.score(X_train_scaled, y_train)
test_score = model.score(X_test_scaled, y_test)
print(f"Training R-squared: {train_score}")
print(f"Testing R-squared: {test_score}")

# Save the model and scaler
with open('app/model.pkl', 'wb') as f:
    pickle.dump((model, scaler, features), f)

# Calculate generalization gap
generalization_gap = train_score - test_score

# Save the model performance metrics as JSON
model_info = {
    "r_squared": test_score,
    "training_r_squared": train_score,
    "generalization_gap": generalization_gap,
    "coefficients": {feature: float(coef) for feature, coef in zip(features, model.coef_)},
}

with open('app/model_info.json', 'w') as f:
    json.dump(model_info, f, indent=4)