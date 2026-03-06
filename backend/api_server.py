from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import json
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI(title="VeriGuard AI API")


# ---- Load anomaly model ----

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained models
vectorizer = joblib.load("ml_engine/vectorizer.pkl")
model = joblib.load("ml_engine/failure_model.pkl")

# ---- Load clustering artifacts ----
cluster_vectorizer = joblib.load("ml_engine/cluster_vectorizer.pkl")
cluster_labels = json.load(open("ml_engine/cluster_labels.json"))

cluster_df = pd.read_csv("dataset/clustered_logs.csv")

cluster_centers = cluster_df.groupby("predicted_cluster")["log_message"].apply(list)


class LogInput(BaseModel):
    log_message: str


@app.post("/analyze_log")
def analyze_log(input_log: LogInput):

    log = [input_log.log_message]

    # -------- anomaly detection --------
    log_vector = vectorizer.transform(log)

    prediction = model.predict(log_vector)[0]
    probability = model.predict_proba(log_vector)[0][1]

    log_text = input_log.log_message

    if "[INFO]" in log_text:
        prediction = 0

# severity calibration
    if "[ASSERT_FAIL]" in log_text:
        probability = max(probability, 0.95)

    elif "[ERROR]" in log_text:
        probability = min(max(probability, 0.75), 0.9)

    elif "[WARNING]" in log_text:
        probability = min(probability, 0.4)

    elif "[INFO]" in log_text:
        probability = min(probability, 0.2)

    result = {
        "log": input_log.log_message,
        "failure_prediction": int(prediction),
        "failure_probability": float(probability)
    }

    # -------- clustering if failure --------
    # -------- clustering if failure --------
    if prediction == 1 or "[WARNING]" in input_log.log_message:

        log_vec_cluster = cluster_vectorizer.transform(log)

        best_cluster = None
        best_score = 0

        for cluster_id, logs in cluster_centers.items():

            sample_vec = cluster_vectorizer.transform(logs[:20])
            sim = cosine_similarity(log_vec_cluster, sample_vec).max()

            if sim > best_score:
                best_score = sim
                best_cluster = cluster_id

    # ---- unknown pattern detection ----
        CONFIDENCE_THRESHOLD = 0.55

        if best_score < CONFIDENCE_THRESHOLD:
            result["cluster_id"] = -1
            result["bug_type"] = "unknown pattern"
            result["cluster_confidence"] = float(best_score)

        else:
            result["cluster_id"] = int(best_cluster)
            result["bug_type"] = cluster_labels.get(str(best_cluster), "unknown_pattern")
            result["cluster_confidence"] = float(best_score)

    return result


@app.get("/top_bugs")
def get_top_bugs():

    df = pd.read_csv("dataset/prioritized_bugs.csv")

    return df.head(5).to_dict(orient="records")


@app.get("/clusters")
def get_clusters():

    df = pd.read_csv("dataset/clustered_logs.csv")

    cluster_counts = df["predicted_cluster"].value_counts()

    return cluster_counts.to_dict()