import React from 'react';
import { Utensils, RotateCcw, Sparkles, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  onRestart: () => void;
  showRestartButton?: boolean;
  onOpenExclusion?: () => void;
  excludedCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onRestart,
  showRestartButton = false,
  onOpenExclusion,
  excludedCount = 0,
}) => {
  return (
    <header className="w-full bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EBE5DC] sticky top-0 z-30 transition-all">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-2">
        <button
          onClick={onRestart}
          className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A36] rounded-2xl p-1 -ml-1 transition-transform active:scale-[0.98]"
          aria-label="오늘 뭐 먹지? 처음으로 이동"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8A65] flex items-center justify-center text-white shadow-md shadow-[#FF5A36]/25 group-hover:scale-105 transition-transform duration-200">
            <Utensils className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-stone-900 group-hover:text-[#FF5A36] transition-colors">
                오늘 뭐 먹지?
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FFF0EB] text-[#FF5A36] border border-[#FF5A36]/20">
                <Sparkles className="w-2.5 h-2.5" />
                Curation
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium hidden sm:block">
              몇 가지 질문에 답하면 오늘의 메뉴를 골라드릴게요.
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          {/* Exclusion Settings Button */}
          {onOpenExclusion && (
            <button
              onClick={onOpenExclusion}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl border transition-all cursor-pointer active:scale-95 ${
                excludedCount > 0
                  ? 'bg-[#FFF0EB] text-[#C93B18] border-[#FF5A36]/30 shadow-2xs hover:bg-[#FFE6DC]'
                  : 'bg-white hover:bg-stone-50 text-stone-600 border-[#E2DBD1] shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
              }`}
              title="못 먹는 음식 및 알레르기 재료 제외 설정"
              aria-label="제외 설정 열기"
            >
              <ShieldAlert
                className={`w-3.5 h-3.5 ${
                  excludedCount > 0 ? 'text-[#FF5A36]' : 'text-stone-500'
                }`}
              />
              <span>제외 설정</span>
              {excludedCount > 0 && (
                <span className="px-1.5 py-0.2 bg-[#FF5A36] text-white text-[10px] font-black rounded-full leading-tight">
                  {excludedCount}
                </span>
              )}
            </button>
          )}

          {showRestartButton && (
            <button
              onClick={onRestart}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 border border-[#E2DBD1] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-sm active:scale-95 transition-all cursor-pointer"
              title="처음부터 다시 시작하기"
              aria-label="처음부터 다시 시작"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              <span>다시 시작</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
