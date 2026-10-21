/**
 * Utility functions for building restaurant search queries and map links
 * Supports Naver Map and Kakao Map external search URLs with safe encoding
 */

/**
 * Builds the combined search query from food name and region
 * @param foodName Selected food name (e.g. '돈가스')
 * @param region Optional user region (e.g. '서울 강남구')
 * @returns Combined search query string trimmed
 */
export function buildRestaurantSearchQuery(foodName: string, region: string): string {
  const cleanRegion = (region || '').trim();
  const cleanFood = (foodName || '').trim();

  if (cleanRegion && cleanFood) {
    return `${cleanRegion} ${cleanFood}`;
  }
  return cleanFood || cleanRegion || '';
}

/**
 * Generates the official Naver Map search URL
 * Path: https://map.naver.com/p/search/{encodedQuery}
 */
export function getNaverMapSearchUrl(query: string): string {
  const trimmed = query.trim();
  if (!trimmed) return 'https://map.naver.com/';
  return `https://map.naver.com/p/search/${encodeURIComponent(trimmed)}`;
}

/**
 * Generates the official Kakao Map search URL according to Kakao Web API guidelines
 * Format: https://map.kakao.com/link/search/{encodedQuery}
 * Reference: https://apis.map.kakao.com/web/guide/
 */
export function getKakaoMapSearchUrl(query: string): string {
  const trimmed = query.trim();
  if (!trimmed) return 'https://map.kakao.com/';
  return `https://map.kakao.com/link/search/${encodeURIComponent(trimmed)}`;
}
