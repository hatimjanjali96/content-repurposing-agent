'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToGenerator = () => {
    const element = document.getElementById('generator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white">
      {/* Header/Nav */}
      <header className="fixed top-0 z-10 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a className="flex items-center gap-2 text-xl font-bold text-gray-900" href="#">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-white text-sm font-bold">CR</span>
              </div>
              ContentRepurpose
            </a>
            <button
              onClick={scrollToGenerator}
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg"
            >
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* Main Hero */}
      <main className="min-h-screen">
        <div className="flex min-h-screen flex-col justify-center gap-8 overflow-x-hidden pt-24 md:pt-28">
          <div
            className={`mx-auto flex max-w-4xl flex-col items-center gap-8 px-4 text-center sm:px-6 lg:px-8 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Badge */}
            <div className="flex w-fit items-center gap-2.5 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
              <span className="shrink-0 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                AI-Powered
              </span>
              <span className="text-gray-600 text-sm">Free content repurposing tool</span>
            </div>

            {/* Headline */}
            <h1 className="relative z-10 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl md:text-6xl md:leading-tight">
              <span>Turn One Blog Into </span>
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  21+ Platform-Ready Posts
                </span>
                {/* Decorative underline */}
                <svg
                  width="100%"
                  height="12"
                  viewBox="0 0 223 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute -bottom-2 left-0 w-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M1.30466 10.7431C39.971 5.28788 76.0949 3.02 115.082 2.30401C143.893 1.77489 175.871 0.628649 204.399 3.63102C210.113 3.92052 215.332 4.91391 221.722 6.06058"
                    stroke="url(#paint0_linear)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear"
                      x1="19.0416"
                      y1="4.03539"
                      x2="42.8362"
                      y2="66.9459"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0.2" stopColor="#2563eb" />
                      <stop offset="1" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-2xl text-lg text-gray-600 sm:text-xl">
              AI-powered content repurposing for marketers who move fast. Generate weeks of social media content from a single blog article in under 2 minutes.
            </p>

            {/* CTA Button */}
            <button
              onClick={scrollToGenerator}
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:-translate-y-0.5"
            >
              Try it Now
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                <span>Under 2 min generation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
                <span>21+ content pieces</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-purple-500"></span>
                <span>100% free to use</span>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className={`flex flex-col items-center gap-2 pb-8 transition-all duration-500 delay-500 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="animate-bounce">
              <svg
                className="h-6 w-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
            <p className="text-xs text-gray-400">Scroll to get started</p>
          </div>
        </div>
      </main>
    </div>
  );
}
