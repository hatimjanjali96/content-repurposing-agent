'use client';

import { useState } from 'react';
import { Download, Copy, Check, AlertTriangle, CheckCircle2, Package, ChevronDown, ChevronUp } from 'lucide-react';
import ProgressStages from './ProgressStages';

export default function OutputPreview({ status, progress, currentStage, data, error }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [expandedPost, setExpandedPost] = useState(null);

  const copyToClipboard = async (content, index) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

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
      a.download = `linkedin-posts-${Date.now()}.pdf`;
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

  const downloadJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkedin-posts-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Idle State
  if (status === 'idle') {
    return (
      <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-gray-100 flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <Package className="w-10 h-10 text-blue-500" />
          </div>
          <div>
            <p className="text-gray-500 text-lg">Your LinkedIn posts will appear here</p>
            <p className="text-gray-400 text-sm mt-1">Enter a blog URL and click generate to create 14 posts</p>
          </div>
        </div>
      </div>
    );
  }

  // Generating State
  if (status === 'generating') {
    return (
      <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-gray-100 flex items-center justify-center min-h-[500px]">
        <ProgressStages progress={progress} currentStage={currentStage} />
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

  // Complete State - Show LinkedIn Posts
  if (status === 'complete') {
    const posts = data?.linkedInPosts || [];

    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-6 h-6" />
            <h3 className="text-xl font-bold">LinkedIn Posts Ready!</h3>
          </div>
          <p className="text-blue-100 text-sm">
            {posts.length} posts generated from: {data?.blogMetadata?.title?.substring(0, 50)}...
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-gray-50 border-b flex gap-3 flex-wrap">
          <button
            onClick={downloadPDF}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? 'Preparing...' : 'Download PDF'}
          </button>
          <button
            onClick={downloadJSON}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download JSON
          </button>
        </div>

        {/* Posts Grid */}
        <div className="p-4 max-h-[600px] overflow-y-auto">
          <div className="space-y-4">
            {posts.map((post, index) => (
              <div
                key={post.postNumber || index}
                className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors"
              >
                {/* Post Header */}
                <div
                  className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                  onClick={() => setExpandedPost(expandedPost === index ? null : index)}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
                      {post.postNumber || index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{post.format?.replace(/-/g, ' ') || 'Post'}</p>
                      <p className="text-xs text-gray-500">{post.wordCount || 0} words</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(post.content, index);
                      }}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    {expandedPost === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Post Content (Expanded) */}
                {expandedPost === index && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-relaxed bg-white p-0 m-0">
                        {post.content}
                      </pre>
                    </div>
                    {post.ideaUsed && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Based on:</span> {post.ideaUsed}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Preview (Collapsed) */}
                {expandedPost !== index && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {post.content?.substring(0, 150)}...
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Summary Footer */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{posts.length} of 14 posts generated</span>
            <span>Ready to schedule for the next month</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
