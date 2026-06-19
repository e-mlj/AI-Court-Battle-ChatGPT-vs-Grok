import React from 'react';
import SpeakerButton from './SpeakerButton.jsx';

export default function CaseBoard({
  currentCase,
  prompt,
  phase,
  onCrossExamine,
  onHearAnswers,
  onEvidence,
  onVerdict,
  onNext,
  onAutoPlay,
  onAskLive,
  loadingAI,
  liveMode,
  setLiveMode,
}) {
  return (
    <section className={`case-board sketch-panel phase-${phase}`}>
      <div className="case-board-header">
        <span className="case-number">CASE {currentCase.caseNumber}/5</span>
        <span className="trap-tag">{currentCase.trapType}</span>
      </div>
      <h2>{currentCase.title}</h2>
      <div className="prompt-card">
        <span className="prompt-label">QUESTION ON THE BOARD</span>
        <p>{prompt}</p>
        <SpeakerButton text={prompt} label="Narrate Board" />
      </div>
      <div className="trial-controls">
        <button onClick={onCrossExamine}>Cross-Examine</button>
        <button onClick={onHearAnswers} disabled={loadingAI}>
          {loadingAI ? 'Calling AI...' : 'Hear Answers'}
        </button>
        <button onClick={onAskLive} disabled={loadingAI}>
          {loadingAI ? 'Live AI running...' : liveMode ? 'Run Live AI' : 'Dataset Demo'}
        </button>
        <button onClick={onEvidence}>Evidence Check</button>
        <button onClick={onVerdict}>Verdict</button>
        <button onClick={onNext}>Next Case</button>
      </div>
      <div className="toggle-row">
        <label className="switch-label">
          <input type="checkbox" checked={liveMode} onChange={(e) => setLiveMode(e.target.checked)} />
          <span>Use live APIs when keys exist</span>
        </label>
        <button className="auto-play" onClick={onAutoPlay}>Auto Play Trial</button>
      </div>
    </section>
  );
}
