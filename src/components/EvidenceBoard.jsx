import React from 'react';
import SpeakerButton from './SpeakerButton.jsx';

export default function EvidenceBoard({ evidence, sourceName, sourceUrl, visible }) {
  return (
    <section className={`evidence-board sketch-panel ${visible ? 'show-evidence' : ''}`}>
      <div className="evidence-title">EVIDENCE CHECK ✅</div>
      <p className="verified-label">Verified public source</p>
      <p>{evidence}</p>
      <SpeakerButton text={evidence} label="Read Evidence" />
      <a href={sourceUrl} target="_blank" rel="noreferrer" className="source-link">
        {sourceName}
      </a>
    </section>
  );
}
