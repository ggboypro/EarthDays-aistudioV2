// src/features/diary-home/gallery/MemoryGallery.tsx
// Memory Gallery: Fluid harmonic curves, balanced sliding sensitivity, and continuous scrubber

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DiaryEntry } from '../../../core/types/diary';
import { GalleryCard } from './GalleryCard';
import { computeSpatialProps } from './GallerySpatialEngine';
import { MemoryGalleryScrubber } from './MemoryGalleryScrubber';
import { motionTokens } from '../../../motion/tokens';
import { motion } from 'motion/react';

interface MemoryGalleryProps {
  entries: DiaryEntry[];
  currentId: string;
  newlyInsertedId?: string;
  onSelectId: (id: string) => void;
  onEntryClick: (entry: DiaryEntry) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onWriteClick: () => void;
}

interface PointerSample {
  x: number;
  time: number;
}

export const MemoryGallery: React.FC<MemoryGalleryProps> = ({
  entries,
  currentId,
  newlyInsertedId,
  onSelectId,
  onEntryClick,
  onToggleFavorite,
  onWriteClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Single source of truth activeIndex
  const activeIndex = Math.max(
    0,
    entries.findIndex((e) => e.id === currentId)
  );

  // Dragging & Kinematics State
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSettling, setIsSettling] = useState<boolean>(false);
  const [snapDurationMs, setSnapDurationMs] = useState<number>(360);

  // Velocity Tracking & Intent Refs
  const startXRef = useRef<number>(0);
  const pointerHistoryRef = useRef<PointerSample[]>([]);
  const settleTimeoutRef = useRef<number | null>(null);

  // Responsive Card Spacing
  const [cardSpacing, setCardSpacing] = useState<number>(360);

  useEffect(() => {
    const updateSpacing = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCardSpacing(250); // Mobile: 280px card, 60px side peek
      } else if (width < 1024) {
        setCardSpacing(310); // Tablet: 340px card, 120px side peek
      } else {
        setCardSpacing(360); // Desktop: 400px card, 160-200px side peek
      }
    };
    updateSpacing();
    window.addEventListener('resize', updateSpacing);
    return () => window.removeEventListener('resize', updateSpacing);
  }, []);

  // Trigger brief focus settle animation on the target card
  const triggerFocusSettle = useCallback(() => {
    setIsSettling(true);
    if (settleTimeoutRef.current) {
      window.clearTimeout(settleTimeoutRef.current);
    }
    settleTimeoutRef.current = window.setTimeout(() => {
      setIsSettling(false);
    }, motionTokens.duration.settleTimeMs);
  }, []);

  // Smooth snap duration curve based on page span (1 page: 360ms, 2 pages: 430ms, 3+ pages: 490ms)
  const computeSnapDuration = (pageSpan: number): number => {
    const absSpan = Math.max(1, Math.abs(pageSpan));
    if (absSpan <= 1) return 360;
    if (absSpan === 2) return 430;
    return Math.min(520, 430 + (absSpan - 2) * 35);
  };

  // Safe navigation helper with variable duration and focus settle
  const navigateToIndex = useCallback(
    (targetIndex: number, customDurationMs?: number) => {
      const boundedIndex = Math.max(0, Math.min(entries.length - 1, targetIndex));
      if (entries[boundedIndex]) {
        const pageSpan = Math.abs(boundedIndex - activeIndex);
        const duration = customDurationMs ?? computeSnapDuration(pageSpan);
        setSnapDurationMs(duration);

        if (entries[boundedIndex].id !== currentId) {
          onSelectId(entries[boundedIndex].id);
          triggerFocusSettle();
        }
      }
    },
    [entries, activeIndex, currentId, onSelectId, triggerFocusSettle]
  );

  // Keyboard Navigation (Arrow: ±1, Shift+Arrow: ±3)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      const jumpStep = e.shiftKey ? 3 : 1;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateToIndex(activeIndex - jumpStep);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateToIndex(activeIndex + jumpStep);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, navigateToIndex]);

  // Pointer Handlers with Smooth Resistance & Velocity Sampling
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    pointerHistoryRef.current = [{ x: e.clientX, time: performance.now() }];
    setDragOffset(0);
    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const now = performance.now();

    // Append to rolling pointer history window (keep within last 120ms)
    pointerHistoryRef.current.push({ x: currentX, time: now });
    if (pointerHistoryRef.current.length > 10) {
      pointerHistoryRef.current.shift();
    }
    pointerHistoryRef.current = pointerHistoryRef.current.filter((s) => now - s.time <= 120);

    const totalOffset = currentX - startXRef.current;
    const isAtStart = activeIndex === 0;
    const isAtEnd = activeIndex === entries.length - 1;

    // Smooth hyperbolic rubber-band resistance at boundary edges
    if ((isAtStart && totalOffset > 0) || (isAtEnd && totalOffset < 0)) {
      const maxOverdrag = cardSpacing * 0.45;
      const resistedOffset =
        Math.sign(totalOffset) *
        maxOverdrag *
        Math.tanh(Math.abs(totalOffset) / (cardSpacing * 0.7));
      setDragOffset(resistedOffset);
    } else {
      setDragOffset(totalOffset);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    const totalOffset = dragOffset;
    const absOffset = Math.abs(totalOffset);

    // If movement is tiny (< 10px), treat it as a direct tap/click on the card
    if (absOffset < 10) {
      if (entries[activeIndex]) {
        onEntryClick(entries[activeIndex]);
      }
      setDragOffset(0);
      return;
    }

    // Compute release velocity (px/ms) from recent history samples
    const history = pointerHistoryRef.current;
    let releaseVelocity = 0;
    if (history.length >= 2) {
      const oldest = history[0];
      const newest = history[history.length - 1];
      const dt = Math.max(1, newest.time - oldest.time);
      releaseVelocity = (newest.x - oldest.x) / dt;
    }
    const absVelocity = Math.abs(releaseVelocity);

    // ==========================================
    // BALANCED SMOOTH GESTURE DECISION ENGINE
    // ==========================================
    let pageDelta = 0;
    const dragRatio = absOffset / cardSpacing;

    // 1. Intentional Drag: Moved more than 26% of card spacing
    if (dragRatio >= 0.26) {
      const direction = totalOffset < 0 ? 1 : -1;
      const pages = Math.round(dragRatio);
      // Cap normal drag jump to at most 2 cards to prevent uncontrolled skips
      pageDelta = direction * Math.max(1, Math.min(2, pages));
    }
    // 2. Responsive Flick: quick swipe with consistent direction
    else if (absVelocity >= 0.38 && absOffset >= 16) {
      const flickDir = releaseVelocity < 0 ? 1 : -1;
      // High-speed fling over larger distance allows 2 cards, otherwise strictly 1 card
      if (absVelocity >= 1.5 && absOffset >= 50) {
        pageDelta = flickDir * 2;
      } else {
        pageDelta = flickDir * 1;
      }
    }

    const targetIndex = Math.max(0, Math.min(entries.length - 1, activeIndex + pageDelta));
    const span = Math.abs(targetIndex - activeIndex);
    const duration = computeSnapDuration(span);

    setDragOffset(0);
    navigateToIndex(targetIndex, duration);
  };

  // Trackpad / Horizontal Wheel with Smooth Throttled Navigation
  const wheelLockRef = useRef<boolean>(false);
  const handleWheel = (e: React.WheelEvent) => {
    const delta =
      Math.abs(e.deltaX) > Math.abs(e.deltaY)
        ? e.deltaX
        : e.shiftKey
        ? e.deltaY
        : 0;
    if (Math.abs(delta) < 16) return;
    if (wheelLockRef.current) return;

    wheelLockRef.current = true;
    const direction = delta > 0 ? 1 : -1;
    const targetIndex = Math.max(
      0,
      Math.min(entries.length - 1, activeIndex + direction)
    );
    navigateToIndex(targetIndex, 380);

    setTimeout(() => {
      wheelLockRef.current = false;
    }, 320);
  };

  if (entries.length === 0) {
    return (
      <div className="w-full h-[55vh] flex flex-col items-center justify-center text-center px-4">
        <p className="font-serif-sc text-[15.5px] text-[#7A6F62] mb-4">
          这一本账本还没有留存记忆。
        </p>
        <button
          type="button"
          onClick={onWriteClick}
          className="px-5 py-2 rounded-[4px] bg-[#9E3628] font-serif-sc text-[13px] text-white shadow-sm hover:opacity-95 transition-opacity cursor-pointer"
        >
          写下第一页日记
        </button>
      </div>
    );
  }

  // Fractional continuous index during dragging
  const continuousIndex = activeIndex - dragOffset / cardSpacing;
  const totalCount = entries.length;
  const currentEntry = entries[activeIndex];

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      className="w-full relative touch-pan-y select-none cursor-grab active:cursor-grabbing overflow-hidden pt-1 pb-4 flex flex-col items-center"
      style={{ userSelect: 'none', touchAction: 'pan-y' }}
    >
      {/* Cards Viewport Stage - Full Viewport Width */}
      <div className="relative w-full h-[420px] sm:h-[460px] md:h-[490px] lg:h-[510px] flex items-center justify-center overflow-visible">
        {entries.map((entry, index) => {
          const distance = index - continuousIndex;

          // Virtualized rendering window: render within [-4.2, +4.2] units range
          if (Math.abs(distance) > 4.2) {
            return null;
          }

          const spatial = computeSpatialProps(distance);
          const translateX = distance * cardSpacing;

          return (
            <motion.div
              key={entry.id}
              animate={{ x: translateX }}
              transition={
                isDragging
                  ? { type: 'just' }
                  : { type: 'spring', stiffness: 320, damping: 28 }
              }
              style={{
                position: 'absolute',
                zIndex: spatial.zIndex,
              }}
            >
              <GalleryCard
                entry={entry}
                spatial={spatial}
                isSettling={isSettling}
                isNewlyInserted={entry.id === newlyInsertedId}
                onCardClick={() => {
                  if (entry.id === currentId || index === activeIndex) {
                    onEntryClick(entry);
                  } else {
                    navigateToIndex(index);
                  }
                }}
                onToggleFavorite={onToggleFavorite}
              />
            </motion.div>
          );
        })}
      </div>

      {/* CONTINUOUS MEMORY SCRUBBER (Unified single source of truth timeline) */}
      <div className="mt-3 sm:mt-4 w-full flex justify-center">
        <MemoryGalleryScrubber
          totalCount={totalCount}
          activeIndex={activeIndex}
          currentDate={currentEntry?.diaryDate}
          currentLocationName={currentEntry?.location?.name}
          onNavigateToIndex={(targetIdx) => navigateToIndex(targetIdx)}
        />
      </div>
    </div>
  );
};

