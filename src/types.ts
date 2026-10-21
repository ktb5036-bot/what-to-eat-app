export type FoodCategory =
  | '한식'
  | '일식'
  | '중식'
  | '양식'
  | '동남아 음식'
  | '상관없어요';

export type MenuType =
  | '면 요리'
  | '밥 요리'
  | '고기 요리'
  | '해산물 요리'
  | '채소 요리'
  | '빵 또는 샌드위치'
  | '상관없어요';

export type FlavorProfile =
  | '매콤한 맛'
  | '담백한 맛'
  | '고소한 맛'
  | '달콤짭짤한 맛'
  | '새콤한 맛'
  | '얼큰한 맛'
  | '구수한 맛'
  | '시원한 맛'
  | '상관없어요';

export type FullnessLevel =
  | '가볍게 먹고 싶어요'
  | '적당히 먹고 싶어요'
  | '든든하게 먹고 싶어요'
  | '상관없어요';

export type BudgetRange =
  | '10,000원 이하'
  | '10,000원 초과~20,000원 이하'
  | '20,000원 초과'
  | '상관없어요';

export interface ImageInfo {
  url: string;
  alt: string;
  source: string;
  license?: string;
  author?: string;
  isVerified: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  aliases?: string[];
  category: Exclude<FoodCategory, '상관없어요'>;
  menuTypes: Exclude<MenuType, '상관없어요'>[];
  mainIngredients: string[];
  ingredients: string[];
  allergens: string[];
  allergenNote?: string;
  flavors: Exclude<FlavorProfile, '상관없어요'>[];
  spiciness?: number;
  fullness: Exclude<FullnessLevel, '상관없어요'>;
  priceRange: Exclude<BudgetRange, '상관없어요'>;
  description: string;
  emoji: string;
  imageInfo?: ImageInfo;
  imageUrl?: string;
  tags: string[];
}

export interface UserPreferences {
  category: FoodCategory;
  menuType: MenuType;
  flavor: FlavorProfile;
  fullness: FullnessLevel;
  budget: BudgetRange;
}

export type ExclusionType = 'dish' | 'ingredient';

export interface ExcludedItem {
  id: string;
  type: ExclusionType;
  name: string;
  category?: string;
  icon?: string;
}

export interface RecommendedFood extends FoodItem {
  recommendReason: string;
  matchScore: number;
}

export interface RecommendationOutput {
  items: RecommendedFood[];
  wasRelaxed: boolean;
  relaxedDetails?: string;
  isBlockedByExclusions?: boolean;
  exclusionNotice?: string;
}
