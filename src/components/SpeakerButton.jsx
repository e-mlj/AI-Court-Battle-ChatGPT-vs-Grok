import React, { useState } from 'react';

export default function SpeakerButton({ text, label = 'Speak', compact = false }) {
  const [speaking, setSpeaking] = useState(false);

  const speak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Your browser does not support text-to-speech.');
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text || '');
    utterance.rate = 0.94;
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button className={`speaker-button ${speaking ? 'speaking' : ''} ${compact ? 'compact' : ''}`} onClick={speak} type="button">
      <span className="speaker-icon">{speaking ? '■' : '🔊'}</span>
      {!compact && <span>{speaking ? 'Stop' : label}</span>}
      {speaking && <span className="sound-waves"><i></i><i></i><i></i></span>}
    </button>
  );
}
