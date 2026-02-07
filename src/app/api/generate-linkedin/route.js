import { NextResponse } from 'next/server';

export const runtime = 'edge';

// 14 different post formats/angles for variety
const POST_FORMATS = [
  { type: 'story', instruction: 'Tell a specific story or scenario. Start with "I was..." or "Last week..." or a vivid scene.' },
  { type: 'data-insight', instruction: 'Lead with a surprising statistic or data point. Explain what it means.' },
  { type: 'contrarian', instruction: 'Challenge a common belief. Start with "Most people think X, but actually..."' },
  { type: 'how-to', instruction: 'Provide 3-4 actionable steps. Use numbered list format.' },
  { type: 'question', instruction: 'Start with a thought-provoking question. Explore the answer.' },
  { type: 'lesson-learned', instruction: 'Share a personal lesson. "Here\'s what I learned about..."' },
  { type: 'myth-buster', instruction: 'Debunk a common myth. "Myth: X. Reality: Y."' },
  { type: 'prediction', instruction: 'Make a bold prediction about the future based on current trends.' },
  { type: 'comparison', instruction: 'Compare two approaches. "X vs Y: Here\'s what the data shows..."' },
  { type: 'quick-tips', instruction: 'Share 5 quick tips in bullet format. Make each actionable.' },
  { type: 'case-study', instruction: 'Present a mini case study. Problem → Solution → Result.' },
  { type: 'behind-scenes', instruction: 'Share insider knowledge. "What most people don\'t see is..."' },
  { type: 'framework', instruction: 'Present a simple framework. Give it a memorable name.' },
  { type: 'mistake', instruction: 'Describe a common mistake and how to avoid it.' },
  { type: 'trend-analysis', instruction: 'Analyze an emerging trend. What it means, why it matters.' },
  { type: 'quote-expansion', instruction: 'Start with a relevant quote, then expand on its meaning.' },
  { type: 'before-after', instruction: 'Show transformation. Before this approach vs After.' },
  { type: 'unpopular-opinion', instruction: 'Share an unpopular opinion with reasoning. "Unpopular opinion:..."' },
  { type: 'checklist', instruction: 'Provide a checklist for success. "Before you X, make sure you..."' },
  { type: 'analogy', instruction: 'Use a powerful analogy to explain a complex concept.' },
  { type: 'call-to-action', instruction: 'Inspire action. End with a strong CTA for immediate implementation.' }
];

export async function POST(request) {
  try {
    const { title, content, mainIdeas, batch, brandVoice } = await request.json();

    if (!content) {
      return NextResponse.json({ success: false, error: 'Content is required' }, { status: 400 });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return NextResponse.json({ success: false, error: 'Groq API key not configured' }, { status: 500 });
    }

    // Determine which posts to generate based on batch (0, 1, or 2)
    const batchNum = batch || 0;
    const startIdx = batchNum * 7;
    const endIdx = Math.min(startIdx + 7, 14);
    const formatsToUse = POST_FORMATS.slice(startIdx, endIdx);

    // Build ideas string
    const ideasStr = (mainIdeas || []).map((idea, i) =>
      `Idea ${i + 1}: ${idea.title}\nDetails: ${idea.description}`
    ).join('\n\n');

    const systemPrompt = `You are a LinkedIn content expert creating professional, engaging posts.

CRITICAL REQUIREMENTS:
- Each post MUST be 150-200 words (this is mandatory!)
- Use SPECIFIC details from the article and ideas provided
- NO generic phrases like "Discover the future" or "Game-changing" or "In today's world"
- Write like a human thought leader, not AI
- Each post must have a different angle/format as specified
- Include 3-5 relevant hashtags at the end of each post
- End each post with an engaging question for discussion

Brand voice: ${brandVoice || 'Professional, insightful, conversational'}`;

    const userPrompt = `Create ${formatsToUse.length} LinkedIn posts based on this article. Each post MUST be 150-200 words.

ARTICLE TITLE: "${title}"

KEY IDEAS FROM ARTICLE:
${ideasStr}

ARTICLE EXCERPT:
${content.substring(0, 2500)}

CREATE THESE ${formatsToUse.length} POSTS (posts ${startIdx + 1} to ${endIdx}):

${formatsToUse.map((format, i) => `
POST ${startIdx + i + 1} - ${format.type.toUpperCase()} FORMAT:
${format.instruction}
Use one of the key ideas above. Write 150-200 words.
`).join('\n')}

Return as JSON array. Each post MUST be 150-200 words with hashtags:
[{"postNumber":${startIdx + 1},"format":"${formatsToUse[0]?.type}","content":"Full 150-200 word post ending with question and hashtags"},...]`;

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
        temperature: 0.8, // Slightly higher for more variety
        max_tokens: 4000,
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

    // Parse the response
    let posts;
    try {
      let cleaned = aiContent.replace(/```json|```/g, '').trim();
      const jsonStart = cleaned.indexOf('[');
      const jsonEnd = cleaned.lastIndexOf(']') + 1;

      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('No JSON array found');
      }

      let jsonStr = cleaned.substring(jsonStart, jsonEnd)
        .replace(/,\s*]/g, ']')
        .replace(/,\s*}/g, '}')
        .replace(/[\x00-\x1F\x7F]/g, ' ');

      posts = JSON.parse(jsonStr);
    } catch (_parseError) {
      console.error('Parse error, generating fallback posts');
      // Generate fallback posts
      posts = formatsToUse.map((format, i) => ({
        postNumber: startIdx + i + 1,
        format: format.type,
        content: generateFallbackPost(title, mainIdeas, format, startIdx + i + 1)
      }));
    }

    // Format and validate posts
    const formattedPosts = posts.map((post, i) => {
      const format = formatsToUse[i] || formatsToUse[0];
      const postContent = post.content || '';
      const wordCount = postContent.split(/\s+/).length;

      return {
        postNumber: post.postNumber || startIdx + i + 1,
        format: post.format || format.type,
        formatDescription: format.instruction,
        content: postContent,
        wordCount,
        ideaUsed: mainIdeas?.[i % (mainIdeas?.length || 1)]?.title || 'Key Insight'
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        batch: batchNum,
        posts: formattedPosts,
        totalGenerated: formattedPosts.length
      }
    });

  } catch (error) {
    console.error('LinkedIn generation error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to generate LinkedIn posts'
    }, { status: 500 });
  }
}

function generateFallbackPost(title, mainIdeas, format, postNum) {
  const idea = mainIdeas?.[postNum % (mainIdeas?.length || 1)] || {
    title: 'Key Insight',
    description: 'Important takeaway from the article'
  };

  const templates = {
    'story': `I was reviewing the latest insights on ${title} when something clicked.\n\n${idea.description}\n\nThis isn't just theory—it's a fundamental shift in how we need to approach our work.\n\nThe professionals who recognize this early will have a significant advantage. Those who don't will find themselves playing catch-up.\n\nI've seen this pattern before, and the results are always the same: adapt early, win big.\n\nWhat's your experience with this? Have you noticed similar shifts in your industry?\n\n#Business #Strategy #Leadership #ProfessionalDevelopment`,

    'data-insight': `Here's a data point that should make you pause: ${idea.title}\n\n${idea.description}\n\nWhat does this mean in practice?\n\nIt means the old playbook is becoming obsolete. The strategies that worked 2-3 years ago are now table stakes at best.\n\nThe real competitive advantage lies in understanding these shifts and adapting your approach accordingly.\n\nI'm curious—are you seeing similar patterns in your data? What metrics are you tracking?\n\n#Data #Insights #BusinessStrategy #Analytics`,

    'how-to': `Want to leverage insights from ${title}? Here's how:\n\n1. Start by auditing your current approach\n2. Identify the gaps based on ${idea.title}\n3. Implement changes incrementally\n4. Measure and iterate\n\n${idea.description}\n\nThe key is consistency. Small improvements compound over time.\n\nWhich step do you find most challenging? Let me know in the comments.\n\n#HowTo #Strategy #Implementation #Growth`,

    'question': `Here's a question I've been thinking about: ${idea.title}\n\n${idea.description}\n\nThis isn't just an academic exercise. The answer has real implications for how we work, lead, and create value.\n\nI'd love to hear your perspective. Drop your thoughts below.\n\n#ThoughtLeadership #Discussion #ProfessionalGrowth`,

    'contrarian': `Most people think they understand ${title}. But here's what they're missing:\n\n${idea.description}\n\nThe conventional wisdom often leads us astray. The real insight lies in questioning our assumptions.\n\nWhat conventional wisdom are you challenging in your work?\n\n#Contrarian #Innovation #CriticalThinking`
  };

  return templates[format.type] || templates['story'];
}
