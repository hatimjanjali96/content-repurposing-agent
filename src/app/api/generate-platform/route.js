import { NextResponse } from 'next/server';

export const runtime = 'edge';

const PLATFORM_CONFIGS = {
  linkedin: {
    system: `You are a LinkedIn content expert creating professional thought-leadership posts.

CRITICAL REQUIREMENTS:
- Each post MUST be 150-200 words (count them!)
- Use SPECIFIC details from the main idea provided
- NO generic phrases like "Discover the future" or "Game-changing"
- Write like a human expert, not AI
- Include 3-5 relevant hashtags at the end
- End with a genuine discussion question`,

    prompt: (title, content, ideas, brandVoice) => {
      const idea1 = ideas[0] || { title: 'Key Insight', description: 'Important insight' };
      const idea2 = ideas[1] || ideas[0] || { title: 'Key Insight', description: 'Important insight' };
      const idea3 = ideas[2] || ideas[0] || { title: 'Key Insight', description: 'Important insight' };

      return `Create 3 LinkedIn posts based on these SPECIFIC ideas. Each post MUST be 150-200 words.

ARTICLE: "${title}"

POST 1 - STORYTELLING FORMAT (use this idea):
Idea: ${idea1.title}
Details: ${idea1.description}
Write a story-driven post. Start with a scenario or observation, build to the insight, end with a question.

POST 2 - DATA/INSIGHTS FORMAT (use this idea):
Idea: ${idea2.title}
Details: ${idea2.description}
Lead with a surprising fact or statistic. Explain implications. Ask for others' experience.

POST 3 - ACTIONABLE TIPS FORMAT (use this idea):
Idea: ${idea3.title}
Details: ${idea3.description}
Provide 3-4 specific actionable tips. Use numbered list format. End with implementation question.

Brand voice: ${brandVoice}

Return as JSON array. Each post MUST be 150-200 words:
[{"format":"storytelling","content":"Full 150-200 word post with hashtags"},{"format":"data-driven","content":"..."},{"format":"actionable","content":"..."}]`;
    }
  },

  instagram: {
    system: `You are an Instagram content expert creating visual-first captions.

REQUIREMENTS:
- Captions: 80-120 words each
- Include 5-8 emojis naturally integrated
- Include 10-15 relevant hashtags
- Describe visual concept for each post`,

    prompt: (title, content, ideas, brandVoice) => {
      const idea1 = ideas[3] || ideas[0];
      const idea2 = ideas[4] || ideas[1] || ideas[0];

      return `Create 2 Instagram posts with captions and design briefs.

ARTICLE: "${title}"

POST 1 - INSPIRATIONAL (use this idea):
Idea: ${idea1.title}
Details: ${idea1.description}
Caption: 100-120 words, inspirational tone, 5-8 emojis, end with CTA

POST 2 - EDUCATIONAL (use this idea):
Idea: ${idea2.title}
Details: ${idea2.description}
Caption: 80-100 words, educational tone, 5-8 emojis, quick tips format

Brand voice: ${brandVoice}

Return JSON:
[{"style":"inspirational","caption":"Full caption with emojis","hashtags":["tag1","tag2",...],"visualConcept":"Describe the ideal image/graphic"},{"style":"educational","caption":"...","hashtags":[...],"visualConcept":"..."}]`;
    }
  },

  twitter: {
    system: `You are a Twitter/X thread expert creating engaging, informative threads.

REQUIREMENTS:
- Each tweet: 200-280 characters (use the space!)
- Thread 1: 6 tweets
- Thread 2: 5 tweets
- Tweet 1: Strong hook
- Final tweet: CTA`,

    prompt: (title, _content, ideas, _brandVoice) => {
      const idea1 = ideas[0] || { title: 'Key Insight', description: 'Details' };
      const idea2 = ideas[1] || ideas[0];

      return `Create 2 Twitter threads.

ARTICLE: "${title}"

THREAD 1 - HOW-TO (6 tweets, use this idea):
Idea: ${idea1.title}
Details: ${idea1.description}
Structure: Hook → Problem → Steps 1-3 → Summary → CTA

THREAD 2 - INSIGHTS (5 tweets, use this idea):
Idea: ${idea2.title}
Details: ${idea2.description}
Structure: Hook → Insight 1 → Insight 2 → Implication → CTA

Each tweet should be 200-280 characters. Use the space!

Return JSON:
[{"style":"how-to","tweets":["Tweet 1 (200-280 chars)","Tweet 2",...]},{"style":"insights","tweets":[...]}]`;
    }
  },

  facebook: {
    system: `You are a Facebook content expert creating community-focused posts.

REQUIREMENTS:
- Post 1: 200-250 words (educational)
- Post 2: 150-180 words (conversational)
- Focus on sparking discussion
- End with engaging question
- Use 2-4 emojis sparingly`,

    prompt: (title, content, ideas, brandVoice) => {
      const idea1 = ideas[1] || ideas[0];
      const idea2 = ideas[2] || ideas[0];

      return `Create 2 Facebook posts.

ARTICLE: "${title}"

POST 1 - EDUCATIONAL (200-250 words, use this idea):
Idea: ${idea1.title}
Details: ${idea1.description}
Share knowledge, provide value, spark discussion. End with question.

POST 2 - CONVERSATIONAL (150-180 words, use this idea):
Idea: ${idea2.title}
Details: ${idea2.description}
Personal, relatable tone. Ask for community input.

Brand voice: ${brandVoice}

Return JSON:
[{"style":"educational","content":"Full 200-250 word post"},{"style":"conversational","content":"Full 150-180 word post"}]`;
    }
  },

  linkedinPulse: {
    system: `You are writing a comprehensive LinkedIn Pulse article.

CRITICAL: Article MUST be 600-800 words. This is NOT optional.

Structure required:
- Compelling headline
- Hook opening (2-3 sentences)
- 3-4 main sections with ## headers
- Specific examples throughout
- Strong conclusion with CTA`,

    prompt: (title, content, ideas, brandVoice) => {
      const allIdeas = ideas.map(i => `- ${i.title}: ${i.description}`).join('\n');

      return `Write a COMPLETE 600-800 word LinkedIn Pulse article.

TOPIC: ${title}

KEY IDEAS TO COVER:
${allIdeas}

CONTEXT FROM ARTICLE:
${content.substring(0, 2000)}

STRUCTURE (600-800 words total):
# [Compelling Headline]

[Hook - 2-3 sentences that grab attention]

## The Current Landscape (150-200 words)
[Set context, explain the shift happening]

## Key Insights (200-250 words)
[Deep dive into main findings with specific examples]

## Practical Implications (150-200 words)
[What this means for professionals, actionable takeaways]

## Looking Ahead (100-150 words)
[Future outlook, call to action, discussion question]

Brand voice: ${brandVoice}

Return JSON:
{"headline":"Compelling headline","content":"Full 600-800 word article with ## section headers"}`;
    }
  },

  substack: {
    system: `You are writing a Substack newsletter with personal, storytelling tone.

CRITICAL: Newsletter MUST be 600-800 words.

Tone: Personal, conversational, like writing to a friend
Structure: Personal opening → Main insights → Practical takeaways → Community question`,

    prompt: (title, content, ideas, brandVoice) => {
      const allIdeas = ideas.map(i => `- ${i.title}: ${i.description}`).join('\n');

      return `Write a COMPLETE 600-800 word Substack newsletter.

TOPIC: ${title}

KEY IDEAS:
${allIdeas}

CONTEXT:
${content.substring(0, 2000)}

STRUCTURE (600-800 words):
Subject: [Compelling subject line - personal, intriguing]

[Personal opening - 100 words - story or observation that connects]

[Main insight #1 - 200 words - conversational deep dive]

[Main insight #2 - 200 words - practical application]

[Takeaways section - 100 words - bullet points]

[Closing - 100 words - personal reflection, question for readers]

Brand voice: ${brandVoice}

Return JSON:
{"subject":"Email subject line","content":"Full 600-800 word newsletter"}`;
    }
  }
};

export async function POST(request) {
  try {
    const { platform, title, content, mainIdeas, brandVoice } = await request.json();

    if (!platform || !PLATFORM_CONFIGS[platform]) {
      return NextResponse.json({
        success: false,
        error: `Invalid platform. Valid: ${Object.keys(PLATFORM_CONFIGS).join(', ')}`
      }, { status: 400 });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return NextResponse.json({ success: false, error: 'Groq API key not configured' }, { status: 500 });
    }

    const config = PLATFORM_CONFIGS[platform];
    const prompt = config.prompt(title, content, mainIdeas || [], brandVoice || 'Professional, engaging');

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: config.system },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: platform === 'linkedinPulse' || platform === 'substack' ? 3000 : 2000,
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
    let parsedContent;
    try {
      let cleaned = aiContent.replace(/```json|```/g, '').trim();

      // Find JSON
      const isArray = platform === 'linkedin' || platform === 'instagram' || platform === 'twitter' || platform === 'facebook';
      const startChar = isArray ? '[' : '{';
      const endChar = isArray ? ']' : '}';

      const jsonStart = cleaned.indexOf(startChar);
      const jsonEnd = cleaned.lastIndexOf(endChar) + 1;

      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('No JSON found');
      }

      // Clean common issues
      let jsonStr = cleaned.substring(jsonStart, jsonEnd)
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']')
        .replace(/[\x00-\x1F\x7F]/g, ' ');

      parsedContent = JSON.parse(jsonStr);
    } catch (_parseError) {
      console.error('Parse error, using fallback for', platform);
      return NextResponse.json({
        success: true,
        data: { platform, content: getFallbackContent(platform, title, mainIdeas) }
      });
    }

    // Format the response
    const formattedContent = formatPlatformContent(platform, parsedContent, mainIdeas);

    return NextResponse.json({
      success: true,
      data: { platform, content: formattedContent }
    });

  } catch (error) {
    console.error('Platform generation error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Content generation failed'
    }, { status: 500 });
  }
}

function formatPlatformContent(platform, parsed, mainIdeas) {
  switch (platform) {
    case 'linkedin':
      return (Array.isArray(parsed) ? parsed : [parsed]).map((post, i) => ({
        format: post.format || ['storytelling', 'data-driven', 'actionable'][i] || 'insight',
        mainIdeaId: (mainIdeas[i]?.id) || i + 1,
        mainIdeaTitle: mainIdeas[i]?.title || 'Key Insight',
        content: post.content || '',
        wordCount: (post.content || '').split(/\s+/).length,
        platform: 'LinkedIn'
      }));

    case 'instagram':
      return (Array.isArray(parsed) ? parsed : [parsed]).map((post, i) => ({
        mainIdeaId: (mainIdeas[i + 3]?.id) || i + 1,
        mainIdeaTitle: mainIdeas[i + 3]?.title || 'Key Insight',
        style: post.style || 'visual',
        caption: post.caption || '',
        hashtags: post.hashtags || [],
        designBrief: {
          visualConcept: post.visualConcept || 'Modern, clean design with bold typography',
          colorPalette: ['#3B82F6', '#1E293B', '#F8FAFC', '#10B981'],
          typography: 'Sans-serif, bold headlines',
          layout: 'Centered composition with text overlay',
          stockPhotoKeywords: ['business', 'technology', 'growth', 'success']
        },
        platform: 'Instagram'
      }));

    case 'twitter':
      return (Array.isArray(parsed) ? parsed : [parsed]).map((thread, i) => ({
        style: thread.style || 'thread',
        mainIdeaId: (mainIdeas[i]?.id) || i + 1,
        mainIdeaTitle: mainIdeas[i]?.title || 'Key Insight',
        tweets: (thread.tweets || []).map((text, j) => ({
          tweetNumber: j + 1,
          text: String(text).substring(0, 280)
        })),
        platform: 'Twitter/X'
      }));

    case 'facebook':
      return (Array.isArray(parsed) ? parsed : [parsed]).map((post, i) => ({
        style: post.style || 'engaging',
        mainIdeaId: (mainIdeas[i + 1]?.id) || i + 1,
        mainIdeaTitle: mainIdeas[i + 1]?.title || 'Key Insight',
        content: post.content || '',
        wordCount: (post.content || '').split(/\s+/).length,
        platform: 'Facebook'
      }));

    case 'linkedinPulse':
      return {
        mainIdeaId: mainIdeas[0]?.id || 1,
        mainIdeaTitle: mainIdeas[0]?.title || 'Key Insight',
        headline: parsed.headline || '',
        content: parsed.content || '',
        wordCount: (parsed.content || '').split(/\s+/).length,
        platform: 'LinkedIn Pulse'
      };

    case 'substack':
      return {
        mainIdeaId: mainIdeas[1]?.id || 1,
        mainIdeaTitle: mainIdeas[1]?.title || 'Key Insight',
        subject: parsed.subject || '',
        content: parsed.content || '',
        wordCount: (parsed.content || '').split(/\s+/).length,
        platform: 'Substack'
      };

    default:
      return parsed;
  }
}

function getFallbackContent(platform, title, mainIdeas) {
  const idea = mainIdeas?.[0] || { id: 1, title: 'Key Insight', description: 'Important insight from the article that professionals should consider.' };

  switch (platform) {
    case 'linkedin':
      return [{
        format: 'insight',
        mainIdeaId: 1,
        mainIdeaTitle: idea.title,
        content: `${idea.title}\n\n${idea.description}\n\nThis represents a significant shift in how we approach this challenge. The implications are clear: those who adapt early will have a competitive advantage.\n\nWhat's your experience with this? I'd love to hear how others are approaching this shift.\n\n#Business #Strategy #Innovation #Leadership`,
        wordCount: 60,
        platform: 'LinkedIn'
      }];

    case 'instagram':
      return [{
        mainIdeaId: 1,
        mainIdeaTitle: idea.title,
        style: 'visual',
        caption: `✨ ${idea.title}\n\n${idea.description}\n\n💡 Key takeaway: Stay ahead of the curve.\n\nDouble tap if this resonates! 👇\n\n#Business #Growth #Success #Strategy #Innovation #Tips #Insights`,
        hashtags: ['business', 'growth', 'success', 'strategy', 'innovation', 'tips', 'insights'],
        designBrief: {
          visualConcept: 'Modern gradient background with bold white text overlay',
          colorPalette: ['#3B82F6', '#1E293B', '#F8FAFC', '#10B981'],
          typography: 'Bold sans-serif',
          layout: 'Centered with icon accent',
          stockPhotoKeywords: ['business', 'technology', 'success']
        },
        platform: 'Instagram'
      }];

    case 'twitter':
      return [{
        style: 'thread',
        mainIdeaId: 1,
        mainIdeaTitle: idea.title,
        tweets: [
          { tweetNumber: 1, text: `🧵 ${idea.title}\n\nHere's what you need to know:` },
          { tweetNumber: 2, text: idea.description?.substring(0, 270) || 'Key insight from the research.' },
          { tweetNumber: 3, text: 'The implications are significant for anyone in this space.' },
          { tweetNumber: 4, text: 'Follow for more insights like this! 🚀' }
        ],
        platform: 'Twitter/X'
      }];

    case 'facebook':
      return [{
        style: 'engaging',
        mainIdeaId: 1,
        mainIdeaTitle: idea.title,
        content: `${idea.title}\n\n${idea.description}\n\nThis is something I've been thinking about a lot lately. The landscape is shifting, and it's fascinating to see how different people are responding.\n\nWhat's your take on this? Have you noticed similar trends in your work? I'd love to hear your perspective! 👇`,
        wordCount: 60,
        platform: 'Facebook'
      }];

    case 'linkedinPulse':
      return {
        mainIdeaId: 1,
        mainIdeaTitle: idea.title,
        headline: `Understanding ${idea.title}: A Deep Dive`,
        content: `# Understanding ${idea.title}: A Deep Dive\n\n${idea.description}\n\n## The Shifting Landscape\n\nThe way we approach this challenge is evolving rapidly. What worked yesterday may not work tomorrow.\n\n## Key Insights\n\nBased on recent developments, several patterns emerge that deserve attention.\n\n## What This Means For You\n\nThe practical implications are clear: adapt or risk falling behind.\n\n## Moving Forward\n\nWhat steps are you taking to stay ahead? Share your thoughts in the comments.`,
        wordCount: 120,
        platform: 'LinkedIn Pulse'
      };

    case 'substack':
      return {
        mainIdeaId: 1,
        mainIdeaTitle: idea.title,
        subject: `What I learned about ${idea.title}`,
        content: `Subject: What I learned about ${idea.title}\n\nHey there,\n\nI've been diving deep into this topic lately, and I wanted to share some thoughts with you.\n\n${idea.description}\n\nThe more I explore this, the more I realize how much is changing. And fast.\n\n**Key Takeaways:**\n- Pay attention to the trends\n- Adapt your approach\n- Stay curious\n\nI'd love to hear what you think. Hit reply and let me know!\n\nUntil next time.`,
        wordCount: 100,
        platform: 'Substack'
      };

    default:
      return null;
  }
}
