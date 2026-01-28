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

  const handleGenerate = async ({ url, file }: GenerateInput) => {
    setStatus('generating');
    setProgress(0);
    setError(null);
    setData(null);

    try {
      const formData = new FormData();
      formData.append('blogUrl', url);
      if (file) {
        formData.append('brandGuidelines', file);
      }

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            return prev;
          }
          // Variable progress increments based on stage
          const increment = prev < 20 ? 8 : prev < 40 ? 6 : prev < 70 ? 4 : 2;
          return Math.min(prev + increment, 90);
        });
      }, 800);

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Content generation failed');
      }

      // Complete the progress
      setProgress(100);

      // Short delay before showing complete state
      setTimeout(() => {
        setData(result.data);
        setStatus('complete');
      }, 500);

    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Main Content Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
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
