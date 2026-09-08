// src/features/diary-detail/DiaryDetailView.tsx
// Card Detail View (二级页): Single card view with 100% continuous 0.8x scale swipe preview & Unified Top Nav

import React, { useState } from 'react';
import { DiaryEntry } from '../../core/types/diary';
import { diaryRepo } from '../../core/storage/diaryRepository';
import { PaperSheet } from '../../design-system/paper/PaperSheet';
import { PhotoPrint } from '../../design-system/photo/PhotoPrint';
import { MoodStamp, LocationBadge } from '../../design-system/elements/MoodStamp';
import { BookmarkRibbon } from '../../design-system/elements/Bookmark';
import { MoreDotsIcon } from '../../design-system/icons/EarthDiaryIcons';
import { UnifiedTopNav } from '../../design-system/navigation/UnifiedTopNav';
import { useTheme } from '../../core/theme/ThemeContext';
import { motion, useMotionValue, useTransform, animate, PanInfo } from 'motion/react';

interface DiaryDetailViewProps {
  entry: DiaryEntry;
  onBack: () => void;
  onEdit: (entry: DiaryEntry) => void;
  allEntries?: DiaryEntry[];
}

const CARD_STEP = 330; // Horizontal spacing between adjacent cards in slider

export const DiaryDetailView: React.FC<DiaryDetailViewProps> = ({
  entry: initialEntry,
  onBack,
  onEdit,
  allEntries: passedEntries,
}) => {
  const { theme } = useTheme();

  // Get full list of entries for swiping
  const entries =
    passedEntries && passedEntries.length > 0
      ? passedEntries
      : diaryRepo.getEntriesByLedger(initialEntry.ledgerId).length > 0
      ? diaryRepo.getEntriesByLedger(initialEntry.ledgerId)
      : diaryRepo.getAllEntries();

  // Active index state
  const initialIndex = Math.max(
    0,
    entries.findIndex((e) => e.id === initialEntry.id)
  );
  const [currentIndex, setCurrentIndex] = useState<number>(
    initialIndex >= 0 ? initialIndex : 0
  );

  const [showMenu, setShowMenu] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);

  // Motion values for GPU-accelerated continuous swipe without React re-render lag
  const dragX = useMotionValue(0);

  // Derive card positions directly from dragX (1:1 motion tracking without lag or spring desync)
  const farLeftX = useTransform(dragX, (x) => x - CARD_STEP * 2);
  const leftCardX = useTransform(dragX, (x) => x - CARD_STEP);
  const rightCardX = useTransform(dragX, (x) => x + CARD_STEP);
  const farRightX = useTransform(dragX, (x) => x + CARD_STEP * 2);

  const currentEntry = entries[currentIndex] || initialEntry;
  const prevEntry = currentIndex > 0 ? entries[currentIndex - 1] : null;
  const farPrevEntry = currentIndex > 1 ? entries[currentIndex - 2] : null;
  const nextEntry = currentIndex < entries.length - 1 ? entries[currentIndex + 1] : null;
  const farNextEntry = currentIndex < entries.length - 2 ? entries[currentIndex + 2] : null;

  const handleToggleFavorite = (targetEntry: DiaryEntry) => {
    diaryRepo.toggleFavorite(targetEntry.id);
  };

  const handleDelete = (targetEntry: DiaryEntry) => {
    if (window.confirm('确定要将这一页日记从账本中移除吗？')) {
      diaryRepo.deleteEntry(targetEntry.id);
      onBack();
    }
  };

  // Drag Gesture Handlers
  const handleDragStart = () => {
    setIsSwiping(true);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const swipeThreshold = 50;
    const velocityThreshold = 220;

    let deltaIndex = 0;
    if (
      (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) &&
      nextEntry
    ) {
      deltaIndex = 1;
    } else if (
      (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) &&
      prevEntry
    ) {
      deltaIndex = -1;
    }

    const targetX = -deltaIndex * CARD_STEP;

    // Smoothly animate dragX to target destination (so the target card glides smoothly to 0px center)
    animate(dragX, targetX, {
      type: 'spring',
      stiffness: 300,
      damping: 28,
      velocity: info.velocity.x,
      onComplete: () => {
        if (deltaIndex !== 0) {
          // Synchronously reset dragX to 0 at the same time index increments!
          // Since targetX was -deltaIndex * CARD_STEP, index + deltaIndex with dragX=0
          // places ALL cards at the exact same screen pixel coordinates. Zero jump!
          setCurrentIndex((prev) => prev + deltaIndex);
          dragX.set(0);
        }
        setIsSwiping(false);
      },
    });
  };

  // Helper to render single diary card content
  // Note: Only attach initial layoutId to the initial entry when detail view opens to prevent Framer Motion duplicate layout collisions
  const renderCardContent = (entryItem: DiaryEntry, isInitialCard: boolean) => {
    const [year, monthStr, dayStr] = entryItem.diaryDate.split('-');
    const monthNum = parseInt(monthStr, 10);
    const dayNum = parseInt(dayStr, 10);

    const paperContent = (
      <PaperSheet className="p-6 sm:p-7 relative shadow-paper-l1 w-full min-h-[480px] flex flex-col justify-between select-none">
        <div>
          {/* Physical Bookmark Ribbon */}
          <div
            className="absolute -top-2 right-6 z-20 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFavorite(entryItem);
            }}
          >
            <BookmarkRibbon
              isFavorite={entryItem.isFavorite}
              color={theme.accent}
              size="md"
            />
          </div>

          {/* Date Anchor */}
          <div className="flex items-baseline gap-2 pb-2 border-b border-[#EAE2D5] mb-4">
            <span className="font-editorial text-[24px] font-bold text-[#2A231C]">
              {monthNum}月{dayNum}日
            </span>
            <span className="font-serif-sc text-[13px] text-[#867A6D]">
              {year}年 · {entryItem.dayOfWeek}
            </span>
          </div>

          {/* Title */}
          {entryItem.title && (
            <h1 className="font-serif-sc text-[20px] font-bold text-[#29221C] tracking-tight mb-3">
              {entryItem.title}
            </h1>
          )}

          {/* Body Text */}
          <p className="font-serif-sc text-[15.5px] text-[#3F372E] leading-[1.8] whitespace-pre-line mb-6 tracking-normal">
            {entryItem.body}
          </p>

          {/* Photos Showcase */}
          {entryItem.photos && entryItem.photos.length > 0 && (
            <div className="my-6 space-y-4">
              {entryItem.photos.map((photo, i) => (
                <div key={photo.id || i} className="flex justify-center">
                  <PhotoPrint photo={photo} size="hero" showCaption />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer: Location & Mood */}
        <div className="pt-4 border-t border-[#EAE2D5] flex items-center justify-between text-[#6B5F52] mt-auto">
          <div className="flex items-center gap-4 flex-wrap">
            {entryItem.location && <LocationBadge location={entryItem.location} />}
            {entryItem.mood && <MoodStamp mood={entryItem.mood} />}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFavorite(entryItem);
            }}
            className="font-serif-sc text-[12px] text-[#93877A] hover:text-[#332920] cursor-pointer flex items-center gap-1"
          >
            <span>{entryItem.isFavorite ? '已夹入书签' : '夹入书签'}</span>
          </button>
        </div>
      </PaperSheet>
    );

    if (isInitialCard) {
      return (
        <motion.div
          layoutId={`diary-card-${entryItem.id}`}
          className="w-full h-full"
        >
          {paperContent}
        </motion.div>
      );
    }

    return <div className="w-full h-full">{paperContent}</div>;
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] flex flex-col justify-start pb-24">
      {/* 1. Unified Top Navigation (二级页统一Nav) */}
      <UnifiedTopNav
        title="我在地球的日子"
        onBack={onBack}
        backText="返回"
        rightElement={
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 flex items-center justify-center rounded-[4px] bg-[#F3EDE2] border border-[#DDD3C3] text-[#5A4F44] hover:bg-[#EBE2D3] cursor-pointer shadow-xs active:scale-95 transition-all"
              title="卡片选项"
            >
              <MoreDotsIcon size={18} />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-1.5 z-50 w-36 bg-[#FAF7F2] border border-[#DDD3C4] rounded-[6px] shadow-xl py-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(currentEntry);
                  }}
                  className="w-full text-left px-3 py-1.5 font-serif-sc text-[12.5px] text-[#3D342C] hover:bg-[#EAE2D5] cursor-pointer"
                >
                  ✏️ 编辑此页
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    handleToggleFavorite(currentEntry);
                  }}
                  className="w-full text-left px-3 py-1.5 font-serif-sc text-[12.5px] text-[#3D342C] hover:bg-[#EAE2D5] cursor-pointer"
                >
                  🔖 {currentEntry.isFavorite ? '取消书签' : '插入书签'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    alert('已生成日记分享卡片');
                  }}
                  className="w-full text-left px-3 py-1.5 font-serif-sc text-[12.5px] text-[#3D342C] hover:bg-[#EAE2D5] cursor-pointer"
                >
                  📤 分享此页
                </button>
                <div className="my-1 border-t border-[#EAE2D5]" />
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    handleDelete(currentEntry);
                  }}
                  className="w-full text-left px-3 py-1.5 font-serif-sc text-[12.5px] text-[#B8382C] hover:bg-[#FCEAE8] cursor-pointer"
                >
                  🗑️ 移除这一页
                </button>
              </div>
            )}
          </div>
        }
      />

      {/* 2. Page Indicator Subheader */}
      <div className="w-full max-w-md mx-auto px-4 pt-3 pb-1 flex items-center justify-between text-[12px] font-serif-sc text-[#8C8071]">
        <span>
          {currentIndex + 1} / {entries.length} 篇日记
        </span>
        <span className="text-[11px] opacity-75">
          {isSwiping ? '左右滑动切换' : '按住卡片左右滑动'}
        </span>
      </div>

      {/* 3. Motion-Powered Continuous Carousel Stage */}
      <div className="relative w-full max-w-md mx-auto px-4 flex-1 flex items-center justify-center pt-2 overflow-hidden">
        <div className="relative w-full flex items-center justify-center min-h-[500px]">
          {/* Far Left Preview Card */}
          {farPrevEntry && (
            <motion.div
              style={{ x: farLeftX }}
              animate={{
                scale: 0.8,
                opacity: isSwiping ? 0.7 : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 26,
              }}
              className="absolute z-10 w-full pointer-events-none origin-center"
            >
              {renderCardContent(farPrevEntry, farPrevEntry.id === initialEntry.id)}
            </motion.div>
          )}

          {/* Left Preview Card */}
          {prevEntry && (
            <motion.div
              style={{ x: leftCardX }}
              animate={{
                scale: 0.8,
                opacity: isSwiping ? 0.85 : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 26,
              }}
              className="absolute z-15 w-full pointer-events-none origin-center"
            >
              {renderCardContent(prevEntry, prevEntry.id === initialEntry.id)}
            </motion.div>
          )}

          {/* Active Center Card (Interactive Drag Target) */}
          <motion.div
            drag="x"
            dragConstraints={{ left: -CARD_STEP * 1.5, right: CARD_STEP * 1.5 }}
            dragElastic={0.25}
            style={{ x: dragX }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            animate={{
              scale: isSwiping ? 0.8 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 320,
              damping: 28,
            }}
            className="w-full relative z-20 cursor-grab active:cursor-grabbing origin-center touch-pan-y"
          >
            {renderCardContent(currentEntry, currentEntry.id === initialEntry.id)}
          </motion.div>

          {/* Right Preview Card */}
          {nextEntry && (
            <motion.div
              style={{ x: rightCardX }}
              animate={{
                scale: 0.8,
                opacity: isSwiping ? 0.85 : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 26,
              }}
              className="absolute z-15 w-full pointer-events-none origin-center"
            >
              {renderCardContent(nextEntry, nextEntry.id === initialEntry.id)}
            </motion.div>
          )}

          {/* Far Right Preview Card */}
          {farNextEntry && (
            <motion.div
              style={{ x: farRightX }}
              animate={{
                scale: 0.8,
                opacity: isSwiping ? 0.7 : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 26,
              }}
              className="absolute z-10 w-full pointer-events-none origin-center"
            >
              {renderCardContent(farNextEntry, farNextEntry.id === initialEntry.id)}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
