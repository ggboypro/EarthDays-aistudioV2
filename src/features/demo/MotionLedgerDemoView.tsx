// src/features/demo/MotionLedgerDemoView.tsx
// EarthDays Motion Demo: Top Ledger Bar to Center Stage Continuous Animation
// Zero disappearing, zero flickering, 100% visual persistence with motion/react

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Ledger } from '../../core/types/ledger';
import { DiaryEntry } from '../../core/types/diary';
import { diaryRepo } from '../../core/storage/diaryRepository';
import { MemoryGallery } from '../diary-home/gallery/MemoryGallery';
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Sliders,
  Play,
  Pause,
} from 'lucide-react';

interface MotionLedgerDemoViewProps {
  onBack?: () => void;
  onEntryClick?: (entry: DiaryEntry) => void;
  onWriteClick?: () => void;
}

export const MotionLedgerDemoView: React.FC<MotionLedgerDemoViewProps> = ({
  onBack,
  onEntryClick,
  onWriteClick,
}) => {
  const [ledgers, setLedgers] = useState<Ledger[]>(() => diaryRepo.getLedgers());
  const [currentLedgerId, setCurrentLedgerId] = useState<string>(
    () => diaryRepo.getCurrentLedger().id
  );

  // Expansion state: false = Top Row Shelf, true = Center 3D Focus Stage
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Speed multiplier: 1 = normal, 0.4 = slow motion to inspect zero-flicker smoothness
  const [speed, setSpeed] = useState<number>(1);

  // Auto-play loop toggle
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const loopTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Active book index
  const currentIndex = Math.max(
    0,
    ledgers.findIndex((l) => l.id === currentLedgerId)
  );
  const currentLedger = ledgers[currentIndex] || ledgers[0];

  // Diary entries for current ledger
  const [entries, setEntries] = useState<DiaryEntry[]>(() =>
    diaryRepo.getEntriesByLedger(currentLedger.id)
  );
  const [currentEntryId, setCurrentEntryId] = useState<string>(
    () => entries[0]?.id || ''
  );

  useEffect(() => {
    const newEntries = diaryRepo.getEntriesByLedger(currentLedger.id);
    setEntries(newEntries);
    if (newEntries.length > 0 && !newEntries.some((e) => e.id === currentEntryId)) {
      setCurrentEntryId(newEntries[0].id);
    }
  }, [currentLedger.id, currentEntryId]);

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    diaryRepo.toggleFavorite(id);
    setEntries(diaryRepo.getEntriesByLedger(currentLedger.id));
  };

  // Transition spring parameters scaled by speed
  const springTransition = {
    type: 'spring' as const,
    stiffness: 170 * speed,
    damping: 24,
    mass: 1 / speed,
  };

  const smoothTransition = {
    duration: 0.58 / speed,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  };

  // Switch ledger
  const handleSelectLedger = (ledger: Ledger) => {
    setCurrentLedgerId(ledger.id);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentLedgerId(ledgers[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < ledgers.length - 1) {
      setCurrentLedgerId(ledgers[currentIndex + 1].id);
    }
  };

  // Loop toggle logic
  useEffect(() => {
    if (isLooping) {
      loopTimerRef.current = setInterval(() => {
        setIsExpanded((prev) => !prev);
      }, (1600 / speed) + 1200);
    } else {
      if (loopTimerRef.current) {
        clearInterval(loopTimerRef.current);
        loopTimerRef.current = null;
      }
    }
    return () => {
      if (loopTimerRef.current) {
        clearInterval(loopTimerRef.current);
      }
    };
  }, [isLooping, speed]);

  return (
    <div className="relative w-full min-h-screen bg-[#F7F4EE] text-[#2C241E] overflow-hidden flex flex-col font-sans select-none">
      {/* Ambient background lighting & fine paper grain */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#FFFDF9]/60 via-[#F5EFEB]/40 to-[#EAE2D5]/30 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#2C241E_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]" />

      {/* Top Navigation & Demo Control Bar */}
      <header className="relative z-40 w-full max-w-4xl mx-auto px-4 pt-3 pb-2 flex items-center justify-between border-b border-[#E5DDD0]/70">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 -ml-1 rounded-full text-[#6B5E51] hover:text-[#2C241E] hover:bg-black/5 transition-colors cursor-pointer"
              title="返回日记主页"
            >
              <ArrowLeft size={19} />
            </button>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#A34335]" />
              <h1 className="font-serif-sc text-base font-semibold tracking-wide text-[#2C241E]">
                账本横栏动效实验场
              </h1>
            </div>
            <p className="font-serif-sc text-[11px] text-[#8C7F72]">
              Motion 驱动 · 视觉全程保持 · 零白屏 · 零闪烁
            </p>
          </div>
        </div>

        {/* Demo Controls: Speed toggle, Auto-play loop & Expand/Collapse trigger */}
        <div className="flex items-center gap-2">
          {/* Auto Loop Toggle */}
          <button
            type="button"
            onClick={() => setIsLooping((prev) => !prev)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-serif-sc border transition-all cursor-pointer ${
              isLooping
                ? 'bg-[#A34335] text-white border-[#A34335] shadow-xs'
                : 'bg-[#EBE4D8]/70 text-[#5E5244] border-[#DDD4C5] hover:text-[#2C241E]'
            }`}
            title="自动循环播放展开与收缩动效，便于持续观察"
          >
            {isLooping ? <Pause size={12} /> : <Play size={12} />}
            <span>{isLooping ? '循环中' : '自动循环'}</span>
          </button>

          {/* Speed selector */}
          <div className="flex items-center bg-[#EBE4D8]/70 p-0.5 rounded-full text-[11px] font-mono text-[#5E5244] border border-[#DDD4C5]">
            <button
              type="button"
              onClick={() => setSpeed(1)}
              className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                speed === 1 ? 'bg-white shadow-xs text-[#2C241E] font-bold' : 'hover:text-[#2C241E]'
              }`}
              title="正常速度 1.0x"
            >
              1.0x
            </button>
            <button
              type="button"
              onClick={() => setSpeed(0.4)}
              className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                speed === 0.4
                  ? 'bg-white shadow-xs text-[#2C241E] font-bold'
                  : 'hover:text-[#2C241E]'
              }`}
              title="慢速观察 (0.4x) - 检查是否出现闪烁或消失"
            >
              0.4x 慢放
            </button>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={() => {
              setIsLooping(false);
              setIsExpanded((prev) => !prev);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2C241E] text-[#FAF7F2] hover:bg-[#8A2B20] text-xs font-serif-sc font-medium shadow-[0_2px_8px_rgba(40,30,20,0.18)] transition-all cursor-pointer active:scale-95"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={14} strokeWidth={2.4} />
                <span>收缩回顶部</span>
              </>
            ) : (
              <>
                <ChevronDown size={14} strokeWidth={2.4} />
                <span>展开至核心</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="relative flex-1 w-full max-w-5xl mx-auto flex flex-col items-center overflow-hidden">
        {/* ========================================================================= */}
        {/* SHARED DYNAMIC LEDGER CONTAINER (Moves continuously between Top and Center) */}
        {/* ========================================================================= */}
        <motion.div
          animate={{
            // When collapsed: docked near top (y: 0)
            // When expanded: moved directly into the core stage center with ample top headroom (y: 168px)
            y: isExpanded ? 168 : 0,
          }}
          transition={springTransition}
          className="relative z-30 w-full px-4 flex flex-col items-center shrink-0 pt-1"
        >
          {/* Status Label on Top Shelf (Gently fades when expanded) */}
          <motion.div
            animate={{
              opacity: isExpanded ? 0 : 1,
              height: isExpanded ? 0 : 'auto',
              marginBottom: isExpanded ? 0 : 4,
            }}
            transition={smoothTransition}
            className="w-full flex items-center justify-between text-[11px] text-[#8C8071] font-serif-sc px-2 overflow-hidden"
          >
            <span>书架横栏 · 点击选中账本或展开核心</span>
            <span>共 {ledgers.length} 卷</span>
          </motion.div>

          {/* Books Track / Presentation Area */}
          <div className="relative w-full flex items-center justify-center min-h-[70px]">
            {/* 
              Continuous Bookshelf:
              Each book is a single continuous motion component.
              In collapsed mode: neatly horizontally distributed.
              In expanded mode: the active book expands to 3D center stage,
              while neighbors fan out to the left and right in 3D perspective!
            */}
            <div
              className="relative w-full flex items-center justify-center"
              style={{ perspective: 1200 }}
            >
              {ledgers.map((ledger, idx) => {
                const isSelected = ledger.id === currentLedgerId;
                const offset = idx - currentIndex; // -1 for left neighbor, +1 for right neighbor, 0 for active

                // Calculate motion properties based on isExpanded & offset:
                let targetX = 0;
                let targetY = 0;
                let targetZ = 0;
                let targetRotateY = 0;
                let targetScale = 1;
                let targetOpacity = 1;
                let targetWidth = 52;
                let targetHeight = 62;
                let targetZIndex = 10;

                if (!isExpanded) {
                  // ==============================
                  // COLLAPSED TOP ROW MODE:
                  // Distributed in horizontal row
                  // ==============================
                  targetWidth = 50;
                  targetHeight = 58;
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
                  // Center book large, neighbors fan out in 3D
                  // ==============================
                  if (isSelected) {
                    // Center Active Book: Large 3D Desk Presentation
                    targetWidth = 224;
                    targetHeight = 296;
                    targetX = 0;
                    targetY = 0;
                    targetZ = 0;
                    targetRotateY = 0;
                    targetScale = 1;
                    targetOpacity = 1;
                    targetZIndex = 30;
                  } else if (offset === -1) {
                    // Left Neighbor Book: Tilted in 3D perspective to the left
                    targetWidth = 200;
                    targetHeight = 270;
                    targetX = -195;
                    targetY = 0;
                    targetZ = -100;
                    targetRotateY = 28;
                    targetScale = 0.86;
                    targetOpacity = 0.76;
                    targetZIndex = 15;
                  } else if (offset === 1) {
                    // Right Neighbor Book: Tilted in 3D perspective to the right
                    targetWidth = 200;
                    targetHeight = 270;
                    targetX = 195;
                    targetY = 0;
                    targetZ = -100;
                    targetRotateY = -28;
                    targetScale = 0.86;
                    targetOpacity = 0.76;
                    targetZIndex = 15;
                  } else {
                    // Other distant books: Faded further behind
                    targetWidth = 180;
                    targetHeight = 250;
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
                    key={ledger.id}
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
                      if (!isExpanded) {
                        if (isSelected) {
                          setIsExpanded(true);
                        } else {
                          handleSelectLedger(ledger);
                        }
                      } else {
                        if (!isSelected) {
                          handleSelectLedger(ledger);
                        }
                      }
                    }}
                    className={`rounded-[4px] overflow-hidden cursor-pointer ${
                      isSelected && !isExpanded
                        ? 'ring-2 ring-[#B84337] ring-offset-2 ring-offset-[#F7F4EE]'
                        : ''
                    }`}
                  >
                    {/* Shadow Layer (Dynamically deepens when expanded) */}
                    <motion.div
                      animate={{
                        boxShadow: isExpanded
                          ? isSelected
                            ? '0 28px 50px -12px rgba(28, 18, 10, 0.42), 0 8px 18px -4px rgba(20, 14, 8, 0.25)'
                            : '0 16px 32px -8px rgba(28, 18, 10, 0.32)'
                          : '0 2px 8px rgba(35, 25, 18, 0.22)',
                      }}
                      transition={smoothTransition}
                      className="w-full h-full relative rounded-[4px] overflow-hidden bg-[#2C241E]"
                    >
                      {/* Cover Photo */}
                      <img
                        src={ledger.coverImage}
                        alt={ledger.name}
                        className="w-full h-full object-cover select-none"
                        referrerPolicy="no-referrer"
                      />

                      {/* Spine Embossed Shade Groove (Left Edge) */}
                      <div className="absolute left-0 inset-y-0 w-3 bg-gradient-to-r from-black/60 via-black/25 to-transparent pointer-events-none" />
                      <div className="absolute left-2.5 inset-y-0 w-[0.75px] bg-white/20 pointer-events-none" />

                      {/* Right Paper Edge Layering */}
                      <div className="absolute right-0 inset-y-1 w-[2.5px] bg-[#EFE8DC] border-l border-black/20 pointer-events-none rounded-r-[0.5px]" />

                      {/* Lighting Highlight */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/25 pointer-events-none" />

                      {/* Book Cover Title: Smoothly expands typography without popping */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent pt-6 pb-2 px-2 text-center flex flex-col items-center justify-end">
                        <motion.span
                          animate={{
                            fontSize: isExpanded && isSelected ? 18 : 10,
                            letterSpacing: isExpanded && isSelected ? '0.08em' : '0.02em',
                          }}
                          transition={smoothTransition}
                          className="font-serif-sc text-white font-semibold leading-tight drop-shadow-md truncate max-w-full"
                        >
                          {ledger.name}
                        </motion.span>

                        {/* Subtitle visible when expanded */}
                        <motion.p
                          animate={{
                            opacity: isExpanded && isSelected ? 0.85 : 0,
                            height: isExpanded && isSelected ? 'auto' : 0,
                            marginTop: isExpanded && isSelected ? 4 : 0,
                          }}
                          transition={smoothTransition}
                          className="font-serif-sc text-[11px] text-white/90 truncate max-w-full px-1 overflow-hidden"
                        >
                          {ledger.subtitle || '在地球的日子'}
                        </motion.p>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Expanded State Details & Actions (Seamlessly slides in under the center book) */}
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
              <span className="font-serif-sc text-[12px] text-[#8C8072] tracking-widest uppercase">
                第 {currentIndex + 1} / {ledgers.length} 卷 · 留存记录
              </span>
              <h2 className="font-serif-sc text-xl font-bold text-[#2C241E] mt-0.5 tracking-wide">
                {currentLedger.name}
              </h2>
              <p className="font-serif-sc text-xs text-[#6B5E51] mt-1 leading-relaxed max-w-xs mx-auto">
                {currentLedger.subtitle ||
                  '每一本账本，都是你在地球漫步时写下的光阴注脚与温柔回响。'}
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE6DC] text-[#4A3F33] text-[11px] font-serif-sc mt-2">
                <BookOpen size={13} />
                <span>{currentLedger.entryCount} 篇珍贵回忆</span>
              </div>
            </div>

            {/* Navigation & Collapse Buttons */}
            <div className="flex items-center gap-3 mt-4">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="w-9 h-9 rounded-full bg-white/90 border border-[#DDD4C5] shadow-xs flex items-center justify-center text-[#5A4E42] hover:text-[#2C241E] hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                title="上一本账本"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsLooping(false);
                  setIsExpanded(false);
                }}
                className="px-5 py-2 rounded-full bg-[#2C241E] text-[#FAF7F2] hover:bg-[#8A2B20] text-xs font-serif-sc font-medium shadow-[0_2px_10px_rgba(40,30,20,0.18)] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <ChevronUp size={15} strokeWidth={2.4} />
                <span>收缩折叠</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex === ledgers.length - 1}
                className="w-9 h-9 rounded-full bg-white/90 border border-[#DDD4C5] shadow-xs flex items-center justify-center text-[#5A4E42] hover:text-[#2C241E] hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                title="下一本账本"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* ========================================================================= */}
        {/* LOWER CONTENT AREA (Memory Gallery: slides down smoothly on expand) */}
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
          <MemoryGallery
            entries={entries}
            currentId={currentEntryId}
            onSelectId={setCurrentEntryId}
            onEntryClick={onEntryClick || (() => {})}
            onToggleFavorite={handleToggleFavorite}
            onWriteClick={onWriteClick || (() => {})}
          />
        </motion.div>
      </main>
    </div>
  );
};
