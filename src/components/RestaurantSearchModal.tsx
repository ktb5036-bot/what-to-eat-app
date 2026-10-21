import React, { useState, useEffect, useId } from 'react';
import {
  X,
  MapPin,
  Search,
  RotateCcw,
  ExternalLink,
  AlertCircle,
  Navigation,
  ArrowLeft,
  UtensilsCrossed,
} from 'lucide-react';
import {
  buildRestaurantSearchQuery,
  getNaverMapSearchUrl,
  getKakaoMapSearchUrl,
} from '../utils/restaurantSearch.ts';

interface RestaurantSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFoodName?: string;
}

const POPULAR_REGIONS = [
  '내 주변',
  '강남구',
  '마포구 홍대',
  '성수동',
  '종로/광화문',
  '여의도',
  '분당 판교',
  '부산 서면',
];

export const RestaurantSearchModal: React.FC<RestaurantSearchModalProps> = ({
  isOpen,
  onClose,
  initialFoodName = '',
}) => {
  const [foodName, setFoodName] = useState<string>(initialFoodName);
  const [region, setRegion] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const foodInputId = useId();
  const regionInputId = useId();

  // Reset or update inputs whenever modal opens or initialFoodName changes
  useEffect(() => {
    if (isOpen) {
      setFoodName(initialFoodName);
      setRegion('');
      setErrorMessage(null);
    }
  }, [isOpen, initialFoodName]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const combinedQuery = buildRestaurantSearchQuery(foodName, region);
  const isQueryEmpty = combinedQuery.trim().length === 0;

  const naverMapUrl = getNaverMapSearchUrl(combinedQuery);
  const kakaoMapUrl = getKakaoMapSearchUrl(combinedQuery);

  const handleOpenMap = (
    e: React.MouseEvent<HTMLAnchorElement>,
    mapName: string
  ) => {
    if (isQueryEmpty) {
      e.preventDefault();
      setErrorMessage('검색어를 입력해 주세요. (음식 이름 또는 지역이 필요합니다)');
      return;
    }
    setErrorMessage(null);
  };

  const handleReset = () => {
    setFoodName(initialFoodName);
    setRegion('');
    setErrorMessage(null);
  };

  const handleClearAll = () => {
    setFoodName('');
    setRegion('');
    setErrorMessage(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="restaurant-search-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-stone-200/80 flex items-center justify-between bg-gradient-to-r from-[#FFF5F2] to-[#FAF7F2]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF5A36] text-white flex items-center justify-center shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="restaurant-search-title"
                className="text-lg sm:text-xl font-black text-stone-900 tracking-tight"
              >
                주변 식당 찾기
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                실제 지도 서비스에서 주변 맛집을 즉시 검색합니다
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-stone-100 border border-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-stone-800">
          {/* Validation Warning Alert if empty */}
          {errorMessage && (
            <div
              className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 shadow-2xs"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block">검색어 확인</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Input 1: Food Name */}
          <div>
            <label
              htmlFor={foodInputId}
              className="block text-xs sm:text-sm font-extrabold text-stone-800 mb-1.5 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <UtensilsCrossed className="w-4 h-4 text-[#FF5A36]" />
                <span>검색할 음식 이름</span>
              </span>
              {foodName && (
                <button
                  type="button"
                  onClick={() => setFoodName('')}
                  className="text-[11px] text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  지우기
                </button>
              )}
            </label>
            <div className="relative">
              <input
                id={foodInputId}
                type="text"
                value={foodName}
                onChange={(e) => {
                  setFoodName(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="예: 돈가스, 김치찌개, 파스타"
                className="w-full px-4 py-2.5 pr-9 rounded-xl border border-stone-300 focus:border-[#FF5A36] focus:ring-2 focus:ring-[#FF5A36]/20 text-sm font-medium text-stone-900 placeholder:text-stone-400 outline-none transition-all"
              />
              {foodName && (
                <button
                  type="button"
                  onClick={() => setFoodName('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-600 flex items-center justify-center text-xs"
                  aria-label="음식 이름 지우기"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Input 2: Region / Location */}
          <div>
            <label
              htmlFor={regionInputId}
              className="block text-xs sm:text-sm font-extrabold text-stone-800 mb-1.5 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-stone-600" />
                <span>지역 (선택 사항)</span>
              </span>
              <span className="text-[11px] text-stone-400 font-normal">
                비워두면 음식 이름만으로 검색
              </span>
            </label>
            <div className="relative">
              <input
                id={regionInputId}
                type="text"
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="예: 서울 강남구, 역삼동, 홍대입구"
                className="w-full px-4 py-2.5 pr-9 rounded-xl border border-stone-300 focus:border-[#FF5A36] focus:ring-2 focus:ring-[#FF5A36]/20 text-sm font-medium text-stone-900 placeholder:text-stone-400 outline-none transition-all"
              />
              {region && (
                <button
                  type="button"
                  onClick={() => setRegion('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-600 flex items-center justify-center text-xs"
                  aria-label="지역 지우기"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Quick Region Chips */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-stone-500 mr-1">추천 지역:</span>
              {POPULAR_REGIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRegion(r);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className={`text-[11px] px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                    region === r
                      ? 'bg-stone-800 text-white border-stone-800 font-bold'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D8] text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide flex items-center gap-1">
                <Search className="w-3.5 h-3.5 text-stone-400" />
                최종 지도 검색어 미리보기
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] font-medium text-stone-500 hover:text-stone-900 flex items-center gap-1 cursor-pointer transition-colors"
                title="선택 메뉴 기본값으로 초기화"
              >
                <RotateCcw className="w-3 h-3" />
                <span>원래 메뉴로</span>
              </button>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-[#E0D7C9] flex items-center justify-between gap-2">
              <span
                className={`font-black text-sm truncate ${
                  isQueryEmpty ? 'text-stone-400 italic font-normal' : 'text-stone-900'
                }`}
              >
                {isQueryEmpty ? '검색어를 입력해 주세요' : combinedQuery}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-2 py-1 rounded-lg text-[11px] text-stone-500 hover:text-stone-800 hover:bg-stone-100 border border-stone-200 cursor-pointer font-medium"
                >
                  검색어 초기화
                </button>
              </div>
            </div>
            {isQueryEmpty && (
              <p className="text-[11px] text-amber-700 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>검색어가 비어 있으면 지도 검색을 실행할 수 없습니다.</span>
              </p>
            )}
          </div>

          {/* Map Search Buttons */}
          <div className="space-y-2.5 pt-1">
            <span className="block text-xs font-bold text-stone-700 mb-1">
              외부 지도 서비스에서 검색 (새 탭으로 열림)
            </span>

            {/* 1. Naver Map Search Button */}
            <a
              href={naverMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleOpenMap(e, '네이버 지도')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-black text-sm transition-all duration-200 shadow-xs cursor-pointer ${
                isQueryEmpty
                  ? 'bg-emerald-50 text-emerald-300 border border-emerald-100 opacity-60 cursor-not-allowed'
                  : 'bg-[#03C75A] hover:bg-[#02B350] text-white active:scale-98 hover:shadow-md'
              }`}
              aria-label={`네이버 지도에서 "${combinedQuery}" 검색하기`}
            >
              <div className="flex items-center gap-2.5">
                {/* Naver 'N' badge */}
                <div className="w-6 h-6 rounded-md bg-white text-[#03C75A] flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                  N
                </div>
                <span>네이버 지도에서 검색</span>
              </div>
              <div className="flex items-center gap-1 text-xs opacity-90 font-medium">
                <span>바로가기</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>

            {/* 2. Kakao Map Search Button */}
            <a
              href={kakaoMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleOpenMap(e, '카카오맵')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-black text-sm transition-all duration-200 shadow-xs cursor-pointer ${
                isQueryEmpty
                  ? 'bg-amber-50 text-amber-300 border border-amber-100 opacity-60 cursor-not-allowed'
                  : 'bg-[#FEE500] hover:bg-[#FDD800] text-[#191919] active:scale-98 hover:shadow-md'
              }`}
              aria-label={`카카오맵에서 "${combinedQuery}" 검색하기`}
            >
              <div className="flex items-center gap-2.5">
                {/* Kakao map badge */}
                <div className="w-6 h-6 rounded-md bg-[#191919] text-[#FEE500] flex items-center justify-center font-black text-[11px] shrink-0 shadow-2xs">
                  map
                </div>
                <span>카카오맵에서 검색</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#191919]/80 font-medium">
                <span>바로가기</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>
          </div>

          {/* Genuine Data Integrity Principle 5 Notice */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-[11px] text-stone-500 leading-relaxed">
            <span className="font-bold text-stone-700 block mb-0.5">
              💡 실시간 공식 지도 검색 연동
            </span>
            광고나 가짜 식당 목록을 보여주지 않고, 네이버 지도와 카카오맵의 공식 검색
            결과를 통해 실제 영업 중인 매장 위치, 리뷰, 영업시간을 확인하실 수 있습니다.
          </div>
        </div>

        {/* Modal Footer: Return to Recommendations */}
        <div className="p-4 sm:p-5 border-t border-stone-200/80 bg-stone-50/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-stone-100 text-stone-800 font-extrabold text-sm border border-stone-300 shadow-2xs cursor-pointer active:scale-98 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-stone-600" />
            <span>추천 결과로 돌아가기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
