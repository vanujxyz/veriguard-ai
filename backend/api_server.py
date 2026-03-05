from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI(title="VeriGuard AI API")

# Load trained models
vectorizer = joblib.load("ml_engine/vectorizer.pkl")
model = joblib.load("ml_engine/failure_model.pkl")


class LogInput(BaseModel):
    log_message: str


@app.post("/analyze_log")
def analyze_log(input_log: LogInput):

    log = [input_log.log_message]

    log_vector = vectorizer.transform(log)

    prediction = model.predict(log_vector)[0]
    probability = model.predict_proba(log_vector)[0][1]

    return {
        "log": input_log.log_message,
        "failure_prediction": int(prediction),
        "failure_probability": float(probability)
    }


@app.get("/top_bugs")
def get_top_bugs():

    df = pd.read_csv("dataset/prioritized_bugs.csv")

    return df.head(5).to_dict(orient="records")


@app.get("/clusters")
def get_clusters():

    df = pd.read_csv("dataset/clustered_logs.csv")

    cluster_counts = df["predicted_cluster"].value_counts()

    return cluster_counts.to_dict()