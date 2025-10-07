import json
import pickle
from typing import Any, Dict, List, Union

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from pydantic import BaseModel

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model, scaler, and features
with open('app/model.pkl', 'rb') as f:
    model, scaler, model_features = pickle.load(f)

class HouseFeatures(BaseModel):
    square_footage: float
    bedrooms: int
    bathrooms: float
    year_built: int
    lot_size: int
    distance_to_city_center: float
    school_rating: float

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/model-info")
def model_info() -> Dict[str, Any]:
    with open('app/model_info.json', 'r') as f:
        return json.load(f)

def prepare_features(features_data: Union[Dict[str, Any], List[Dict[str, Any]]]) -> pd.DataFrame:
    """Apply feature engineering to raw input features"""
    # Handle both single dict and list of dicts
    if isinstance(features_data, dict):
        df = pd.DataFrame([features_data])
    else:
        df = pd.DataFrame(features_data)
    
    # Apply the same feature engineering as in training
    current_year = 2025
    df['house_age'] = current_year - df['year_built']
    df['footage_lot_ratio'] = df['square_footage'] / df['lot_size'].replace(0, 1) 
    
    # Ensure all required features are present
    for feature in model_features:
        if feature not in df.columns:
            raise ValueError(f"Missing required feature: {feature}")
    
    # Return only the features used by the model in the correct order
    return df[model_features]

@app.post("/predict")
def predict(input_data: List[HouseFeatures]) -> Dict[str, List[float]]:
    try:
        # Expect a top-level array for batch predictions (use a single-element array for single prediction)
        if not input_data:
            raise HTTPException(status_code=400, detail="Prediction error: empty input array")
        
        features_list = [house.model_dump() for house in input_data]
        df = prepare_features(features_list)
        df_scaled = scaler.transform(df)
        predictions = model.predict(df_scaled)
        return {"predictions": [round(float(pred), 2) for pred in predictions]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")
