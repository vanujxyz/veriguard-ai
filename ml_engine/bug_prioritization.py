import pandas as pd

print("Loading clustered dataset...")

df = pd.read_csv("dataset/clustered_logs.csv")

print("Analyzing cluster frequencies...")

cluster_counts = df["predicted_cluster"].value_counts()

cluster_summary = []

severity_weight = {
    "ASSERT_FAIL":3,
    "ERROR":2,
    "WARNING":1
}

for cluster in cluster_counts.index:

    cluster_logs = df[df["predicted_cluster"] == cluster]

    count = len(cluster_logs)

    severity = cluster_logs["severity"].mode()[0]

    severity_score = severity_weight.get(severity,1)

    priority_score = (count * 0.6) + (severity_score * 100)

    cluster_summary.append({
        "cluster":cluster,
        "occurrences":count,
        "severity":severity,
        "priority_score":priority_score
    })

summary_df = pd.DataFrame(cluster_summary)

summary_df = summary_df.sort_values(by="priority_score", ascending=False)

print("\nTop Critical Failure Clusters:\n")

print(summary_df)

summary_df.to_csv("dataset/prioritized_bugs.csv", index=False)

print("\nPrioritized bug list saved to dataset/prioritized_bugs.csv")