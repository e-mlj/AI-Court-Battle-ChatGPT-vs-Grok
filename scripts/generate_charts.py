import csv
from pathlib import Path
import matplotlib.pyplot as plt

base = Path(__file__).resolve().parents[1]

for filename, title, outname in [
    ("final_scores.csv", "Full Dataset Final Scores", "score_chart_full.png"),
    ("live_final_scores.csv", "Live Video Final Scores", "score_chart_live.png"),
]:
    score_file = base / "results" / filename
    out_file = base / "results" / outname

    models = []
    scores = []
    max_score = None

    with score_file.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            models.append(row["model"])
            scores.append(float(row["total_score"]))
            max_score = float(row["max_score"])

    plt.figure(figsize=(6, 4))
    plt.bar(models, scores)
    plt.ylim(0, max_score)
    plt.ylabel(f"Score out of {int(max_score)}")
    plt.title(title)
    plt.tight_layout()
    plt.savefig(out_file, dpi=200)
    print(f"Saved {out_file}")
