import React, { useState } from 'react';
import {
  Sparkles,
  Coins,
  CheckCircle,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { RecommendedFood } from '../types.ts';

interface FoodCardProps {
  food: RecommendedFood;
  rankIndex: number;
  onSearchRestaurant?: (foodName: string) => void;
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  한식: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  일식: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  중식: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  양식: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  '동남아 음식': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  한식: 'from-rose-50/80 via-orange-50/60 to-amber-50/80',
  일식: 'from-emerald-50/80 via-teal-50/60 to-stone-50/80',
  중식: 'from-amber-50/80 via-orange-50/60 to-red-50/80',
  양식: 'from-sky-50/80 via-indigo-50/60 to-slate-50/80',
  '동남아 음식': 'from-purple-50/80 via-fuchsia-50/60 to-pink-50/80',
};

export const FoodCard: React.FC<FoodCardProps> = ({
  food,
  rankIndex,
  onSearchRestaurant,
}) => {
  const [imageError, setImageError] = useState(false);
  const catStyle = CATEGORY_STYLES[food.category] || {
    bg: 'bg-stone-50',
    text: 'text-stone-700',
    border: 'border-stone-200',
  };

  const gradientBg = CATEGORY_GRADIENTS[food.category] || 'from-[#FFF5F2] via-[#FDF0EB] to-[#FCE7DC]';

  // Only render verified images explicitly linked to this food ID
  const hasVerifiedImage =
    Boolean(food.imageInfo?.isVerified && food.imageInfo?.url) && !imageError;

  return (
    <article
      className="bg-white rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-1"
      aria-label={`${rankIndex + 1}위 추천 메뉴: ${food.name}`}
    >
      {/* Visual Image / High-fidelity Illustration Fallback Container */}
      <div className="w-full h-48 sm:h-52 relative bg-[#F5EFE6] overflow-hidden shrink-0 flex items-center justify-center select-none">
        {hasVerifiedImage && food.imageInfo ? (
          <>
            <img
              src={food.imageInfo.url}
              alt={food.imageInfo.alt || `${food.name} 사진`}
              onError={() => setImageError(true)}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            {/* Verified badge with Source & Rights Management */}
            <div
              className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-md border border-white/15"
              title={`출처: ${food.imageInfo.source} | 라이선스: ${food.imageInfo.license || '자유 사용 라이선스'}`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>검증 완료</span>
              <span className="text-white/40">|</span>
              <span className="text-stone-300 font-normal truncate max-w-[120px]">
                {food.imageInfo.source}
              </span>
            </div>
          </>
        ) : (
          /* High-Fidelity Default Card (Used when no verified image exists or on load failure) */
          <div
            className={`w-full h-full bg-gradient-to-br ${gradientBg} flex flex-col items-center justify-center p-4 text-center relative overflow-hidden`}
          >
            {/* Subtle decorative circles */}
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/40 blur-xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-orange-200/20 blur-xl pointer-events-none" />

            <span
              className="text-6xl sm:text-7xl mb-2 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.06)] transform group-hover:scale-110 transition-transform duration-300"
              role="img"
              aria-label={food.name}
            >
              {food.emoji}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-bold text-stone-600 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-stone-200 shadow-2xs">
                {food.category} 대표 메뉴
              </span>
            </div>
          </div>
        )}

        {/* Rank Badge */}
        <div className="absolute top-3.5 left-3.5 bg-stone-900/85 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-xl shadow-xs flex items-center gap-1.5 border border-white/10">
          <span className="text-[#FFA07A]">Top {rankIndex + 1}</span>
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <span className="text-stone-200 font-semibold">추천</span>
        </div>

        {/* Match Score Badge */}
        <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md text-[#FF5A36] text-xs font-extrabold px-2.5 py-1 rounded-xl shadow-xs border border-[#FF5A36]/20">
          {food.matchScore}% 일치
        </div>
      </div>

      {/* Food Details Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Budget Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
            >
              {food.category}
            </span>

            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-stone-600 border border-[#E5DFD5] flex items-center gap-1">
              <Coins className="w-3 h-3 text-stone-500" />
              <span>예상 {food.priceRange}</span>
            </span>

            {food.menuTypes.map((mt) => (
              <span
                key={mt}
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FFF0EB] text-[#FF5A36] border border-[#FF5A36]/20"
              >
                {mt}
              </span>
            ))}
          </div>

          {/* Menu Title */}
          <h3 className="text-xl sm:text-2xl font-black text-stone-900 group-hover:text-[#FF5A36] transition-colors flex items-center gap-2 mb-2">
            <span>{food.name}</span>
            <span className="text-2xl select-none" aria-hidden="true">
              {food.emoji}
            </span>
          </h3>

          {/* Short Description */}
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-3 break-keep-all font-normal">
            {food.description}
          </p>

          {/* Main Ingredients list for user transparency */}
          {((food.mainIngredients && food.mainIngredients.length > 0) ||
            (food.ingredients && food.ingredients.length > 0)) && (
            <div className="mb-2.5 flex items-center gap-1.5 flex-wrap text-[11px] text-stone-600 bg-[#FAF8F5] px-2.5 py-1.5 rounded-xl border border-[#EFE9DF]">
              <span className="font-bold text-stone-800 shrink-0">주요 재료:</span>
              <span>
                {(food.mainIngredients && food.mainIngredients.length > 0
                  ? food.mainIngredients
                  : food.ingredients.slice(0, 5)
                ).join(', ')}
              </span>
            </div>
          )}

          {/* Allergen Transparency & Safety Caution Notice */}
          <div className="mb-3.5 px-2.5 py-1.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 flex flex-col gap-1">
            <div className="flex items-center gap-1 font-bold text-amber-900">
              <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
              <span>알레르기 정보:</span>
              <span className="font-normal text-amber-800">
                {food.allergens && food.allergens.length > 0
                  ? food.allergens.join(', ')
                  : '기본 정보 미포함 (단정 불가)'}
              </span>
            </div>
            <p className="text-[10px] text-amber-800/80 leading-tight">
              {food.allergenNote ||
                '조리 환경에 따른 교차 오염 위험이 있으므로, 특이 체질이나 알레르기가 있으신 경우 주문 전 매장에 직접 문의하시기 바랍니다.'}
            </p>
          </div>
        </div>

        <div>
          {/* Prominent Recommendation Reason Container */}
          <div className="bg-[#FFF5F2] border border-[#FF5A36]/25 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs sm:text-sm text-stone-800 mb-3 shadow-2xs">
            <div className="w-6 h-6 rounded-lg bg-[#FF5A36]/15 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-[#C93B18] block text-xs tracking-tight mb-0.5">
                선택하신 취향 추천 이유
              </span>
              <p className="text-[#4A2016] font-medium leading-relaxed break-keep-all">
                {food.recommendReason}
              </p>
            </div>
          </div>

          {/* Tags & Flavors */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
            {food.flavors.map((f) => (
              <span
                key={f}
                className="bg-[#FAF7F2] border border-[#E8E2D8] text-stone-600 px-2 py-0.5 rounded-lg text-[11px] font-medium"
              >
                #{f}
              </span>
            ))}
            {food.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-stone-400 text-[11px]">
                #{tag}
              </span>
            ))}
          </div>

          {/* Restaurant Search Button */}
          {onSearchRestaurant && (
            <div className="mt-4 pt-3 border-t border-[#F0EAE1]">
              <button
                type="button"
                onClick={() => onSearchRestaurant(food.name)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FAF5EE] hover:bg-[#FF5A36] text-stone-700 hover:text-white font-extrabold text-xs sm:text-sm border border-[#E8DEC8] hover:border-[#FF5A36] shadow-2xs hover:shadow-xs active:scale-98 transition-all duration-200 cursor-pointer group/btn"
                aria-label={`${food.name} 주변 식당 찾기`}
              >
                <MapPin className="w-4 h-4 text-[#FF5A36] group-hover/btn:text-white transition-colors shrink-0" />
                <span>주변 식당 찾기</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover/btn:opacity-100 transition-opacity shrink-0" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
