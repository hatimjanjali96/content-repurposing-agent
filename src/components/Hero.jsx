'use client';

import { useEffect, useState } from 'react';
import { Zap, BarChart3, DollarSign } from 'lucide-react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 opacity-90" />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
        }}
      />

      {/* Floating gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h1
          className={`text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Turn One Blog Into 21+
          <br />
          <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
            Platform-Ready Posts
          </span>
        </h1>

        <p
          className={`text-lg sm:text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto transition-all duration-500 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          AI-powered content repurposing for marketers who move fast.
          <br className="hidden sm:block" />
          Generate weeks of social content in under 2 minutes.
        </p>

        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-blue-200 transition-all duration-500 delay-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            <Zap className="w-4 h-4 text-yellow-400" />
            Under 2 min generation
          </span>
          <span className="hidden sm:block text-blue-400/50">|</span>
          <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            <BarChart3 className="w-4 h-4 text-green-400" />
            21+ content pieces
          </span>
          <span className="hidden sm:block text-blue-400/50">|</span>
          <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            100% free to use
          </span>
        </div>

        {/* Scroll indicator */}
        <div
          className={`mt-16 transition-all duration-500 delay-700 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="animate-bounce">
            <svg
              className="w-6 h-6 mx-auto text-white/70"
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
          <p className="text-xs text-blue-300/50 mt-2">Scroll to get started</p>
        </div>
      </div>
    </section>
  );
}
