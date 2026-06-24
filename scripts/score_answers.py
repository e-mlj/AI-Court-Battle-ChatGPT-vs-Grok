import csv
from pathlib import Path
from collections import defaultdict

base = Path(__file__).resolve().parents[1]
score_file = base / "data" / "score_summary.csv"
failure_file = base / "results" / "false_premise_failures.csv"
out_file = base / "results" / "final_scores.csv"

scores = defaultdict(float)
counts = defaultdict(int)
failures = defaultdict(int)
weak_explanations = defaultdict(int)

with score_file.open(newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        model = row["model_name"]
        counts[model] += 1
        try:
            scores[model] += float(row["final_score"])
        except ValueError:
            pass

with failure_file.open(newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        model = row["model_name"]
        if row["accepted_false_premise"] != "No":
            failures[model] += 1
        if row["failure_type"] == "Weak explanation / needs more detail":
            weak_explanations[model] += 1

with out_file.open("w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["model", "total_score", "max_score", "accuracy_percentage", "false_premise_failures", "weak_explanations"])
    for model in sorted(scores):
        max_score = counts[model] * 2
        accuracy = (scores[model] / max_score) * 100 if max_score else 0
        writer.writerow([model, int(scores[model]), max_score, f"{accuracy:.1f}%", failures[model], weak_explanations[model]])

print(f"Saved {out_file}")
