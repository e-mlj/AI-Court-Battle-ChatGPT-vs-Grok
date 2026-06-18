# Findings

## Full Dataset Results
ChatGPT scored **130 / 130**.
Grok scored **116 / 130**.

## Live Video Results
ChatGPT scored **10 / 10**.
Grok scored **10 / 10**.

## False-Premise Failures
ChatGPT: **0**
Grok: **0**

## Weak Explanations
ChatGPT: **0**
Grok: **14**

## Interpretation
Both models avoided accepting false premises in the submitted answers. ChatGPT received a higher full-dataset score because it consistently gave short explanations, while Grok sometimes answered with only “Yes” or “No,” which lost the explanation point under our rubric.

For the five live video questions, both models scored perfectly. The strongest conclusion is:

> Model agreement is not proof of truth. Even when two models answer correctly, legal claims should still be checked against public data.
