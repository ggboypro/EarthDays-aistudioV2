// src/features/diary-home/gallery/MemoryGalleryScrubber.tsx
// Continuous Memory Scrubber: direct tap + smooth drag across entire journal timeline

import React, { useRef, useCallback } from 'react';

interface MemoryGalleryScrubberProps {
  totalCount: number;
  activeIndex: number;
  currentDate?: string;
  currentLocationName?: string;
  onNavigateToIndex: (targetIndex: number) => void;
}

export const MemoryGalleryScrubber: React.FC<MemoryGalleryScrubberProps> = ({
  totalCount,
  activeIndex,
  currentDate,
  currentLocationName,
  onNavigateToIndex,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  // Generate milestone ticks (4 to 7 items based on total count)
  const getMilestoneTicks = useCallback((count: number): number[] => {
    if (count <= 1) return [1];
    if (count <= 12) {
      // e.g. 1, 5, 10, 12
      const ticks = [1];
      if (count >= 6) ticks.push(Math.round(count * 0.4));
      if (count >= 10) ticks.push(Math.round(count * 0.8));
      ticks.push(count);
      return Array.from(new Set(ticks));
    }
    if (count <= 50) {
      // e.g. 1, 10, 20, 30, 40, 42
      const ticks = [1];
      for (let i = 10; i < count; i += 10) {
        ticks.push(i);
      }
      ticks.push(count);
      return Array.from(new Set(ticks));
    }
    if (count <= 150) {
      // e.g. 1, 25, 50, 75, 100, 126
      const ticks = [1];
      for (let i = 25; i < count; i += 25) {
        ticks.push(i);
      }
      ticks.push(count);
      return Array.from(new Set(ticks));
    }
    // Very large datasets (>150): 5 milestones (1, 25%, 50%, 75%, max)
    return Array.from(
      new Set([
        1,
        Math.round(count * 0.25),
        Math.round(count * 0.5),
        Math.round(count * 0.75),
        count,
      ])
    );
  }, []);

  const milestoneTicks = getMilestoneTicks(totalCount);

  // Calculate index from pointer position along the track
  const computeIndexFromClientX = useCallback(
    (clientX: number): number => {
      if (!trackRef.current || totalCount <= 1) return 0;
      const rect = trackRef.current.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const normalized = Math.max(0, Math.min(1, relativeX / rect.width));
      return Math.round(normalized * (totalCount - 1));
    },
    [totalCount]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    if (trackRef.current) {
      trackRef.current.setPointerCapture(e.pointerId);
    }
    const target = computeIndexFromClientX(e.clientX);
    onNavigateToIndex(target);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    e.stopPropagation();
    const target = computeIndexFromClientX(e.clientX);
    onNavigateToIndex(target);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    e.stopPropagation();
    if (trackRef.current && trackRef.current.hasPointerCapture(e.pointerId)) {
      trackRef.current.releasePointerCapture(e.pointerId);
    }
  };

  const progressPercent =
    totalCount > 1 ? (activeIndex / (totalCount - 1)) * 100 : 100;

  return (
    <div className="w-full max-w-[360px] sm:max-w-[440px] px-6 flex flex-col items-center pointer-events-auto select-none">
      {/* 1. Header Counter & Metadata */}
      <div className="flex items-center gap-2 font-serif-sc text-[12px] text-[#6B5F52]">
        <span className="font-editorial text-[14.5px] font-bold text-[#2A2118] tracking-tight">
          {String(activeIndex + 1).padStart(2, '0')}
        </span>
        <span className="text-[#B5AAA0] text-[11px]">/</span>
        <span className="font-editorial text-[13px] text-[#8C8073]">
          {String(totalCount).padStart(2, '0')}
        </span>
        {currentDate && (
          <>
            <span className="text-[#C2B7AC] mx-0.5">·</span>
            <span className="font-editorial text-[12.5px] text-[#554A3E]">
              {currentDate.replace(/-/g, '.')}
            </span>
          </>
        )}
        {currentLocationName && (
          <>
            <span className="text-[#C2B7AC]">·</span>
            <span className="truncate max-w-[120px] text-[#7A6F62] text-[11.5px]">
              {currentLocationName}
            </span>
          </>
        )}
      </div>

      {/* 2. Continuous Memory Scrubber Track */}
      <div className="w-full mt-2.5 relative flex flex-col items-center">
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-4 flex items-center cursor-pointer group touch-none py-1"
          title="点击或拖动快速翻阅"
        >
          {/* Base Hairline Track */}
          <div className="w-full h-[1.5px] bg-[#DCD3C6] rounded-full relative">
            {/* Active Ink Trail */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-[#A63A2E] rounded-full"
              style={{
                width: `${progressPercent}%`,
                transition: isDraggingRef.current ? 'none' : 'width 180ms ease-out',
              }}
            />

            {/* Resting Vermilion Thumb Marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#FAF7F2] border-[1.5px] border-[#A63A2E] shadow-xs group-hover:scale-110 active:scale-125 transition-transform"
              style={{
                left: `${progressPercent}%`,
                transition: isDraggingRef.current
                  ? 'transform 100ms ease-out'
                  : 'left 180ms ease-out, transform 150ms ease',
              }}
            />
          </div>
        </div>

        {/* 3. Milestone Text Marks */}
        <div className="w-full flex justify-between px-0.5 text-[9.5px] text-[#A69B8E] font-editorial select-none -mt-0.5">
          {milestoneTicks.map((tick) => {
            const tickIndex = tick - 1;
            const isSelected = activeIndex === tickIndex;
            return (
              <button
                key={tick}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateToIndex(tickIndex);
                }}
                className={`hover:text-[#4A4035] transition-colors cursor-pointer py-0.5 ${
                  isSelected ? 'text-[#8A2B20] font-bold scale-105' : ''
                }`}
              >
                {String(tick).padStart(2, '0')}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
