import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer

print("Loading dataset...")

df = pd.read_csv("dataset/rtl_verification_dataset.csv")

print("Total logs:", len(df))

logs = df["log_message"]

print("Vectorizing logs using TF-IDF...")

vectorizer = TfidfVectorizer()

X = vectorizer.fit_transform(logs)

print("Vectorization complete")

print("Feature matrix shape:", X.shape)