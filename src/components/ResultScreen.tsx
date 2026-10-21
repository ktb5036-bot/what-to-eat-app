import React from 'react';
import {
  RotateCcw,
  SlidersHorizontal,
  Dices,
  RefreshCw,
  Info,
  Sparkles,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { FoodCard } from './FoodCard.tsx';
import { RecommendationOutput, UserPreferences, ExcludedItem } from '../types.ts';

interface ResultScreenProps {
  output: RecommendationOutput;
  preferences: UserPreferences;
  excludedItems: ExcludedItem[];
  onReroll: () => void;
  onModifyFilters: () => void;
  onRestart: () => void;
  onOpenRoulette: () => void;
  onOpenExclusion: () => void;
  onSearchRestaurant?: (foodName: string) => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  output,
  preferences,
  excludedItems,
  onReroll,
  onModifyFilters,
  onRestart,
  onOpenRoulette,
  onOpenExclusion,
  onSearchRestaurant,
}) => {
  const { items, wasRelaxed, relaxedDetails, isBlockedByExclusions, exclusionNotice } = output;

  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-8 px-4 overflow-x-hidden">
      {/* Top Banner & Summary */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF0EB] text-[#FF5A36] text-xs font-bold mb-3 border border-[#FF5A36]/20 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>맞춤 큐레이션 완료</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 tracking-tight break-keep-all">
          오늘 당신을 위한 추천 메뉴
        </h2>
        <p className="text-xs sm:text-base text-stone-600 mt-2 max-w-lg mx-auto break-keep-all font-normal">
          {items.length > 0
            ? `선택하신 취향에 맞춰 엄선한 베스트 ${items.length}가지 메뉴입니다. 마음에 쏙 드는 음식을 골라보세요!`
            : '선택하신 조건과 제외 설정에 맞는 메뉴를 찾고 있습니다.'}
        </p>

        {/* Selected Conditions & Exclusion Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-xl mx-auto text-xs">
          {Object.entries(preferences).map(([key, val]) => {
            if (!val || val === '상관없어요') return null;
            return (
              <span
                key={key}
                className="bg-white border border-[#E2DBD1] text-stone-700 px-3 py-1 rounded-xl font-bold shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
              >
                {val}
              </span>
            );
          })}

          {/* Active Excluded Items Badge */}
          {excludedItems.length > 0 && (
            <button
              onClick={onOpenExclusion}
              className="bg-[#FFF0EB] border border-[#FF5A36]/30 text-[#C93B18] px-3 py-1 rounded-xl font-bold shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex items-center gap-1 hover:bg-[#FFE6DC] transition-colors cursor-pointer"
              title="제외 항목 확인 및 수정"
            >
              <ShieldAlert className="w-3 h-3 text-[#FF5A36]" />
              <span>제외 {excludedItems.length}개 적용 중</span>
            </button>
          )}
        </div>
      </div>

      {/* Blocked by Exclusions Notice Banner */}
      {isBlockedByExclusions && (
        <div className="mb-7 p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
          <div className="w-7 h-7 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex-1">
            <span className="font-extrabold text-rose-900 block mb-0.5">
              제외 조건 안내
            </span>
            <p className="text-rose-800 leading-relaxed break-keep-all mb-3">
              {exclusionNotice ||
                '설정하신 못 먹는 음식이나 재료 제외 조건으로 인해 추천 가능한 메뉴가 부족합니다. 사용자의 선택을 임의로 무시하지 않으므로, 아래 버튼을 눌러 제외 항목을 확인하고 수정해 주세요.'}
            </p>
            <button
              onClick={onOpenExclusion}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>제외 항목 수정하기</span>
            </button>
          </div>
        </div>
      )}

      {/* Relaxed Condition Explanation Banner if applicable */}
      {wasRelaxed && relaxedDetails && !isBlockedByExclusions && (
        <div className="mb-7 p-4 sm:p-5 rounded-2xl bg-[#FFFBF0] border border-amber-200/90 text-amber-950 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
          <div className="w-7 h-7 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <span className="font-extrabold text-amber-900 block mb-0.5">안내 말씀</span>
            <p className="text-amber-800 leading-relaxed break-keep-all">{relaxedDetails}</p>
          </div>
        </div>
      )}

      {/* Hero Banner: Quick Roulette Button */}
      {items.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-[#FF5A36] to-[#FF7556] rounded-3xl p-5 sm:p-6 text-white shadow-[0_10px_28px_-6px_rgba(255,90,54,0.35)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold text-orange-100 flex items-center justify-center sm:justify-start gap-1.5 uppercase tracking-wide mb-1">
              <Dices className="w-3.5 h-3.5 text-white" />
              아직도 결정하기 어렵다면?
            </span>
            <h3 className="text-lg sm:text-xl font-black tracking-tight">
              추천 메뉴 {items.length}개로 행운의 룰렛 돌리기
            </h3>
            <p className="text-xs text-orange-100 mt-0.5 hidden sm:block">
              화살표가 가리키는 오늘의 운명 메뉴를 만나보세요!
            </p>
          </div>
          <button
            onClick={onOpenRoulette}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-[#FF5A36] hover:bg-[#FFF5F2] font-extrabold text-sm sm:text-base shadow-sm hover:shadow-md cursor-pointer active:scale-95 transition-all duration-200 shrink-0"
            aria-label="이 메뉴들로 룰렛 돌리기 열기"
          >
            <Dices className="w-5 h-5 text-[#FF5A36]" />
            <span>룰렛 돌리기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* List of Recommended Menus: 1 column on mobile, 2 columns on tablet/desktop */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {items.map((food, idx) => (
            <FoodCard
              key={food.id}
              food={food}
              rankIndex={idx}
              onSearchRestaurant={onSearchRestaurant}
            />
          ))}
        </div>
      ) : (
        /* Empty State Fallback */
        <div className="text-center py-14 px-4 rounded-3xl bg-white border border-[#EAE3D9] mb-10 shadow-xs">
          <AlertCircle className="w-12 h-12 text-stone-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-stone-800 mb-1">
            조건에 꼭 맞는 메뉴를 찾지 못했어요
          </h3>
          <p className="text-sm text-stone-500 max-w-md mx-auto mb-6 break-keep-all leading-relaxed">
            {isBlockedByExclusions
              ? '설정하신 제외 조건으로 인해 추천 가능한 메뉴가 없습니다. 제외 항목을 조정해 보세요.'
              : '선택하신 조건의 조합이 너무 좁을 수 있어요. 조건을 조금 넓히거나 다시 시작해 보세요.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {isBlockedByExclusions && (
              <button
                onClick={onOpenExclusion}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FF5A36] text-white font-bold text-sm shadow-md hover:bg-[#E04826] transition-colors cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>제외 항목 수정하기</span>
              </button>
            )}
            <button
              onClick={onModifyFilters}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-[#E0D8CC] text-stone-800 font-bold text-sm shadow-xs hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>조건 다시 선택하기</span>
            </button>
          </div>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-[#EAE3D9]">
        <button
          onClick={onReroll}
          disabled={items.length === 0}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-50 disabled:opacity-40 disabled:pointer-events-none text-stone-800 font-bold text-sm sm:text-base border border-[#E0D8CC] shadow-2xs hover:shadow-xs cursor-pointer active:scale-95 transition-all"
          aria-label="추천 메뉴 다시 추천받기"
        >
          <RefreshCw className="w-4 h-4 text-[#FF5A36]" />
          <span>다시 추천받기</span>
        </button>

        <button
          onClick={onModifyFilters}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-bold text-sm sm:text-base border border-[#E0D8CC] shadow-2xs hover:shadow-xs cursor-pointer active:scale-95 transition-all"
          aria-label="이전 질문 조건 바꾸기"
        >
          <SlidersHorizontal className="w-4 h-4 text-stone-600" />
          <span>조건 바꾸기</span>
        </button>

        <button
          onClick={onRestart}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-2xl text-stone-500 hover:text-stone-800 font-semibold text-sm transition-colors cursor-pointer"
          aria-label="처음부터 다시하기"
        >
          <RotateCcw className="w-4 h-4" />
          <span>처음부터</span>
        </button>
      </div>
    </div>
  );
};
