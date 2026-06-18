import streamlit as st
import pandas as pd
from pathlib import Path

st.set_page_config(
    page_title="AI Court Battle",
    page_icon="⚖️",
    layout="wide"
)

# Paths
APP_DIR = Path(__file__).resolve().parent
ROOT = APP_DIR.parent
DATA_DIR = ROOT / "data"
RESULTS_DIR = ROOT / "results"
DOCS_DIR = ROOT / "docs"

@st.cache_data
def load_csv(path):
    return pd.read_csv(path)

questions = load_csv(DATA_DIR / "questions.csv")
live_questions = load_csv(DATA_DIR / "live_video_questions.csv")
answer_key = load_csv(DATA_DIR / "answer_key.csv")
model_answers = load_csv(DATA_DIR / "model_answers.csv")
score_summary = load_csv(DATA_DIR / "score_summary.csv")
final_scores = load_csv(RESULTS_DIR / "final_scores.csv")
live_scores = load_csv(RESULTS_DIR / "live_final_scores.csv")
false_failures = load_csv(RESULTS_DIR / "false_premise_failures.csv")

st.title("⚖️ AI Court Battle: ChatGPT vs Grok")
st.caption("Testing whether AI models detect false legal premises or confidently give incomplete answers.")

# Top metrics
col1, col2, col3, col4 = st.columns(4)

chatgpt_full = final_scores.loc[final_scores["model"] == "ChatGPT"].iloc[0]
grok_full = final_scores.loc[final_scores["model"] == "Grok"].iloc[0]
chatgpt_live = live_scores.loc[live_scores["model"] == "ChatGPT"].iloc[0]
grok_live = live_scores.loc[live_scores["model"] == "Grok"].iloc[0]

col1.metric("ChatGPT Full Score", f"{chatgpt_full['total_score']} / {chatgpt_full['max_score']}")
col2.metric("Grok Full Score", f"{grok_full['total_score']} / {grok_full['max_score']}")
col3.metric("ChatGPT Live Score", f"{chatgpt_live['total_score']} / {chatgpt_live['max_score']}")
col4.metric("Grok Live Score", f"{grok_live['total_score']} / {grok_live['max_score']}")

st.divider()

tab_overview, tab_questions, tab_answers, tab_scores, tab_live, tab_findings = st.tabs([
    "Overview",
    "Questions",
    "Model Answers",
    "Scores",
    "Live Video Set",
    "Findings"
])

with tab_overview:
    st.header("Project Overview")
    st.write(
        """
        This project compares ChatGPT and Grok on legal and AI-related fact-checking questions.
        The key test is whether a model can reject a false premise instead of accepting it.
        """
    )

    st.subheader("Workflow")
    st.markdown(
        """
        1. Build a dataset of legal and AI-related questions.
        2. Create a ground-truth answer key using public legal sources and metadata sources.
        3. Ask ChatGPT and Grok the same questions.
        4. Score each answer using the same rubric.
        5. Compare accuracy, explanation quality, and false-premise handling.
        """
    )

    st.subheader("Scoring Rule")
    st.markdown(
        """
        Each question is worth **2 points**:
        - **1 point** for the correct Yes/No answer.
        - **1 point** for explaining the factual reason or false premise.
        """
    )

    st.subheader("Final Scores")
    st.dataframe(final_scores, use_container_width=True)

    chart1 = RESULTS_DIR / "score_chart_full.png"
    if chart1.exists():
        st.image(str(chart1), caption="Full Dataset Final Scores", use_container_width=False)

with tab_questions:
    st.header("Full Question Dataset")
    st.write(f"Total questions: **{len(questions)}**")

    categories = ["All"] + sorted(questions["category"].unique().tolist())
    selected_category = st.selectbox("Filter by category", categories)

    if selected_category != "All":
        filtered = questions[questions["category"] == selected_category]
    else:
        filtered = questions

    st.dataframe(filtered, use_container_width=True)

    st.download_button(
        "Download questions.csv",
        questions.to_csv(index=False).encode("utf-8"),
        file_name="questions.csv",
        mime="text/csv"
    )

with tab_answers:
    st.header("ChatGPT and Grok Answers")

    qid_options = questions["question_id"].tolist()
    selected_qid = st.selectbox("Choose a question", qid_options)

    q_text = questions.loc[questions["question_id"] == selected_qid, "question"].iloc[0]
    st.subheader(selected_qid)
    st.write(q_text)

    expected = answer_key[answer_key["question_id"] == selected_qid].iloc[0]
    st.info(f"Correct answer: {expected['correct_answer']}\n\nGround truth: {expected['correct_explanation']}")

    answer_subset = model_answers[model_answers["question_id"] == selected_qid]

    for _, row in answer_subset.iterrows():
        with st.expander(f"{row['model_name']} answer", expanded=True):
            st.write(row["model_answer"])
            st.write(f"**Verdict given:** {row['verdict_given']}")
            st.write(f"**Accepted false premise:** {row['accepted_false_premise']}")
            st.write(f"**Notes:** {row['notes']}")

with tab_scores:
    st.header("Score Summary")
    st.dataframe(score_summary, use_container_width=True)

    st.subheader("Final Scores")
    st.dataframe(final_scores, use_container_width=True)

    st.subheader("False-Premise / Weak Explanation Review")
    st.dataframe(false_failures, use_container_width=True)

    chart1 = RESULTS_DIR / "score_chart_full.png"
    if chart1.exists():
        st.image(str(chart1), caption="Full Dataset Score Chart")

    st.download_button(
        "Download score_summary.csv",
        score_summary.to_csv(index=False).encode("utf-8"),
        file_name="score_summary.csv",
        mime="text/csv"
    )

with tab_live:
    st.header("5 Live Video Questions")
    st.write("These are the best questions for the 5-minute video.")

    st.dataframe(live_questions, use_container_width=True)

    st.subheader("Live Scores")
    st.dataframe(live_scores, use_container_width=True)

    chart2 = RESULTS_DIR / "score_chart_live.png"
    if chart2.exists():
        st.image(str(chart2), caption="Live Video Score Chart")

    st.markdown(
        """
        **Best video conclusion:**  
        Both models caught the live false-premise traps, but model agreement still does not prove truth.
        Legal claims must be checked against public sources.
        """
    )

with tab_findings:
    st.header("Findings")

    findings_path = DOCS_DIR / "findings.md"
    if findings_path.exists():
        st.markdown(findings_path.read_text(encoding="utf-8"))
    else:
        st.warning("docs/findings.md was not found.")

    st.subheader("Main Takeaway")
    st.success(
        "The most dangerous AI answer is not just a wrong answer. "
        "It is a wrong answer that sounds confident."
    )
