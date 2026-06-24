import React from 'react';

export default function JudgeBench({ verdictVisible }) {
  return (
    <section className="judge-bench sketch-panel">
      <div className="judge-label">JUDGE</div>
      <div className="judge-body">
        <div className="judge-head">⚖️</div>
        <div className="judge-face">•‿•</div>
        <div className={`gavel ${verdictVisible ? 'gavel-slam' : ''}`}>🔨</div>
      </div>
      <p>Evidence Court</p>
    </section>
  );
}
