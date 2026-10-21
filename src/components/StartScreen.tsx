import React from 'react';
import { Sparkles, Dices, ArrowRight, UtensilsCrossed, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

interface StartScreenProps {
  onStartQuestionnaire: () => void;
  onOpenQuickRoulette: () => void;
  onOpenExclusion?: () => void;
  excludedCount?: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartQuestionnaire,
  onOpenQuickRoulette,
  onOpenExclusion,
  excludedCount = 0,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-14 max-w-2xl mx-auto text-center px-4">
      {/* Category Tag Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0EB] text-[#FF5A36] text-xs sm:text-sm font-bold mb-6 border border-[#FF5A36]/20 shadow-xs">
        <Sparkles className="w-4 h-4 text-[#FF5A36]" />
        <span>취향 기반 맞춤 메뉴 큐레이션</span>
      </div>

      {/* Main Title & Subtitle */}
      <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight leading-tight mb-4 break-keep-all">
        오늘 뭐 먹지?
      </h1>
      <p className="text-base sm:text-xl text-stone-600 max-w-lg mb-8 leading-relaxed font-normal break-keep-all">
        몇 가지 질문에 답하면 오늘의 메뉴를 골라드릴게요.
        <br />
        <span className="text-xs sm:text-sm text-stone-500 mt-2 block break-keep-all leading-normal">
          한식, 일식, 중식, 양식, 동남아 음식 중에서 지금 당신의 기분과 예산에 딱 맞는 최고의 한 끼를 찾아드립니다.
        </span>
      </p>

      {/* Food Icons Showcase */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 text-2xl sm:text-3xl bg-white/80 backdrop-blur-xs px-5 py-3.5 rounded-2xl border border-[#EBE5DC] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <span title="한식" className="hover:scale-125 transition-transform duration-200 cursor-default">🍲</span>
        <span title="일식" className="hover:scale-125 transition-transform duration-200 cursor-default">🍣</span>
        <span title="중식" className="hover:scale-125 transition-transform duration-200 cursor-default">🍜</span>
        <span title="양식" className="hover:scale-125 transition-transform duration-200 cursor-default">🍕</span>
        <span title="동남아" className="hover:scale-125 transition-transform duration-200 cursor-default">🍤</span>
        <span title="고기" className="hover:scale-125 transition-transform duration-200 cursor-default">🥩</span>
      </div>

      {/* Dislike / Allergy Exclusion Prompt */}
      {onOpenExclusion && (
        <div className="mb-8">
          <button
            onClick={onOpenExclusion}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-stone-50 border border-[#E0D8CC] text-xs sm:text-sm text-stone-700 font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
            aria-label="못 먹는 음식이나 재료 제외 설정"
          >
            <ShieldAlert className="w-4 h-4 text-[#FF5A36]" />
            <span>
              못 먹는 음식이나 피하고 싶은 재료가 있나요?
            </span>
            {excludedCount > 0 ? (
              <span className="bg-[#FF5A36] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {excludedCount}개 제외 중
              </span>
            ) : (
              <span className="text-[#FF5A36] font-bold">제외 설정하기</span>
            )}
          </button>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3.5 w-full max-w-md justify-center mb-12">
        <button
          onClick={onStartQuestionnaire}
          className="flex-1 inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7556] hover:from-[#E04826] hover:to-[#FF6442] text-white font-extrabold text-lg shadow-[0_8px_24px_-4px_rgba(255,90,54,0.38)] hover:shadow-[0_12px_28px_-4px_rgba(255,90,54,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF5A36]/30"
          aria-label="메뉴 추천받기 시작"
        >
          <span>메뉴 추천받기</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>

        <button
          onClick={onOpenQuickRoulette}
          className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-bold text-base border-2 border-[#E5DFD5] hover:border-[#FF5A36]/40 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-stone-300"
          title="질문 없이 바로 룰렛으로 결정하기"
          aria-label="즉석 메뉴 룰렛 돌리기"
        >
          <Dices className="w-5 h-5 text-[#FF5A36]" />
          <span>즉석 룰렛 돌리기</span>
        </button>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-xl text-left">
        <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-xs border border-[#EBE5DC] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 font-bold text-stone-900 text-sm mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>50+ 엄선된 인기 메뉴</span>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed break-keep-all">
            주변에서 쉽게 찾을 수 있는 대표 요리 데이터베이스
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-xs border border-[#EBE5DC] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 font-bold text-stone-900 text-sm mb-1">
            <Clock className="w-4 h-4 text-[#FF5A36] shrink-0" />
            <span>단 30초 맞춤 질문</span>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed break-keep-all">
            종류, 맛, 식사량, 예산만 콕 짚어 스마트하게 큐레이션
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-xs border border-[#EBE5DC] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 font-bold text-stone-900 text-sm mb-1">
            <UtensilsCrossed className="w-4 h-4 text-amber-500 shrink-0" />
            <span>선택장애 해결 룰렛</span>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed break-keep-all">
            추천된 메뉴 중 고민될 때 룰렛 한 판으로 깔끔 종결
          </p>
        </div>
      </div>
    </div>
  );
};
