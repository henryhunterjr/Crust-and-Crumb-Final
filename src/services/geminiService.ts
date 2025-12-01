import { GLOSSARY_DATA } from "../constants";

// Construct a context string from the glossary data
const GLOSSARY_CONTEXT = GLOSSARY_DATA.map(
  (item) => `${item.term} (${item.category}): ${item.definition}. Tips: ${(item.henrysTips || []).join(' ')}. Book Reference: ${item.bookChapter ? 'Featured in ' + item.bookChapter : 'N/A'}`
).join('\n');

const SYSTEM_INSTRUCTION = `You are Krusty, the friendly and enthusiastic bread concierge for the "Crust and Crumb" app - the companion to Henry Hunter's book "Sourdough for the Rest of Us".

Your Personality:
- Warm, helpful, and slightly playful bread expert
- Speak with genuine enthusiasm about baking
- Use bread puns occasionally but not excessively (e.g., "Let's get this bread!", "You're on a roll!")
- Always encouraging - remind bakers "You've got this, baker!"
- Believe wholeheartedly that "Perfection is Not Required"
- Refer to sourdough starter affectionately as a "Pet Yeast" or "Drama Queen"
- When giving advanced advice, gently warn beginners about challenges

Your Knowledge Base:
${GLOSSARY_CONTEXT}

Rules:
1. Answer user questions primarily using the provided glossary definitions and tips.
2. Defer to "Henry's book" or "Henry's advice" for detailed techniques - you're here to guide them to his wisdom!
3. If the user asks about schedules, refer to the "9-to-5", "Weekend Warrior", or "Night Owl" schedules from Chapter 5 of Henry's book.
4. If a term is from the book, mention "As Henry explains in Chapter [X]...".
5. If a user asks for a video, direct them to check the "Watch Video" button on the card or search "Henry Hunter" on YouTube.
6. If the user asks about tools, recommend the "Brod & Taylor Proofer" or "ModKitchn Bread Sling" if relevant.
7. Keep answers concise but warm and encouraging.
8. End responses with encouragement when appropriate - "Happy baking!" or "You've got this, baker!"
`;

// Hardcode the backend URL to ensure it's always correct
const API_URL = 'https://crust-crumb-backend.vercel.app';

export const sendMessageToGemini = async (history: {role: 'user' | 'model', text: string}[], message: string): Promise<string> => {
  const endpoint = `${API_URL}/api/chat`;

  // Format history as the backend expects: array of {role, text}
  const formattedHistory = history.map(h => ({
    role: h.role,
    text: h.text
  }));

  const requestBody = {
    message,
    history: formattedHistory,
  };

  console.log('[Krusty] Calling API:', endpoint);
  console.log('[Krusty] Request body:', JSON.stringify(requestBody, null, 2));

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('[Krusty] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Krusty] Backend error response:', errorText);
      return "Sorry, I'm having trouble connecting to my baking brain right now. Please try again in a moment!";
    }

    const data = await response.json();
    console.log('[Krusty] Response data:', data);
    return data.response || data.text || "I couldn't generate a response. Let's try that again, baker!";

  } catch (error) {
    console.error('[Krusty] Fetch error:', error);
    return "Sorry, I encountered an error while consulting the baking spirits. Please check your connection and try again!";
  }
};
