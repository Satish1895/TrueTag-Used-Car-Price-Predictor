import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from catboost import CatBoostRegressor
import numpy as np
import pandas as pd
import json
from groq import AsyncGroq
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "catboost_engine.cbm")
METADATA_PATH = os.path.join(BASE_DIR, "models", "dropdown_metadata.json")

# initialize the api
app = FastAPI(title="TrueTag : Used Car Price Predictor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)
# load the ML model and metadata
model = CatBoostRegressor()
model.load_model(MODEL_PATH)

with open(METADATA_PATH, "r") as f:
    metadata = json.load(f)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
groq_client = AsyncGroq(api_key=GROQ_API_KEY)

# define json structure the frontend must send
class CarQuery(BaseModel):
    distance: int
    owner: int
    brand: str
    model_name: str
    year: int
    state: str
    fuel: str
    drive: str
    body_type: str
@app.get("/")
async def root():
    return {"message": "TrueTag API is running"}

# create the predicton endpoint
@app.post("/api/predict")
async def predict_price(car : CarQuery):
    car_age = 2024 - car.year
    age_x_distance = car_age * car.distance
    input_data = pd.DataFrame([{
        "Distance": car.distance,
        "Owner": car.owner,          
        "Brand": car.brand,
        "Model": car.model_name,
        "State": car.state,
        "Fuel": car.fuel,
        "Drive": car.drive,
        "Type": car.body_type,
        "Car_age": car_age,
        "Age_x_Distance": age_x_distance
    }])
    input_data = input_data[model.feature_names_]
    # ask the engine for prediction
    log_prdiction = model.predict(input_data)[0]

    # reverse the log transformation
    real_price = int(np.expm1(log_prdiction))

    prompt = (
        f"You are an expert Indian used car appraiser. "
        f"A user is evaluating a {car.year} {car.brand} {car.model_name} driven for {car.distance} km in {car.state}. "
        f"The CatBoost AI calculated its market value at ₹{real_price:,.0f}. "
        f"Write exactly two sentences explaining if this specific car and brand holds its value well in India, "
        f"and if this is a solid commuter choice. Do not use asterisks or markdown, just professional text."
    )

    try:
        completion = await groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model = "openai/gpt-oss-120b",
            temperature=0.7,
        )
        insight = completion.choices[0].message.content.strip()

        if not insight:
            insight = "AI market analysis is currently processing high traffic. Valuations remain accurate based on local market data."
    except Exception as e:
        print(f"Groq Error:{e}")
        insight = "AI Market insight temporarily paused to prevent rate-limiting. Price estimation remains fully active."

    return {
        "status": "success",
        "predicted_price": real_price,
        "currency": "INR",
        "insight": insight
    }
@app.get("/api/metadata")
async def get_metadata():
    return metadata
