import pandas as pd
import numpy as np
import json
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import normalize

print("Loading dataset...")

df = pd.read_csv("dataset/rtl_verification_dataset.csv")
logs = df["log_message"]

# -----------------------------
# TF-IDF Vectorization
# -----------------------------

print("Vectorizing logs using TF-IDF...")

vectorizer = TfidfVectorizer(
    max_features=500,
    stop_words="english",
    token_pattern=r"[a-zA-Z_]+",
    ngram_range=(1,2),
    min_df=5
)

X = vectorizer.fit_transform(logs)

# SAVE VECTORIZER
joblib.dump(vectorizer, "ml_engine/cluster_vectorizer.pkl")
print("Vectorizer saved to ml_engine/cluster_vectorizer.pkl")

print("Normalizing vectors...")
X = normalize(X)

# -----------------------------
# DBSCAN Clustering
# -----------------------------

print("Running DBSCAN clustering...")

dbscan = DBSCAN(
    eps=0.32,
    min_samples=15,
    metric="cosine"
)

clusters = dbscan.fit_predict(X)

# SAVE DBSCAN MODEL
joblib.dump(dbscan, "ml_engine/dbscan_model.pkl")
print("DBSCAN model saved to ml_engine/dbscan_model.pkl")

df["predicted_cluster"] = clusters

print("\nCluster distribution:\n")
print(df["predicted_cluster"].value_counts())

print("Vector shape:", X.shape)
print("Unique clusters:", np.unique(clusters))

# -----------------------------
# Save clustered dataset
# -----------------------------

df.to_csv("dataset/clustered_logs.csv", index=False)
print("\nClustered dataset saved to dataset/clustered_logs.csv")

# -----------------------------
# Print sample logs per cluster
# -----------------------------

for cluster_id in sorted(df["predicted_cluster"].unique()):

    print(f"\n===== Cluster {cluster_id} =====")

    sample_logs = df[df["predicted_cluster"] == cluster_id]["log_message"].head(5)

    for log in sample_logs:
        print(log)

# -----------------------------
# Cluster vs Bug Type Table
# -----------------------------

print("\nCluster vs Bug Type Table\n")

print(pd.crosstab(df["predicted_cluster"], df["bug_type"]))
# -----------------------------
# Automatic Cluster Naming (Improved)
# -----------------------------

print("\nGenerating cluster names...")

cluster_names = {}

for cluster_id in sorted(df["predicted_cluster"].unique()):

    cluster_logs = df[df["predicted_cluster"] == cluster_id]["log_message"]

    messages = []

    for log in cluster_logs:

        lines = log.split("\n")

        if len(lines) > 1:

            msg = lines[1].lower()

            # clean wording
            msg = msg.replace("detected", "")
            msg = msg.replace("error", "")
            msg = msg.replace("warning", "")
            msg = msg.replace("assertion failed:", "")
            msg = msg.replace("  ", " ")

            messages.append(msg.strip())

    if len(messages) > 0:
        name = pd.Series(messages).value_counts().index[0]
    else:
        name = "unknown_pattern"

    cluster_names[int(cluster_id)] = name

print("\nCluster Names:\n")

for k,v in cluster_names.items():
    print(f"Cluster {k}: {v}")

# SAVE CLUSTER LABELS
with open("ml_engine/cluster_labels.json","w") as f:
    json.dump(cluster_names,f,indent=4)

print("\nCluster labels saved to ml_engine/cluster_labels.json")