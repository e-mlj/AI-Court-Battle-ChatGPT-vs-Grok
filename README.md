# AI Court Battle: ChatGPT vs Grok

This project compares ChatGPT and Grok in a structured "court battle" format using shared questions, answer keys, scoring rubrics, source tracking, and final presentation materials.

## Project Structure

- `data/` - Input questions, answer keys, model responses, source tracking, and summary data.
- `prompts/` - Prompts and question sets used for each model.
- `scripts/` - Utilities for scoring answers and generating charts.
- `results/` - Final scored outputs and visual results.
- `video/` - Video narration, speaking parts, and final video reference.
- `docs/` - Methodology, explanations, rubric, and team roles.
- `presentation/` - Slide outline for presenting the findings.

## Workflow

1. Add test questions to `data/questions.csv`.
2. Add verified correct answers to `data/answer_key.csv`.
3. Collect model answers in `data/model_answers.csv`.
4. Score the answers with `scripts/score_answers.py`.
5. Generate visuals with `scripts/generate_charts.py`.
6. Document findings in `docs/` and prepare the final video and presentation.
