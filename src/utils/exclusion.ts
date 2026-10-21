import type { FoodItem, ExcludedItem } from '../types.ts';

export const EXCLUSION_STORAGE_KEY = 'today_what_to_eat_excluded_items_v1';

/**
 * Normalizes strings for flexible ingredient comparison.
 * e.g., '새우 / 갑각류' -> ['새우', '갑각류']
 */
export function getIngredientTokens(name: string): string[] {
  return name
    .toLowerCase()
    .split(/[\s/,]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Checks whether a single food item is excluded given the active excluded items list.
 */
export function isFoodExcluded(
  food: FoodItem,
  excludedList: ExcludedItem[]
): { isExcluded: boolean; matchedReason?: string } {
  if (!excludedList || excludedList.length === 0) {
    return { isExcluded: false };
  }

  for (const exc of excludedList) {
    // 1. Check if the dish itself is directly excluded (by ID, full name, or alias)
    if (exc.type === 'dish') {
      const targetName = exc.name.trim().toLowerCase();
      const isDirectMatch =
        exc.id === food.id ||
        exc.id === `dish:${food.id}` ||
        food.name.trim().toLowerCase() === targetName ||
        (food.aliases && food.aliases.some((a) => a.trim().toLowerCase() === targetName));

      if (isDirectMatch) {
        return {
          isExcluded: true,
          matchedReason: `제외 설정된 메뉴 '${food.name}'입니다.`,
        };
      }
    }

    // 2. Check if any ingredient or allergen matches
    if (exc.type === 'ingredient') {
      const tokens = getIngredientTokens(exc.name);
      const allFoodIngredients = [
        ...(food.mainIngredients || []),
        ...(food.ingredients || []),
        ...(food.allergens || []),
      ].map((ing) => ing.toLowerCase());

      const hasMatch = allFoodIngredients.some((ing) => {
        // Direct match or partial token match
        return tokens.some((token) => ing.includes(token) || token.includes(ing));
      });

      if (hasMatch) {
        return {
          isExcluded: true,
          matchedReason: `제외 설정된 재료/성분 '${exc.name}'이(가) 포함되어 있습니다.`,
        };
      }
    }
  }

  return { isExcluded: false };
}

/**
 * Filters a database of foods, removing all excluded dishes and ingredients.
 */
export function filterExcludedFoods(
  foods: FoodItem[],
  excludedList: ExcludedItem[]
): FoodItem[] {
  if (!excludedList || excludedList.length === 0) {
    return foods;
  }
  return foods.filter((f) => !isFoodExcluded(f, excludedList).isExcluded);
}

/**
 * Loads excluded items from browser localStorage safely.
 */
export function loadExcludedItems(): ExcludedItem[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(EXCLUSION_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item) => item && typeof item.id === 'string' && typeof item.name === 'string'
      );
    }
    return [];
  } catch (err) {
    console.error('Failed to load excluded items from localStorage:', err);
    return [];
  }
}

/**
 * Saves excluded items to browser localStorage safely.
 */
export function saveExcludedItems(items: ExcludedItem[]): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(EXCLUSION_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save excluded items to localStorage:', err);
  }
}
