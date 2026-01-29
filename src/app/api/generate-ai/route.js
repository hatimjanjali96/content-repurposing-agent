import { NextResponse } from 'next/server';

// Use Edge Runtime
export const runtime = 'edge';

export async function POST(request) {
  try {
    const { title, content, brandVoice } = await request.json();

    if (!content) {
      return NextResponse.json({ success: false, error: 'Content is required' }, { status: 400 });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return NextResponse.json({ success: false, error: 'Groq API key not configured' }, { status: 500 });
    }

    const prompt = `Create social media content based on this blog:

TITLE: ${title || 'Article'}
CONTENT: ${content.substring(0, 2500)}

Return JSON with this EXACT structure (no extra text):
{
  "linkedin": [{"format":"insight","content":"LinkedIn post 150 words with hashtags"}],
  "instagram": [{"style":"visual","caption":"Instagram caption 80 words with emojis and hashtags","visualConcept":"image description"}],
  "twitter": [{"style":"thread","tweets":["Tweet 1","Tweet 2","Tweet 3"]}],
  "facebook": [{"style":"engaging","content":"Facebook post 100 words ending with question"}],
  "article": {"headline":"Headline","summary":"200 word summary"}
}`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: `You are a social media expert. Brand voice: ${brandVoice || 'Professional'}. Return ONLY valid JSON.` },
          { role: 'user', content: prompt }
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

    // Parse the JSON response
    const cleaned = aiContent.replace(/```json|```/g, '').trim();
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}') + 1;

    if (jsonStart === -1 || jsonEnd === 0) {
      // Return fallback content
      return NextResponse.json({
        success: true,
        data: getFallbackContent(title)
      });
    }

    const parsedContent = JSON.parse(cleaned.substring(jsonStart, jsonEnd));

    // Build the full response
    const mainIdeas = [
      { id: 1, title: "Core Message", description: `Main insight from: ${title}` },
      { id: 2, title: "Key Takeaway", description: "Practical application" },
      { id: 3, title: "Industry Insight", description: "Broader implications" },
      { id: 4, title: "Action Steps", description: "Implementation guide" }
    ];

    const fullContent = {
      linkedin: (parsedContent.linkedin || []).map(post => ({
        format: post.format || 'insight',
        mainIdeaId: 1,
        content: post.content || '',
        wordCount: (post.content || '').split(/\s+/).length,
        platform: 'LinkedIn'
      })),
      instagram: (parsedContent.instagram || []).map(post => ({
        mainIdeaId: 1,
        style: post.style || 'visual',
        caption: post.caption || '',
        designBrief: {
          visualConcept: post.visualConcept || 'Modern design',
          colorPalette: ['#3B82F6', '#1E293B', '#F8FAFC'],
          typography: 'Sans-serif, bold',
          layout: 'Centered',
          stockPhotoKeywords: ['business', 'technology']
        },
        platform: 'Instagram'
      })),
      twitter: (parsedContent.twitter || []).map(thread => ({
        style: thread.style || 'thread',
        mainIdeaId: 1,
        tweets: (thread.tweets || []).map((text, j) => ({ tweetNumber: j + 1, text })),
        platform: 'Twitter/X'
      })),
      facebook: (parsedContent.facebook || []).map(post => ({
        style: post.style || 'engaging',
        mainIdeaId: 1,
        content: post.content || '',
        platform: 'Facebook'
      })),
      infographic: {
        title: title,
        subtitle: mainIdeas[0].description,
        dataPoints: mainIdeas.map((idea, i) => ({
          point: idea.title,
          description: idea.description,
          emphasis: i === 0 ? 'high' : 'medium'
        })),
        colorPalette: { primary: '#3B82F6', secondary: '#1E293B', accent: '#10B981', background: '#F8FAFC' },
        iconStyle: 'Modern flat icons',
        dimensions: '1080x1350px'
      },
      linkedinPulse: {
        mainIdeaId: 1,
        content: `# ${parsedContent.article?.headline || title}\n\n${parsedContent.article?.summary || ''}`,
        wordCount: 200,
        platform: 'LinkedIn Pulse'
      },
      substack: {
        mainIdeaId: 1,
        content: `Subject: ${parsedContent.article?.headline || title}\n\n${parsedContent.article?.summary || ''}`,
        wordCount: 200,
        platform: 'Substack'
      },
      youtubeShorts: {
        mainIdeaId: 1,
        segments: [
          { time: '0-3s', spokenText: 'Hook', onScreenText: title.substring(0, 30), visualCue: 'Bold text' },
          { time: '3-25s', spokenText: mainIdeas[0].description, onScreenText: 'Key points', visualCue: 'Demo' },
          { time: '25-30s', spokenText: 'Follow for more!', onScreenText: 'Follow', visualCue: 'CTA' }
        ],
        platform: 'YouTube Shorts'
      }
    };

    return NextResponse.json({
      success: true,
      data: {
        mainIdeas,
        content: fullContent
      }
    });

  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Content generation failed'
    }, { status: 500 });
  }
}

function getFallbackContent(title) {
  const mainIdeas = [
    { id: 1, title: "Core Message", description: `Main insight from: ${title}` },
    { id: 2, title: "Key Takeaway", description: "Practical application" },
    { id: 3, title: "Industry Insight", description: "Broader implications" },
    { id: 4, title: "Action Steps", description: "Implementation guide" }
  ];

  return {
    mainIdeas,
    content: {
      linkedin: [{
        format: 'insight',
        mainIdeaId: 1,
        content: `${title}\n\nKey insights every professional should know.\n\n#business #insights #professional`,
        wordCount: 20,
        platform: 'LinkedIn'
      }],
      instagram: [{
        mainIdeaId: 1,
        style: 'visual',
        caption: `✨ ${title}\n\nKey takeaways you need to know!\n\n#business #growth #success`,
        designBrief: {
          visualConcept: 'Modern design',
          colorPalette: ['#3B82F6', '#1E293B', '#F8FAFC'],
          typography: 'Sans-serif',
          layout: 'Centered',
          stockPhotoKeywords: ['business']
        },
        platform: 'Instagram'
      }],
      twitter: [{
        style: 'thread',
        mainIdeaId: 1,
        tweets: [
          { tweetNumber: 1, text: `🧵 ${title}` },
          { tweetNumber: 2, text: 'Key insight from this article...' },
          { tweetNumber: 3, text: 'Follow for more! 🚀' }
        ],
        platform: 'Twitter/X'
      }],
      facebook: [{
        style: 'engaging',
        mainIdeaId: 1,
        content: `${title}\n\nWhat do you think? Share below! 👇`,
        platform: 'Facebook'
      }],
      infographic: {
        title: title,
        subtitle: mainIdeas[0].description,
        dataPoints: mainIdeas.map((idea, i) => ({
          point: idea.title,
          description: idea.description,
          emphasis: i === 0 ? 'high' : 'medium'
        })),
        colorPalette: { primary: '#3B82F6', secondary: '#1E293B', accent: '#10B981', background: '#F8FAFC' },
        iconStyle: 'Modern flat icons',
        dimensions: '1080x1350px'
      },
      linkedinPulse: { mainIdeaId: 1, content: `# ${title}`, wordCount: 100, platform: 'LinkedIn Pulse' },
      substack: { mainIdeaId: 1, content: `Subject: ${title}`, wordCount: 100, platform: 'Substack' },
      youtubeShorts: {
        mainIdeaId: 1,
        segments: [
          { time: '0-3s', spokenText: 'Hook', onScreenText: title.substring(0, 30), visualCue: 'Bold text' },
          { time: '3-25s', spokenText: 'Main content', onScreenText: 'Key points', visualCue: 'Demo' },
          { time: '25-30s', spokenText: 'Follow!', onScreenText: 'Follow', visualCue: 'CTA' }
        ],
        platform: 'YouTube Shorts'
      }
    }
  };
}
