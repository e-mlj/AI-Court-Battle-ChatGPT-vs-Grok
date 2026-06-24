export async function getApiHealth() {
  try {
    const response = await fetch('/api/health');
    if (!response.ok) throw new Error('Health check failed');
    return response.json();
  } catch (error) {
    return {
      ok: false,
      mode: { openai: 'frontend-only', grok: 'frontend-only' },
      error: error.message,
    };
  }
}

export async function runCaseWithAI({ caseId, branchMode, forceMock }) {
  const response = await fetch('/api/run-case', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ caseId, branchMode, forceMock })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'AI trial request failed');
  }

  return response.json();
}
