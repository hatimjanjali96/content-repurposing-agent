import { generateWithGroq } from './groqClient';

// Generate all content in a SINGLE API call to fit within Vercel's timeout
export async function extractMainIdeas(blogContent) {
  const systemPrompt = `You are a content strategist. Extract 4 distinct main ideas from the blog article.

Each idea should be unique and substantive enough to build content around.

Return ONLY a JSON array:
[{"id": 1, "title": "Main idea title", "description": "2-3 sentence description"}, ...]`;

  const userPrompt = `Extract 4 main ideas from this blog:

Title: ${blogContent.title}

Content:
${blogContent.content.substring(0, 4000)}

Return ONLY the JSON array.`;

  try {
    const response = await generateWithGroq(systemPrompt, userPrompt, 800);
    const cleaned = response.replace(/```json|```/g, '').trim();
    const mainIdeas = JSON.parse(cleaned);
    return mainIdeas.slice(0, 4);
  } catch (_e) {
    console.error('Failed to parse main ideas, using fallback');
    return [
      { id: 1, title: "Key Insight", description: "Main takeaway from the article" },
      { id: 2, title: "Practical Application", description: "How to apply the concepts" },
      { id: 3, title: "Industry Impact", description: "Broader implications" },
      { id: 4, title: "Best Practices", description: "Recommended approaches" }
    ];
  }
}

// Generate ALL platform content in a single comprehensive API call
export async function generateAllContent(blogContent, brandGuidelines, mainIdeas) {
  const brandContext = brandGuidelines?.voice || 'Professional, engaging, clear';
  const ideasText = mainIdeas.map(i => `${i.id}. ${i.title}: ${i.description}`).join('\n');

  const systemPrompt = `You are an expert social media content creator. Generate comprehensive multi-platform content.
Brand voice: ${brandContext}
Always return valid JSON with the exact structure requested.`;

  const userPrompt = `Based on this blog article, create a complete content package.

BLOG TITLE: ${blogContent.title}
MAIN IDEAS:
${ideasText}

BLOG EXCERPT:
${blogContent.content.substring(0, 3000)}

Generate content for ALL platforms below. Return ONLY a JSON object with this EXACT structure:

{
  "linkedin": [
    {"format": "storytelling", "content": "Full LinkedIn post 150-200 words with hashtags"},
    {"format": "listicle", "content": "Full LinkedIn post 150-200 words with hashtags"},
    {"format": "thought-leadership", "content": "Full LinkedIn post 150-200 words with hashtags"}
  ],
  "instagram": [
    {"style": "inspirational", "caption": "Instagram caption 80-100 words with emojis and 10 hashtags", "visualConcept": "Describe the image/graphic"}
  ],
  "twitter": [
    {"style": "thread", "tweets": ["Tweet 1 hook under 280 chars", "Tweet 2 under 280 chars", "Tweet 3 under 280 chars", "Tweet 4 CTA under 280 chars"]}
  ],
  "facebook": [
    {"style": "educational", "content": "Facebook post 150-200 words, conversational, ends with question"},
    {"style": "relatable", "content": "Facebook post 100-150 words, personal tone"}
  ],
  "infographic": {
    "title": "Compelling infographic title",
    "dataPoints": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
    "colorPalette": {"primary": "#3B82F6", "secondary": "#1E293B", "accent": "#10B981"}
  },
  "linkedinPulse": {
    "headline": "Article headline 60-80 chars",
    "content": "Full 400-600 word article with sections marked by ## headings"
  },
  "substack": {
    "subject": "Email subject line",
    "content": "Full 400-600 word newsletter, personal tone, storytelling"
  },
  "youtubeShorts": {
    "segments": [
      {"time": "0-3s", "script": "Hook line", "visual": "Visual description"},
      {"time": "3-20s", "script": "Main point script", "visual": "Visual description"},
      {"time": "20-30s", "script": "CTA script", "visual": "Visual description"}
    ]
  }
}

IMPORTANT: Return ONLY the JSON object, no other text. Ensure all content is complete and high-quality.`;

  try {
    const response = await generateWithGroq(systemPrompt, userPrompt, 4000);
    const cleaned = response.replace(/```json|```/g, '').trim();

    // Find the JSON object in the response
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}') + 1;
    const jsonStr = cleaned.substring(jsonStart, jsonEnd);

    const content = JSON.parse(jsonStr);

    // Transform to expected format
    return {
      linkedin: (content.linkedin || []).map((post, i) => ({
        format: post.format || `post-${i+1}`,
        mainIdeaId: mainIdeas[i % mainIdeas.length]?.id || 1,
        content: post.content || '',
        wordCount: (post.content || '').split(/\s+/).length,
        platform: 'LinkedIn'
      })),
      instagram: (content.instagram || []).map((post, i) => ({
        mainIdeaId: mainIdeas[i % mainIdeas.length]?.id || 1,
        style: post.style || 'inspirational',
        caption: post.caption || '',
        designBrief: {
          visualConcept: post.visualConcept || 'Modern, clean design',
          colorPalette: ['#3B82F6', '#1E293B', '#F8FAFC'],
          typography: 'Sans-serif, bold headlines',
          layout: 'Centered composition',
          stockPhotoKeywords: ['business', 'technology', 'success']
        },
        platform: 'Instagram'
      })),
      twitter: (content.twitter || []).map((thread, i) => ({
        style: thread.style || 'thread',
        mainIdeaId: mainIdeas[i % mainIdeas.length]?.id || 1,
        tweets: (thread.tweets || []).map((text, j) => ({ tweetNumber: j + 1, text })),
        platform: 'Twitter/X'
      })),
      facebook: (content.facebook || []).map((post, i) => ({
        style: post.style || 'educational',
        mainIdeaId: mainIdeas[i % mainIdeas.length]?.id || 1,
        content: post.content || '',
        platform: 'Facebook'
      })),
      infographic: content.infographic ? {
        title: content.infographic.title || blogContent.title,
        subtitle: mainIdeas[0]?.description || '',
        dataPoints: (content.infographic.dataPoints || []).map((point, i) => ({
          point: typeof point === 'string' ? point : point.point || `Point ${i+1}`,
          description: typeof point === 'string' ? '' : point.description || '',
          emphasis: i === 0 ? 'high' : 'medium'
        })),
        visualHierarchy: 'Top-to-bottom flow',
        colorPalette: content.infographic.colorPalette || {
          primary: '#3B82F6',
          secondary: '#1E293B',
          accent: '#10B981',
          background: '#F8FAFC'
        },
        iconStyle: 'Modern flat icons',
        dimensions: '1080x1350px'
      } : getDefaultInfographic(blogContent, mainIdeas),
      linkedinPulse: content.linkedinPulse ? {
        mainIdeaId: mainIdeas[0]?.id || 1,
        content: `# ${content.linkedinPulse.headline || blogContent.title}\n\n${content.linkedinPulse.content || ''}`,
        wordCount: (content.linkedinPulse.content || '').split(/\s+/).length,
        platform: 'LinkedIn Pulse'
      } : getDefaultLinkedInPulse(blogContent, mainIdeas),
      substack: content.substack ? {
        mainIdeaId: mainIdeas[1]?.id || mainIdeas[0]?.id || 1,
        content: `Subject: ${content.substack.subject || blogContent.title}\n\n${content.substack.content || ''}`,
        wordCount: (content.substack.content || '').split(/\s+/).length,
        platform: 'Substack'
      } : getDefaultSubstack(blogContent, mainIdeas),
      youtubeShorts: content.youtubeShorts ? {
        mainIdeaId: mainIdeas[2]?.id || mainIdeas[0]?.id || 1,
        segments: (content.youtubeShorts.segments || []).map(seg => ({
          time: seg.time || '0-10s',
          spokenText: seg.script || '',
          onScreenText: seg.script?.substring(0, 50) || '',
          visualCue: seg.visual || 'Visual demonstration'
        })),
        platform: 'YouTube Shorts'
      } : getDefaultYouTubeShorts(mainIdeas)
    };
  } catch (error) {
    console.error('Content generation error:', error);
    // Return fallback content
    return getDefaultContent(blogContent, mainIdeas);
  }
}

function getDefaultInfographic(blogContent, mainIdeas) {
  return {
    title: blogContent.title,
    subtitle: mainIdeas[0]?.description || 'Key insights from the article',
    dataPoints: mainIdeas.map((idea, i) => ({
      point: idea.title,
      description: idea.description,
      emphasis: i === 0 ? 'high' : 'medium'
    })),
    visualHierarchy: 'Top-to-bottom flow with clear sections',
    colorPalette: {
      primary: '#3B82F6',
      secondary: '#1E293B',
      accent: '#10B981',
      background: '#F8FAFC'
    },
    iconStyle: 'Modern flat icons with subtle shadows',
    dimensions: '1080x1350px'
  };
}

function getDefaultLinkedInPulse(blogContent, mainIdeas) {
  return {
    mainIdeaId: mainIdeas[0]?.id || 1,
    content: `# ${blogContent.title}\n\n${mainIdeas.map(i => `## ${i.title}\n${i.description}`).join('\n\n')}`,
    wordCount: 100,
    platform: 'LinkedIn Pulse'
  };
}

function getDefaultSubstack(blogContent, mainIdeas) {
  return {
    mainIdeaId: mainIdeas[1]?.id || 1,
    content: `Subject: Insights from "${blogContent.title}"\n\n${mainIdeas.map(i => `**${i.title}**\n${i.description}`).join('\n\n')}`,
    wordCount: 100,
    platform: 'Substack'
  };
}

function getDefaultYouTubeShorts(mainIdeas) {
  return {
    mainIdeaId: mainIdeas[0]?.id || 1,
    segments: [
      { time: '0-3s', spokenText: 'Hook', onScreenText: mainIdeas[0]?.title || 'Key Insight', visualCue: 'Bold text animation' },
      { time: '3-25s', spokenText: mainIdeas[0]?.description || 'Main content', onScreenText: 'Key points', visualCue: 'Visual demonstration' },
      { time: '25-30s', spokenText: 'Follow for more!', onScreenText: 'Follow', visualCue: 'CTA animation' }
    ],
    platform: 'YouTube Shorts'
  };
}

function getDefaultContent(blogContent, mainIdeas) {
  return {
    linkedin: mainIdeas.slice(0, 3).map((idea, i) => ({
      format: ['storytelling', 'listicle', 'thought-leadership'][i],
      mainIdeaId: idea.id,
      content: `${idea.title}\n\n${idea.description}\n\n#business #insights #professional`,
      wordCount: 50,
      platform: 'LinkedIn'
    })),
    instagram: [{
      mainIdeaId: mainIdeas[0]?.id || 1,
      style: 'inspirational',
      caption: `✨ ${mainIdeas[0]?.title || 'Key Insight'}\n\n${mainIdeas[0]?.description || ''}\n\n#business #growth #success #motivation #tips`,
      designBrief: {
        visualConcept: 'Modern, clean design with bold typography',
        colorPalette: ['#3B82F6', '#1E293B', '#F8FAFC'],
        typography: 'Sans-serif, bold headlines',
        layout: 'Centered text with gradient background',
        stockPhotoKeywords: ['business', 'technology', 'success']
      },
      platform: 'Instagram'
    }],
    twitter: [{
      style: 'thread',
      mainIdeaId: mainIdeas[0]?.id || 1,
      tweets: [
        { tweetNumber: 1, text: `🧵 ${mainIdeas[0]?.title || 'Thread'}` },
        { tweetNumber: 2, text: mainIdeas[0]?.description?.substring(0, 270) || 'Key insight' },
        { tweetNumber: 3, text: 'Follow for more insights! 🚀' }
      ],
      platform: 'Twitter/X'
    }],
    facebook: mainIdeas.slice(0, 2).map((idea, i) => ({
      style: ['educational', 'relatable'][i],
      mainIdeaId: idea.id,
      content: `${idea.title}\n\n${idea.description}\n\nWhat do you think? Share your thoughts below! 👇`,
      platform: 'Facebook'
    })),
    infographic: getDefaultInfographic(blogContent, mainIdeas),
    linkedinPulse: getDefaultLinkedInPulse(blogContent, mainIdeas),
    substack: getDefaultSubstack(blogContent, mainIdeas),
    youtubeShorts: getDefaultYouTubeShorts(mainIdeas)
  };
}
