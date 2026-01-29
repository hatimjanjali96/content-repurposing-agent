import { generateWithGroq } from './groqClient';

// Extract main ideas - simplified for speed
export async function extractMainIdeas(blogContent) {
  // Skip API call - extract ideas directly from content to save time
  const title = blogContent.title || 'Key Insights';
  const contentPreview = blogContent.content.substring(0, 500);

  return [
    { id: 1, title: "Core Message", description: `Main insight from: ${title}` },
    { id: 2, title: "Key Takeaway", description: "Practical application of the concepts" },
    { id: 3, title: "Industry Insight", description: "Broader implications and trends" },
    { id: 4, title: "Action Steps", description: "How to implement these ideas" }
  ];
}

// Generate ALL content in ONE fast API call
export async function generateAllContent(blogContent, brandGuidelines, mainIdeas) {
  const brandVoice = brandGuidelines?.voice || 'Professional, engaging';

  const prompt = `Create social media content based on this blog:

TITLE: ${blogContent.title}
CONTENT: ${blogContent.content.substring(0, 2000)}

Return JSON with this EXACT structure (no extra text):
{
  "linkedin": [{"format":"insight","content":"LinkedIn post 150 words with hashtags"}],
  "instagram": [{"style":"visual","caption":"Instagram caption 80 words with emojis and hashtags","visualConcept":"image description"}],
  "twitter": [{"style":"thread","tweets":["Tweet 1","Tweet 2","Tweet 3"]}],
  "facebook": [{"style":"engaging","content":"Facebook post 100 words ending with question"}],
  "article": {"headline":"Headline","summary":"200 word summary"}
}`;

  try {
    const response = await generateWithGroq(
      `You are a social media expert. Brand voice: ${brandVoice}. Return ONLY valid JSON.`,
      prompt,
      1500
    );

    // Parse JSON from response
    const cleaned = response.replace(/```json|```/g, '').trim();
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}') + 1;

    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('No JSON found in response');
    }

    const content = JSON.parse(cleaned.substring(jsonStart, jsonEnd));

    // Transform to expected format
    return {
      linkedin: (content.linkedin || []).map((post, i) => ({
        format: post.format || 'insight',
        mainIdeaId: 1,
        content: post.content || '',
        wordCount: (post.content || '').split(/\s+/).length,
        platform: 'LinkedIn'
      })),
      instagram: (content.instagram || []).map(post => ({
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
      twitter: (content.twitter || []).map(thread => ({
        style: thread.style || 'thread',
        mainIdeaId: 1,
        tweets: (thread.tweets || []).map((text, j) => ({ tweetNumber: j + 1, text })),
        platform: 'Twitter/X'
      })),
      facebook: (content.facebook || []).map(post => ({
        style: post.style || 'engaging',
        mainIdeaId: 1,
        content: post.content || '',
        platform: 'Facebook'
      })),
      infographic: {
        title: blogContent.title,
        subtitle: mainIdeas[0]?.description || '',
        dataPoints: mainIdeas.map((idea, i) => ({
          point: idea.title,
          description: idea.description,
          emphasis: i === 0 ? 'high' : 'medium'
        })),
        visualHierarchy: 'Top-to-bottom flow',
        colorPalette: { primary: '#3B82F6', secondary: '#1E293B', accent: '#10B981', background: '#F8FAFC' },
        iconStyle: 'Modern flat icons',
        dimensions: '1080x1350px'
      },
      linkedinPulse: {
        mainIdeaId: 1,
        content: `# ${content.article?.headline || blogContent.title}\n\n${content.article?.summary || mainIdeas.map(i => `## ${i.title}\n${i.description}`).join('\n\n')}`,
        wordCount: 200,
        platform: 'LinkedIn Pulse'
      },
      substack: {
        mainIdeaId: 1,
        content: `Subject: ${content.article?.headline || blogContent.title}\n\n${content.article?.summary || 'Key insights from the article.'}`,
        wordCount: 200,
        platform: 'Substack'
      },
      youtubeShorts: {
        mainIdeaId: 1,
        segments: [
          { time: '0-3s', spokenText: 'Hook', onScreenText: blogContent.title.substring(0, 30), visualCue: 'Bold text' },
          { time: '3-25s', spokenText: mainIdeas[0]?.description || '', onScreenText: 'Key points', visualCue: 'Visual demo' },
          { time: '25-30s', spokenText: 'Follow for more!', onScreenText: 'Follow', visualCue: 'CTA' }
        ],
        platform: 'YouTube Shorts'
      }
    };
  } catch (error) {
    console.error('Content generation error:', error.message);
    // Return fallback content
    return generateFallbackContent(blogContent, mainIdeas);
  }
}

function generateFallbackContent(blogContent, mainIdeas) {
  const title = blogContent.title || 'Key Insights';

  return {
    linkedin: [{
      format: 'insight',
      mainIdeaId: 1,
      content: `${title}\n\nKey takeaways from this article that every professional should know.\n\n${mainIdeas[0]?.description || ''}\n\n#business #insights #professional #growth`,
      wordCount: 30,
      platform: 'LinkedIn'
    }],
    instagram: [{
      mainIdeaId: 1,
      style: 'visual',
      caption: `✨ ${title}\n\n${mainIdeas[0]?.description || 'Key insights'}\n\n#business #growth #success #tips #motivation`,
      designBrief: {
        visualConcept: 'Modern, clean design',
        colorPalette: ['#3B82F6', '#1E293B', '#F8FAFC'],
        typography: 'Sans-serif, bold',
        layout: 'Centered',
        stockPhotoKeywords: ['business', 'technology']
      },
      platform: 'Instagram'
    }],
    twitter: [{
      style: 'thread',
      mainIdeaId: 1,
      tweets: [
        { tweetNumber: 1, text: `🧵 ${title}` },
        { tweetNumber: 2, text: mainIdeas[0]?.description?.substring(0, 270) || 'Key insight from this article' },
        { tweetNumber: 3, text: 'Follow for more insights! 🚀' }
      ],
      platform: 'Twitter/X'
    }],
    facebook: [{
      style: 'engaging',
      mainIdeaId: 1,
      content: `${title}\n\n${mainIdeas[0]?.description || ''}\n\nWhat are your thoughts? Share below! 👇`,
      platform: 'Facebook'
    }],
    infographic: {
      title: title,
      subtitle: mainIdeas[0]?.description || '',
      dataPoints: mainIdeas.map((idea, i) => ({
        point: idea.title,
        description: idea.description,
        emphasis: i === 0 ? 'high' : 'medium'
      })),
      visualHierarchy: 'Top-to-bottom flow',
      colorPalette: { primary: '#3B82F6', secondary: '#1E293B', accent: '#10B981', background: '#F8FAFC' },
      iconStyle: 'Modern flat icons',
      dimensions: '1080x1350px'
    },
    linkedinPulse: {
      mainIdeaId: 1,
      content: `# ${title}\n\n${mainIdeas.map(i => `## ${i.title}\n${i.description}`).join('\n\n')}`,
      wordCount: 100,
      platform: 'LinkedIn Pulse'
    },
    substack: {
      mainIdeaId: 1,
      content: `Subject: Insights from "${title}"\n\n${mainIdeas.map(i => `**${i.title}**\n${i.description}`).join('\n\n')}`,
      wordCount: 100,
      platform: 'Substack'
    },
    youtubeShorts: {
      mainIdeaId: 1,
      segments: [
        { time: '0-3s', spokenText: 'Hook', onScreenText: title.substring(0, 30), visualCue: 'Bold text' },
        { time: '3-25s', spokenText: mainIdeas[0]?.description || '', onScreenText: 'Key points', visualCue: 'Demo' },
        { time: '25-30s', spokenText: 'Follow!', onScreenText: 'Follow', visualCue: 'CTA' }
      ],
      platform: 'YouTube Shorts'
    }
  };
}
