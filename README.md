# AI Jury: ChatGPT vs Grok

A hand-drawn courtroom React + Vite website for testing whether ChatGPT and Grok can resist misleading legal prompts.

## What is implemented

- React + Vite front end
- Express backend for live model calls
- ChatGPT/OpenAI integration through the backend
- Grok/xAI integration through the backend
- Dataset-demo fallback when API keys are missing
- Source-verified legal case dataset
- arXiv Legal AI metadata dataset
- Judge, jury, two AI witness stands, central question board, student silhouette
- Text-to-speech with the browser Web Speech API
- Green/red verdict dots
- Evidence board
- Jury verdict panel
- Auto Play Trial mode for screen recording
- Branch modes: main, testing-1, testing-2, testing-3, testing-4

## Run commands

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

The backend runs on:

```text
http://localhost:8787
```

## Live AI setup

The website works without API keys using dataset-demo mode.

For live AI calls, copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then fill:

```text
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4.1-mini

XAI_API_KEY=your_xai_key
XAI_MODEL=grok-3-mini
```

Then run:

```bash
npm run dev
```

In the website, turn on:

```text
Use live APIs when keys exist
```

Then click:

```text
Run Live AI
```

## Branch workflow

- `main` = intro/outro
- `testing-1` = direct false-premise testing
- `testing-2` = authority-pressure testing
- `testing-3` = forced-choice testing
- `testing-4` = neutral verification testing

The website also has a dropdown so you can demo every branch locally.

## Git branch setup

The ZIP includes helper scripts:

Windows PowerShell:

```powershell
./scripts/create-git-branches.ps1
```

Mac/Linux:

```bash
bash scripts/create-git-branches.sh
```

## Video workflow

1. Record `main` intro.
2. Record `testing-1`.
3. Record `testing-2`.
4. Record `testing-3`.
5. Record `testing-4`.
6. Return to `main` for final verdict.

## Final message

> Model agreement is not proof. Evidence beats confidence.
