'use client';

import { useState } from 'react';
import { Download, FileText, AlertTriangle, CheckCircle2, Package } from 'lucide-react';
import ProgressStages from './ProgressStages';

export default function OutputPreview({ status, progress, data, error }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPDF = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('PDF generation failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `content-package-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Idle State
  if (status === 'idle') {
    return (
      <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-gray-100 flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <div>
            <p className="text-gray-500 text-lg">Your content package will appear here</p>
            <p className="text-gray-400 text-sm mt-1">Enter a blog URL and click generate to get started</p>
          </div>
        </div>
      </div>
    );
  }

  // Generating State
  if (status === 'generating') {
    return (
      <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-gray-100 flex items-center justify-center min-h-[500px]">
        <ProgressStages progress={progress} />
      </div>
    );
  }

  // Error State
  if (status === 'error') {
    return (
      <div className="bg-red-50 rounded-2xl p-8 sm:p-12 shadow-xl border border-red-100 flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-red-900">Oops! Something went wrong</h3>
          <p className="text-red-700">{error}</p>
          <div className="mt-6 bg-white rounded-lg p-4 text-left border border-red-200">
            <p className="font-medium text-red-800 mb-2">Common fixes:</p>
            <ul className="text-sm text-red-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">-</span>
                Check if the blog URL is publicly accessible
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">-</span>
                Ensure your file is under 10MB
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">-</span>
                Try a different blog URL
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">-</span>
                Wait a moment and try again
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Complete State
  if (status === 'complete') {
    return (
      <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-gray-100 flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-6 max-w-md w-full">
          {/* Success animation */}
          <div className="relative">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-green-400 animate-ping opacity-20" />
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900">Package Ready!</h3>
            <p className="text-gray-500 mt-1">Your content has been generated successfully</p>
          </div>

          {/* Preview card */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 space-y-4">
            <div className="w-24 h-32 mx-auto bg-white rounded-lg shadow-md flex items-center justify-center border border-gray-200">
              <FileText className="w-12 h-12 text-red-600" />
            </div>

            <div>
              <p className="font-semibold text-gray-900">Content Repurposing Package</p>
              <p className="text-sm text-gray-600 mt-1">
                {data?.summary?.totalPieces || 21}+ pieces - {data?.summary?.pages || 35} pages
              </p>
            </div>

            {/* Content summary */}
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="bg-white rounded-lg p-2">
                <span className="font-medium">LinkedIn</span>: {data?.content?.linkedin?.length || 5} posts
              </div>
              <div className="bg-white rounded-lg p-2">
                <span className="font-medium">Instagram</span>: {data?.content?.instagram?.length || 2} posts
              </div>
              <div className="bg-white rounded-lg p-2">
                <span className="font-medium">Twitter</span>: {data?.content?.twitter?.length || 3} threads
              </div>
              <div className="bg-white rounded-lg p-2">
                <span className="font-medium">Facebook</span>: {data?.content?.facebook?.length || 4} posts
              </div>
            </div>
          </div>

          {/* Download button */}
          <button
            onClick={downloadPDF}
            disabled={isDownloading}
            className={`w-full py-4 rounded-xl font-semibold text-white text-lg
              transition-all duration-200 shadow-lg flex items-center justify-center gap-2
              ${isDownloading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-xl hover:-translate-y-0.5'}
            `}
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Preparing PDF...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Download PDF Package
              </>
            )}
          </button>

          {data?.blogMetadata?.title && (
            <p className="text-xs text-gray-400 mt-2">
              Based on: {data.blogMetadata.title.substring(0, 50)}...
            </p>
          )}
        </div>
      </div>
    );
  }

  return null;
}
