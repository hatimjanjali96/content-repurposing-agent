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

export default function Home() {
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async ({ url, file: _file }: GenerateInput) => {
    setStatus('generating');
    setProgress(0);
    setError(null);
    setData(null);

    try {
      // Step 1: Scrape the blog (Edge Runtime - fast)
      setProgress(10);
      const scrapeResponse = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const scrapeResult = await scrapeResponse.json();
      if (!scrapeResponse.ok || !scrapeResult.success) {
        throw new Error(scrapeResult.error || 'Failed to fetch blog content');
      }

      setProgress(40);

      // Step 2: Generate AI content (Edge Runtime)
      const generateResponse = await fetch('/api/generate-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: scrapeResult.data.title,
          content: scrapeResult.data.content,
          brandVoice: 'Professional, engaging'
        }),
      });

      const generateResult = await generateResponse.json();
      if (!generateResponse.ok || !generateResult.success) {
        throw new Error(generateResult.error || 'Content generation failed');
      }

      setProgress(90);

      // Build final content package
      const contentPackage = {
        blogMetadata: {
          title: scrapeResult.data.title,
          url: scrapeResult.data.url,
          author: '',
          date: '',
          wordCount: scrapeResult.data.wordCount
        },
        brandGuidelines: {
          tone: 'Professional',
          platforms: ['LinkedIn', 'Instagram', 'Twitter', 'Facebook']
        },
        mainIdeas: generateResult.data.mainIdeas,
        content: generateResult.data.content,
        schedule: generateSchedule(generateResult.data.content),
        summary: {
          totalPieces: countPieces(generateResult.data.content),
          platforms: 8,
          pages: 15,
          generatedAt: new Date().toISOString()
        }
      };

      setProgress(100);

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

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Main Content Section */}
      <section id="generator" className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Generate Your Content Package
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Enter your blog URL and optionally upload brand guidelines.
              We&apos;ll create 21+ platform-optimized content pieces in under 2 minutes.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left: Input Section */}
            <div className="lg:sticky lg:top-8">
              <InputSection
                onGenerate={handleGenerate}
                isGenerating={status === 'generating'}
              />
            </div>

            {/* Right: Output Preview */}
            <div>
              <OutputPreview
                status={status}
                progress={progress}
                data={data}
                error={error}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQAccordion />

      {/* Footer */}
      <Footer />
    </main>
  );
}
