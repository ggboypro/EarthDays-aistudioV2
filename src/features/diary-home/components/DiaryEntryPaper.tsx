import React from 'react';
import { DiaryEntry } from '../../../core/types/diary';
import { PaperSheet } from '../../../design-system/paper/PaperSheet';
import { PhotoGrid } from '../../../design-system/photo/PhotoPrint';
import { MoodStamp, LocationBadge } from '../../../design-system/elements/MoodStamp';
import { BookmarkRibbon } from '../../../design-system/elements/Bookmark';
import { useTheme } from '../../../core/theme/ThemeContext';

interface DiaryEntryPaperProps {
  entry: DiaryEntry;
  onEntryClick: (entry: DiaryEntry) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export const DiaryEntryPaper: React.FC<DiaryEntryPaperProps> = ({
  entry,
  onEntryClick,
  onToggleFavorite,
}) => {
  const { theme } = useTheme();

  // Parse date components
  const [year, monthStr, dayStr] = entry.diaryDate.split('-');
  const monthNum = parseInt(monthStr, 10);
  const dayNum = dayStr;

  return (
    <article className="flex gap-3 sm:gap-4 items-start mb-6 group">
      {/* Left side: 日期视觉锚点 (9月 / 06 / 周六) */}
      <div className="w-12 shrink-0 pt-1 text-center select-none">
        <div className="font-serif-sc text-[11px] text-[#857B6E] tracking-wider">
          {monthNum}月
        </div>
        <div className="font-editorial text-[24px] sm:text-[26px] font-bold leading-none my-0.5 text-[#2B231C]">
          {dayNum}
        </div>
        <div className="font-serif-sc text-[11px] text-[#857B6E] tracking-wider">
          {entry.dayOfWeek}
        </div>
      </div>

      {/* Right side: 真实纸页 (自适应高度) */}
      <div className="flex-1 relative min-w-0">
        <PaperSheet
          onClick={() => onEntryClick(entry)}
          className="p-4 sm:p-5 transition-transform duration-200 hover:-translate-y-[1px] cursor-pointer"
        >
          {/* Top-Right inserted Bookmark Ribbon */}
          <div 
            className="absolute -top-1.5 right-4 z-20"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(entry.id, e);
            }}
          >
            <BookmarkRibbon
              isFavorite={entry.isFavorite}
              color={theme.accent}
              size="sm"
            />
          </div>

          {/* Title (Optional) */}
          {entry.title && (
            <h3 className="font-serif-sc text-[16px] sm:text-[17px] font-semibold text-[#29221C] tracking-tight mb-2 pr-6 leading-snug">
              {entry.title}
            </h3>
          )}

          {/* Body content with comfortable reading rhythm */}
          <p className="font-serif-sc text-[14px] sm:text-[15px] text-[#423930] leading-[1.65] line-clamp-4 tracking-normal whitespace-pre-line mb-3">
            {entry.body}
          </p>

          {/* Photographic prints grid */}
          {entry.photos && entry.photos.length > 0 && (
            <div className="pt-1 pb-2">
              <PhotoGrid photos={entry.photos} />
            </div>
          )}

          {/* Footer Metadata: Location & Mood Stamp */}
          <div className="mt-3 pt-2.5 border-t border-[#EAE3D6]/70 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              {entry.location && <LocationBadge location={entry.location} />}
              {entry.mood && <MoodStamp mood={entry.mood} />}
            </div>

            {/* Favorite status prompt */}
            <div className="text-[11px] font-serif-sc text-[#9A8F82] opacity-75">
              {entry.isFavorite ? '已书签' : ''}
            </div>
          </div>
        </PaperSheet>
      </div>
    </article>
  );
};
