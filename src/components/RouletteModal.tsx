import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { RotateCw, X, Sparkles, Award, ArrowDown, MapPin } from 'lucide-react';
import { RecommendedFood } from '../types.ts';
import {
  calculateTargetRotation,
  POINTER_ANGLE_DEG,
  ROULETTE_COLORS,
} from '../utils/rouletteMath.ts';

interface RouletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  foods: RecommendedFood[];
  onSearchRestaurant?: (foodName: string) => void;
}

export const RouletteModal: React.FC<RouletteModalProps> = ({
  isOpen,
  onClose,
  foods,
  onSearchRestaurant,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<RecommendedFood | null>(null);
  const [spinCount, setSpinCount] = useState(0);

  // Rotation tracker in degrees
  const currentRotationRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // If only 1 food in list, immediately select it as winner
  useEffect(() => {
    if (foods.length === 1) {
      setWinner(foods[0]);
    } else {
      setWinner(null);
    }
  }, [foods]);

  // Draw the roulette wheel on canvas
  const drawWheel = (rotationDeg: number) => {
    const canvas = canvasRef.current;
    if (!canvas || foods.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 14;
    const totalSlices = foods.length;
    const sliceAngle = (2 * Math.PI) / totalSlices;

    ctx.clearRect(0, 0, size, size);

    // Save context for rotation
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate((rotationDeg * Math.PI) / 180);

    // Outer rim border
    ctx.beginPath();
    ctx.arc(0, 0, radius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#E8E2D8';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, radius + 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Draw slices
    foods.forEach((food, i) => {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;
      const color = ROULETTE_COLORS[i % ROULETTE_COLORS.length];

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Slice border
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Draw slice text
      ctx.save();
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px Pretendard, sans-serif';

      // Shadow for text readability
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // Truncate name if too long for slice
      const displayName = food.name.length > 7 ? `${food.name.slice(0, 6)}…` : food.name;
      ctx.fillText(`${displayName} ${food.emoji}`, radius - 20, 0);
      ctx.restore();
    });

    // Center hub
    ctx.beginPath();
    ctx.arc(0, 0, 28, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#FF5A36';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF5A36';
    ctx.fill();

    ctx.restore();
  };

  // Initial render when modal opens or foods change
  useEffect(() => {
    if (isOpen && foods.length > 1) {
      drawWheel(currentRotationRef.current);
    }
  }, [isOpen, foods]);

  // Spin the wheel
  const handleSpin = () => {
    if (isSpinning || foods.length <= 1) return;

    setIsSpinning(true);
    setWinner(null);

    // Pick target randomly
    const targetIndex = Math.floor(Math.random() * foods.length);
    const chosenWinner = foods[targetIndex];

    // Compute target rotation
    const startRotation = currentRotationRef.current;
    const finalRotation = calculateTargetRotation(
      targetIndex,
      foods.length,
      startRotation,
      5, // 5 full turns
      (Math.random() - 0.5) * 0.25 // slight natural jitter within slice
    );

    const spinDuration = 4200; // 4.2 seconds
    const startTime = performance.now();

    // Ease-out cubic function: 1 - pow(1 - t, 3)
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      const easedProgress = easeOutCubic(progress);

      const currentAngle = startRotation + (finalRotation - startRotation) * easedProgress;
      currentRotationRef.current = currentAngle;
      drawWheel(currentAngle);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Animation finished!
        setIsSpinning(false);
        setWinner(chosenWinner);
        setSpinCount((prev) => prev + 1);

        // Confetti burst
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore if canvas-confetti is not loaded
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="roulette-modal-title"
    >
      <div className="bg-[#FAF7F2] rounded-3xl border border-[#EAE3D9] shadow-2xl max-w-lg w-full p-5 sm:p-7 relative text-center my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSpinning}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="룰렛 닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0EB] text-[#FF5A36] text-xs font-bold mb-2 border border-[#FF5A36]/20">
            <Sparkles className="w-3.5 h-3.5" />
            선택 고민 완벽 해결!
          </span>
          <h3 id="roulette-modal-title" className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            오늘의 메뉴 룰렛
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            추천된 {foods.length}개 메뉴 중에서 오늘의 운명 메뉴를 골라보세요!
          </p>
        </div>

        {/* If only 1 food, show direct result */}
        {foods.length === 1 ? (
          <div className="my-6 p-6 rounded-3xl bg-white border border-[#FF5A36]/30 shadow-sm text-center">
            <div className="text-6xl mb-3">{foods[0].emoji}</div>
            <span className="text-xs font-bold text-[#FF5A36] uppercase tracking-wide">단 하나의 맞춤 추천</span>
            <h4 className="text-2xl font-black text-stone-900 mt-1 mb-2">{foods[0].name}</h4>
            <div className="flex items-center justify-center gap-2 mb-2 text-xs font-semibold text-stone-600">
              <span className="bg-stone-100 px-2.5 py-0.5 rounded-full">{foods[0].category}</span>
              <span className="bg-stone-100 px-2.5 py-0.5 rounded-full">예상 {foods[0].priceRange}</span>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed break-keep-all">{foods[0].description}</p>
          </div>
        ) : (
          /* Wheel Container */
          <div className="relative flex flex-col items-center justify-center my-4">
            {/* Pointer Arrow pointing to top (12 o'clock) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 flex flex-col items-center filter drop-shadow-md">
              <div className="w-6 h-6 bg-[#FF3B1D] text-white flex items-center justify-center rounded-full shadow-xs">
                <ArrowDown className="w-4 h-4 stroke-[3]" />
              </div>
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-[#FF3B1D] -mt-1" />
            </div>

            {/* Canvas Wheel */}
            <div className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] relative rounded-full shadow-lg border-4 border-white bg-white">
              <canvas
                ref={canvasRef}
                width={320}
                height={320}
                className="w-full h-full rounded-full"
                aria-label="음식 추천 룰렛 판"
              />
            </div>
          </div>
        )}

        {/* Winner Announcement Banner */}
        {winner && (
          <div className="mt-4 p-5 rounded-3xl bg-gradient-to-r from-[#FF5A36] to-[#FF7556] text-white shadow-[0_8px_24px_rgba(255,90,54,0.35)] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider text-orange-100 mb-1">
              <Award className="w-4 h-4" />
              <span>오늘의 결정!</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black flex items-center justify-center gap-2 mb-1">
              <span>{winner.name}</span>
              <span>{winner.emoji}</span>
            </div>
            <div className="flex items-center justify-center gap-2 my-2 text-xs font-bold text-orange-100">
              <span className="bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full">{winner.category}</span>
              <span className="bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full">예상 {winner.priceRange}</span>
            </div>
            <p className="text-xs sm:text-sm text-orange-100 font-medium break-keep-all leading-relaxed">
              오늘은 이 메뉴! {winner.description}
            </p>
            {onSearchRestaurant && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSearchRestaurant(winner.name);
                }}
                className="mt-3.5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-[#FF5A36] hover:bg-[#FFF5F2] font-black text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer"
                aria-label={`${winner.name} 주변 식당 찾기`}
              >
                <MapPin className="w-4 h-4 text-[#FF5A36]" />
                <span>'{winner.name}' 주변 식당 찾기</span>
              </button>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          {foods.length > 1 && (
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className={`w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-extrabold text-base shadow-md transition-all ${
                isSpinning
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                  : 'bg-[#FF5A36] hover:bg-[#E04826] text-white shadow-[#FF5A36]/30 cursor-pointer active:scale-95'
              }`}
              aria-label={winner ? '한 번 더 룰렛 돌리기' : '룰렛 돌리기 시작'}
            >
              <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>
                {isSpinning
                  ? '메뉴 추첨 중...'
                  : winner
                  ? '한 번 더 돌리기'
                  : '룰렛 돌리기'}
              </span>
            </button>
          )}

          <button
            onClick={onClose}
            disabled={isSpinning}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3.5 rounded-2xl font-bold text-stone-700 bg-white hover:bg-stone-50 border border-[#E0D8CC] shadow-2xs hover:shadow-xs cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="추천 결과 목록으로 돌아가기"
          >
            <span>추천 결과로 돌아가기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
