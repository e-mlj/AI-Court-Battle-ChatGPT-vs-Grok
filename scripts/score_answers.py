import csv
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
RESULTS = ROOT / "results"


def main():
    RESULTS.mkdir(exist_ok=True)
    output_path = RESULTS / "final_scores.csv"

    with output_path.open("w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["question_id", "model", "score", "max_score", "notes"])

    print(f"Wrote {output_path}")


if __name__ == "__main__":
    main()
