import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  RotateCcw,
  Check,
  ShieldAlert,
  SlidersHorizontal,
  Plus,
  Trash2,
} from 'lucide-react';
import { ExcludedItem, FoodCategory } from '../types.ts';
import { FOOD_DATABASE } from '../data/foodData.ts';
import { COMMON_INGREDIENTS } from '../data/commonIngredients.ts';

interface ExclusionModalProps {
  isOpen: boolean;
  onClose: () => void;
  excludedItems: ExcludedItem[];
  onToggleItem: (item: ExcludedItem) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
}

type TabCategory = '전체' | '주요 재료' | Exclude<FoodCategory, '상관없어요'>;

export const ExclusionModal: React.FC<ExclusionModalProps> = ({
  isOpen,
  onClose,
  excludedItems,
  onToggleItem,
  onRemoveItem,
  onClearAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabCategory>('전체');

  // Set of selected item IDs for fast lookup
  const selectedIds = useMemo(
    () => new Set(excludedItems.map((item) => item.id)),
    [excludedItems]
  );

  // Filtered ingredients
  const filteredIngredients = useMemo(() => {
    if (activeTab !== '전체' && activeTab !== '주요 재료') return [];
    const query = searchTerm.trim().toLowerCase();
    return COMMON_INGREDIENTS.filter((ing) => {
      if (!query) return true;
      return (
        ing.name.toLowerCase().includes(query) ||
        ing.category.toLowerCase().includes(query) ||
        ing.description.toLowerCase().includes(query)
      );
    });
  }, [searchTerm, activeTab]);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    if (activeTab === '주요 재료') return [];
    const query = searchTerm.trim().toLowerCase();
    return FOOD_DATABASE.filter((food) => {
      if (activeTab !== '전체' && food.category !== activeTab) return false;
      if (!query) return true;
      return (
        food.name.toLowerCase().includes(query) ||
        food.category.toLowerCase().includes(query) ||
        food.ingredients.some((ing) => ing.toLowerCase().includes(query)) ||
        food.tags.some((t) => t.toLowerCase().includes(query))
      );
    });
  }, [searchTerm, activeTab]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exclusion-modal-title"
    >
      <div className="bg-[#FAF7F2] w-full max-w-3xl rounded-3xl shadow-2xl border border-[#EAE3D9] flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-white border-b border-[#EAE3D9] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF0EB] border border-[#FF5A36]/20 flex items-center justify-center text-[#FF5A36] shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="exclusion-modal-title"
                className="text-lg sm:text-xl font-black text-stone-900 tracking-tight"
              >
                못 먹거나 싫어하는 음식·재료 제외
              </h2>
              <p className="text-xs text-stone-500 mt-0.5 break-keep-all">
                선택한 항목은 모든 추천과 룰렛에서 완전히 제외됩니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Active Summary */}
        <div className="p-4 sm:p-5 bg-[#FAF7F2] border-b border-[#EAE3D9] shrink-0 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="음식 이름이나 제외할 재료 검색 (예: 오이, 고수, 돼지고기, 김치찌개)"
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white border border-[#E0D8CC] text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#FF5A36] focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                aria-label="검색어 지우기"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Active Excluded Tags Box */}
          {excludedItems.length > 0 ? (
            <div className="bg-white p-3 rounded-2xl border border-[#EAE3D9] shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF5A36]" />
                  현재 제외 중 ({excludedItems.length}개)
                </span>
                <button
                  onClick={onClearAll}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  title="전체 제외 목록 비우기"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>전체 초기화</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {excludedItems.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-xl bg-[#FFF0EB] text-[#C93B18] border border-[#FF5A36]/25 group"
                  >
                    <span className="text-[10px] text-[#FF5A36] font-bold">
                      {item.type === 'ingredient' ? '[재료]' : '[메뉴]'}
                    </span>
                    <span>{item.name}</span>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-[#FF5A36] hover:text-red-700 ml-0.5 rounded-full hover:bg-white/60 p-0.5 cursor-pointer"
                      title="제외 해제"
                      aria-label={`${item.name} 제외 해제`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-stone-500 px-1">
              💡 아래 목록이나 검색창을 통해 피하고 싶은 음식이나 알레르기 재료를 자유롭게 선택해 보세요.
            </p>
          )}

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            {(
              [
                '전체',
                '주요 재료',
                '한식',
                '일식',
                '중식',
                '양식',
                '동남아 음식',
              ] as TabCategory[]
            ).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all duration-150 ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-[#E5DFD5]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Items Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Section 1: Common Ingredients */}
          {filteredIngredients.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🥕 주요 기피 및 알레르기 재료</span>
                  <span className="text-stone-400 font-normal">
                    ({filteredIngredients.length})
                  </span>
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {filteredIngredients.map((ing) => {
                  const itemId = ing.id;
                  const isSelected = selectedIds.has(itemId);
                  const excludedObj: ExcludedItem = {
                    id: itemId,
                    type: 'ingredient',
                    name: ing.name,
                    category: ing.category,
                    icon: ing.icon,
                  };

                  return (
                    <button
                      key={ing.id}
                      onClick={() => onToggleItem(excludedObj)}
                      className={`text-left p-3 rounded-2xl border transition-all duration-150 flex items-start justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFF0EB] border-[#FF5A36] text-[#C93B18] shadow-xs'
                          : 'bg-white border-[#E8E2D8] hover:border-[#FF5A36]/40 text-stone-800 hover:bg-[#FFFDFC]'
                      }`}
                      aria-pressed={isSelected}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl shrink-0" role="img" aria-hidden="true">
                          {ing.icon}
                        </span>
                        <div className="min-w-0">
                          <span className="font-extrabold text-sm block truncate">
                            {ing.name}
                          </span>
                          <span className="text-[11px] text-stone-500 block truncate">
                            {ing.category}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                          isSelected
                            ? 'bg-[#FF5A36] border-[#FF5A36] text-white'
                            : 'bg-white border-stone-300 text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: Specific Dishes */}
          {filteredDishes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🍽️ 개별 메뉴</span>
                  <span className="text-stone-400 font-normal">
                    ({filteredDishes.length})
                  </span>
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {filteredDishes.map((food) => {
                  const itemId = `dish:${food.id}`;
                  const isSelected = selectedIds.has(itemId);
                  const excludedObj: ExcludedItem = {
                    id: itemId,
                    type: 'dish',
                    name: food.name,
                    category: food.category,
                    icon: food.emoji,
                  };

                  return (
                    <button
                      key={food.id}
                      onClick={() => onToggleItem(excludedObj)}
                      className={`text-left p-3 rounded-2xl border transition-all duration-150 flex items-start justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFF0EB] border-[#FF5A36] text-[#C93B18] shadow-xs'
                          : 'bg-white border-[#E8E2D8] hover:border-[#FF5A36]/40 text-stone-800 hover:bg-[#FFFDFC]'
                      }`}
                      aria-pressed={isSelected}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl shrink-0" role="img" aria-hidden="true">
                          {food.emoji}
                        </span>
                        <div className="min-w-0">
                          <span className="font-extrabold text-sm block truncate">
                            {food.name}
                          </span>
                          <span className="text-[11px] text-stone-500 block truncate">
                            {food.category} · {food.priceRange}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                          isSelected
                            ? 'bg-[#FF5A36] border-[#FF5A36] text-white'
                            : 'bg-white border-stone-300 text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredIngredients.length === 0 && filteredDishes.length === 0 && (
            <div className="text-center py-12 text-stone-500">
              <p className="text-sm">'{searchTerm}'에 일치하는 음식이나 재료가 없습니다.</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-2 text-xs font-bold text-[#FF5A36] underline cursor-pointer"
              >
                검색어 지우기
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#EAE3D9] flex items-center justify-between shrink-0">
          <span className="text-xs font-semibold text-stone-600">
            총 <strong>{excludedItems.length}</strong>개 항목 제외 중
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7556] hover:from-[#E04826] hover:to-[#FF6442] text-white font-extrabold text-sm shadow-md hover:shadow-lg cursor-pointer transition-all active:scale-95"
          >
            설정 완료
          </button>
        </div>
      </div>
    </div>
  );
};
