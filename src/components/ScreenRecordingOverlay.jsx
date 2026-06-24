import React from 'react';
import { branchPromptStyles } from '../data/legalCases.js';

export default function ScreenRecordingOverlay({ branchMode }) {
  if (branchMode === 'main') return null;
  const branch = branchPromptStyles[branchMode];
  return (
    <div className="recording-overlay">
      <span className="recording-dot"></span>
      Recording {branchMode}
      <em>Prompt style: {branch.style}</em>
    </div>
  );
}
