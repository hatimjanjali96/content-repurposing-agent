'use client';

import { Check, Loader2 } from 'lucide-react';

export default function ProgressStages({ progress, currentStage }) {
  const stages = [
    { id: 1, label: 'Fetching blog content', threshold: 15 },
    { id: 2, label: 'Analyzing & extracting ideas', threshold: 25 },
    { id: 3, label: 'Generating posts 1-7', threshold: 55 },
    { id: 4, label: 'Generating posts 8-14', threshold: 85 },
    { id: 5, label: 'Finalizing package', threshold: 100 }
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
    <div className="w-full max-w-md space-y-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-3">
          <svg className="w-10 h-10 text-blue-600 animate-spin" viewBox="0 0 24 24">
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
        <h3 className="text-xl font-semibold text-gray-900">Creating 14 LinkedIn Posts</h3>
        {currentStage && (
          <p className="text-blue-600 font-medium mt-1">{currentStage}</p>
        )}
      </div>

      <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
        {stages.map((stage, index) => {
          const status = getStageStatus(stage, index);
          const stageProgress = getStageProgress(stage, index);

          return (
            <div key={stage.id} className="flex items-start gap-3">
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300
                  ${status === 'complete'
                    ? 'bg-green-500'
                    : status === 'active'
                      ? 'bg-blue-500'
                      : 'bg-gray-200'}
                `}
              >
                {status === 'complete' ? (
                  <Check className="w-3.5 h-3.5 text-white" />
                ) : status === 'active' ? (
                  <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                )}
              </div>

              <div className="flex-1 pt-0.5">
                <p
                  className={`text-sm font-medium transition-colors duration-300
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
                  <div className="mt-1.5 h-1 bg-gray-200 rounded-full overflow-hidden">
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
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Overall Progress</span>
          <span className="text-xl font-bold text-blue-600">{progress}%</span>
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
