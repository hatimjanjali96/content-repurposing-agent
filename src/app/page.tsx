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

interface LinkedInPost {
  postNumber: number;
  format: string;
  formatDescription: string;
  content: string;
  wordCount: number;
  ideaUsed: string;
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

      // Step 3: Generate 21 LinkedIn posts in 3 batches of 7
      const allLinkedInPosts: LinkedInPost[] = [];
      const brandVoice = 'Professional, engaging, thought-leadership';

      for (let batch = 0; batch < 3; batch++) {
        const batchStart = batch * 7 + 1;
        const batchEnd = Math.min((batch + 1) * 7, 21);
        setCurrentStage(`Generating LinkedIn posts ${batchStart}-${batchEnd}...`);
        setProgress(25 + Math.round((batch / 3) * 60));

        try {
          const linkedInResponse = await fetch('/api/generate-linkedin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title,
              content,
              mainIdeas,
              batch,
              brandVoice
            }),
          });

          const linkedInResult = await linkedInResponse.json();

          if (linkedInResult.success && linkedInResult.data?.posts) {
            allLinkedInPosts.push(...linkedInResult.data.posts);
          } else {
            console.warn(`Failed to generate batch ${batch}:`, linkedInResult.error);
          }
        } catch (batchError) {
          console.warn(`Error generating batch ${batch}:`, batchError);
        }
      }

      setProgress(90);
      setCurrentStage('Finalizing content package...');

      // Build final content package (LinkedIn-focused)
      const contentPackage = {
        blogMetadata: {
          title,
          url,
          wordCount
        },
        mainIdeas,
        linkedInPosts: allLinkedInPosts,
        summary: {
          totalPosts: allLinkedInPosts.length,
          targetPosts: 21,
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

  return (
    <main className="min-h-screen">
      <Hero />

      <section id="generator" className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Generate 21 LinkedIn Posts
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Enter your blog URL and we&apos;ll create 21 unique LinkedIn posts with different formats and angles - ready to schedule for a month of content.
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
