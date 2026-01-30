import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const { title, content } = await request.json();

    if (!content || content.length < 200) {
      return NextResponse.json({ success: false, error: 'Content too short' }, { status: 400 });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return NextResponse.json({ success: false, error: 'Groq API key not configured' }, { status: 500 });
    }

    const systemPrompt = `You are a content strategist analyzing an article to extract SPECIFIC, CONCRETE main ideas.

CRITICAL RULES:
1. Each idea MUST include SPECIFIC facts, numbers, or examples from the article
2. NEVER use generic titles like "Core Message", "Key Takeaway", "Main Idea"
3. Each description must be 80-120 words with concrete details
4. Extract 6 completely DIFFERENT ideas - no overlap

EXAMPLE OF GOOD OUTPUT:
{
  "id": 1,
  "title": "Loop Marketing Creates 47% Higher Customer Retention",
  "description": "The article reveals that companies implementing loop marketing strategies see 47% higher customer retention compared to traditional linear funnels. This approach focuses on creating continuous engagement cycles rather than one-time conversions. Key components include post-purchase nurturing, referral programs integrated into the product experience, and community-driven content that keeps customers engaged long after the initial sale. HubSpot's own data shows their loop marketing approach generated 3x more qualified leads from existing customers than from cold outreach."
}

Return ONLY a JSON array with 6 ideas. No markdown, no explanation.`;

    const userPrompt = `Analyze this article and extract 6 SPECIFIC main ideas with detailed descriptions.

ARTICLE TITLE: ${title}

ARTICLE CONTENT:
${content.substring(0, 4000)}

Extract 6 ideas. Each must have:
- Specific title (include numbers/facts if available)
- 80-120 word description with concrete details from the article
- Different focus than other ideas

Return as JSON array:
[{"id":1,"title":"Specific title with detail","description":"80-120 word description with facts"},...]`;

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
        max_tokens: 2500,
      }),
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.json().catch(() => ({}));
      return NextResponse.json({
        success: false,
        error: `AI failed: ${errorData.error?.message || groqResponse.statusText}`
      }, { status: 500 });
    }

    const groqData = await groqResponse.json();
    const aiContent = groqData.choices?.[0]?.message?.content || '';

    // Parse JSON
    let mainIdeas;
    try {
      let cleaned = aiContent.replace(/```json|```/g, '').trim();
      const jsonStart = cleaned.indexOf('[');
      const jsonEnd = cleaned.lastIndexOf(']') + 1;

      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('No JSON array found');
      }

      mainIdeas = JSON.parse(cleaned.substring(jsonStart, jsonEnd));

      // Validate - reject generic ideas
      for (const idea of mainIdeas) {
        if (idea.title.includes('Core Message') ||
            idea.title.includes('Key Takeaway') ||
            idea.title.includes('Main Idea') ||
            idea.title.length < 20) {
          throw new Error('Generic idea detected');
        }
      }

    } catch (_parseError) {
      // Create article-specific fallback ideas
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 30).slice(0, 12);

      mainIdeas = [
        {
          id: 1,
          title: `Strategic Insight: ${title.substring(0, 50)}`,
          description: sentences[0] ? sentences[0].trim() + '. ' + (sentences[1] || '').trim() : `Key strategic insight from "${title}" that shapes how professionals approach this topic.`
        },
        {
          id: 2,
          title: `Implementation Framework from ${title.split(' ').slice(0, 4).join(' ')}`,
          description: sentences[2] ? sentences[2].trim() + '. ' + (sentences[3] || '').trim() : `Practical framework for implementing the concepts discussed in the article.`
        },
        {
          id: 3,
          title: `Market Impact: How This Changes the Industry`,
          description: sentences[4] ? sentences[4].trim() + '. ' + (sentences[5] || '').trim() : `The broader industry implications and market shifts driven by these trends.`
        },
        {
          id: 4,
          title: `Data-Driven Approach to ${title.split(' ').slice(0, 3).join(' ')}`,
          description: sentences[6] ? sentences[6].trim() + '. ' + (sentences[7] || '').trim() : `Evidence-based methodology for measuring and optimizing results.`
        },
        {
          id: 5,
          title: `Common Pitfalls and How to Avoid Them`,
          description: sentences[8] ? sentences[8].trim() + '. ' + (sentences[9] || '').trim() : `Critical mistakes to avoid and proven strategies for success.`
        },
        {
          id: 6,
          title: `Future Outlook: Where This Trend Is Heading`,
          description: sentences[10] ? sentences[10].trim() + '. ' + (sentences[11] || '').trim() : `Predictions and emerging opportunities in this evolving landscape.`
        }
      ];
    }

    return NextResponse.json({
      success: true,
      data: { mainIdeas: mainIdeas.slice(0, 6) }
    });

  } catch (error) {
    console.error('Ideas extraction error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to extract main ideas'
    }, { status: 500 });
  }
}
