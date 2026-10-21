import React from 'react';
import { ArrowLeft, ArrowRight, Check, Info } from 'lucide-react';
import { ProgressBar } from './ProgressBar.tsx';
import { UserPreferences } from '../types.ts';

export interface QuestionScreenProps {
  currentStep: number; // 1 to 5
  preferences: UserPreferences;
  onSelectOption: (field: keyof UserPreferences, value: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
}

interface StepConfig {
  field: keyof UserPreferences;
  title: string;
  subtitle: string;
  options: {
    label: string;
    emoji: string;
    desc?: string;
  }[];
  notice?: string;
}

const STEP_CONFIGS: StepConfig[] = [
  {
    field: 'category',
    title: '어떤 종류의 음식이 먹고 싶나요?',
    subtitle: '끌리는 요리 카테고리를 하나 골라주세요.',
    options: [
      { label: '한식', emoji: '🍲', desc: '찌개, 볶음, 백반, 삼겹살 등' },
      { label: '일식', emoji: '🍣', desc: '초밥, 라멘, 돈가스, 덮밥 등' },
      { label: '중식', emoji: '🥟', desc: '짜장, 짬뽕, 탕수육, 마라 등' },
      { label: '양식', emoji: '🍕', desc: '파스타, 피자, 버거, 스테이크 등' },
      { label: '동남아 음식', emoji: '🍜', desc: '쌀국수, 팟타이, 분짜, 반미 등' },
      { label: '상관없어요', emoji: '✨', desc: '무엇이든 맛있으면 다 좋아요' },
    ],
  },
  {
    field: 'menuType',
    title: '어떤 종류의 메뉴가 좋나요?',
    subtitle: '주요 식재료나 메뉴 형태를 골라주세요.',
    options: [
      { label: '면 요리', emoji: '🍜', desc: '라멘, 짬뽕, 칼국수, 파스타, 쌀국수' },
      { label: '밥 요리', emoji: '🍚', desc: '찌개백반, 비빔밥, 덮밥, 리소토, 볶음밥' },
      { label: '고기 요리', emoji: '🥩', desc: '삼겹살, 불고기, 돈가스, 스테이크' },
      { label: '해산물 요리', emoji: '🦐', desc: '초밥, 해물찜, 팟타이, 생선구이' },
      { label: '채소 요리', emoji: '🥗', desc: '샐러드, 나물비빔밥, 공심채 볶음' },
      { label: '빵 또는 샌드위치', emoji: '🥪', desc: '수제버거, 화덕피자, 샌드위치, 브런치' },
      { label: '상관없어요', emoji: '✨', desc: '어떤 형태의 메뉴든 상관없어요' },
    ],
  },
  {
    field: 'flavor',
    title: '어떤 맛을 원하나요?',
    subtitle: '지금 머릿속에 가장 당기는 맛을 골라주세요.',
    options: [
      { label: '매콤한 맛', emoji: '🌶️', desc: '스트레스 싹 날리는 화끈하고 알싸한 맛' },
      { label: '담백한 맛', emoji: '🥣', desc: '자극 없이 속이 편안하고 깔끔한 맛' },
      { label: '고소한 맛', emoji: '🧀', desc: '치즈, 참기름, 버터의 풍미 가득한 맛' },
      { label: '달콤짭짤한 맛', emoji: '🍯', desc: '단짠단짠 밥도둑 양념의 매력' },
      { label: '새콤한 맛', emoji: '🍋', desc: '입맛 돋우는 상큼하고 산뜻한 맛' },
      { label: '얼큰한 맛', emoji: '🔥', desc: '속이 뻥 뚫리는 시원칼칼한 국물 맛' },
      { label: '상관없어요', emoji: '✨', desc: '맛의 종류는 상관없어요' },
    ],
  },
  {
    field: 'fullness',
    title: '얼마나 든든하게 먹고 싶나요?',
    subtitle: '오늘의 배고픔 정도에 맞춰 포만감을 골라주세요.',
    options: [
      { label: '가볍게 먹고 싶어요', emoji: '🌱', desc: '부담 없이 산뜻하고 소화가 잘되는 식사' },
      { label: '적당히 먹고 싶어요', emoji: '🍽️', desc: '딱 알맞게 기분 좋은 일반적인 한 끼' },
      { label: '든든하게 먹고 싶어요', emoji: '💪', desc: '푸짐하게 배부르고 힘나는 든든한 식사' },
      { label: '상관없어요', emoji: '✨', desc: '배고픔 정도는 상관없어요' },
    ],
  },
  {
    field: 'budget',
    title: '한 끼 예산은 얼마인가요?',
    subtitle: '생각하시는 대략적인 예산 범위를 골라주세요.',
    options: [
      { label: '10,000원 이하', emoji: '🪙', desc: '부담 없는 착한 가성비 한 끼' },
      { label: '10,000원 초과~20,000원 이하', emoji: '💵', desc: '가장 대중적인 일반적인 점심·저녁 식사' },
      { label: '20,000원 초과', emoji: '✨', desc: '특별한 날 나를 위한 프리미엄 외식' },
      { label: '상관없어요', emoji: '🤝', desc: '가격대 상관없이 추천해주세요' },
    ],
    notice: '※ 제시된 가격은 실제 식당의 확정 가격이 아니라 일반적인 예상 가격대입니다.',
  },
];

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  currentStep,
  preferences,
  onSelectOption,
  onNext,
  onPrev,
  onSubmit,
}) => {
  const stepIndex = currentStep - 1;
  const config = STEP_CONFIGS[stepIndex];
  const currentValue = preferences[config.field];
  const isSelected = Boolean(currentValue);
  const isLastStep = currentStep === STEP_CONFIGS.length;

  return (
    <div className="w-full max-w-2xl mx-auto py-3 sm:py-8 px-4">
      {/* Step Progress Bar */}
      <ProgressBar
        currentStep={currentStep}
        totalSteps={STEP_CONFIGS.length}
        stepTitle={config.title}
      />

      {/* Question Header */}
      <div className="mb-7 text-left">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#FFF0EB] text-[#FF5A36] font-bold text-xs tracking-wider uppercase mb-2">
          <span>Q{currentStep}. Question</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug break-keep-all">
          {config.title}
        </h2>
        <p className="text-sm sm:text-base text-stone-600 mt-1.5 break-keep-all font-normal">
          {config.subtitle}
        </p>
      </div>

      {/* Options Grid (Single choice per question) */}
      <div
        role="radiogroup"
        aria-label={config.title}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-7"
      >
        {config.options.map((opt) => {
          const selected = currentValue === opt.label;
          return (
            <button
              key={opt.label}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelectOption(config.field, opt.label)}
              className={`flex items-start gap-3.5 p-4 sm:p-4.5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF5A36]/30 ${
                selected
                  ? 'border-[#FF5A36] bg-[#FFF5F2] shadow-[0_4px_16px_rgba(255,90,54,0.15)] ring-2 ring-[#FF5A36]/25 scale-[1.01]'
                  : 'border-[#EAE3D9] bg-white hover:border-[#FF5A36]/40 hover:bg-[#FAF7F2] shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              <div
                className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200 ${
                  selected
                    ? 'bg-[#FF5A36] text-white shadow-sm shadow-[#FF5A36]/30 scale-105'
                    : 'bg-[#F5EFE6] text-stone-700'
                }`}
              >
                {opt.emoji}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5">
                  <span
                    className={`text-base font-bold truncate ${
                      selected ? 'text-[#C93B18] font-extrabold' : 'text-stone-800'
                    }`}
                  >
                    {opt.label}
                  </span>
                  {selected && (
                    <span className="w-5 h-5 rounded-full bg-[#FF5A36] text-white flex items-center justify-center shrink-0 shadow-2xs animate-in zoom-in-75 duration-150">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                {opt.desc && (
                  <p
                    className={`text-xs mt-1 leading-relaxed break-keep-all ${
                      selected ? 'text-[#A33A20] font-medium' : 'text-stone-500'
                    }`}
                  >
                    {opt.desc}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Notice Message if any (e.g. Budget estimation notice) */}
      {config.notice && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs sm:text-sm mb-7">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span className="break-keep-all leading-relaxed">{config.notice}</span>
        </div>
      )}

      {/* Navigation Footer Buttons */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#EAE3D9]">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentStep === 1}
          className={`flex items-center gap-1.5 px-4 sm:px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all ${
            currentStep === 1
              ? 'opacity-30 cursor-not-allowed text-stone-400 bg-stone-100'
              : 'text-stone-700 bg-white hover:bg-stone-50 border border-[#E0D8CC] shadow-2xs hover:shadow-xs cursor-pointer active:scale-95'
          }`}
          aria-label="이전 단계로 이동"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>이전</span>
        </button>

        {isLastStep ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!isSelected}
            className={`flex items-center gap-2 px-7 sm:px-9 py-3.5 rounded-xl font-extrabold text-sm sm:text-base shadow-md transition-all ${
              isSelected
                ? 'bg-gradient-to-r from-[#FF5A36] to-[#FF7556] hover:from-[#E04826] hover:to-[#FF6442] text-white shadow-[#FF5A36]/30 hover:shadow-[#FF5A36]/40 cursor-pointer active:scale-95 hover:-translate-y-0.5'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
            }`}
            aria-label="메뉴 추천받기"
          >
            <span>메뉴 추천받기</span>
            <Check className="w-5 h-5 stroke-[2.8]" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={!isSelected}
            className={`flex items-center gap-2 px-7 sm:px-9 py-3.5 rounded-xl font-extrabold text-sm sm:text-base shadow-md transition-all ${
              isSelected
                ? 'bg-[#FF5A36] hover:bg-[#E04826] text-white shadow-[#FF5A36]/25 hover:shadow-[#FF5A36]/35 cursor-pointer active:scale-95 hover:-translate-y-0.5'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
            }`}
            aria-label="다음 단계로 이동"
          >
            <span>다음</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
};
