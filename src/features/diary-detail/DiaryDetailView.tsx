import React, { useState } from 'react';
import { DiaryEntry } from '../../core/types/diary';
import { diaryRepo } from '../../core/storage/diaryRepository';
import { PaperSheet } from '../../design-system/paper/PaperSheet';
import { PhotoPrint } from '../../design-system/photo/PhotoPrint';
import { MoodStamp, LocationBadge } from '../../design-system/elements/MoodStamp';
import { BookmarkRibbon } from '../../design-system/elements/Bookmark';
import { MoreDotsIcon, SharePhotoIcon } from '../../design-system/icons/EarthDiaryIcons';
import { useTheme } from '../../core/theme/ThemeContext';
import { motion } from 'motion/react';

interface DiaryDetailViewProps {
  entry: DiaryEntry;
  onBack: () => void;
  onEdit: (entry: DiaryEntry) => void;
}

export const DiaryDetailView: React.FC<DiaryDetailViewProps> = ({
  entry: initialEntry,
  onBack,
  onEdit,
}) => {
  const { theme } = useTheme();
  const [entry, setEntry] = useState<DiaryEntry>(initialEntry);
  const [showMenu, setShowMenu] = useState(false);

  const handleToggleFavorite = () => {
    diaryRepo.toggleFavorite(entry.id);
    const updated = diaryRepo.getEntryById(entry.id);
    if (updated) setEntry(updated);
  };

  const handleDelete = () => {
    if (window.confirm('确定要将这一页日记从账本中移除吗？')) {
      diaryRepo.deleteEntry(entry.id);
      onBack();
    }
  };

  // Parse date
  const [year, monthStr, dayStr] = entry.diaryDate.split('-');
  const monthNum = parseInt(monthStr, 10);
  const dayNum = parseInt(dayStr, 10);

  return (
    <div className="min-h-screen pb-24 pt-3 px-4 max-w-md mx-auto">
      {/* Top action navigation */}
      <header className="flex items-center justify-between py-2 mb-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-[#FAF7F2] border border-[#E0D7C9] text-[#5A4F44] font-serif-sc text-[13px] hover:bg-[#F0E9DC] cursor-pointer shadow-sm"
        >
          <span>← 返回日记</span>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 flex items-center justify-center rounded-[4px] bg-[#FAF7F2] border border-[#E0D7C9] text-[#5A4F44] hover:bg-[#F0E9DC] cursor-pointer shadow-sm"
          >
            <MoreDotsIcon size={18} />
          </button>

          {/* Page Edge Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-full mt-1.5 z-30 w-36 bg-[#FAF7F2] border border-[#DDD3C4] rounded-[6px] shadow-xl py-1">
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onEdit(entry);
                }}
                className="w-full text-left px-3 py-1.5 font-serif-sc text-[12.5px] text-[#3D342C] hover:bg-[#EAE2D5] cursor-pointer"
              >
                ✏️ 编辑此页
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  handleToggleFavorite();
                }}
                className="w-full text-left px-3 py-1.5 font-serif-sc text-[12.5px] text-[#3D342C] hover:bg-[#EAE2D5] cursor-pointer"
              >
                🔖 {entry.isFavorite ? '取消书签' : '插入书签'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  alert('已将日记以冲印明信片格式生成');
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
                  handleDelete();
                }}
                className="w-full text-left px-3 py-1.5 font-serif-sc text-[12.5px] text-[#B8382C] hover:bg-[#FCEAE8] cursor-pointer"
              >
                🗑️ 移除这一页
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 05 日记详情 (回看那一天的完整画面) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <PaperSheet className="p-6 sm:p-7 relative shadow-paper-l1">
          {/* Physical Bookmark in Top-Right corner */}
          <div 
            className="absolute -top-2 right-6 z-20 cursor-pointer"
            onClick={handleToggleFavorite}
          >
            <BookmarkRibbon
              isFavorite={entry.isFavorite}
              color={theme.accent}
              size="md"
            />
          </div>

          {/* Date Anchor: 9月6日  2026年 · 周六 */}
          <div className="flex items-baseline gap-2 pb-2 border-b border-[#EAE2D5] mb-4">
            <span className="font-editorial text-[24px] font-bold text-[#2A231C]">
              {monthNum}月{dayNum}日
            </span>
            <span className="font-serif-sc text-[13px] text-[#867A6D]">
              {year}年 · {entry.dayOfWeek}
            </span>
          </div>

          {/* Title */}
          {entry.title && (
            <h1 className="font-serif-sc text-[20px] font-bold text-[#29221C] tracking-tight mb-3">
              {entry.title}
            </h1>
          )}

          {/* Body */}
          <p className="font-serif-sc text-[15.5px] text-[#3F372E] leading-[1.8] whitespace-pre-line mb-6 tracking-normal">
            {entry.body}
          </p>

          {/* Photos Showcase */}
          {entry.photos && entry.photos.length > 0 && (
            <div className="my-6 space-y-4">
              {entry.photos.map((photo, i) => (
                <div key={photo.id || i} className="flex justify-center">
                  <PhotoPrint photo={photo} size="hero" showCaption />
                </div>
              ))}
            </div>
          )}

          {/* Footer: Location & Mood */}
          <div className="pt-4 border-t border-[#EAE2D5] flex items-center justify-between text-[#6B5F52]">
            <div className="flex items-center gap-4 flex-wrap">
              {entry.location && <LocationBadge location={entry.location} />}
              {entry.mood && <MoodStamp mood={entry.mood} />}
            </div>

            <button
              type="button"
              onClick={handleToggleFavorite}
              className="font-serif-sc text-[12px] text-[#93877A] hover:text-[#332920] cursor-pointer flex items-center gap-1"
            >
              <span>{entry.isFavorite ? '已夹入书签' : '夹入书签'}</span>
            </button>
          </div>
        </PaperSheet>
      </motion.div>
    </div>
  );
};
