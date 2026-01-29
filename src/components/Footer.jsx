'use client';

import { Linkedin, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 py-10 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Social Marketing Content Team</h3>
            <p className="text-sm text-gray-400">
              AI-powered content transformation for modern marketers
            </p>
          </div>

          <div className="flex items-center justify-center gap-6">
            <a
              href="https://linkedin.com/in/hatimjanjali"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <Linkedin className="w-5 h-5" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
            <span className="text-gray-700">|</span>
            <a
              href="https://resume-website-one-ruby.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <Globe className="w-5 h-5" />
              <span className="hidden sm:inline">Portfolio</span>
            </a>
          </div>

          <div className="pt-6 border-t border-gray-800">
            <p className="text-sm text-gray-500">
              Built by Hatim Janjali - 2026
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Powered by Groq AI + Vercel
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
