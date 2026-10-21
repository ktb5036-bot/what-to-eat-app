import type { ExcludedItem } from '../types.ts';

export interface IngredientOption {
  id: string;
  name: string;
  category: '채소 및 향채' | '육류' | '해산물' | '유제품 및 견과류' | '기타 알레르기';
  icon: string;
  description: string;
}

export const COMMON_INGREDIENTS: IngredientOption[] = [
  {
    id: 'ing:cucumber',
    name: '오이',
    category: '채소 및 향채',
    icon: '🥒',
    description: '냉면, 김밥, 반미 등에 주로 들어가는 오이',
  },
  {
    id: 'ing:coriander',
    name: '고수',
    category: '채소 및 향채',
    icon: '🌿',
    description: '쌀국수, 똠얌꿍, 분짜, 반미의 호불호 갈리는 고수(실란트로)',
  },
  {
    id: 'ing:mushroom',
    name: '버섯',
    category: '채소 및 향채',
    icon: '🍄',
    description: '찌개, 리소토, 탕수육, 마라탕 등의 각종 버섯류',
  },
  {
    id: 'ing:eggplant',
    name: '가지',
    category: '채소 및 향채',
    icon: '🍆',
    description: '텐동, 마파가지 등에 쓰이는 가지',
  },
  {
    id: 'ing:carrot',
    name: '당근',
    category: '채소 및 향채',
    icon: '🥕',
    description: '김밥, 비빔밥, 카레, 탕수육의 당근',
  },
  {
    id: 'ing:onion',
    name: '양파',
    category: '채소 및 향채',
    icon: '🧅',
    description: '볶음, 찌개, 덮밥 등에 널리 쓰이는 양파',
  },
  {
    id: 'ing:pork',
    name: '돼지고기',
    category: '육류',
    icon: '🥩',
    description: '제육, 김치찌개, 삼겹살, 돈가스, 짜장면, 라멘 차슈 등',
  },
  {
    id: 'ing:beef',
    name: '소고기',
    category: '육류',
    icon: '🥩',
    description: '불고기, 갈비탕, 스테이크, 규동, 쌀국수 양지 등',
  },
  {
    id: 'ing:chicken',
    name: '닭고기',
    category: '육류',
    icon: '🍗',
    description: '닭볶음탕, 치킨, 유린기, 닭가슴살 샐러드 등',
  },
  {
    id: 'ing:seafood',
    name: '해산물',
    category: '해산물',
    icon: '🐟',
    description: '생선회, 초밥, 조개류, 오징어 등 일체의 해산물',
  },
  {
    id: 'ing:shrimp',
    name: '새우 / 갑각류',
    category: '해산물',
    icon: '🦐',
    description: '새우볶음밥, 팟타이, 똠얌꿍, 텐동, 뿌빳퐁커리 등',
  },
  {
    id: 'ing:dairy',
    name: '치즈 / 유제품',
    category: '유제품 및 견과류',
    icon: '🧀',
    description: '피자, 리소토, 리코타 샐러드, 버거 등의 치즈/우유/버터',
  },
  {
    id: 'ing:nuts',
    name: '견과류 / 땅콩',
    category: '유제품 및 견과류',
    icon: '🥜',
    description: '팟타이 토핑, 샐러드 드레싱, 일부 중식 소스',
  },
  {
    id: 'ing:egg',
    name: '계란 / 달걀',
    category: '기타 알레르기',
    icon: '🥚',
    description: '비빔밥 계란후라이, 라멘 반숙란, 오코노미야키, 전 등',
  },
];
