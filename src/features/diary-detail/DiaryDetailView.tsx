// src/features/diary-detail/DiaryDetailView.tsx
// Card Detail View (二级页): Single card view with 0.8x scale swipe preview & Unified Top Nav

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

  // Motion values for GPU-accelerated swipe without React re-render lag
  const dragX = useMotionValue(0);

  // Derive neighbor card positions using Framer Motion transforms
  const leftCardX = useTransform(dragX, (x) => x - 330);
  const rightCardX = useTransform(dragX, (x) => x + 330);

  const currentEntry = entries[currentIndex] || initialEntry;
  const prevEntry = currentIndex > 0 ? entries[currentIndex - 1] : null;
  const nextEntry = currentIndex < entries.length - 1 ? entries[currentIndex + 1] : null;

  const handleToggleFavorite = (targetEntry: DiaryEntry) => {
    diaryRepo.toggleFavorite(targetEntry.id);
  };

  const handleDelete = (targetEntry: DiaryEntry) => {
    if (window.confirm('确定要将这一页日记从账本中移除吗？')) {
      diaryRepo.deleteEntry(targetEntry.id);
      onBack();
    }
  };

  // Drag Handlers
  const handleDragStart = () => {
    setIsSwiping(true);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setIsSwiping(false);

    const swipeThreshold = 50;
    const velocityThreshold = 250;

    let targetIndex = currentIndex;
    if (
      (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) &&
      nextEntry
    ) {
      targetIndex = Math.min(entries.length - 1, currentIndex + 1);
    } else if (
      (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) &&
      prevEntry
    ) {
      targetIndex = Math.max(0, currentIndex - 1);
    }

    // Spring animate dragX back to 0 cleanly
    animate(dragX, 0, {
      type: 'spring',
      stiffness: 350,
      damping: 28,
    });

    if (targetIndex !== currentIndex) {
      setCurrentIndex(targetIndex);
    }
  };

  // Helper to render single diary card content
  const renderCardContent = (entryItem: DiaryEntry) => {
    const [year, monthStr, dayStr] = entryItem.diaryDate.split('-');
    const monthNum = parseInt(monthStr, 10);
    const dayNum = parseInt(dayStr, 10);

    return (
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

      {/* 3. Motion-Powered GPU-Accelerated Stage */}
      <div className="relative w-full max-w-md mx-auto px-4 flex-1 flex items-center justify-center pt-2 overflow-hidden">
        <div className="relative w-full flex items-center justify-center min-h-[500px]">
          {/* Active Center Card */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            style={{ x: dragX }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            animate={{
              scale: isSwiping ? 0.8 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 26,
            }}
            className="w-full relative z-20 cursor-grab active:cursor-grabbing origin-center touch-pan-y"
          >
            {renderCardContent(currentEntry)}
          </motion.div>

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
              className="absolute z-10 w-full pointer-events-none origin-center"
            >
              {renderCardContent(prevEntry)}
            </motion.div>
          )}

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
              className="absolute z-10 w-full pointer-events-none origin-center"
            >
              {renderCardContent(nextEntry)}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
