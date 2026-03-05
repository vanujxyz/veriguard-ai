import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans

print("Loading dataset...")

df = pd.read_csv("dataset/rtl_verification_dataset.csv")

logs = df["log_message"]

print("Vectorizing logs...")

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(logs)

print("Running KMeans clustering...")

NUM_CLUSTERS = 8

kmeans = KMeans(n_clusters=NUM_CLUSTERS, random_state=42)

kmeans.fit(X)

df["predicted_cluster"] = kmeans.labels_

print("Clustering complete")

print(df[["bug_type","predicted_cluster"]].head(10))

df.to_csv("dataset/clustered_logs.csv", index=False)

print("Clustered dataset saved as dataset/clustered_logs.csv")