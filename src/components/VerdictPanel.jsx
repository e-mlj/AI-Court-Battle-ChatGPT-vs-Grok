import React from 'react';

export default function VerdictPanel({ visible, verdict, chatgptScore, grokScore, chatgptVerdict, grokVerdict }) {
  return (
    <section className={`verdict-panel sketch-panel ${visible ? 'verdict-visible' : ''}`}>
      <div className="verdict-stamp">VERDICT</div>
      <p>{verdict}</p>
      <div className="verdict-grid">
        <div>
          <strong>ChatGPT</strong>
          <span className={chatgptScore ? 'dot green' : 'dot red'}></span>
          <em>{chatgptVerdict || 'Waiting'}</em>
        </div>
        <div>
          <strong>Grok</strong>
          <span className={grokScore ? 'dot green' : 'dot red'}></span>
          <em>{grokVerdict || 'Waiting'}</em>
        </div>
      </div>
    </section>
  );
}
