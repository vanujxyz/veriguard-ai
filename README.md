# VeriGuard AI — RTL Verification Failure Analyzer

## Overview

**VeriGuard AI** is an AI-powered system designed to assist hardware verification engineers in analyzing RTL verification logs and identifying critical failures efficiently.

Modern hardware verification environments generate thousands of logs during simulation and testing. Manually analyzing these logs is time-consuming and inefficient. VeriGuard AI provides an automated solution that extracts insights from verification logs using machine learning to detect patterns, predict failures, and prioritize debugging tasks.

This project was developed as part of a hackathon focused on **AI-driven solutions for semiconductor verification workflows**.

---

## Key Features

### Failure Prediction
Uses machine learning to estimate the probability that a verification log represents a critical failure.

### Log Clustering
Automatically groups similar logs to detect recurring failure patterns within large datasets.

### Debug Prioritization
Ranks failure clusters based on frequency and severity to help engineers focus on the most impactful issues.

### Interactive Dashboard
Provides a web-based interface for analyzing logs, visualizing cluster distributions, and reviewing prioritized debugging insights.

---

## System Architecture

The system follows a modular architecture composed of four main layers.

```
User Input Log
      │
      ▼
Streamlit Dashboard
      │
      ▼
FastAPI Backend API
      │
      ▼
Machine Learning Engine
      │
      ▼
Prediction & Analysis Results
```

### Dashboard Layer
Provides a user interface for interacting with the system, submitting logs for analysis, and visualizing insights.

### Backend API Layer
Exposes REST API endpoints that process requests and communicate with the machine learning engine.

### Machine Learning Layer
Implements log vectorization, failure prediction models, clustering algorithms, and bug prioritization logic.

### Data Layer
Contains verification log datasets and analysis results used by the system.

---

## Project Structure

```
veriguard-ai
│
├── backend
│   └── api_server.py
│
├── dashboard
│   └── app.py
│
├── dataset
│   ├── generate_logs.py
│   └── sample_logs.csv
│
├── ml_engine
│   ├── train_model.py
│   ├── log_clustering.py
│   ├── failure_prediction.py
│   ├── bug_prioritization.py
│   ├── vectorizer.pkl
│   └── failure_model.pkl
│
├── requirements.txt
├── README.md
└── .gitignore
```

---

## Technology Stack

- Python
- FastAPI
- Streamlit
- Scikit-learn
- Pandas
- NumPy
- Joblib

---

## Installation

Clone the repository:

```
git clone https://github.com/your-username/veriguard-ai.git
```

Navigate to the project directory:

```
cd veriguard-ai
```

Install dependencies:

```
pip install -r requirements.txt
```

---

## Setup Instructions

### Step 1 — Generate Verification Logs

Synthetic verification logs are generated to simulate RTL verification environments.

```
python dataset/generate_logs.py
```

This creates the dataset used for clustering and failure analysis.

---

### Step 2 — Train the Machine Learning Model

Train the failure prediction model and save the trained artifacts.

```
python ml_engine/train_model.py
```

This generates the following model files:

```
vectorizer.pkl
failure_model.pkl
```

These artifacts are loaded by the backend API during runtime.

---

### Step 3 — Perform Log Clustering

Cluster verification logs to detect common failure patterns.

```
python ml_engine/log_clustering.py
```

---

### Step 4 — Generate Debug Prioritization Report

Rank failure clusters based on severity and frequency.

```
python ml_engine/bug_prioritization.py
```

This generates a prioritized list of failure clusters.

---

## Running the System

### Start the Backend API

```
uvicorn backend.api_server:app --reload
```

The backend server will start at:

```
http://127.0.0.1:8000
```

Interactive API documentation is available at:

```
http://127.0.0.1:8000/docs
```

---

### Launch the Dashboard

In a separate terminal run:

```
streamlit run dashboard/app.py
```

The dashboard will open at:

```
http://localhost:8501
```

---

## Dashboard Overview

The dashboard contains three major sections designed to support verification engineers.

### Log Analyzer

Users can paste a verification log and receive an AI-based failure probability estimate.

Example input:

```
Assertion failed: FSM entered illegal state
```

Example output:

```
Failure Probability: 92%
Critical Failure Detected
```

---

### Failure Cluster Distribution

Displays a visualization showing how logs are distributed across discovered failure clusters.  
This helps identify dominant failure patterns in verification runs.

---

### Top Critical Failure Clusters

Shows a prioritized list of failure clusters ranked by importance.

Example output:

| Cluster | Occurrences | Severity | Priority Score |
|--------|-------------|----------|---------------|
| 2 | 3109 | ERROR | 2065 |
| 5 | 1848 | WARNING | 1208 |
| 4 | 1223 | ASSERT_FAIL | 1033 |

---

## API Endpoints

### Analyze Log

```
POST /analyze_log
```

Request body:

```json
{
  "log_message": "Assertion failed: FSM entered illegal state"
}
```

Response:

```json
{
  "failure_prediction": 1,
  "failure_probability": 0.92
}
```

---

### Get Top Bugs

```
GET /top_bugs
```

Returns the highest priority failure clusters.

---

### Get Cluster Distribution

```
GET /clusters
```

Returns the distribution of logs across clusters.

---

## How the System Works

### Log Vectorization

Verification logs are converted into numerical feature vectors using **TF-IDF (Term Frequency–Inverse Document Frequency)**.

### Failure Prediction

A **Random Forest classifier** predicts whether a given log corresponds to a critical failure.

### Log Clustering

**K-Means clustering** groups similar logs together to discover recurring failure patterns.

### Debug Prioritization

Clusters are ranked using a priority scoring mechanism based on:

- occurrence frequency
- severity of failures
- cluster importance

This enables engineers to prioritize debugging tasks effectively.

---

## Example Workflow

1. An engineer runs RTL verification simulations.
2. Verification logs are generated during testing.
3. Logs are submitted to the VeriGuard AI dashboard.
4. The system predicts failure probability.
5. Logs are grouped into clusters automatically.
6. Critical clusters are prioritized for debugging.

---

## Potential Applications

- Hardware verification environments
- Large-scale simulation debugging
- Failure triage automation
- Log analytics for verification systems

---

## Future Improvements

- Integration with real verification logs from hardware simulation tools
- LLM-based root cause explanation of failures
- Support for large-scale log ingestion pipelines
- Advanced visualization of cluster relationships

---

## License

This project is intended for educational and research purposes.