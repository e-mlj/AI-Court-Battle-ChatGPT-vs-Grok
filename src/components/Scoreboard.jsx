import React from 'react';

function Dots({ score, total }) {
  return (
    <div className="score-dots">
      {Array.from({ length: total }).map((_, index) => (
        <span key={index} className={`score-dot ${index < score ? 'filled' : ''}`}></span>
      ))}
    </div>
  );
}

export default function Scoreboard({ chatgptScore, grokScore, totalCases, branchMode, apiHealth }) {
  return (
    <section className="scoreboard sketch-panel">
      <div>
        <span className="score-label">ChatGPT</span>
        <strong>{chatgptScore}/{totalCases}</strong>
        <Dots score={chatgptScore} total={totalCases} />
      </div>
      <div>
        <span className="score-label">Grok</span>
        <strong>{grokScore}/{totalCases}</strong>
        <Dots score={grokScore} total={totalCases} />
      </div>
      <div className="lesson-card">
        <strong>Evidence beats agreement.</strong>
        <span>Branch: {branchMode}</span>
        <small>OpenAI: {apiHealth?.mode?.openai || 'checking'} • Grok: {apiHealth?.mode?.grok || 'checking'}</small>
      </div>
    </section>
  );
}
