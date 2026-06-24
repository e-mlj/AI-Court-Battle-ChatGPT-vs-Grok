import React, { useEffect, useMemo, useState } from 'react';
import CourtroomLayout from './components/CourtroomLayout.jsx';
import BranchNavigator from './components/BranchNavigator.jsx';
import { legalCases, branchPromptStyles } from './data/legalCases.js';
import { BRANCH_MODE } from './config/branchMode.js';
import { getApiHealth, runCaseWithAI } from './services/trialApi.js';

const AUTO_TIMING = {
  prompt: 500,
  cross: 1500,
  answers: 3000,
  evidence: 6500,
  verdict: 8500,
  next: 11500,
};

function extractVerdict(text = '') {
  const value = text.trim().toLowerCase();
  if (value.startsWith('no')) return 'No';
  if (value.startsWith('yes')) return 'Yes';
  if (/\bno\b/i.test(text) && !/\byes\b/i.test(text)) return 'No';
  if (/\byes\b/i.test(text) && !/\bno\b/i.test(text)) return 'Yes';
  return 'Unclear';
}

function score(answer, expected) {
  return extractVerdict(answer) === expected ? 1 : 0;
}

export default function App() {
  const [branchMode, setBranchMode] = useState(BRANCH_MODE);
  const [screen, setScreen] = useState(branchMode === 'main' ? 'intro' : 'trial');
  const [caseIndex, setCaseIndex] = useState(0);
  const [phase, setPhase] = useState('case');
  const [liveMode, setLiveMode] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [apiHealth, setApiHealth] = useState(null);
  const [answers, setAnswers] = useState({
    chatgpt: '',
    grok: '',
    chatgptMode: 'waiting',
    grokMode: 'waiting',
    chatgptVerdict: '',
    grokVerdict: '',
  });
  const [caseScores, setCaseScores] = useState({});

  const currentCase = legalCases[caseIndex];
  const prompt = currentCase.prompts[branchMode] || currentCase.prompts['testing-1'];

  useEffect(() => {
    getApiHealth().then(setApiHealth);
  }, []);

  useEffect(() => {
    if (branchMode === 'main') setScreen('intro');
    else setScreen('trial');
    resetCase();
  }, [branchMode]);

  function resetCase(nextIndex = caseIndex) {
    setCaseIndex(nextIndex);
    setPhase('case');
    setAnswers({
      chatgpt: '',
      grok: '',
      chatgptMode: 'waiting',
      grokMode: 'waiting',
      chatgptVerdict: '',
      grokVerdict: '',
    });
  }

  async function hearAnswers(forceLive = false) {
    setLoadingAI(true);
    setPhase('answers');

    if (forceLive || liveMode) {
      try {
        const result = await runCaseWithAI({
          caseId: currentCase.id,
          branchMode,
          forceMock: !liveMode && !forceLive,
        });

        setAnswers({
          chatgpt: result.chatgpt.answer,
          grok: result.grok.answer,
          chatgptMode: result.chatgpt.mode,
          grokMode: result.grok.mode,
          chatgptVerdict: result.chatgpt.verdict,
          grokVerdict: result.grok.verdict,
        });

        setCaseScores((prev) => ({
          ...prev,
          [currentCase.id]: {
            chatgpt: result.chatgpt.score,
            grok: result.grok.score,
          },
        }));
      } catch (error) {
        console.error(error);
        useStaticAnswers();
      } finally {
        setLoadingAI(false);
      }
      return;
    }

    useStaticAnswers();
    setLoadingAI(false);
  }

  function useStaticAnswers() {
    const chatgptVerdict = extractVerdict(currentCase.chatgptAnswer);
    const grokVerdict = extractVerdict(currentCase.grokAnswer);
    setAnswers({
      chatgpt: currentCase.chatgptAnswer,
      grok: currentCase.grokAnswer,
      chatgptMode: 'dataset-demo',
      grokMode: 'dataset-demo',
      chatgptVerdict,
      grokVerdict,
    });
    setCaseScores((prev) => ({
      ...prev,
      [currentCase.id]: {
        chatgpt: score(currentCase.chatgptAnswer, currentCase.expectedAnswer),
        grok: score(currentCase.grokAnswer, currentCase.expectedAnswer),
      },
    }));
  }

  function nextCase() {
    const next = caseIndex + 1;
    if (next >= legalCases.length) {
      setScreen('final');
      return;
    }
    resetCase(next);
  }

  function autoPlayTrial() {
    resetCase(caseIndex);
    window.setTimeout(() => setPhase('case'), AUTO_TIMING.prompt);
    window.setTimeout(() => setPhase('cross'), AUTO_TIMING.cross);
    window.setTimeout(() => hearAnswers(liveMode), AUTO_TIMING.answers);
    window.setTimeout(() => setPhase('evidence'), AUTO_TIMING.evidence);
    window.setTimeout(() => setPhase('verdict'), AUTO_TIMING.verdict);
    window.setTimeout(() => nextCase(), AUTO_TIMING.next);
  }

  const totals = useMemo(() => {
    return Object.values(caseScores).reduce(
      (acc, item) => ({
        chatgpt: acc.chatgpt + (item.chatgpt || 0),
        grok: acc.grok + (item.grok || 0),
      }),
      { chatgpt: 0, grok: 0 }
    );
  }, [caseScores]);

  const visible = {
    answers: phase === 'answers' || phase === 'evidence' || phase === 'verdict',
    evidence: phase === 'evidence' || phase === 'verdict',
    verdict: phase === 'verdict',
  };

  const scores = caseScores[currentCase.id] || { chatgpt: 0, grok: 0 };

  if (screen === 'intro') {
    return (
      <div className="app-shell intro-shell">
        <header className="top-header">
          <div>
            <h1>AI Jury</h1>
            <p>ChatGPT vs Grok</p>
          </div>
          <BranchNavigator branchMode={branchMode} setBranchMode={setBranchMode} />
        </header>
        <section className="intro-card sketch-panel no-blur-card">
          <div className="court-stamp">COURT IS IN SESSION</div>
          <h2>Can AI resist misleading legal prompts?</h2>
          <p>5 cases • 2 AI witnesses • 4 prompt styles • evidence-based scoring</p>
          <div className="intro-court-visual">
            <span>👨‍⚖️</span>
            <span className="stand">ChatGPT</span>
            <span className="center-accused">student</span>
            <span className="stand">Grok</span>
            <span>👥 Jury</span>
          </div>
          <div className="intro-actions">
            <button onClick={() => setScreen('trial')}>Start Trial</button>
            <button onClick={() => setScreen('final')}>View Final Verdict</button>
          </div>
          <p className="main-quote">“Model agreement is not proof. Evidence beats confidence.”</p>
        </section>
      </div>
    );
  }

  if (screen === 'final') {
    const best = totals.chatgpt === totals.grok ? 'Tie confirmed by evidence' : totals.chatgpt > totals.grok ? 'ChatGPT highest factual accuracy' : 'Grok highest factual accuracy';
    return (
      <div className="app-shell final-shell">
        <header className="top-header">
          <div>
            <h1>AI Jury</h1>
            <p>Final verdict</p>
          </div>
          <BranchNavigator branchMode={branchMode} setBranchMode={setBranchMode} />
        </header>
        <section className="final-card sketch-panel no-blur-card">
          <div className="verdict-stamp big-final">FINAL VERDICT</div>
          <h2>Evidence beats agreement.</h2>
          <p>Two models can agree and still be wrong. Always verify with public legal sources.</p>
          <div className="final-score-grid">
            <div><span>ChatGPT</span><strong>{totals.chatgpt}/5</strong><em>AI witness</em></div>
            <div><span>Grok</span><strong>{totals.grok}/5</strong><em>AI witness</em></div>
            <div><span>Result</span><strong>{best}</strong><em>source-based verdict</em></div>
          </div>
          <button onClick={() => { setCaseScores({}); setCaseIndex(0); setScreen('trial'); resetCase(0); }}>
            Replay Trial
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="top-header">
        <div>
          <h1>AI Jury</h1>
          <p>ChatGPT vs Grok</p>
        </div>
        <div className="status-pill">{branchMode}</div>
        <BranchNavigator branchMode={branchMode} setBranchMode={setBranchMode} />
      </header>
      <CourtroomLayout
        branchMode={branchMode}
        currentCase={currentCase}
        prompt={prompt}
        phase={phase}
        answers={answers}
        scores={scores}
        chatgptScore={totals.chatgpt}
        grokScore={totals.grok}
        totalCases={legalCases.length}
        loadingAI={loadingAI}
        liveMode={liveMode}
        setLiveMode={setLiveMode}
        apiHealth={apiHealth}
        visible={visible}
        handlers={{
          onCrossExamine: () => setPhase('cross'),
          onHearAnswers: () => hearAnswers(false),
          onAskLive: () => hearAnswers(true),
          onEvidence: () => setPhase('evidence'),
          onVerdict: () => setPhase('verdict'),
          onNext: nextCase,
          onAutoPlay: autoPlayTrial,
        }}
      />
    </div>
  );
}
