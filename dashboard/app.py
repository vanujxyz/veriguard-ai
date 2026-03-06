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

    if log_input.strip() == "":
        st.warning("Please paste a log message.")
    else:

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

        # Failure / No Failure
        if result["failure_prediction"] == 1:
            st.error("Critical Failure Detected")
        else:
            st.success("No Critical Failure")

        # -----------------------------
        # Cluster Classification
        # -----------------------------

        if "cluster_id" in result:

            st.subheader("Failure Classification")

            # Unknown pattern
            if result["cluster_id"] == -1:

                st.warning("New Failure Pattern Detected (Unknown Cluster)")

                st.metric(
                    "Cluster Confidence",
                    f"{result['cluster_confidence']*100:.2f}%"
                )

            else:

                col1, col2 = st.columns(2)

                with col1:
                    st.metric("Cluster ID", result["cluster_id"])

                with col2:
                    st.metric(
                        "Cluster Confidence",
                        f"{result['cluster_confidence']*100:.2f}%"
                    )

                st.info(f"Bug Type: {result['bug_type']}")

# -----------------------------
# Cluster Dashboard
# -----------------------------

st.header("Failure Cluster Distribution")

cluster_data = requests.get(f"{API_URL}/clusters").json()

cluster_df = pd.DataFrame(
    list(cluster_data.items()),
    columns=["Cluster","Logs"]
)

cluster_df = cluster_df.sort_values("Logs", ascending=False)

st.bar_chart(cluster_df.set_index("Cluster"))

# -----------------------------
# Top Bugs Panel
# -----------------------------

st.header("Top Critical Failure Clusters")

bugs = requests.get(f"{API_URL}/top_bugs").json()

bugs_df = pd.DataFrame(bugs)

st.dataframe(bugs_df, use_container_width=True)