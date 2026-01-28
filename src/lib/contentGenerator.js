import { generateWithGroq } from './groqClient';

export async function extractMainIdeas(blogContent) {
  const systemPrompt = `You are a content strategist. Extract 6-8 distinct main ideas from the blog article.

Each idea should be:
- Unique and self-contained
- Substantive enough to build content around
- Different from the others (no overlap)

Return ONLY a JSON array of objects with this structure:
[
  {"id": 1, "title": "Main idea title", "description": "2-3 sentence description"},
  ...
]`;

  const userPrompt = `Extract 6-8 main ideas from this blog article:

Title: ${blogContent.title}

Content:
${blogContent.content.substring(0, 6000)}

Return ONLY the JSON array, no other text.`;

  const response = await generateWithGroq(systemPrompt, userPrompt, 1500);

  // Clean response (remove markdown code blocks if present)
  const cleaned = response.replace(/```json|```/g, '').trim();

  try {
    const mainIdeas = JSON.parse(cleaned);
    return mainIdeas.slice(0, 8);
  } catch (_e) {
    // Fallback: create default ideas from content
    console.error('Failed to parse main ideas, using fallback');
    return [
      { id: 1, title: "Key Insight", description: "Main takeaway from the article" },
      { id: 2, title: "Practical Application", description: "How to apply the concepts" },
      { id: 3, title: "Industry Impact", description: "Broader implications for the field" },
      { id: 4, title: "Best Practices", description: "Recommended approaches" },
      { id: 5, title: "Common Challenges", description: "Problems addressed in the article" },
      { id: 6, title: "Future Trends", description: "Where things are heading" }
    ];
  }
}

export async function generateAllContent(blogContent, brandGuidelines, mainIdeas) {
  const brandContext = JSON.stringify(brandGuidelines, null, 2);

  // Generate content for each platform
  const [linkedin, instagram, twitter, facebook, infographic, linkedinPulse, substack, youtubeShorts] = await Promise.all([
    generateLinkedInPosts(mainIdeas, brandContext),
    generateInstagramPosts(mainIdeas, brandContext),
    generateTwitterThreads(mainIdeas, brandContext),
    generateFacebookPosts(mainIdeas, brandContext),
    generateInfographic(mainIdeas, brandContext),
    generateLinkedInPulse(mainIdeas, brandContext, blogContent),
    generateSubstack(mainIdeas, brandContext, blogContent),
    generateYouTubeShorts(mainIdeas, brandContext)
  ]);

  return {
    linkedin,
    instagram,
    twitter,
    facebook,
    infographic,
    linkedinPulse,
    substack,
    youtubeShorts
  };
}

async function generateLinkedInPosts(mainIdeas, brandContext) {
  const posts = [];
  const formats = [
    'storytelling case study',
    'data-driven analysis',
    'thought-provoking question',
    'actionable listicle',
    'contrarian perspective'
  ];

  const systemPrompt = `You are a LinkedIn content expert. Create engaging, professional posts that drive engagement.
Follow these brand guidelines: ${brandContext}
Keep posts between 120-200 words. Use line breaks for readability. Include relevant hashtags.`;

  for (let i = 0; i < 5; i++) {
    const idea = mainIdeas[i % mainIdeas.length];
    const prompt = `Create a LinkedIn post using this main idea: "${idea.title} - ${idea.description}"

Format: ${formats[i]}
Length: 120-200 words
Style: Professional, thought leadership

Structure:
- Hook opening line
- Main content (2-3 paragraphs)
- Call to action
- 3-5 relevant hashtags

Return ONLY the post text, no preamble or explanation.`;

    try {
      const post = await generateWithGroq(systemPrompt, prompt, 500);
      posts.push({
        format: formats[i],
        mainIdeaId: idea.id,
        content: post.trim(),
        wordCount: post.split(/\s+/).length,
        platform: 'LinkedIn'
      });
    } catch (_error) {
      posts.push({
        format: formats[i],
        mainIdeaId: idea.id,
        content: `[Content generation in progress - ${formats[i]}]`,
        wordCount: 0,
        platform: 'LinkedIn'
      });
    }
  }

  return posts;
}

async function generateInstagramPosts(mainIdeas, brandContext) {
  const posts = [];
  const styles = ['Visual storytelling, emotional', 'Inspirational, aspirational'];

  const systemPrompt = `You are an Instagram content expert. Create engaging captions that complement visuals.
Follow these brand guidelines: ${brandContext}
Keep captions engaging with emojis and clear CTAs.`;

  for (let i = 0; i < 2; i++) {
    const idea = mainIdeas[(i + 5) % mainIdeas.length];
    const prompt = `Create an Instagram post using this main idea: "${idea.title} - ${idea.description}"

Style: ${styles[i]}
Length: ${i === 0 ? '100-125' : '80-100'} words
Include: Hook + 2-3 sentences + CTA + 8-15 hashtags

Also create a design brief with:
- Visual concept (describe the image/graphic)
- Color palette (3-4 colors with descriptions)
- Typography notes
- Layout suggestions
- Stock photo keywords

Return as JSON: {"caption": "...", "designBrief": {"visualConcept": "...", "colorPalette": [...], "typography": "...", "layout": "...", "stockPhotoKeywords": [...]}}`;

    try {
      const response = await generateWithGroq(systemPrompt, prompt, 800);
      const cleaned = response.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      posts.push({
        mainIdeaId: idea.id,
        style: styles[i],
        caption: parsed.caption,
        designBrief: parsed.designBrief,
        platform: 'Instagram'
      });
    } catch (_error) {
      posts.push({
        mainIdeaId: idea.id,
        style: styles[i],
        caption: `[Instagram caption for: ${idea.title}]`,
        designBrief: {
          visualConcept: 'Modern, clean design with bold typography',
          colorPalette: ['#3B82F6', '#1E293B', '#F8FAFC'],
          typography: 'Sans-serif, bold headlines',
          layout: 'Centered text with gradient background',
          stockPhotoKeywords: ['business', 'technology', 'success']
        },
        platform: 'Instagram'
      });
    }
  }

  return posts;
}

async function generateTwitterThreads(mainIdeas, brandContext) {
  const threads = [];
  const styles = ['how-to educational', 'insight analysis', 'narrative story'];
  const tweetCounts = [6, 7, 5];

  const systemPrompt = `You are a Twitter/X content expert. Create engaging threads that provide value.
Follow these brand guidelines: ${brandContext}
Each tweet must be under 280 characters. Make threads cohesive but each tweet should stand alone.`;

  for (let i = 0; i < 3; i++) {
    const idea = mainIdeas[i % mainIdeas.length];
    const prompt = `Create a Twitter thread using this main idea: "${idea.title} - ${idea.description}"

Style: ${styles[i]}
Length: ${tweetCounts[i]} tweets
Each tweet: Max 280 characters

Structure:
- Tweet 1: Hook (grab attention)
- Tweets 2-N: Main content
- Final tweet: CTA/summary

Return as JSON array: [{"tweetNumber": 1, "text": "..."}, ...]`;

    try {
      const response = await generateWithGroq(systemPrompt, prompt, 1000);
      const cleaned = response.replace(/```json|```/g, '').trim();
      const tweets = JSON.parse(cleaned);

      threads.push({
        style: styles[i],
        mainIdeaId: idea.id,
        tweets,
        platform: 'Twitter/X'
      });
    } catch (_error) {
      threads.push({
        style: styles[i],
        mainIdeaId: idea.id,
        tweets: [
          { tweetNumber: 1, text: `Thread: ${idea.title}` },
          { tweetNumber: 2, text: idea.description }
        ],
        platform: 'Twitter/X'
      });
    }
  }

  return threads;
}

async function generateFacebookPosts(mainIdeas, brandContext) {
  const posts = [];
  const styles = ['educational long-form', 'conversational relatable', 'question poll', 'personal authentic'];
  const lengths = ['200-250', '150-180', '100-130', '180-220'];

  const systemPrompt = `You are a Facebook content expert. Create community-focused, engaging posts.
Follow these brand guidelines: ${brandContext}
Focus on sparking conversation and building community.`;

  for (let i = 0; i < 4; i++) {
    const idea = mainIdeas[(i + 1) % mainIdeas.length];
    const prompt = `Create a Facebook post using this main idea: "${idea.title} - ${idea.description}"

Style: ${styles[i]}
Length: ${lengths[i]} words
Tone: Community-focused, engaging

Include a conversation starter or question at the end.
Return ONLY the post text.`;

    try {
      const post = await generateWithGroq(systemPrompt, prompt, 600);
      posts.push({
        style: styles[i],
        mainIdeaId: idea.id,
        content: post.trim(),
        platform: 'Facebook'
      });
    } catch (_error) {
      posts.push({
        style: styles[i],
        mainIdeaId: idea.id,
        content: `[Facebook post for: ${idea.title}]`,
        platform: 'Facebook'
      });
    }
  }

  return posts;
}

async function generateInfographic(mainIdeas, brandContext) {
  const idea = mainIdeas[0];
  const systemPrompt = `You are an infographic design expert. Create detailed infographic outlines.
Follow these brand guidelines: ${brandContext}`;

  const prompt = `Create an infographic outline using this main idea: "${idea.title} - ${idea.description}"

Include:
1. Compelling title (benefit-driven)
2. 5-7 data points with descriptions
3. Visual hierarchy notes
4. Color palette (4 colors with hex codes)
5. Icon/illustration style recommendations
6. Dimensions: 1080x1350px (Instagram format)

Return as JSON:
{
  "title": "...",
  "subtitle": "...",
  "dataPoints": [{"point": "...", "description": "...", "emphasis": "high/medium/low"}],
  "visualHierarchy": "...",
  "colorPalette": {"primary": "#...", "secondary": "#...", "accent": "#...", "background": "#..."},
  "iconStyle": "...",
  "dimensions": "1080x1350px"
}`;

  try {
    const response = await generateWithGroq(systemPrompt, prompt, 1200);
    const cleaned = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (_error) {
    return {
      title: idea.title,
      subtitle: idea.description,
      dataPoints: [
        { point: "Key Statistic 1", description: "Description", emphasis: "high" },
        { point: "Key Statistic 2", description: "Description", emphasis: "medium" },
        { point: "Key Statistic 3", description: "Description", emphasis: "medium" }
      ],
      visualHierarchy: "Top-to-bottom flow with clear sections",
      colorPalette: {
        primary: "#3B82F6",
        secondary: "#1E293B",
        accent: "#10B981",
        background: "#F8FAFC"
      },
      iconStyle: "Modern flat icons with subtle shadows",
      dimensions: "1080x1350px"
    };
  }
}

async function generateLinkedInPulse(mainIdeas, brandContext, blogContent) {
  const idea = mainIdeas[0];
  const systemPrompt = `You are a thought leadership content expert. Create authoritative, comprehensive articles.
Follow these brand guidelines: ${brandContext}`;

  const prompt = `Create a LinkedIn Pulse article using this main idea: "${idea.title} - ${idea.description}"

Source context: ${blogContent.content.substring(0, 2000)}

Structure:
- Compelling headline (60-100 chars)
- Hook opening paragraph
- 3-4 main sections with subheadings (use ## for headings)
- Examples and insights throughout
- Strong conclusion with actionable CTA

Length: 800-1200 words
Tone: Authoritative, thought leadership

Return ONLY the article text with clear section headers.`;

  try {
    const article = await generateWithGroq(systemPrompt, prompt, 2500);
    return {
      mainIdeaId: idea.id,
      content: article.trim(),
      wordCount: article.split(/\s+/).length,
      platform: 'LinkedIn Pulse'
    };
  } catch (_error) {
    return {
      mainIdeaId: idea.id,
      content: `[LinkedIn Pulse article for: ${idea.title}]`,
      wordCount: 0,
      platform: 'LinkedIn Pulse'
    };
  }
}

async function generateSubstack(mainIdeas, brandContext, blogContent) {
  const idea = mainIdeas[1] || mainIdeas[0];
  const systemPrompt = `You are a newsletter content expert. Create personal, engaging newsletters.
Follow these brand guidelines: ${brandContext}`;

  const prompt = `Create a Substack newsletter post using this main idea: "${idea.title} - ${idea.description}"

Source context: ${blogContent.content.substring(0, 2000)}

Structure:
- Subject line (start with "Subject: ")
- Personal, engaging opening
- Story-driven body (mix personal insights + information)
- Practical takeaways section
- Community CTA (encourage replies/discussion)

Length: 1000-1500 words
Tone: Personal, storytelling, accessible

Return the newsletter with subject line at the top.`;

  try {
    const newsletter = await generateWithGroq(systemPrompt, prompt, 2800);
    return {
      mainIdeaId: idea.id,
      content: newsletter.trim(),
      wordCount: newsletter.split(/\s+/).length,
      platform: 'Substack'
    };
  } catch (_error) {
    return {
      mainIdeaId: idea.id,
      content: `[Substack newsletter for: ${idea.title}]`,
      wordCount: 0,
      platform: 'Substack'
    };
  }
}

async function generateYouTubeShorts(mainIdeas, brandContext) {
  const idea = mainIdeas[2] || mainIdeas[0];
  const systemPrompt = `You are a short-form video script expert. Create punchy, engaging scripts.
Follow these brand guidelines: ${brandContext}`;

  const prompt = `Create a YouTube Shorts script (60 seconds) using this main idea: "${idea.title} - ${idea.description}"

Structure with timing:
[0-3s] Hook (pattern interrupt, grab attention)
[3-15s] Context/problem setup
[15-45s] Main content (tip/insight/solution)
[45-55s] Quick summary
[55-60s] CTA (like/follow)

Include for each segment:
- Spoken text
- On-screen text suggestions
- Visual cues (b-roll, graphics)

Return as JSON: {"segments": [{"time": "0-3s", "spokenText": "...", "onScreenText": "...", "visualCue": "..."}]}`;

  try {
    const response = await generateWithGroq(systemPrompt, prompt, 1000);
    const cleaned = response.replace(/```json|```/g, '').trim();
    return {
      mainIdeaId: idea.id,
      ...JSON.parse(cleaned),
      platform: 'YouTube Shorts'
    };
  } catch (_error) {
    return {
      mainIdeaId: idea.id,
      segments: [
        { time: "0-3s", spokenText: "Hook", onScreenText: idea.title, visualCue: "Bold text animation" },
        { time: "3-60s", spokenText: idea.description, onScreenText: "Key points", visualCue: "Visual demonstration" }
      ],
      platform: 'YouTube Shorts'
    };
  }
}
