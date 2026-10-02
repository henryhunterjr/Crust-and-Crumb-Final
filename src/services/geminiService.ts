/** Keep the existing component interface; glossary grounding and keys stay server-side. */
export async function sendMessageToGemini(history: { role: 'user' | 'model'; text: string }[], message: string): Promise<string> {
  const prior = [...history];
  const last = prior[prior.length - 1];
  if (last?.role === 'user' && last?.text === message) prior.pop();
  while (prior.length && prior[0].role !== 'user') prior.shift();
  try {
    const response = await fetch('/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history: prior.slice(-6) }),
      signal: AbortSignal.timeout(30000),
    });
    const result = await response.json();
    return response.ok && result.response ? result.response : (result.error || 'Ask Krusty is temporarily unavailable. You can still search the glossary.');
  } catch {
    return 'Ask Krusty could not connect. You can still use the glossary or report a correction from a term page.';
  }
}
