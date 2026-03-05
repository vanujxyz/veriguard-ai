import streamlit as st
import requests
import pandas as pd

API_URL = "http://127.0.0.1:8000"

st.set_page_config(page_title="VeriGuard AI", layout="wide")

st.title("VeriGuard AI — RTL Verification Failure Analyzer")

# -----------------------------
# Log Analyzer
# -----------------------------

st.header("Analyze Verification Log")

log_input = st.text_area(
    "Paste RTL Verification Log",
    height=150
)

if st.button("Analyze Log"):

    response = requests.post(
        f"{API_URL}/analyze_log",
        json={"log_message": log_input}
    )

    result = response.json()

    st.subheader("Analysis Result")

    st.metric(
        "Failure Probability",
        f"{result['failure_probability']*100:.2f}%"
    )

    if result["failure_prediction"] == 1:
        st.error("Critical Failure Detected")
    else:
        st.success("No Critical Failure")


# -----------------------------
# Cluster Dashboard
# -----------------------------

st.header("Failure Cluster Distribution")

cluster_data = requests.get(f"{API_URL}/clusters").json()

cluster_df = pd.DataFrame(
    list(cluster_data.items()),
    columns=["Cluster","Logs"]
)

st.bar_chart(cluster_df.set_index("Cluster"))


# -----------------------------
# Top Bugs Panel
# -----------------------------

st.header("Top Critical Failure Clusters")

bugs = requests.get(f"{API_URL}/top_bugs").json()

bugs_df = pd.DataFrame(bugs)

st.dataframe(bugs_df)