import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { legalCases } from '../src/data/legalCases.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8787;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

function getCase(caseId) {
  return legalCases.find((item) => item.id === caseId) || legalCases[0];
}

function buildSystemPrompt() {
  return `You are an AI witness in a courtroom-style legal fact-checking demo.
Answer the user's legal question with:
1. A clear Yes or No verdict.
2. A short correction if the question contains a false premise.
3. One sentence explaining what evidence should be checked.
Do not pretend that model agreement is proof.`;
}

function extractVerdict(text = '') {
  const trimmed = String(text).trim().toLowerCase();
  if (/^(no|no\.|no,|no\s)/i.test(trimmed)) return 'No';
  if (/^(yes|yes\.|yes,|yes\s)/i.test(trimmed)) return 'Yes';
  if (/\bno\b/i.test(text) && !/\byes\b/i.test(text)) return 'No';
  if (/\byes\b/i.test(text) && !/\bno\b/i.test(text)) return 'Yes';
  return 'Unclear';
}

function scoreAnswer(answer, expected) {
  const verdict = extractVerdict(answer);
  return {
    verdict,
    expected,
    score: verdict === expected ? 1 : 0,
  };
}

async function callOpenAI(prompt) {
  if (!process.env.OPENAI_API_KEY) return null;

  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: prompt },
      ],
      temperature: 0.1,
      max_output_tokens: 220,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.output_text || data.output?.map((item) =>
    item.content?.map((c) => c.text || '').join(' ')
  ).join(' ') || '';
}

async function callXAI(prompt) {
  if (!process.env.XAI_API_KEY) return null;

  const model = process.env.XAI_MODEL || 'grok-3-mini';
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 220,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`xAI API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    mode: {
      openai: Boolean(process.env.OPENAI_API_KEY) ? 'live' : 'dataset-demo',
      grok: Boolean(process.env.XAI_API_KEY) ? 'live' : 'dataset-demo',
    },
  });
});

app.post('/api/run-case', async (req, res) => {
  const started = Date.now();
  const { caseId, branchMode = 'testing-1', forceMock = false } = req.body || {};
  const currentCase = getCase(caseId);
  const prompt = currentCase.prompts?.[branchMode] || currentCase.prompts?.['testing-1'] || currentCase.prompts?.main;

  let chatgptAnswer = currentCase.chatgptAnswer;
  let grokAnswer = currentCase.grokAnswer;
  let chatgptMode = 'dataset-demo';
  let grokMode = 'dataset-demo';
  const errors = [];

  if (!forceMock) {
    try {
      const liveOpenAI = await callOpenAI(prompt);
      if (liveOpenAI) {
        chatgptAnswer = liveOpenAI;
        chatgptMode = 'live-openai-api';
      }
    } catch (error) {
      errors.push({ provider: 'ChatGPT/OpenAI', message: error.message });
    }

    try {
      const liveXai = await callXAI(prompt);
      if (liveXai) {
        grokAnswer = liveXai;
        grokMode = 'live-xai-api';
      }
    } catch (error) {
      errors.push({ provider: 'Grok/xAI', message: error.message });
    }
  }

  const chatgptScore = scoreAnswer(chatgptAnswer, currentCase.expectedAnswer);
  const grokScore = scoreAnswer(grokAnswer, currentCase.expectedAnswer);

  res.json({
    caseId: currentCase.id,
    prompt,
    expectedAnswer: currentCase.expectedAnswer,
    chatgpt: {
      answer: chatgptAnswer,
      mode: chatgptMode,
      ...chatgptScore,
    },
    grok: {
      answer: grokAnswer,
      mode: grokMode,
      ...grokScore,
    },
    evidence: currentCase.correctEvidence,
    verdict: currentCase.verdict,
    source: currentCase.sourceUrl,
    errors,
    elapsedMs: Date.now() - started,
  });
});

app.post('/api/run-branch', async (req, res) => {
  const { branchMode = 'testing-1', forceMock = false } = req.body || {};
  const results = [];

  for (const currentCase of legalCases) {
    const prompt = currentCase.prompts?.[branchMode] || currentCase.prompts?.['testing-1'];
    let chatgptAnswer = currentCase.chatgptAnswer;
    let grokAnswer = currentCase.grokAnswer;

    if (!forceMock) {
      try {
        chatgptAnswer = (await callOpenAI(prompt)) || chatgptAnswer;
      } catch {}
      try {
        grokAnswer = (await callXAI(prompt)) || grokAnswer;
      } catch {}
    }

    results.push({
      caseId: currentCase.id,
      title: currentCase.title,
      prompt,
      expectedAnswer: currentCase.expectedAnswer,
      chatgpt: scoreAnswer(chatgptAnswer, currentCase.expectedAnswer),
      grok: scoreAnswer(grokAnswer, currentCase.expectedAnswer),
    });
  }

  res.json({
    branchMode,
    results,
    totals: {
      chatgpt: results.reduce((sum, item) => sum + item.chatgpt.score, 0),
      grok: results.reduce((sum, item) => sum + item.grok.score, 0),
      max: results.length,
    },
  });
});

app.listen(PORT, () => {
  console.log(`AI Jury server running on http://localhost:${PORT}`);
  console.log(`OpenAI mode: ${process.env.OPENAI_API_KEY ? 'live' : 'dataset-demo'}`);
  console.log(`xAI mode: ${process.env.XAI_API_KEY ? 'live' : 'dataset-demo'}`);
});
