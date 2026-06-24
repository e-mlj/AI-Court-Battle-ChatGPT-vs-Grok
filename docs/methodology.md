# Methodology

## Research Question
Can ChatGPT and Grok detect false premises in controversial legal questions about AI, copyright, criminal justice, surveillance, arXiv metadata, and legal reliability?

## Dataset
The project uses **65 total questions**:
- Direct factual legal questions
- False-premise trap questions
- LLM reliability questions
- arXiv metadata and fake-citation questions

A separate live-video subset contains **5 questions**:
- Q56: State v Loomis trap
- Q57: Thaler v Vidal trap
- Q58: Naruto v Slater trap
- Q61: Google v Oracle trap
- Q36: Model agreement trap

## Workflow
1. Build a question dataset.
2. Create a ground-truth answer key using public legal sources and metadata sources.
3. Ask ChatGPT and Grok the exact same questions.
4. Save raw answers in `data/model_answers.csv`.
5. Score every answer with the same 2-point rubric.
6. Compare total accuracy and false-premise failures.
7. Use the 5-question subset in the final 5-minute video.

## Why This Matters
Legal and academic answers are dangerous when an AI model sounds confident but mixes up a case, court, issue, or source type. The project tests whether models can reject false premises instead of accepting them.
