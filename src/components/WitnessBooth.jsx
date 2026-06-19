import React from 'react';
import SpeakerButton from './SpeakerButton.jsx';

export default function WitnessBooth({
  modelName,
  answer,
  verdictStatus = 'waiting',
  isSpeaking = false,
  side = 'left',
  onSpeak,
  mode = 'dataset-demo',
}) {
  const dotClass = verdictStatus === 'passed' ? 'dot green' : verdictStatus === 'failed' ? 'dot red' : 'dot yellow';

  return (
    <aside className={`witness-booth sketch-panel ${side} ${isSpeaking ? 'active-witness' : ''}`}>
      <div className="witness-topline">
        <span className="witness-label">AI WITNESS</span>
        <span className={dotClass}></span>
      </div>
      <div className="witness-icon">
        <span className="abstract-ai-icon">{modelName === 'ChatGPT' ? '◎' : '✕'}</span>
      </div>
      <h3>{modelName}</h3>
      <div className="mode-chip">{mode}</div>
      <SpeakerButton text={answer} label={`${modelName} answer`} compact />
      <div className={`speech-bubble ${answer ? 'revealed' : ''}`}>
        {answer || 'Waiting for cross-examination...'}
      </div>
    </aside>
  );
}
