'use client';

import { Check, Loader2 } from 'lucide-react';

export default function ProgressStages({ progress }) {
  const stages = [
    { id: 1, label: 'Fetching blog content', threshold: 10 },
    { id: 2, label: 'Analyzing brand guidelines', threshold: 25 },
    { id: 3, label: 'Extracting main ideas', threshold: 40 },
    { id: 4, label: 'Generating content pieces', threshold: 70 },
    { id: 5, label: 'Building PDF package', threshold: 90 }
  ];

  const getStageStatus = (stage, index) => {
    if (progress >= stage.threshold) return 'complete';
    const prevThreshold = index > 0 ? stages[index - 1].threshold : 0;
    if (progress >= prevThreshold) return 'active';
    return 'pending';
  };

  const getStageProgress = (stage, index) => {
    const prevThreshold = index > 0 ? stages[index - 1].threshold : 0;
    const range = stage.threshold - prevThreshold;
    const stageProgress = progress - prevThreshold;
    return Math.max(0, Math.min(100, (stageProgress / range) * 100));
  };

  return (
    <div className="w-full max-w-md space-y-5">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-4">
          <div className="relative">
            <svg className="w-12 h-12 text-blue-600 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Creating Your Content</h3>
        <p className="text-gray-500 mt-1">This usually takes 60-90 seconds</p>
      </div>

      {stages.map((stage, index) => {
        const status = getStageStatus(stage, index);
        const stageProgress = getStageProgress(stage, index);

        return (
          <div key={stage.id} className="flex items-start gap-3">
            <div
              className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300
                ${status === 'complete'
                  ? 'bg-green-500'
                  : status === 'active'
                    ? 'bg-blue-500'
                    : 'bg-gray-200'}
              `}
            >
              {status === 'complete' ? (
                <Check className="w-4 h-4 text-white" />
              ) : status === 'active' ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-gray-400" />
              )}
            </div>

            <div className="flex-1 pt-0.5">
              <p
                className={`font-medium transition-colors duration-300
                  ${status === 'complete'
                    ? 'text-green-700'
                    : status === 'active'
                      ? 'text-blue-700'
                      : 'text-gray-400'}
                `}
              >
                {stage.label}
                {status === 'active' && '...'}
              </p>

              {status === 'active' && (
                <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${stageProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Overall Progress</span>
          <span className="text-2xl font-bold text-blue-600">{progress}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
