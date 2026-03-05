import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

print("Loading dataset...")

df = pd.read_csv("dataset/rtl_verification_dataset.csv")

logs = df["log_message"]
labels = df["anomaly"]

print("Vectorizing logs...")

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(logs)

print("Splitting dataset...")

X_train, X_test, y_train, y_test = train_test_split(
    X, labels, test_size=0.2, random_state=42
)

print("Training RandomForest model...")

model = RandomForestClassifier(n_estimators=100, random_state=42)

model.fit(X_train, y_train)

print("Model training complete")

print("Running predictions...")

predictions = model.predict(X_test)

print("\nModel Performance:\n")

print(classification_report(y_test, predictions))