import type {
  FoodItem,
  RecommendedFood,
  RecommendationOutput,
  UserPreferences,
  ExcludedItem,
} from '../types.ts';
import { appendJosa, getJosa } from './koreanUtils.ts';
import { filterExcludedFoods } from './exclusion.ts';

/**
 * Generates an empathetic, customized Korean recommendation reason based on the user's choices.
 */
export function generateRecommendReason(food: FoodItem, prefs: UserPreferences): string {
  const parts: string[] = [];

  if (prefs.category && prefs.category !== '상관없어요' && food.category === prefs.category) {
    parts.push(`선택하신 ${food.category}`);
  }

  const matchedType =
    prefs.menuType && prefs.menuType !== '상관없어요' && food.menuTypes.includes(prefs.menuType as any);
  if (matchedType) {
    parts.push(`${prefs.menuType} 선호`);
  }

  const matchedFlavor =
    prefs.flavor && prefs.flavor !== '상관없어요' && food.flavors.includes(prefs.flavor as any);
  if (matchedFlavor) {
    parts.push(`${prefs.flavor}의 매력`);
  }

  if (prefs.fullness && prefs.fullness !== '상관없어요' && food.fullness === prefs.fullness) {
    parts.push(`원하시던 ${prefs.fullness}`);
  }

  if (prefs.budget && prefs.budget !== '상관없어요' && food.priceRange === prefs.budget) {
    parts.push(`예산(${food.priceRange}) 만족`);
  }

  if (parts.length >= 2) {
    const first = parts[0];
    const second = parts[1];
    const combined = `${appendJosa(first, '과/와')} ${second}`;
    return `${appendJosa(combined, '을/를')} 고루 갖춘 딱 맞는 추천 메뉴예요!`;
  } else if (parts.length === 1) {
    return `${parts[0]}에 딱 어울려 만족스럽게 식사할 수 있는 추천 메뉴예요.`;
  }

  return `${food.category} 대표 인기 요리로, ${food.description.slice(0, 30)}...의 풍미를 즐길 수 있어요.`;
}

/**
 * Fisher-Yates shuffle helper for randomized variance.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Main recommendation engine.
 * Matches user preferences against database, relaxes conditions gracefully if items are few,
 * and strictly filters out any excluded dishes or ingredients without exception.
 */
export function recommendFoods(
  database: FoodItem[],
  prefs: UserPreferences,
  limit: number = 5,
  excludedList: ExcludedItem[] = []
): RecommendationOutput {
  if (!database || database.length === 0) {
    return { items: [], wasRelaxed: false };
  }

  // 1. Strictly filter out excluded items first
  const availableDatabase = filterExcludedFoods(database, excludedList);

  if (availableDatabase.length === 0) {
    return {
      items: [],
      wasRelaxed: false,
      isBlockedByExclusions: true,
      exclusionNotice:
        '설정하신 제외 조건(못 먹는 음식/재료)으로 인해 선택 가능한 메뉴가 모두 제외되었습니다. 제외 항목을 조정해 보세요.',
    };
  }

  // 2. Strict matching
  // Filter by all chosen conditions (ignoring '상관없어요' and empty values)
  const strictCandidates = availableDatabase.filter((item) => {
    if (prefs.category && prefs.category !== '상관없어요' && item.category !== prefs.category) return false;
    if (prefs.menuType && prefs.menuType !== '상관없어요' && !item.menuTypes.includes(prefs.menuType as any)) return false;
    if (prefs.flavor && prefs.flavor !== '상관없어요' && !item.flavors.includes(prefs.flavor as any)) return false;
    if (prefs.fullness && prefs.fullness !== '상관없어요' && item.fullness !== prefs.fullness) return false;
    if (prefs.budget && prefs.budget !== '상관없어요' && item.priceRange !== prefs.budget) return false;
    return true;
  });

  // If we have at least 3 exact matches, pick up to `limit` with a fresh shuffle
  if (strictCandidates.length >= 3) {
    const shuffled = shuffleArray(strictCandidates);
    const selected = shuffled.slice(0, limit).map((item) => ({
      ...item,
      recommendReason: generateRecommendReason(item, prefs),
      matchScore: 100,
    }));
    return {
      items: selected,
      wasRelaxed: false,
    };
  }

  // 3. Graceful relaxation if strict candidates are fewer than 3
  // Keep primary anchors (Category & Menu Type), relax secondary criteria (Flavor, Fullness, Budget)
  // NEVER include excluded dishes!
  const relaxedSecondaryCandidates = availableDatabase.filter((item) => {
    if (prefs.category && prefs.category !== '상관없어요' && item.category !== prefs.category) return false;
    if (prefs.menuType && prefs.menuType !== '상관없어요' && !item.menuTypes.includes(prefs.menuType as any)) return false;
    return true;
  });

  const relaxedDetailsList: string[] = [];
  if (prefs.flavor && prefs.flavor !== '상관없어요') relaxedDetailsList.push('맛의 특성');
  if (prefs.fullness && prefs.fullness !== '상관없어요') relaxedDetailsList.push('식사량');
  if (prefs.budget && prefs.budget !== '상관없어요') relaxedDetailsList.push('예산');

  if (relaxedSecondaryCandidates.length > 0) {
    const strictIds = new Set(strictCandidates.map((c) => c.id));

    const scored = relaxedSecondaryCandidates.map((item) => {
      let score = 0;
      const isExact = strictIds.has(item.id);

      if (isExact) {
        score += 100;
      }

      if (prefs.flavor && prefs.flavor !== '상관없어요' && item.flavors.includes(prefs.flavor as any)) {
        score += 20;
      }
      if (prefs.fullness && prefs.fullness !== '상관없어요' && item.fullness === prefs.fullness) {
        score += 15;
      }
      if (prefs.budget && prefs.budget !== '상관없어요' && item.priceRange === prefs.budget) {
        score += 15;
      }

      score += Math.random() * 2;

      return {
        item,
        isExact,
        score,
      };
    });

    scored.sort((a, b) => b.score - a.score);

    const topItems = scored.slice(0, limit).map((s) => ({
      ...s.item,
      recommendReason: generateRecommendReason(s.item, prefs),
      matchScore: s.isExact ? 100 : Math.min(95, Math.round(65 + (s.score / 50) * 25)),
    }));

    const catLabel = prefs.category && prefs.category !== '상관없어요' ? prefs.category : '음식';
    const typeLabel = prefs.menuType && prefs.menuType !== '상관없어요' ? prefs.menuType : '메뉴 유형';

    const relaxationMsg =
      relaxedDetailsList.length > 0
        ? `선택하신 '${catLabel}'${getJosa(catLabel, '과/와')} '${typeLabel}' 조건을 최우선으로 지키고, 더 다양하고 만족스러운 선택을 위해 [${relaxedDetailsList.join(', ')}] 조건을 유연하게 넓혀 추천해 드렸어요.`
        : '선택하신 핵심 조건을 바탕으로 가장 잘 어울리는 메뉴를 엄선해 추천해 드렸어요.';

    return {
      items: topItems,
      wasRelaxed: strictCandidates.length < 3 && relaxedDetailsList.length > 0,
      relaxedDetails: relaxationMsg,
    };
  }

  // 4. Fallback: Keep Category, relax MenuType
  const categoryCandidates = availableDatabase.filter((item) => {
    if (prefs.category && prefs.category !== '상관없어요') return item.category === prefs.category;
    return true;
  });

  if (categoryCandidates.length === 0) {
    const isExcluded = excludedList.length > 0;
    return {
      items: [],
      wasRelaxed: true,
      isBlockedByExclusions: isExcluded,
      exclusionNotice: isExcluded
        ? `선택하신 '${prefs.category}' 메뉴가 설정하신 제외 조건으로 인해 모두 제외되었습니다. 제외 설정을 확인해 주세요.`
        : `선택하신 '${prefs.category}' 조건에 맞는 메뉴를 찾지 못했습니다.`,
    };
  }

  const pool = categoryCandidates;

  const fallbackShuffled = shuffleArray(pool).slice(0, limit).map((item) => ({
    ...item,
    recommendReason: generateRecommendReason(item, prefs),
    matchScore: 60,
  }));

  const catLabel = prefs.category && prefs.category !== '상관없어요' ? prefs.category : '인기';
  return {
    items: fallbackShuffled,
    wasRelaxed: true,
    relaxedDetails: `선택하신 모든 조건의 조합에 딱 맞는 메뉴가 드물어, 가장 좋아하시는 '${catLabel}' 메뉴 중에서 만족도 높은 음식을 엄선해 드렸어요.`,
  };
}
