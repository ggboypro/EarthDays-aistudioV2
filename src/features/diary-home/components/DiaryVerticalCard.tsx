import React from 'react';
import { DiaryEntry } from '../../../core/types/diary';
import { DiaryVerticalPhotoGrid } from './DiaryVerticalPhotoGrid';

interface DiaryVerticalCardProps {
  entry: DiaryEntry;
  index: number;
  onCardClick: () => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

/**
 * 纵向时间流日记单篇 (EarthDays Editorial Diary Sheet)
 * 核心设计原则：
 * - 减少传统 UI Card 特征：无矩形厚外框、无重阴影、无固定高度
 * - 真实日记纸张呼吸感：大留白 (Large Whitespace)、细腻 1px 分割线、实体相纸
 * - 日期作为主要视觉锚点 (Playfair Display 较大字号)
 * - 3 种版式根据内容自适应：Layout A (文字型)、Layout B (单张照片型)、Layout C (多照片型)
 * - 取消“阅读详情 → / READ MORE”，仅保留极轻的“XX 字”或“继续阅读 ·”
 */
export const DiaryVerticalCard: React.FC<DiaryVerticalCardProps> = React.memo(
  ({ entry, index, onCardClick, onToggleFavorite }) => {
    const photos = entry.photos || [];
    const photoCount = photos.length;
    const bodyText = entry.body?.trim() || '';
    const wordCount = bodyText.length;

    // 根据长文字特性，若超出常规段落则优雅保留呼吸感
    const isLongText = wordCount > 320;
    const displayBody = isLongText
      ? bodyText.slice(0, 320).trim() + '...'
      : bodyText;

    // 格式化两位数序号 (如 01, 02, 03)
    const formattedIndex = String(index + 1).padStart(2, '0');

    return (
      <article
        id={`diary-vertical-card-${entry.id}`}
        data-entry-id={entry.id}
        onClick={onCardClick}
        className="group relative w-full cursor-pointer select-auto transition-colors pt-10 pb-12 sm:pt-12 sm:pb-16"
      >
        {/* 1. Date & Chronological Anchor (视觉锚点) */}
        <header className="flex items-baseline justify-between mb-2.5">
          <div className="flex items-baseline gap-3 sm:gap-4 flex-wrap">
            {/* 日期大字号排版 */}
            <time className="font-editorial text-[26px] sm:text-[30px] font-bold text-[#2A2119] tracking-tight leading-none">
              {entry.diaryDate}
            </time>
            {/* 星期小字号 */}
            <span className="font-serif-sc text-[13px] text-[#7A6E62]">
              {entry.dayOfWeek}
            </span>
            {entry.createdAt && (
              <span className="hidden sm:inline font-serif-sc text-[11px] text-[#A69B8E]">
                {new Date(entry.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            )}
          </div>

          {/* 右侧：克制的时间序号与朱砂书签 */}
          <div className="flex items-center gap-3">
            <span className="font-editorial text-[13px] text-[#B0A496] tracking-widest select-none">
              {formattedIndex}
            </span>

            {/* 书签 (Bookmark Ribbon) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(entry.id, e);
              }}
              title={entry.isFavorite ? '已收录书签' : '加入书签'}
              className="p-1 -mr-1 transition-transform active:scale-90 hover:opacity-80 cursor-pointer focus:outline-none"
            >
              {entry.isFavorite ? (
                <div className="w-2.5 h-4.5 bg-[#9E3628] rounded-[0.5px] shadow-[0_1px_3px_rgba(40,20,15,0.25)] relative">
                  <div className="absolute inset-x-0 bottom-0 border-solid border-b-[2px] border-b-[#FAF8F2] border-x-[5px] border-x-transparent" />
                </div>
              ) : (
                <div className="w-2 h-3.5 border border-[#BDB0A2] rounded-[0.5px] opacity-0 group-hover:opacity-60 transition-opacity" />
              )}
            </button>
          </div>
        </header>

        {/* 2. Location & Mood Metadata (次级位置与心情) */}
        {(entry.location || entry.mood) && (
          <div className="flex items-center gap-2 text-[12px] text-[#867A6D] font-serif-sc mb-4 tracking-wide">
            {entry.location && <span>📍 {entry.location.name}</span>}
            {entry.location && entry.mood && (
              <span className="text-[#C4B8AA]">·</span>
            )}
            {entry.mood && <span>{entry.mood.label}</span>}
          </div>
        )}

        {/* 3. Title (如果存在标题) */}
        {entry.title && (
          <h2 className="font-serif-sc font-bold text-[19px] sm:text-[21px] text-[#281F17] leading-snug tracking-tight mt-2 mb-3 group-hover:text-[#1F1710] transition-colors">
            {entry.title}
          </h2>
        )}

        {/* 4. Photos (按 Layout A/B/C 自动呈现真实相纸质感) */}
        {photoCount > 0 && (
          <DiaryVerticalPhotoGrid photos={photos} title={entry.title} />
        )}

        {/* 5. Body Text (自然高度展开，优美排印) */}
        {bodyText && (
          <div className="mt-3.5">
            <p className="font-serif-sc text-[15px] sm:text-[16px] text-[#3E342B] leading-[1.85] whitespace-pre-wrap font-normal tracking-[0.01em]">
              {displayBody}
            </p>
          </div>
        )}

        {/* 6. Footer (极轻量微信息，取消 'READ MORE' 与 '阅读详情 →') */}
        <footer className="flex items-center justify-between mt-5 pt-2 text-[11.5px] text-[#9E9182] font-serif-sc">
          <div className="flex items-center gap-2">
            <span>{wordCount > 0 ? `${wordCount} 字` : '生活札记'}</span>
            {photoCount > 0 && (
              <>
                <span className="text-[#D0C5B7]">·</span>
                <span>{photoCount} 张相片</span>
              </>
            )}
          </div>

          {isLongText && (
            <span className="text-[#8F8173] group-hover:text-[#645648] transition-colors tracking-wide">
              继续阅读 ·
            </span>
          )}
        </footer>

        {/* 7. Fine Editorial Divider (纸页之间的 1px 优雅分隔线) */}
        <div className="w-full h-[1px] bg-[#E8E1D5] mt-10 sm:mt-12 group-last:hidden" />
      </article>
    );
  }
);

DiaryVerticalCard.displayName = 'DiaryVerticalCard';
