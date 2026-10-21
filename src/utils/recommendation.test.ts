import test from 'node:test';
import assert from 'node:assert/strict';
import { recommendFoods, generateRecommendReason } from './recommendation.ts';
import { getJosa, appendJosa } from './koreanUtils.ts';
import { FOOD_DATABASE } from '../data/foodData.ts';
import type { UserPreferences } from '../types.ts';

test('FOOD_DATABASE contains at least 50 items with all required fields', () => {
  assert.ok(FOOD_DATABASE.length >= 50, `Expected at least 50 items, got ${FOOD_DATABASE.length}`);
  
  for (const food of FOOD_DATABASE) {
    assert.ok(food.id, 'food must have an id');
    assert.ok(food.name, `food ${food.id} must have a name`);
    assert.ok(food.category, `food ${food.name} must have a category`);
    assert.ok(Array.isArray(food.menuTypes) && food.menuTypes.length > 0, `food ${food.name} must have menuTypes`);
    assert.ok(Array.isArray(food.flavors) && food.flavors.length > 0, `food ${food.name} must have flavors`);
    assert.ok(food.fullness, `food ${food.name} must have fullness`);
    assert.ok(food.priceRange, `food ${food.name} must have priceRange`);
    assert.ok(food.description, `food ${food.name} must have description`);
    assert.ok(food.emoji, `food ${food.name} must have emoji`);
  }
});

test('recommendation output description and priceRange match database source of truth exactly', () => {
  const prefs: UserPreferences = {
    category: '일식',
    menuType: '면 요리',
    flavor: '고소한 맛',
    fullness: '든든하게 먹고 싶어요',
    budget: '10,000원 이하',
  };

  const result = recommendFoods(FOOD_DATABASE, prefs, 5);
  assert.ok(result.items.length > 0);

  for (const item of result.items) {
    const original = FOOD_DATABASE.find(dbItem => dbItem.id === item.id);
    assert.ok(original, `Item ${item.id} must exist in FOOD_DATABASE`);
    assert.equal(item.name, original.name);
    assert.equal(item.description, original.description, 'Description must match database exactly');
    assert.equal(item.priceRange, original.priceRange, 'Price range must match database exactly');
    assert.equal(item.category, original.category);
  }
});

test('all 5 criteria actually affect the recommendations', () => {
  // Test category filtering
  const koreanPrefs: UserPreferences = {
    category: '한식',
    menuType: '상관없어요',
    flavor: '상관없어요',
    fullness: '상관없어요',
    budget: '상관없어요',
  };
  const koreanResult = recommendFoods(FOOD_DATABASE, koreanPrefs, 5);
  assert.ok(koreanResult.items.every(item => item.category === '한식'));

  // Test menuType filtering
  const noodlePrefs: UserPreferences = {
    category: '상관없어요',
    menuType: '면 요리',
    flavor: '상관없어요',
    fullness: '상관없어요',
    budget: '상관없어요',
  };
  const noodleResult = recommendFoods(FOOD_DATABASE, noodlePrefs, 5);
  assert.ok(noodleResult.items.every(item => item.menuTypes.includes('면 요리')));

  // Test budget filtering
  const budgetPrefs: UserPreferences = {
    category: '상관없어요',
    menuType: '상관없어요',
    flavor: '상관없어요',
    fullness: '상관없어요',
    budget: '10,000원 이하',
  };
  const budgetResult = recommendFoods(FOOD_DATABASE, budgetPrefs, 5);
  assert.ok(budgetResult.items.every(item => item.priceRange === '10,000원 이하'));
});

test('recommendFoods ignores "상관없어요" filter conditions without restriction', () => {
  const allAnyPrefs: UserPreferences = {
    category: '상관없어요',
    menuType: '상관없어요',
    flavor: '상관없어요',
    fullness: '상관없어요',
    budget: '상관없어요',
  };

  const result = recommendFoods(FOOD_DATABASE, allAnyPrefs, 5);
  assert.equal(result.items.length, 5);
  assert.equal(result.wasRelaxed, false);
});

test('exact matches rank before relaxed secondary candidates', () => {
  // Setup preference where exactly 1 item strictly matches all 5:
  // e.g. 김치찌개: 한식, 밥 요리, 얼큰한 맛, 든든하게 먹고 싶어요, 10,000원 이하
  const prefs: UserPreferences = {
    category: '한식',
    menuType: '밥 요리',
    flavor: '얼큰한 맛',
    fullness: '든든하게 먹고 싶어요',
    budget: '10,000원 이하',
  };

  const result = recommendFoods(FOOD_DATABASE, prefs, 5);
  assert.ok(result.items.length > 0);
  const exactNames = ['김치찌개', '얼큰 뼈다귀 해장국'];
  assert.ok(
    exactNames.includes(result.items[0].name),
    `Expected exact match item (one of ${exactNames.join(', ')}), got ${result.items[0].name}`
  );
  assert.equal(result.items[0].matchScore, 100);
});

test('korean postposition utilities work accurately', () => {
  assert.equal(getJosa('한식', '과/와'), '과');
  assert.equal(getJosa('피자', '과/와'), '와');
  assert.equal(getJosa('면 요리', '을/를'), '를');
  assert.equal(getJosa('밥', '을/를'), '을');
  assert.equal(appendJosa('일식', '은/는'), '일식은');
  assert.equal(appendJosa('돈가스', '은/는'), '돈가스는');
});
