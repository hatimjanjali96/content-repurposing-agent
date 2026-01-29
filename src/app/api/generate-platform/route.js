import { NextResponse } from 'next/server';

export const runtime = 'edge';

const PLATFORM_PROMPTS = {
  linkedin: {
    system: `You are a LinkedIn content expert. Create professional, thought-leadership posts.
Each post must be 150-200 words with substance, specific examples, and clear value.
Never use generic phrases like "Discover the future" or "Game-changing".`,
    prompt: (title, content, ideas, brandVoice) => `Create 3 LinkedIn posts based on this article. Each post must use a DIFFERENT main idea.

ARTICLE: "${title}"
KEY CONTENT: ${content.substring(0, 1500)}

MAIN IDEAS TO USE (one per post):
${ideas.slice(0, 3).map((idea, i) => `${i + 1}. ${idea.title}: ${idea.description}`).join('\n')}

REQUIREMENTS FOR EACH POST:
- 150-200 words (MANDATORY - not less!)
- Start with a compelling hook (not "Discover...")
- Include SPECIFIC facts or examples
- End with engaging question
- Add 3-5 relevant hashtags
- Format: storytelling for post 1, data-driven for post 2, actionable tips for post 3

Brand voice: ${brandVoice}

Return JSON array with 3 posts:
[{"format":"storytelling","content":"Full 150-200 word post with hashtags"},{"format":"data-driven","content":"..."},{"format":"actionable","content":"..."}]`
  },

  instagram: {
    system: `You are an Instagram content expert. Create engaging, visual-first captions.
Captions should be 80-120 words with emojis and 10-15 hashtags.`,
    prompt: (title, content, ideas, brandVoice) => `Create 2 Instagram post captions based on this article.

ARTICLE: "${title}"
CONTENT: ${content.substring(0, 1000)}

MAIN IDEAS:
${ideas.slice(3, 5).map((idea, i) => `${i + 1}. ${idea.title}: ${idea.description}`).join('\n')}

REQUIREMENTS:
- Caption 1: Inspirational/aspirational (100-125 words)
- Caption 2: Educational/informative (80-100 words)
- Use 5-8 relevant emojis per caption
- Include 10-15 hashtags at the end
- Include a visual concept description for each

Brand voice: ${brandVoice}

Return JSON:
[{"style":"inspirational","caption":"Caption with emojis and hashtags","visualConcept":"Describe ideal image"},{"style":"educational","caption":"...","visualConcept":"..."}]`
  },

  twitter: {
    system: `You are a Twitter/X thread expert. Create engaging, informative threads.
Each tweet must be under 280 characters but substantial.`,
    prompt: (title, content, ideas, brandVoice) => `Create 2 Twitter threads based on this article. Each thread should have 5-6 tweets.

ARTICLE: "${title}"
CONTENT: ${content.substring(0, 1200)}

MAIN IDEAS:
${ideas.slice(0, 2).map((idea, i) => `${i + 1}. ${idea.title}: ${idea.description}`).join('\n')}

REQUIREMENTS:
- Thread 1: How-to/educational style (6 tweets)
- Thread 2: Insights/analysis style (5 tweets)
- Tweet 1: Hook that grabs attention
- Each tweet: 180-280 characters, valuable standalone
- Final tweet: CTA

Brand voice: ${brandVoice}

Return JSON:
[{"style":"how-to","tweets":["Tweet 1...","Tweet 2...","Tweet 3...","Tweet 4...","Tweet 5...","Tweet 6..."]},{"style":"insights","tweets":["..."]}]`
  },

  facebook: {
    system: `You are a Facebook content expert. Create community-focused, conversational posts.
Posts should be 150-250 words and encourage discussion.`,
    prompt: (title, content, ideas, brandVoice) => `Create 2 Facebook posts based on this article.

ARTICLE: "${title}"
CONTENT: ${content.substring(0, 1200)}

MAIN IDEAS:
${ideas.slice(1, 3).map((idea, i) => `${i + 1}. ${idea.title}: ${idea.description}`).join('\n')}

REQUIREMENTS:
- Post 1: Educational/long-form (200-250 words)
- Post 2: Conversational/relatable (150-180 words)
- Focus on community discussion
- End with thought-provoking question
- Use 1-3 emojis sparingly

Brand voice: ${brandVoice}

Return JSON:
[{"style":"educational","content":"Full 200-250 word post"},{"style":"conversational","content":"Full 150-180 word post"}]`
  },

  linkedinPulse: {
    system: `You are a thought leadership article writer. Create comprehensive, authoritative articles.
Articles must be 600-800 words with clear structure and sections.`,
    prompt: (title, content, ideas, brandVoice) => `Write a LinkedIn Pulse article based on this content.

ARTICLE: "${title}"
FULL CONTENT: ${content.substring(0, 2500)}

MAIN IDEAS TO COVER:
${ideas.map((idea, i) => `${i + 1}. ${idea.title}: ${idea.description}`).join('\n')}

STRUCTURE (600-800 words total):
1. Compelling headline
2. Hook opening (2-3 sentences)
3. ## Section 1: The Context (150 words)
4. ## Section 2: Key Insights (200 words)
5. ## Section 3: Practical Application (150 words)
6. ## Section 4: Looking Ahead (100 words)
7. Conclusion with CTA

Brand voice: ${brandVoice}

Return JSON:
{"headline":"Compelling headline","content":"Full 600-800 word article with ## section headers"}`
  },

  substack: {
    system: `You are a newsletter writer. Create personal, engaging newsletters.
Newsletters should be 600-800 words with a personal, storytelling tone.`,
    prompt: (title, content, ideas, brandVoice) => `Write a Substack newsletter based on this content.

ARTICLE: "${title}"
CONTENT: ${content.substring(0, 2500)}

KEY IDEAS:
${ideas.map((idea, i) => `${i + 1}. ${idea.title}: ${idea.description}`).join('\n')}

STRUCTURE (600-800 words):
1. Subject line (compelling, personal)
2. Personal opening (connect with reader)
3. Main insight (storytelling approach)
4. Practical takeaways
5. Community CTA (ask for replies)

Brand voice: ${brandVoice}

Return JSON:
{"subject":"Email subject line","content":"Full 600-800 word newsletter"}`
  }
};

export async function POST(request) {
  try {
    const { platform, title, content, mainIdeas, brandVoice } = await request.json();

    if (!platform || !PLATFORM_PROMPTS[platform]) {
      return NextResponse.json({
        success: false,
        error: `Invalid platform. Valid: ${Object.keys(PLATFORM_PROMPTS).join(', ')}`
      }, { status: 400 });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return NextResponse.json({ success: false, error: 'Groq API key not configured' }, { status: 500 });
    }

    const platformConfig = PLATFORM_PROMPTS[platform];
    const prompt = platformConfig.prompt(title, content, mainIdeas || [], brandVoice || 'Professional, engaging');

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: platformConfig.system },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2500,
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
      const cleaned = aiContent.replace(/```json|```/g, '').trim();
      const jsonStart = cleaned.indexOf(/^\[/.test(cleaned) ? '[' : '{');
      const jsonEnd = cleaned.lastIndexOf(/^\[/.test(cleaned) ? ']' : '}') + 1;

      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('No JSON found');
      }

      parsedContent = JSON.parse(cleaned.substring(jsonStart, jsonEnd));
    } catch (parseError) {
      console.error('Parse error:', parseError.message);
      return NextResponse.json({
        success: true,
        data: { platform, content: getFallbackContent(platform, title, mainIdeas) }
      });
    }

    // Format the response based on platform
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
        format: post.format || ['storytelling', 'data-driven', 'actionable'][i],
        mainIdeaId: (mainIdeas[i]?.id) || i + 1,
        content: post.content || '',
        wordCount: (post.content || '').split(/\s+/).length,
        platform: 'LinkedIn'
      }));

    case 'instagram':
      return (Array.isArray(parsed) ? parsed : [parsed]).map((post, i) => ({
        mainIdeaId: (mainIdeas[i + 3]?.id) || i + 1,
        style: post.style || 'visual',
        caption: post.caption || '',
        designBrief: {
          visualConcept: post.visualConcept || 'Modern, clean design',
          colorPalette: ['#3B82F6', '#1E293B', '#F8FAFC'],
          typography: 'Sans-serif, bold',
          layout: 'Centered composition',
          stockPhotoKeywords: ['business', 'technology', 'growth']
        },
        platform: 'Instagram'
      }));

    case 'twitter':
      return (Array.isArray(parsed) ? parsed : [parsed]).map((thread, i) => ({
        style: thread.style || 'thread',
        mainIdeaId: (mainIdeas[i]?.id) || i + 1,
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
        content: post.content || '',
        wordCount: (post.content || '').split(/\s+/).length,
        platform: 'Facebook'
      }));

    case 'linkedinPulse':
      return {
        mainIdeaId: mainIdeas[0]?.id || 1,
        headline: parsed.headline || '',
        content: parsed.content || '',
        wordCount: (parsed.content || '').split(/\s+/).length,
        platform: 'LinkedIn Pulse'
      };

    case 'substack':
      return {
        mainIdeaId: mainIdeas[1]?.id || 1,
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
  const idea = mainIdeas?.[0] || { title: 'Key Insight', description: 'Important takeaway' };

  switch (platform) {
    case 'linkedin':
      return [{
        format: 'insight',
        mainIdeaId: 1,
        content: `${idea.title}\n\n${idea.description}\n\nWhat's your experience with this? Share your thoughts below.\n\n#business #insights #professional`,
        wordCount: 30,
        platform: 'LinkedIn'
      }];

    case 'instagram':
      return [{
        mainIdeaId: 1,
        style: 'visual',
        caption: `✨ ${idea.title}\n\n${idea.description}\n\n#business #growth #success #tips`,
        designBrief: {
          visualConcept: 'Modern design',
          colorPalette: ['#3B82F6', '#1E293B', '#F8FAFC'],
          typography: 'Bold sans-serif',
          layout: 'Centered',
          stockPhotoKeywords: ['business', 'technology']
        },
        platform: 'Instagram'
      }];

    case 'twitter':
      return [{
        style: 'thread',
        mainIdeaId: 1,
        tweets: [
          { tweetNumber: 1, text: `🧵 ${idea.title}` },
          { tweetNumber: 2, text: idea.description?.substring(0, 270) || 'Key insight' },
          { tweetNumber: 3, text: 'Follow for more insights! 🚀' }
        ],
        platform: 'Twitter/X'
      }];

    case 'facebook':
      return [{
        style: 'engaging',
        mainIdeaId: 1,
        content: `${idea.title}\n\n${idea.description}\n\nWhat do you think? Share below! 👇`,
        wordCount: 30,
        platform: 'Facebook'
      }];

    case 'linkedinPulse':
      return {
        mainIdeaId: 1,
        headline: title,
        content: `# ${title}\n\n${mainIdeas?.map(i => `## ${i.title}\n${i.description}`).join('\n\n') || 'Content'}`,
        wordCount: 100,
        platform: 'LinkedIn Pulse'
      };

    case 'substack':
      return {
        mainIdeaId: 1,
        subject: `Insights: ${title}`,
        content: `${mainIdeas?.map(i => `**${i.title}**\n${i.description}`).join('\n\n') || 'Newsletter content'}`,
        wordCount: 100,
        platform: 'Substack'
      };

    default:
      return null;
  }
}
