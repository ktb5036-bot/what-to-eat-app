import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isFoodExcluded,
  filterExcludedFoods,
  getIngredientTokens,
} from './exclusion.ts';
import { recommendFoods } from './recommendation.ts';
import { FOOD_DATABASE } from '../data/foodData.ts';
import type { ExcludedItem, FoodItem, UserPreferences } from '../types.ts';

test('FOOD_DATABASE integrity: unique IDs, valid ingredients, mainIngredients, allergens, and rights management', () => {
  assert.equal(FOOD_DATABASE.length, 57, `Expected exactly 57 items, got ${FOOD_DATABASE.length}`);

  const idSet = new Set<string>();
  const nameSet = new Set<string>();
  const imageUrlSet = new Set<string>();

  for (const food of FOOD_DATABASE) {
    // Unique ID check
    assert.ok(food.id, `Food must have an ID: ${food.name}`);
    assert.ok(!idSet.has(food.id), `Duplicate ID found: ${food.id}`);
    idSet.add(food.id);

    // Duplicate name check
    assert.ok(!nameSet.has(food.name), `Duplicate menu name found: ${food.name}`);
    nameSet.add(food.name);

    // Required fields check
    assert.ok(food.category, `Food ${food.name} must have a category`);
    assert.ok(Array.isArray(food.menuTypes) && food.menuTypes.length > 0, `Food ${food.name} must have menuTypes`);
    assert.ok(food.fullness, `Food ${food.name} must have fullness`);
    assert.ok(food.priceRange, `Food ${food.name} must have priceRange`);
    assert.ok(food.description, `Food ${food.name} must have description`);
    assert.ok(food.emoji, `Food ${food.name} must have emoji`);
    assert.ok(Array.isArray(food.tags) && food.tags.length > 0, `Food ${food.name} must have tags`);

    // Main Ingredients check
    assert.ok(
      Array.isArray(food.mainIngredients) && food.mainIngredients.length > 0,
      `Food ${food.name} must have a non-empty mainIngredients array`
    );

    // Ingredients check
    assert.ok(
      Array.isArray(food.ingredients) && food.ingredients.length > 0,
      `Food ${food.name} must have a non-empty ingredients array`
    );

    // Allergens check
    assert.ok(
      Array.isArray(food.allergens) && food.allergens.length > 0,
      `Food ${food.name} must have a non-empty allergens array for transparency`
    );

    // Image uniqueness, format & rights verification check
    if (food.imageInfo) {
      assert.ok(food.imageInfo.url.startsWith('https://'), `Food ${food.name} image url must be https: ${food.imageInfo.url}`);
      assert.ok(food.imageInfo.alt, `Food ${food.name} imageInfo must have alt text`);
      assert.ok(food.imageInfo.source, `Food ${food.name} imageInfo must have source`);
      assert.ok(food.imageInfo.license, `Food ${food.name} imageInfo must have license for rights management`);
      assert.equal(
        food.imageInfo.isVerified,
        true,
        `Food ${food.name} imageInfo must be marked verified if present`
      );
      assert.ok(
        !imageUrlSet.has(food.imageInfo.url),
        `Duplicate image URL found on food ${food.name}: ${food.imageInfo.url}`
      );
      imageUrlSet.add(food.imageInfo.url);
    }
  }

  // Verify total verified images and default card fallbacks
  assert.equal(imageUrlSet.size, 8, `Expected exactly 8 verified images, got ${imageUrlSet.size}`);
});

test('getIngredientTokens splits compound ingredient strings correctly', () => {
  const tokens = getIngredientTokens('새우 / 갑각류');
  assert.deepEqual(tokens, ['새우', '갑각류']);

  const dairyTokens = getIngredientTokens('치즈 / 유제품');
  assert.deepEqual(dairyTokens, ['치즈', '유제품']);
});

test('isFoodExcluded correctly identifies directly excluded dishes', () => {
  const kimchiStew = FOOD_DATABASE.find((f) => f.name === '김치찌개')!;
  assert.ok(kimchiStew);

  const excludedDish: ExcludedItem = {
    id: `dish:${kimchiStew.id}`,
    type: 'dish',
    name: '김치찌개',
  };

  const result = isFoodExcluded(kimchiStew, [excludedDish]);
  assert.equal(result.isExcluded, true);

  // Other dishes shouldn't be affected
  const bibimbap = FOOD_DATABASE.find((f) => f.name === '비빔밥')!;
  const bibimbapResult = isFoodExcluded(bibimbap, [excludedDish]);
  assert.equal(bibimbapResult.isExcluded, false);
});

test('isFoodExcluded filters dishes containing excluded ingredients (e.g., 오이, 돼지고기, 고수)', () => {
  const cucumberExclusion: ExcludedItem = {
    id: 'ing:cucumber',
    type: 'ingredient',
    name: '오이',
  };

  const porkExclusion: ExcludedItem = {
    id: 'ing:pork',
    type: 'ingredient',
    name: '돼지고기',
  };

  const cilantroExclusion: ExcludedItem = {
    id: 'ing:coriander',
    type: 'ingredient',
    name: '고수',
  };

  // Cold noodles has cucumber in ingredients
  const naengmyeon = FOOD_DATABASE.find((f) => f.name.includes('냉면'))!;
  assert.ok(naengmyeon);
  assert.equal(isFoodExcluded(naengmyeon, [cucumberExclusion]).isExcluded, true);

  // Kimchi stew has pork
  const kimchiStew = FOOD_DATABASE.find((f) => f.name === '김치찌개')!;
  assert.equal(isFoodExcluded(kimchiStew, [porkExclusion]).isExcluded, true);

  // Vietnamese Pho has cilantro
  const pho = FOOD_DATABASE.find((f) => f.name.includes('쌀국수 (포)'))!;
  assert.ok(pho);
  assert.equal(isFoodExcluded(pho, [cilantroExclusion]).isExcluded, true);

  // Soybean paste stew has neither pork nor cucumber nor cilantro
  const doenjang = FOOD_DATABASE.find((f) => f.name === '된장찌개')!;
  assert.equal(isFoodExcluded(doenjang, [cucumberExclusion, porkExclusion, cilantroExclusion]).isExcluded, false);
});

test('filterExcludedFoods excludes multiple items and retains non-matching dishes', () => {
  const exclusions: ExcludedItem[] = [
    { id: 'ing:pork', type: 'ingredient', name: '돼지고기' },
    { id: 'dish:k-3', type: 'dish', name: '비빔밥' },
  ];

  const filtered = filterExcludedFoods(FOOD_DATABASE, exclusions);

  // No filtered dish should be 비빔밥 or contain 돼지고기
  for (const food of filtered) {
    assert.notEqual(food.name, '비빔밥');
    assert.ok(
      !food.ingredients.some((ing) => ing.includes('돼지고기')),
      `Dish ${food.name} should not contain 돼지고기`
    );
  }

  // Dishes without pork or bibimbap should still exist
  const steak = filtered.find((f) => f.name === '프라임 부채살 스테이크');
  assert.ok(steak, 'Beef steak should remain in filtered list');
});

test('recommendFoods strictly honors exclusions without silently relaxing or ignoring them', () => {
  const porkExclusion: ExcludedItem = {
    id: 'ing:pork',
    type: 'ingredient',
    name: '돼지고기',
  };

  const prefs: UserPreferences = {
    category: '한식',
    menuType: '고기 요리',
    flavor: '상관없어요',
    fullness: '상관없어요',
    budget: '상관없어요',
  };

  const result = recommendFoods(FOOD_DATABASE, prefs, 5, [porkExclusion]);

  // All returned items must NOT contain pork
  for (const item of result.items) {
    assert.ok(
      !item.ingredients.some((ing) => ing.includes('돼지고기')),
      `Recommendation ${item.name} must not contain excluded ingredient pork`
    );
  }
});

test('recommendFoods flags isBlockedByExclusions when all candidates are excluded', () => {
  // Exclude all Korean dishes
  const koreanDishes = FOOD_DATABASE.filter((f) => f.category === '한식');
  const allKoreanExclusions: ExcludedItem[] = koreanDishes.map((f) => ({
    id: `dish:${f.id}`,
    type: 'dish',
    name: f.name,
  }));

  const koreanPrefs: UserPreferences = {
    category: '한식',
    menuType: '상관없어요',
    flavor: '상관없어요',
    fullness: '상관없어요',
    budget: '상관없어요',
  };

  const result = recommendFoods(FOOD_DATABASE, koreanPrefs, 5, allKoreanExclusions);

  // Must not ignore the user's exclusions
  assert.equal(result.items.length, 0);
  assert.equal(result.isBlockedByExclusions, true);
  assert.ok(result.exclusionNotice && result.exclusionNotice.length > 0);
});

test('isFoodExcluded matches dishes by aliases', () => {
  const tonkatsuDish = FOOD_DATABASE.find((f) => f.name === '수제 일식 돈가스')!;
  assert.ok(tonkatsuDish);

  // Exclude using alias '돈카츠'
  const aliasExclusion: ExcludedItem = {
    id: 'dish:custom-tonkatsu',
    type: 'dish',
    name: '돈카츠',
  };

  const result = isFoodExcluded(tonkatsuDish, [aliasExclusion]);
  assert.equal(result.isExcluded, true);
});

test('isFoodExcluded matches allergens (e.g. 갑각류, 메밀, 견과류)', () => {
  const crustaceanExclusion: ExcludedItem = {
    id: 'ing:crustacean',
    type: 'ingredient',
    name: '갑각류',
  };

  const buckwheatExclusion: ExcludedItem = {
    id: 'ing:buckwheat',
    type: 'ingredient',
    name: '메밀',
  };

  // Shrimp Pad Thai has crustacean allergen
  const padThai = FOOD_DATABASE.find((f) => f.name.includes('팟타이'))!;
  assert.ok(padThai);
  assert.equal(isFoodExcluded(padThai, [crustaceanExclusion]).isExcluded, true);

  // Cold noodles has buckwheat allergen
  const coldNoodles = FOOD_DATABASE.find((f) => f.name.includes('냉면'))!;
  assert.ok(coldNoodles);
  assert.equal(isFoodExcluded(coldNoodles, [buckwheatExclusion]).isExcluded, true);

  // Beef steak should not be excluded by crustacean or buckwheat
  const steak = FOOD_DATABASE.find((f) => f.name.includes('부채살 스테이크'))!;
  assert.ok(steak);
  assert.equal(isFoodExcluded(steak, [crustaceanExclusion, buckwheatExclusion]).isExcluded, false);
});

test('Roulette exclusion guarantees zero excluded foods are ever picked', () => {
  const porkExclusion: ExcludedItem = {
    id: 'ing:pork',
    type: 'ingredient',
    name: '돼지고기',
  };

  // Simulate quick roulette food pool preparation
  const availableForRoulette = filterExcludedFoods(FOOD_DATABASE, [porkExclusion]);
  assert.ok(availableForRoulette.length > 0);

  // Verify none of the items in availableForRoulette contain pork in ingredients or allergens
  for (const item of availableForRoulette) {
    const allIngs = [
      ...(item.mainIngredients || []),
      ...(item.ingredients || []),
      ...(item.allergens || []),
    ].join(' ');
    assert.ok(!allIngs.includes('돼지고기'), `Roulette pool item ${item.name} must not contain 돼지고기`);
  }
});

