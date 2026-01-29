import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const { title, content } = await request.json();

    if (!content) {
      return NextResponse.json({ success: false, error: 'Content is required' }, { status: 400 });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return NextResponse.json({ success: false, error: 'Groq API key not configured' }, { status: 500 });
    }

    const systemPrompt = `You are a content strategist extracting SPECIFIC, CONCRETE main ideas from articles.

CRITICAL: Extract ideas with ACTUAL DETAILS from the article - not generic placeholders.

BAD (DO NOT DO):
{"title": "Core Message", "description": "Main insight from article"}

GOOD (DO THIS):
{"title": "Voice Search Queries Are 3x Longer", "description": "Research shows voice queries average 29 words vs 9 for text. This means content needs long-tail conversational phrases."}

Each idea MUST have specific facts, statistics, or examples from the article.`;

    const userPrompt = `Extract 6 SPECIFIC main ideas from this article. Include actual details, numbers, and examples.

TITLE: ${title}
CONTENT: ${content.substring(0, 3000)}

Return ONLY a JSON array with 6 ideas:
[{"id":1,"title":"Specific idea with detail","description":"2-3 sentences with SPECIFIC facts from the article"},...]`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.json().catch(() => ({}));
      return NextResponse.json({
        success: false,
        error: `AI generation failed: ${errorData.error?.message || groqResponse.statusText}`
      }, { status: 500 });
    }

    const groqData = await groqResponse.json();
    const aiContent = groqData.choices?.[0]?.message?.content || '';

    // Parse JSON
    let mainIdeas;
    try {
      const cleaned = aiContent.replace(/```json|```/g, '').trim();
      const jsonStart = cleaned.indexOf('[');
      const jsonEnd = cleaned.lastIndexOf(']') + 1;

      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('No JSON array found');
      }

      mainIdeas = JSON.parse(cleaned.substring(jsonStart, jsonEnd));
    } catch (_parseError) {
      // Fallback with article-specific ideas
      mainIdeas = [
        { id: 1, title: `Key Strategy from "${title}"`, description: "Primary strategic insight from the article content." },
        { id: 2, title: "Implementation Approach", description: "How to practically apply the concepts discussed." },
        { id: 3, title: "Industry Impact", description: "Broader implications for the field." },
        { id: 4, title: "Best Practices", description: "Recommended approaches from the article." },
        { id: 5, title: "Common Challenges", description: "Problems and solutions addressed." },
        { id: 6, title: "Future Outlook", description: "Where this trend is heading." }
      ];
    }

    return NextResponse.json({
      success: true,
      data: { mainIdeas }
    });

  } catch (error) {
    console.error('Ideas extraction error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to extract main ideas'
    }, { status: 500 });
  }
}
