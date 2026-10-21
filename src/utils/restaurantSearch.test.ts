import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildRestaurantSearchQuery,
  getNaverMapSearchUrl,
  getKakaoMapSearchUrl,
} from './restaurantSearch.ts';

test('buildRestaurantSearchQuery: combines region and food correctly', () => {
  assert.equal(
    buildRestaurantSearchQuery('돈가스', '서울 강남구'),
    '서울 강남구 돈가스'
  );
  assert.equal(
    buildRestaurantSearchQuery('김치찌개', '역삼동'),
    '역삼동 김치찌개'
  );
});

test('buildRestaurantSearchQuery: handles empty region gracefully', () => {
  assert.equal(buildRestaurantSearchQuery('돈가스', ''), '돈가스');
  assert.equal(buildRestaurantSearchQuery('돈가스', '   '), '돈가스');
});

test('buildRestaurantSearchQuery: handles empty food name gracefully', () => {
  assert.equal(buildRestaurantSearchQuery('', '서울 종로구'), '서울 종로구');
  assert.equal(buildRestaurantSearchQuery('   ', '서울 종로구'), '서울 종로구');
});

test('buildRestaurantSearchQuery: trims leading and trailing whitespace', () => {
  assert.equal(
    buildRestaurantSearchQuery('  돈가스  ', '  서울 마포구  '),
    '서울 마포구 돈가스'
  );
});

test('getNaverMapSearchUrl: properly encodes Korean characters and spaces', () => {
  const url1 = getNaverMapSearchUrl('돈가스');
  assert.equal(
    url1,
    `https://map.naver.com/p/search/${encodeURIComponent('돈가스')}`
  );
  assert.ok(url1.includes('%EB%8F%88%EA%B0%80%EC%8A%A4'));

  const url2 = getNaverMapSearchUrl('서울 강남구 돈가스');
  assert.equal(
    url2,
    `https://map.naver.com/p/search/${encodeURIComponent('서울 강남구 돈가스')}`
  );
  assert.ok(!url2.includes(' ')); // Spaces must be encoded
});

test('getKakaoMapSearchUrl: matches official guide format https://map.kakao.com/link/search/{query}', () => {
  const url1 = getKakaoMapSearchUrl('돈가스');
  assert.equal(
    url1,
    `https://map.kakao.com/link/search/${encodeURIComponent('돈가스')}`
  );
  assert.ok(url1.startsWith('https://map.kakao.com/link/search/'));
  assert.ok(url1.includes('%EB%8F%88%EA%B0%80%EC%8A%A4'));

  const url2 = getKakaoMapSearchUrl('서울 강남구 돈가스');
  assert.equal(
    url2,
    `https://map.kakao.com/link/search/${encodeURIComponent('서울 강남구 돈가스')}`
  );
  assert.ok(!url2.includes(' ')); // Spaces must be encoded
});

test('map URLs handle fallback for completely blank query', () => {
  assert.equal(getNaverMapSearchUrl(''), 'https://map.naver.com/');
  assert.equal(getKakaoMapSearchUrl(''), 'https://map.kakao.com/');
});
