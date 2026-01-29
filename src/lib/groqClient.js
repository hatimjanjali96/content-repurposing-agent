const GROQ_API_KEY = process.env.GROQ_API_KEY;
// Use llama-3.1-8b-instant for speed (much faster than mixtral)
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

export async function generateWithGroq(systemPrompt, userPrompt, maxTokens = 2000) {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key is not configured. Please add GROQ_API_KEY to environment variables.');
  }

  // Truncate user prompt to fit within limits and speed up processing
  const maxPromptLength = 4000;
  const truncatedUserPrompt = userPrompt.length > maxPromptLength
    ? userPrompt.substring(0, maxPromptLength) + '...[truncated]'
    : userPrompt;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout for Vercel hobby

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: truncatedUserPrompt }
        ],
        temperature: 0.7,
        max_tokens: maxTokens,
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = response.statusText;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorMessage;
      } catch {
        // Ignore JSON parse errors for error response
      }

      if (response.status === 401) {
        throw new Error('Invalid Groq API key. Please check your GROQ_API_KEY environment variable.');
      }
      if (response.status === 429) {
        throw new Error('Groq API rate limit exceeded. Please wait a moment and try again.');
      }
      throw new Error(`Groq API error (${response.status}): ${errorMessage}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Unexpected response format from Groq API');
    }

    return data.choices[0].message.content;

  } catch (error) {
    console.error('Groq generation failed:', error);

    if (error.name === 'AbortError') {
      throw new Error('Groq API request timed out. Please try again.');
    }

    throw new Error(`Content generation failed: ${error.message}`);
  }
}
