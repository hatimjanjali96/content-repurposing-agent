'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import InputSection from '@/components/InputSection';
import OutputPreview from '@/components/OutputPreview';
import FAQAccordion from '@/components/FAQAccordion';
import Footer from '@/components/Footer';

type Status = 'idle' | 'generating' | 'complete' | 'error';

interface GenerateInput {
  url: string;
  file: File | null;
}

interface MainIdea {
  id: number;
  title: string;
  description: string;
}

export default function Home() {
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async ({ url, file: _file }: GenerateInput) => {
    setStatus('generating');
    setProgress(0);
    setError(null);
    setData(null);

    try {
      // Step 1: Scrape the blog
      setCurrentStage('Fetching blog content...');
      setProgress(5);

      const scrapeResponse = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const scrapeResult = await scrapeResponse.json();
      if (!scrapeResponse.ok || !scrapeResult.success) {
        throw new Error(scrapeResult.error || 'Failed to fetch blog content');
      }

      const { title, content, wordCount } = scrapeResult.data;
      setProgress(15);

      // Step 2: Extract main ideas
      setCurrentStage('Analyzing content & extracting key ideas...');

      const ideasResponse = await fetch('/api/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      const ideasResult = await ideasResponse.json();
      if (!ideasResponse.ok || !ideasResult.success) {
        throw new Error(ideasResult.error || 'Failed to extract main ideas');
      }

      const mainIdeas: MainIdea[] = ideasResult.data.mainIdeas;
      setProgress(25);

      // Step 3: Generate content for each platform sequentially
      const platforms = ['linkedin', 'instagram', 'twitter', 'facebook', 'linkedinPulse', 'substack'];
      const platformContent: Record<string, any> = {};
      const brandVoice = 'Professional, engaging, thought-leadership';

      for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i];
        const platformNames: Record<string, string> = {
          linkedin: 'LinkedIn posts',
          instagram: 'Instagram content',
          twitter: 'Twitter threads',
          facebook: 'Facebook posts',
          linkedinPulse: 'LinkedIn Pulse article',
          substack: 'Substack newsletter'
        };

        setCurrentStage(`Generating ${platformNames[platform]}...`);
        setProgress(25 + Math.round((i / platforms.length) * 65));

        try {
          const platformResponse = await fetch('/api/generate-platform', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              platform,
              title,
              content,
              mainIdeas,
              brandVoice
            }),
          });

          const platformResult = await platformResponse.json();

          if (platformResult.success) {
            platformContent[platform] = platformResult.data.content;
          } else {
            console.warn(`Failed to generate ${platform}:`, platformResult.error);
            // Use fallback for this platform
            platformContent[platform] = getEmptyPlatformContent(platform, title, mainIdeas);
          }
        } catch (platformError) {
          console.warn(`Error generating ${platform}:`, platformError);
          platformContent[platform] = getEmptyPlatformContent(platform, title, mainIdeas);
        }
      }

      setProgress(95);
      setCurrentStage('Finalizing content package...');

      // Add infographic and YouTube Shorts (static generation)
      platformContent.infographic = {
        title: title,
        subtitle: mainIdeas[0]?.description || 'Key insights',
        dataPoints: mainIdeas.slice(0, 5).map((idea, i) => ({
          point: idea.title,
          description: idea.description,
          emphasis: i === 0 ? 'high' : 'medium'
        })),
        colorPalette: { primary: '#3B82F6', secondary: '#1E293B', accent: '#10B981', background: '#F8FAFC' },
        iconStyle: 'Modern flat icons',
        dimensions: '1080x1350px'
      };

      platformContent.youtubeShorts = {
        mainIdeaId: mainIdeas[0]?.id || 1,
        segments: [
          { time: '0-3s', spokenText: `Here's what you need to know about ${title}`, onScreenText: title.substring(0, 40), visualCue: 'Bold text animation' },
          { time: '3-20s', spokenText: mainIdeas[0]?.description || 'Key insight', onScreenText: mainIdeas[0]?.title || 'Key Point', visualCue: 'Visual demonstration' },
          { time: '20-40s', spokenText: mainIdeas[1]?.description || 'Another insight', onScreenText: mainIdeas[1]?.title || 'Point 2', visualCue: 'Supporting visuals' },
          { time: '40-55s', spokenText: `The key takeaway: ${mainIdeas[2]?.title || 'Take action'}`, onScreenText: 'Key Takeaway', visualCue: 'Summary graphic' },
          { time: '55-60s', spokenText: 'Follow for more insights like this!', onScreenText: 'Follow for more!', visualCue: 'CTA animation' }
        ],
        platform: 'YouTube Shorts'
      };

      // Build final content package
      const contentPackage = {
        blogMetadata: {
          title,
          url,
          author: '',
          date: '',
          wordCount
        },
        brandGuidelines: {
          tone: 'Professional',
          platforms: ['LinkedIn', 'Instagram', 'Twitter', 'Facebook']
        },
        mainIdeas,
        content: platformContent,
        schedule: generateSchedule(platformContent),
        summary: {
          totalPieces: countPieces(platformContent),
          platforms: 8,
          pages: 15,
          generatedAt: new Date().toISOString()
        }
      };

      setProgress(100);
      setCurrentStage('Complete!');

      setTimeout(() => {
        setData(contentPackage);
        setStatus('complete');
      }, 300);

    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  // Helper to count content pieces
  const countPieces = (content: Record<string, unknown>) => {
    let count = 0;
    if (Array.isArray(content.linkedin)) count += content.linkedin.length;
    if (Array.isArray(content.instagram)) count += content.instagram.length;
    if (Array.isArray(content.twitter)) count += content.twitter.length;
    if (Array.isArray(content.facebook)) count += content.facebook.length;
    if (content.infographic) count += 1;
    if (content.linkedinPulse) count += 1;
    if (content.substack) count += 1;
    if (content.youtubeShorts) count += 1;
    return count;
  };

  // Helper to generate posting schedule
  const generateSchedule = (_content: Record<string, unknown>) => {
    const posts: Array<{day: number; platform: string; contentType: string; time: string}> = [];
    const platforms = ['LinkedIn', 'Instagram', 'Twitter/X', 'Facebook'];
    const times = ['09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM'];

    for (let week = 1; week <= 4; week++) {
      for (let day = 1; day <= 5; day++) {
        const dayNum = (week - 1) * 7 + day;
        posts.push({
          day: dayNum,
          platform: platforms[(day - 1) % platforms.length],
          contentType: 'Post',
          time: times[(day - 1) % times.length]
        });
      }
    }

    return {
      posts,
      summary: {
        totalPosts: posts.length,
        postsPerWeek: 5,
        platforms: platforms.length
      }
    };
  };

  // Fallback content generator
  const getEmptyPlatformContent = (platform: string, title: string, mainIdeas: MainIdea[]) => {
    const idea = mainIdeas[0] || { id: 1, title: 'Key Insight', description: 'Important takeaway from the article' };

    switch (platform) {
      case 'linkedin':
        return [{
          format: 'insight',
          mainIdeaId: idea.id,
          content: `${idea.title}\n\n${idea.description}\n\nThoughts? 💭\n\n#business #insights`,
          wordCount: 20,
          platform: 'LinkedIn'
        }];
      case 'instagram':
        return [{
          mainIdeaId: idea.id,
          style: 'visual',
          caption: `✨ ${idea.title}\n\n${idea.description}\n\n#business #growth`,
          designBrief: { visualConcept: 'Modern design', colorPalette: ['#3B82F6'], typography: 'Bold', layout: 'Centered', stockPhotoKeywords: ['business'] },
          platform: 'Instagram'
        }];
      case 'twitter':
        return [{
          style: 'thread',
          mainIdeaId: idea.id,
          tweets: [{ tweetNumber: 1, text: `🧵 ${idea.title}` }, { tweetNumber: 2, text: idea.description.substring(0, 270) }],
          platform: 'Twitter/X'
        }];
      case 'facebook':
        return [{
          style: 'engaging',
          mainIdeaId: idea.id,
          content: `${idea.title}\n\n${idea.description}\n\nWhat do you think?`,
          platform: 'Facebook'
        }];
      case 'linkedinPulse':
        return { mainIdeaId: idea.id, headline: title, content: `# ${title}\n\n${idea.description}`, wordCount: 50, platform: 'LinkedIn Pulse' };
      case 'substack':
        return { mainIdeaId: idea.id, subject: title, content: `${idea.description}`, wordCount: 50, platform: 'Substack' };
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen">
      <Hero />

      <section id="generator" className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Generate Your Content Package
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Enter your blog URL and we&apos;ll create multiple platform-optimized content pieces for LinkedIn, Instagram, Twitter, Facebook, and more.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="lg:sticky lg:top-8">
              <InputSection
                onGenerate={handleGenerate}
                isGenerating={status === 'generating'}
              />
            </div>

            <div>
              <OutputPreview
                status={status}
                progress={progress}
                currentStage={currentStage}
                data={data}
                error={error}
              />
            </div>
          </div>
        </div>
      </section>

      <FAQAccordion />
      <Footer />
    </main>
  );
}
