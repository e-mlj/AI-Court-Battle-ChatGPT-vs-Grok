# AI Court Battle: ChatGPT vs Grok

## Problem
Large language models can sound confident even when they are wrong. In legal topics, this is dangerous because one false case detail can completely change the answer.

## Goal
We test whether ChatGPT and Grok can detect false premises in controversial legal and AI-related questions.

## Models Tested
- ChatGPT
- Grok

## Dataset
The repository contains **65 total questions** and a **5-question live video subset**.

## Public Data Sources
- Public legal case sources
- Court opinions and legal databases
- Wikidata/public metadata sources where useful
- arXiv API for paper metadata verification

## Method
We created court-style questions about AI, criminal justice, copyright, privacy, arXiv metadata, and LLM reliability. Both models received the same questions and the same fact-checking format.

## Scoring
Each answer is scored out of 2 points:
- 1 point for the correct Yes/No answer
- 1 point for identifying/explaining the false premise or factual reason

## Results
### Full Dataset
ChatGPT: 130 / 130
Grok: 116 / 130

### Live Video Subset
ChatGPT: 10 / 10
Grok: 10 / 10

## Main Finding
Both models avoided false-premise failures in the submitted answers. ChatGPT scored higher on the full dataset because Grok sometimes gave very short answers that lost the explanation point.

## Conclusion
Model agreement does not prove legal truth. AI answers must be checked against public data.


## Streamlit Dashboard

This repository includes an interactive Streamlit dashboard.

Run it locally:

```bash
pip install -r streamlit_app/requirements.txt
streamlit run streamlit_app/app.py
```

The dashboard shows the questions, answer key, model answers, score summaries, charts, and findings.

## Team Roles
- Person 1: Project Leader / GitHub Manager
- Person 2: Legal Evidence Researcher
- Person 3: AI Prompt Tester
- Person 4: Scoring Analyst
- Person 5: Judge / Presenter

## Video Link
TBD
