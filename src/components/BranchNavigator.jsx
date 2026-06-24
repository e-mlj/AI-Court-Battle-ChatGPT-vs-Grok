import React from 'react';
import { branchPromptStyles } from '../data/legalCases.js';

export default function BranchNavigator({ branchMode, setBranchMode }) {
  const branch = branchPromptStyles[branchMode];

  return (
    <section className="branch-navigator sketch-panel">
      <label htmlFor="branch-select">Chapter / branch</label>
      <select id="branch-select" value={branchMode} onChange={(e) => setBranchMode(e.target.value)}>
        {Object.keys(branchPromptStyles).map((mode) => (
          <option key={mode} value={mode}>{mode}</option>
        ))}
      </select>
      <div className="branch-help">
        <strong>{branch.title}</strong>
        <span>{branch.description}</span>
      </div>
    </section>
  );
}
