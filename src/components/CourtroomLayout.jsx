import React from 'react';
import JudgeBench from './JudgeBench.jsx';
import WitnessBooth from './WitnessBooth.jsx';
import CaseBoard from './CaseBoard.jsx';
import EvidenceBoard from './EvidenceBoard.jsx';
import VerdictPanel from './VerdictPanel.jsx';
import Scoreboard from './Scoreboard.jsx';
import ScreenRecordingOverlay from './ScreenRecordingOverlay.jsx';

export default function CourtroomLayout({
  branchMode,
  currentCase,
  prompt,
  phase,
  answers,
  scores,
  chatgptScore,
  grokScore,
  totalCases,
  handlers,
  visible,
  loadingAI,
  liveMode,
  setLiveMode,
  apiHealth,
}) {
  const isTesting = branchMode !== 'main';

  return (
    <main className={`courtroom-layout ${isTesting ? 'testing-mode' : 'main-mode'}`}>
      <ScreenRecordingOverlay branchMode={branchMode} />
      <div className={`courtroom-background ${isTesting && phase !== 'case' ? 'blurred-background' : ''}`}>
        <div className="jury-row top-jury">
          {Array.from({ length: 9 }).map((_, idx) => <span key={idx} className="jury-person">◉</span>)}
        </div>
        <JudgeBench verdictVisible={visible.verdict} />
        <div className="trial-zone">
          <WitnessBooth
            modelName="ChatGPT"
            side="left"
            answer={answers.chatgpt}
            mode={answers.chatgptMode}
            verdictStatus={visible.answers ? (scores.chatgpt ? 'passed' : 'failed') : 'waiting'}
            isSpeaking={visible.answers}
          />
          <div className="center-stage">
            <CaseBoard
              currentCase={currentCase}
              prompt={prompt}
              phase={phase}
              onCrossExamine={handlers.onCrossExamine}
              onHearAnswers={handlers.onHearAnswers}
              onAskLive={handlers.onAskLive}
              onEvidence={handlers.onEvidence}
              onVerdict={handlers.onVerdict}
              onNext={handlers.onNext}
              onAutoPlay={handlers.onAutoPlay}
              loadingAI={loadingAI}
              liveMode={liveMode}
              setLiveMode={setLiveMode}
            />
            <div className="student-stand">
              <div className="student-head"></div>
              <div className="student-body"></div>
              <span>student/jury question</span>
            </div>
          </div>
          <WitnessBooth
            modelName="Grok"
            side="right"
            answer={answers.grok}
            mode={answers.grokMode}
            verdictStatus={visible.answers ? (scores.grok ? 'passed' : 'failed') : 'waiting'}
            isSpeaking={visible.answers}
          />
        </div>
        <div className="evidence-verdict-row">
          <EvidenceBoard
            evidence={currentCase.correctEvidence}
            sourceName={currentCase.sourceName}
            sourceUrl={currentCase.sourceUrl}
            visible={visible.evidence}
          />
          <VerdictPanel
            visible={visible.verdict}
            verdict={currentCase.verdict}
            chatgptScore={scores.chatgpt}
            grokScore={scores.grok}
            chatgptVerdict={answers.chatgptVerdict}
            grokVerdict={answers.grokVerdict}
          />
        </div>
        <Scoreboard
          chatgptScore={chatgptScore}
          grokScore={grokScore}
          totalCases={totalCases}
          branchMode={branchMode}
          apiHealth={apiHealth}
        />
      </div>
    </main>
  );
}
