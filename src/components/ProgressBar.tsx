import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepTitle?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  stepTitle,
}) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full mb-7">
      <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-600 mb-2.5">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FFF0EB] border border-[#FF5A36]/20">
          <span className="w-2 h-2 rounded-full bg-[#FF5A36] animate-pulse" />
          <span className="text-[#FF5A36] font-extrabold text-xs tracking-wide">
            {currentStep} / {totalSteps} 단계
          </span>
        </div>

        {stepTitle && (
          <span className="text-stone-500 font-medium text-xs sm:text-sm truncate max-w-[190px] sm:max-w-none">
            {stepTitle}
          </span>
        )}

        <span className="text-stone-400 font-mono text-xs font-bold">{percentage}%</span>
      </div>

      <div className="w-full bg-[#ECE5DB] rounded-full h-2.5 overflow-hidden p-0.5 shadow-inner">
        <div
          className="bg-gradient-to-r from-[#FF5A36] via-[#FF7556] to-[#FFA07A] h-full rounded-full transition-all duration-400 ease-out shadow-[0_1px_4px_rgba(255,90,54,0.3)]"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={`${currentStep}단계 진행 중`}
        />
      </div>
    </div>
  );
};
