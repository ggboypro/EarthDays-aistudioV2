// src/features/diary-home/components/LedgerPresentationStage.tsx
// EarthDays Motion Ledger Stage: Continuous Unified 3D Spatial Architecture
// Zero flickering, zero DOM unmounting, perfect top headroom & luxurious paper styling

import React, { useState, useRef } from 'react';
import { motion, PanInfo } from 'motion/react';
import { Ledger } from '../../../core/types/ledger';
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Plus,
  BookOpen,
  Pencil,
} from 'lucide-react';

interface LedgerPresentationStageProps {
  ledgers: Ledger[];
  currentLedgerId: string;
  onSelectLedger: (ledger: Ledger) => void;
  onOpenAddLedger: () => void;
  onEditLedger?: (ledger: Ledger) => void;
  headerRight?: React.ReactNode;
  children: React.ReactNode; // Core Memory Gallery or Vertical Feed
}

export const LedgerPresentationStage: React.FC<LedgerPresentationStageProps> = ({
  ledgers,
  currentLedgerId,
  onSelectLedger,
  onOpenAddLedger,
  onEditLedger,
  headerRight,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Active book index
  const currentIndex = Math.max(
    0,
    ledgers.findIndex((l) => l.id === currentLedgerId)
  );
  const currentLedger = ledgers[currentIndex] || ledgers[0];
  const prevLedger = currentIndex > 0 ? ledgers[currentIndex - 1] : null;
  const nextLedger = currentIndex < ledgers.length - 1 ? ledgers[currentIndex + 1] : null;

  // Spring physics parameter
  const springTransition = {
    type: 'spring' as const,
    stiffness: 260,
    damping: 28,
    mass: 0.9,
  };

  const smoothTransition = {
    duration: 0.35,
    ease: [0.25, 1, 0.5, 1],
  };

  // Switch ledger helper
  const navigateLedger = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && prevLedger) {
      onSelectLedger(prevLedger);
    } else if (direction === 'next' && nextLedger) {
      onSelectLedger(nextLedger);
    }
  };

  // Handle horizontal drag on 3D expanded stage
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isExpanded) return;
    const swipeThreshold = 40;
    if (info.offset.x > swipeThreshold && prevLedger) {
      onSelectLedger(prevLedger);
    } else if (info.offset.x < -swipeThreshold && nextLedger) {
      onSelectLedger(nextLedger);
    }
  };

  // Combine real ledgers with the "+" add book item at the end
  const allShelfItems = [
    ...ledgers.map((l) => ({ type: 'ledger' as const, ledger: l, id: l.id })),
    { type: 'add' as const, ledger: null, id: 'add_new_ledger_slot' },
  ];

  return (
    <div className="relative w-full flex-1 flex flex-col items-center justify-start select-none">
      {/* ========================================================================= */}
      {/* 1. TOP DOCK HEADER BAR */}
      {/* ========================================================================= */}
      <div className="relative z-40 w-full max-w-4xl mx-auto px-4 pt-2.5 pb-1 flex items-center justify-between">
        {/* Left: Clean Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6.5 h-6.5 rounded-full bg-[#2C241E] text-[#F7F4EE] flex items-center justify-center shadow-xs">
            <BookOpen size={14} />
          </div>
          <span className="font-editorial text-[16px] font-bold text-[#2C241E] tracking-wide">
            我在地球的日子
          </span>
        </div>

        {/* Right: Show collapse button when expanded, or headerRight (ViewModeButton) when collapsed */}
        {isExpanded ? (
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#2C241E] text-[#FAF7F2] hover:bg-[#8A2B20] text-xs font-serif-sc font-medium shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <ChevronUp size={14} strokeWidth={2.4} />
            <span>收起</span>
          </button>
        ) : (
          headerRight
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. SHARED DYNAMIC LEDGER CONTAINER (Moves between Top Shelf & Center Stage) */}
      {/* ========================================================================= */}
      <motion.div
        animate={{
          y: isExpanded ? 168 : 0,
        }}
        transition={springTransition}
        className="relative z-30 w-full max-w-4xl mx-auto px-4 flex flex-col items-center shrink-0"
      >

        {/* Books Track / 3D Presentation Area */}
        <div className="relative w-full flex items-center justify-center min-h-[64px]">
          {/* 3D Perspective Stage */}
          <motion.div
            className="relative w-full flex items-center justify-center cursor-grab active:cursor-grabbing"
            style={{ perspective: 1200 }}
            drag={isExpanded ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={handleDragEnd}
          >
            {allShelfItems.map((item, idx) => {
              const isAddCard = item.type === 'add';
              const ledger = item.ledger;
              const isSelected = !isAddCard && ledger?.id === currentLedgerId;
              const offset = idx - currentIndex; // -1 for left neighbor, +1 for right neighbor, 0 for center

              // Calculate motion properties
              let targetX = 0;
              let targetY = 0;
              let targetZ = 0;
              let targetRotateY = 0;
              let targetScale = 1;
              let targetOpacity = 1;
              let targetWidth = 50;
              let targetHeight = 60;
              let targetZIndex = 10;

              if (!isExpanded) {
                // ==============================
                // COLLAPSED TOP ROW MODE:
                // ==============================
                targetWidth = 50;
                targetHeight = 60;
                targetX = (idx - currentIndex) * 64;
                targetY = 0;
                targetZ = 0;
                targetRotateY = 0;
                targetScale = isSelected ? 1.08 : 0.94;
                targetOpacity = Math.abs(offset) > 3 ? 0 : 1;
                targetZIndex = isSelected ? 20 : 10 - Math.abs(offset);
              } else {
                // ==============================
                // EXPANDED 3D CORE DESK MODE:
                // ==============================
                if (isSelected) {
                  // Center Active Book
                  targetWidth = 220;
                  targetHeight = 292;
                  targetX = 0;
                  targetY = 0;
                  targetZ = 0;
                  targetRotateY = 0;
                  targetScale = 1;
                  targetOpacity = 1;
                  targetZIndex = 30;
                } else if (offset === -1) {
                  // Left Neighbor
                  targetWidth = 196;
                  targetHeight = 266;
                  targetX = -195;
                  targetY = 0;
                  targetZ = -100;
                  targetRotateY = 28;
                  targetScale = 0.86;
                  targetOpacity = 0.76;
                  targetZIndex = 15;
                } else if (offset === 1) {
                  // Right Neighbor
                  targetWidth = 196;
                  targetHeight = 266;
                  targetX = 195;
                  targetY = 0;
                  targetZ = -100;
                  targetRotateY = -28;
                  targetScale = 0.86;
                  targetOpacity = 0.76;
                  targetZIndex = 15;
                } else {
                  // Other distant books / cards
                  targetWidth = 175;
                  targetHeight = 245;
                  targetX = offset < 0 ? -320 : 320;
                  targetY = 0;
                  targetZ = -220;
                  targetRotateY = offset < 0 ? 35 : -35;
                  targetScale = 0.7;
                  targetOpacity = 0;
                  targetZIndex = 5;
                }
              }

              return (
                <motion.div
                  key={item.id}
                  animate={{
                    x: targetX,
                    y: targetY,
                    z: targetZ,
                    rotateY: targetRotateY,
                    scale: targetScale,
                    opacity: targetOpacity,
                    width: targetWidth,
                    height: targetHeight,
                    zIndex: targetZIndex,
                  }}
                  transition={springTransition}
                  style={{
                    position: 'absolute',
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'center center',
                  }}
                  onClick={() => {
                    if (isAddCard) {
                      onOpenAddLedger();
                      return;
                    }

                    if (!isExpanded) {
                      if (isSelected) {
                        setIsExpanded(true);
                      } else if (ledger) {
                        onSelectLedger(ledger);
                      }
                    } else {
                      if (isSelected) {
                        // Clicking current active book in expanded mode flips open active notes!
                        setIsExpanded(false);
                      } else if (ledger) {
                        onSelectLedger(ledger);
                      }
                    }
                  }}
                  className={`rounded-[4px] cursor-pointer ${
                    isSelected && !isExpanded
                      ? 'ring-2 ring-[#B84337] ring-offset-2 ring-offset-[#F7F4EE]'
                      : ''
                  }`}
                >
                  {isAddCard ? (
                    /* "+ 新建" Special Add Book Item */
                    <motion.div
                      animate={{
                        boxShadow: isExpanded
                          ? '0 12px 28px -6px rgba(28, 18, 10, 0.18)'
                          : '0 2px 6px rgba(35, 25, 18, 0.12)',
                      }}
                      transition={smoothTransition}
                      className="w-full h-full relative rounded-[4px] border-2 border-dashed border-[#B8AA98] hover:border-[#2C241E] bg-[#FAF7F2] hover:bg-[#F3EDE2] flex flex-col items-center justify-center transition-colors text-[#6E6254] hover:text-[#2C241E]"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#EAE3D6] flex items-center justify-center mb-1">
                        <Plus size={18} strokeWidth={2.4} />
                      </div>
                      <span className="font-serif-sc text-[11px] font-medium tracking-wide">
                        装订新卷
                      </span>
                    </motion.div>
                  ) : (
                    /* Standard Ledger Book */
                    <motion.div
                      animate={{
                        boxShadow: isExpanded
                          ? isSelected
                            ? '0 30px 56px -12px rgba(28, 18, 10, 0.44), 0 10px 20px -4px rgba(20, 14, 8, 0.26)'
                            : '0 16px 32px -8px rgba(28, 18, 10, 0.32)'
                          : '0 2px 8px rgba(35, 25, 18, 0.22)',
                      }}
                      transition={smoothTransition}
                      className="w-full h-full relative rounded-[4px] overflow-hidden bg-[#2C241E]"
                    >
                      {/* Cover Image */}
                      <img
                        src={ledger?.coverImage}
                        alt={ledger?.name}
                        className="w-full h-full object-cover select-none"
                        referrerPolicy="no-referrer"
                      />

                      {/* Left Spine Groove */}
                      <div className="absolute left-0 inset-y-0 w-3 bg-gradient-to-r from-black/60 via-black/25 to-transparent pointer-events-none" />
                      <div className="absolute left-2.5 inset-y-0 w-[0.75px] bg-white/20 pointer-events-none" />

                      {/* Right Paper Edge Layering */}
                      <div className="absolute right-0 inset-y-1 w-[2.5px] bg-[#EFE8DC] border-l border-black/20 pointer-events-none rounded-r-[0.5px]" />

                      {/* Ambient Lighting */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/25 pointer-events-none" />

                      {/* Cover Typography */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent pt-6 pb-2 px-2 text-center flex flex-col items-center justify-end">
                        <motion.span
                          animate={{
                            fontSize: isExpanded && isSelected ? 17 : 10,
                            letterSpacing: isExpanded && isSelected ? '0.08em' : '0.02em',
                          }}
                          transition={smoothTransition}
                          className="font-serif-sc text-white font-semibold leading-tight drop-shadow-md truncate max-w-full"
                        >
                          {ledger?.name}
                        </motion.span>

                        <motion.p
                          animate={{
                            opacity: isExpanded && isSelected ? 0.85 : 0,
                            height: isExpanded && isSelected ? 'auto' : 0,
                            marginTop: isExpanded && isSelected ? 4 : 0,
                          }}
                          transition={smoothTransition}
                          className="font-serif-sc text-[11px] text-white/90 truncate max-w-full px-1 overflow-hidden"
                        >
                          {ledger?.subtitle || '在地球的日子'}
                        </motion.p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* EXPANDED DESK DETAILS & CONTROLS */}
        {/* ========================================================================= */}
        <motion.div
          animate={{
            opacity: isExpanded ? 1 : 0,
            y: isExpanded ? 0 : 20,
            maxHeight: isExpanded ? 240 : 0,
            marginTop: isExpanded ? 176 : 0,
            pointerEvents: isExpanded ? 'auto' : 'none',
          }}
          transition={smoothTransition}
          className="w-full max-w-md flex flex-col items-center text-center px-4 overflow-hidden"
        >
          <div className="text-center">
            <span className="font-serif-sc text-[11px] text-[#8C8072] tracking-widest uppercase">
              EarthDays Ledger · 第 {currentIndex + 1} 卷
            </span>
            <h2 className="font-serif-sc text-xl font-bold text-[#2C241E] mt-0.5 tracking-wide">
              《{currentLedger.name}》
            </h2>
            <p className="font-serif-sc text-xs text-[#6B5E51] mt-1 line-clamp-2 max-w-sm mx-auto leading-relaxed">
              {currentLedger.subtitle || '记录在此颗星球上的微风、黄昏与温存。'}
            </p>
          </div>

          {/* Navigation Arrows & Action Buttons */}
          <div className="flex items-center gap-3 mt-4">
            <button
              type="button"
              disabled={!prevLedger}
              onClick={() => navigateLedger('prev')}
              className="w-9 h-9 rounded-full bg-white/90 border border-[#DDD4C5] text-[#3A2E24] hover:bg-[#FAF7F2] disabled:opacity-30 disabled:cursor-not-allowed shadow-xs flex items-center justify-center transition-all cursor-pointer active:scale-90"
              title="上一本账本"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Bottom Edit Info Button (reuses Create/Edit Ledger Modal) */}
            <button
              type="button"
              onClick={() => onEditLedger && onEditLedger(currentLedger)}
              className="px-5 py-2 rounded-full bg-[#2C241E] text-[#FAF7F2] hover:bg-[#8A2B20] text-xs font-serif-sc font-medium shadow-[0_2px_10px_rgba(40,30,20,0.18)] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Pencil size={14} strokeWidth={2} />
              <span>编辑信息</span>
            </button>

            <button
              type="button"
              disabled={!nextLedger}
              onClick={() => navigateLedger('next')}
              className="w-9 h-9 rounded-full bg-white/90 border border-[#DDD4C5] text-[#3A2E24] hover:bg-[#FAF7F2] disabled:opacity-30 disabled:cursor-not-allowed shadow-xs flex items-center justify-center transition-all cursor-pointer active:scale-90"
              title="下一本账本"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 3. LOWER CONTENT AREA (Memory Gallery: slides down smoothly on expand) */}
      {/* ========================================================================= */}
      <motion.div
        animate={{
          y: isExpanded ? 320 : 0,
          opacity: isExpanded ? 0 : 1,
          pointerEvents: isExpanded ? 'none' : 'auto',
        }}
        transition={smoothTransition}
        className="relative z-10 w-full flex-1 flex flex-col items-center justify-start overflow-hidden pt-1"
      >
        {children}
      </motion.div>
    </div>
  );
};
