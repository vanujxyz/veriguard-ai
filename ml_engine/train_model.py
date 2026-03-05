import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
import joblib

print("Loading dataset...")

df = pd.read_csv("dataset/rtl_verification_dataset.csv")

logs = df["log_message"]
labels = df["anomaly"]

print("Training vectorizer...")

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(logs)

print("Training RandomForest model...")

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, labels)

print("Saving models...")

joblib.dump(vectorizer, "ml_engine/vectorizer.pkl")
joblib.dump(model, "ml_engine/failure_model.pkl")

print("Models saved successfully.")