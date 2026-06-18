from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RESULTS = ROOT / "results"


def main():
    RESULTS.mkdir(exist_ok=True)
    chart_path = RESULTS / "score_chart.png"
    chart_path.write_bytes(b"")
    print(f"Created placeholder chart at {chart_path}")


if __name__ == "__main__":
    main()
