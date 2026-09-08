import React, { useState } from 'react';
import { DiaryEntry } from '../../../core/types/diary';
import { Ledger } from '../../../core/types/ledger';
import { PhotoPrint } from '../../../design-system/photo/PhotoPrint';
import { MoodStamp, LocationBadge } from '../../../design-system/elements/MoodStamp';
import { useTheme } from '../../../core/theme/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

interface DiaryBookModeProps {
  entries: DiaryEntry[];
  currentLedger: Ledger;
  onEntryClick: (entry: DiaryEntry) => void;
}

export const DiaryBookMode: React.FC<DiaryBookModeProps> = ({
  entries,
  currentLedger,
  onEntryClick,
}) => {
  const { theme } = useTheme();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  if (entries.length === 0) {
    return (
      <div className="py-16 px-6 text-center">
        <p className="font-serif-sc text-[15px] text-[#7A6F62]">
          你的日子，从今天开始。
        </p>
      </div>
    );
  }

  const currentEntry = entries[currentPageIndex] || entries[0];
  const totalPages = entries.length;

  const handlePrev = () => {
    if (currentPageIndex > 0) setCurrentPageIndex(p => p - 1);
  };

  const handleNext = () => {
    if (currentPageIndex < totalPages - 1) setCurrentPageIndex(p => p + 1);
  };

  return (
    <div className="px-4 py-2 select-none">
      {/* Real Hardcover Book Gutter Container */}
      <div className="relative mx-auto max-w-sm bg-[#FAF7F1] rounded-[4px] border border-[#DDD3C4] shadow-book-spine overflow-hidden">
        {/* Left Book Spine Gutter shadow */}
        <div className="absolute left-0 inset-y-0 w-4 bg-gradient-to-r from-black/20 via-black/5 to-transparent z-20 pointer-events-none" />
        {/* Right page edge stack effect */}
        <div className="absolute right-0 inset-y-0 w-2 bg-gradient-to-l from-[#CFC5B4] to-transparent z-20 pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentEntry.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            onClick={() => onEntryClick(currentEntry)}
            className="p-6 pl-8 min-h-[420px] flex flex-col justify-between cursor-pointer"
          >
            <div>
              {/* Header: Date & Ledger watermark */}
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D6]">
                <div className="flex items-baseline gap-2">
                  <span className="font-editorial text-[20px] font-bold text-[#2A231C]">
                    {currentEntry.diaryDate}
                  </span>
                  <span className="font-serif-sc text-[12px] text-[#857A6D]">
                    {currentEntry.dayOfWeek}
                  </span>
                </div>
                <span className="font-serif-sc text-[11px] text-[#9A8F82] tracking-widest uppercase">
                  {currentLedger.name}
                </span>
              </div>

              {/* Title */}
              {currentEntry.title && (
                <h2 className="mt-4 font-serif-sc text-[18px] font-semibold text-[#29221C] tracking-tight">
                  {currentEntry.title}
                </h2>
              )}

              {/* Body Text */}
              <p className="mt-3 font-serif-sc text-[14.5px] text-[#423A30] leading-[1.75] whitespace-pre-line">
                {currentEntry.body}
              </p>

              {/* Photo */}
              {currentEntry.photos && currentEntry.photos.length > 0 && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                  {currentEntry.photos.map((p, idx) => (
                    <PhotoPrint key={idx} photo={p} size="sm" />
                  ))}
                </div>
              )}
            </div>

            {/* Footer: Location & Page Number */}
            <div className="pt-4 mt-6 border-t border-[#EAE3D6] flex items-center justify-between">
              <div className="flex items-center gap-2">
                {currentEntry.location && <LocationBadge location={currentEntry.location} />}
                {currentEntry.mood && <MoodStamp mood={currentEntry.mood} />}
              </div>
              <span className="font-editorial text-[12px] text-[#8A7E70]">
                第 {currentPageIndex + 1} 页 / 共 {totalPages} 页
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Book Navigation Page Turner Buttons */}
      <div className="flex items-center justify-between mt-3 px-2">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentPageIndex === 0}
          className="px-3.5 py-1.5 rounded-[4px] font-serif-sc text-[12px] bg-[#FAF7F2] border border-[#DED4C6] text-[#554A3E] disabled:opacity-40 transition-all cursor-pointer shadow-sm"
        >
          ← 上一页
        </button>

        <span className="font-serif-sc text-[11px] text-[#867B6F]">
          点击书页可查看详情
        </span>

        <button
          type="button"
          onClick={handleNext}
          disabled={currentPageIndex === totalPages - 1}
          className="px-3.5 py-1.5 rounded-[4px] font-serif-sc text-[12px] bg-[#FAF7F2] border border-[#DED4C6] text-[#554A3E] disabled:opacity-40 transition-all cursor-pointer shadow-sm"
        >
          下一页 →
        </button>
      </div>
    </div>
  );
};
