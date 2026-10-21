import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { StartScreen } from './components/StartScreen.tsx';
import { QuestionScreen } from './components/QuestionScreen.tsx';
import { ResultScreen } from './components/ResultScreen.tsx';
import { RouletteModal } from './components/RouletteModal.tsx';
import { ExclusionModal } from './components/ExclusionModal.tsx';
import { RestaurantSearchModal } from './components/RestaurantSearchModal.tsx';
import { FOOD_DATABASE } from './data/foodData.ts';
import { recommendFoods, shuffleArray } from './utils/recommendation.ts';
import {
  filterExcludedFoods,
  loadExcludedItems,
  saveExcludedItems,
} from './utils/exclusion.ts';
import {
  RecommendationOutput,
  RecommendedFood,
  UserPreferences,
  ExcludedItem,
} from './types.ts';

type ViewMode = 'start' | 'question' | 'results';

const INITIAL_PREFERENCES: UserPreferences = {
  category: '' as any,
  menuType: '' as any,
  flavor: '' as any,
  fullness: '' as any,
  budget: '' as any,
};

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('start');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [preferences, setPreferences] = useState<UserPreferences>(INITIAL_PREFERENCES);
  const [recommendationOutput, setRecommendationOutput] = useState<RecommendationOutput>({
    items: [],
    wasRelaxed: false,
  });
  const [isRouletteOpen, setIsRouletteOpen] = useState<boolean>(false);
  const [rouletteFoods, setRouletteFoods] = useState<RecommendedFood[]>([]);

  // Excluded items persisted in localStorage
  const [excludedItems, setExcludedItems] = useState<ExcludedItem[]>([]);
  const [isExclusionModalOpen, setIsExclusionModalOpen] = useState<boolean>(false);

  // Restaurant search modal state
  const [isRestaurantSearchOpen, setIsRestaurantSearchOpen] = useState<boolean>(false);
  const [selectedSearchFood, setSelectedSearchFood] = useState<string>('');

  const handleOpenRestaurantSearch = (foodName: string) => {
    setSelectedSearchFood(foodName);
    setIsRestaurantSearchOpen(true);
  };

  // Load exclusions on initial mount
  useEffect(() => {
    const saved = loadExcludedItems();
    if (saved && saved.length > 0) {
      setExcludedItems(saved);
    }
  }, []);

  // Support ?autostart=1 or direct parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        setViewMode('question');
      }
    }
  }, []);

  // Update option selection
  const handleSelectOption = (field: keyof UserPreferences, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Next step
  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Prev step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setViewMode('start');
    }
  };

  // Submit questionnaire and calculate recommendations
  const handleSubmitQuestionnaire = () => {
    const result = recommendFoods(FOOD_DATABASE, preferences, 5, excludedItems);
    setRecommendationOutput(result);
    setRouletteFoods(result.items);
    setViewMode('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reroll recommendations with same preferences and current exclusions
  const handleReroll = () => {
    const result = recommendFoods(FOOD_DATABASE, preferences, 5, excludedItems);
    setRecommendationOutput(result);
    setRouletteFoods(result.items);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return to modify filters (keeps answers preserved)
  const handleModifyFilters = () => {
    setViewMode('question');
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Restart from beginning
  const handleRestart = () => {
    setPreferences(INITIAL_PREFERENCES);
    setCurrentStep(1);
    setViewMode('start');
    setIsRouletteOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open quick roulette with up to 6 non-excluded dishes
  const handleOpenQuickRoulette = () => {
    const available = filterExcludedFoods(FOOD_DATABASE, excludedItems);

    if (available.length === 0) {
      setIsExclusionModalOpen(true);
      return;
    }

    const randomPicks = shuffleArray(available)
      .slice(0, Math.min(6, available.length))
      .map((item) => ({
        ...item,
        recommendReason: '오늘의 인기 추천 메뉴 중 하나예요!',
        matchScore: 90,
      }));
    setRouletteFoods(randomPicks);
    setIsRouletteOpen(true);
  };

  // Exclusion handlers
  const handleToggleExclusionItem = (item: ExcludedItem) => {
    setExcludedItems((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      const updated = exists ? prev.filter((p) => p.id !== item.id) : [...prev, item];
      saveExcludedItems(updated);

      // If user is currently viewing results, immediately recalculate
      if (viewMode === 'results') {
        const refreshed = recommendFoods(FOOD_DATABASE, preferences, 5, updated);
        setRecommendationOutput(refreshed);
        setRouletteFoods(refreshed.items);
      }
      return updated;
    });
  };

  const handleRemoveExclusionItem = (id: string) => {
    setExcludedItems((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      saveExcludedItems(updated);

      if (viewMode === 'results') {
        const refreshed = recommendFoods(FOOD_DATABASE, preferences, 5, updated);
        setRecommendationOutput(refreshed);
        setRouletteFoods(refreshed.items);
      }
      return updated;
    });
  };

  const handleClearAllExclusions = () => {
    setExcludedItems([]);
    saveExcludedItems([]);

    if (viewMode === 'results') {
      const refreshed = recommendFoods(FOOD_DATABASE, preferences, 5, []);
      setRecommendationOutput(refreshed);
      setRouletteFoods(refreshed.items);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-800 flex flex-col font-sans selection:bg-[#FFE5DC] selection:text-[#C93B18] overflow-x-hidden">
      {/* Top Header */}
      <Header
        onRestart={handleRestart}
        showRestartButton={viewMode !== 'start'}
        onOpenExclusion={() => setIsExclusionModalOpen(true)}
        excludedCount={excludedItems.length}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-4 flex flex-col items-center justify-start">
        {viewMode === 'start' && (
          <StartScreen
            onStartQuestionnaire={() => {
              setViewMode('question');
              setCurrentStep(1);
            }}
            onOpenQuickRoulette={handleOpenQuickRoulette}
            onOpenExclusion={() => setIsExclusionModalOpen(true)}
            excludedCount={excludedItems.length}
          />
        )}

        {viewMode === 'question' && (
          <QuestionScreen
            currentStep={currentStep}
            preferences={preferences}
            onSelectOption={handleSelectOption}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            onSubmit={handleSubmitQuestionnaire}
          />
        )}

        {viewMode === 'results' && (
          <ResultScreen
            output={recommendationOutput}
            preferences={preferences}
            excludedItems={excludedItems}
            onReroll={handleReroll}
            onModifyFilters={handleModifyFilters}
            onRestart={handleRestart}
            onOpenRoulette={() => setIsRouletteOpen(true)}
            onOpenExclusion={() => setIsExclusionModalOpen(true)}
            onSearchRestaurant={handleOpenRestaurantSearch}
          />
        )}
      </main>

      {/* Roulette Modal */}
      <RouletteModal
        isOpen={isRouletteOpen}
        onClose={() => setIsRouletteOpen(false)}
        foods={rouletteFoods}
        onSearchRestaurant={handleOpenRestaurantSearch}
      />

      {/* Exclusion Management Modal */}
      <ExclusionModal
        isOpen={isExclusionModalOpen}
        onClose={() => setIsExclusionModalOpen(false)}
        excludedItems={excludedItems}
        onToggleItem={handleToggleExclusionItem}
        onRemoveItem={handleRemoveExclusionItem}
        onClearAll={handleClearAllExclusions}
      />

      {/* Restaurant Search Modal */}
      <RestaurantSearchModal
        isOpen={isRestaurantSearchOpen}
        onClose={() => setIsRestaurantSearchOpen(false)}
        initialFoodName={selectedSearchFood}
      />

      {/* Footer */}
      <footer className="w-full border-t border-stone-200/70 py-6 px-4 text-center text-xs text-stone-500">
        <p className="max-w-md mx-auto leading-relaxed">
          <strong>오늘 뭐 먹지?</strong> — 한국어 맞춤 음식 & 메뉴 추천 큐레이션 서비스
          <br />
          <span className="text-stone-400 mt-1 block">
            표시된 가격대는 일반적인 식당 기준의 예상 금액으로 실제와 다를 수 있습니다.
          </span>
        </p>
      </footer>
    </div>
  );
}
