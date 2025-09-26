from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import pandas as pd
from typing import List

app = FastAPI()

# Load the model
with open('app/model.pkl', 'rb') as f:
    model = pickle.load(f)

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
def model_info():
    with open('app/model_info.txt', 'r') as f:
        return f.read()

@app.post("/predict")
def predict(features: HouseFeatures):
    df = pd.DataFrame([features.dict()])
    prediction = model.predict(df)
    return {"prediction": prediction[0]}

@app.post("/predict-batch")
def predict_batch(features: List[HouseFeatures]):
    df = pd.DataFrame([f.dict() for f in features])
    predictions = model.predict(df)
    return {"predictions": predictions.tolist()}