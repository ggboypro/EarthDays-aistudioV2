// src/features/diary-home/gallery/GalleryCardContent.tsx
// Distinct preview archetypes: Text, Photo, Photo+Text, Multi-Photo, Small Note

import React from 'react';
import { DiaryEntry } from '../../../core/types/diary';

interface GalleryCardContentProps {
  entry: DiaryEntry;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
}

export const GalleryCardContent: React.FC<GalleryCardContentProps> = ({
  entry,
  onToggleFavorite,
}) => {
  const photoCount = entry.photos?.length || 0;
  const hasPhotos = photoCount > 0;
  const bodyText = entry.body?.trim() || '';
  const hasBody = bodyText.length > 0;
  const hasTitle = Boolean(entry.title?.trim());
  const bodyLength = bodyText.length;

  // Archetype Classification:
  // TYPE E: SMALL NOTE (Very brief text under 40 chars, or title-only thought)
  const isTypeE_SmallNote = (!hasPhotos && bodyLength < 45) || (!hasPhotos && !hasBody && hasTitle);
  // TYPE D: MULTI PHOTO (2+ photos)
  const isTypeD_MultiPhoto = photoCount >= 2;
  // TYPE B: PHOTO MEMORY (1 photo, no or ultra-short body < 25 chars)
  const isTypeB_PhotoMemory = hasPhotos && photoCount === 1 && bodyLength < 25;
  // TYPE C: PHOTO + TEXT (1 photo + moderate body)
  const isTypeC_PhotoText = hasPhotos && photoCount === 1 && bodyLength >= 25;
  // TYPE A: TEXT MEMORY (No photos, rich body text >= 45 chars)
  const isTypeA_TextMemory = !hasPhotos && !isTypeE_SmallNote;

  // Bookmark Ribbon (Silk ribbon)
  const renderBookmark = () => {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite?.(entry.id, e);
        }}
        title={entry.isFavorite ? '已收录为重要记忆 (书签)' : '插入书签'}
        className="absolute -top-1 right-5 z-20 transition-transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none"
      >
        {entry.isFavorite ? (
          <div className="relative">
            {/* Silk ribbon with dovetail cut */}
            <div className="w-4.5 h-8 bg-[#9E3628] shadow-[1px_2px_6px_rgba(40,20,15,0.28)] relative flex flex-col justify-end items-center pb-1">
              <div className="absolute inset-x-0 bottom-0 border-solid border-b-[5px] border-b-[#FAF7F2] border-x-[9px] border-x-transparent" />
              <div className="w-[1px] h-3.5 bg-white/35 mb-1" />
            </div>
          </div>
        ) : (
          <div className="w-4 h-6 opacity-0 hover:opacity-60 transition-opacity flex items-center justify-center text-[#8C8072]">
            <span className="text-[11px]">🏷️</span>
          </div>
        )}
      </button>
    );
  };

  // Weather & Mood micro pill
  const renderMetadataPills = () => {
    return (
      <div className="flex items-center gap-2 text-[11px] text-[#867B6E] font-serif-sc">
        {entry.weather && <span>{entry.weather.label}</span>}
        {entry.weather && entry.mood && <span>·</span>}
        {entry.mood && <span>{entry.mood.label}</span>}
      </div>
    );
  };

  // Date Header helper
  const renderDateHeader = (compact = false) => {
    return (
      <div className={`flex items-baseline justify-between ${compact ? 'mb-2' : 'mb-3 pb-2 border-b border-[#ECE4D8]'}`}>
        <div className="flex items-baseline gap-2">
          <span className="font-editorial text-[20px] font-bold text-[#2A221B] tracking-tight">
            {entry.diaryDate}
          </span>
          <span className="font-serif-sc text-[11.5px] text-[#8A7D70]">
            {entry.dayOfWeek}
          </span>
        </div>
        {entry.location ? (
          <span className="font-serif-sc text-[11.5px] text-[#786D61] truncate max-w-[130px]">
            📍 {entry.location.name}
          </span>
        ) : (
          renderMetadataPills()
        )}
      </div>
    );
  };

  // ==================== TYPE E: SMALL NOTE / POETIC MEMORY ====================
  if (isTypeE_SmallNote) {
    return (
      <div className="h-full flex flex-col justify-between p-6 relative">
        {renderBookmark()}
        {renderDateHeader()}

        {/* Spacious centered thought */}
        <div className="my-auto py-4 text-center px-4 flex flex-col items-center justify-center">
          <div className="w-6 h-[1px] bg-[#CFC4B5] mb-4" />
          {entry.title && (
            <h3 className="font-serif-sc font-medium text-[16.5px] text-[#2C231B] leading-relaxed mb-3">
              {entry.title}
            </h3>
          )}
          {bodyText && (
            <p className="font-serif-sc text-[14px] text-[#4E443A] leading-relaxed line-clamp-3">
              {bodyText}
            </p>
          )}
          <div className="w-6 h-[1px] bg-[#CFC4B5] mt-4" />
        </div>

        {/* Bottom subtle ledger hint */}
        <div className="flex items-center justify-between pt-2 border-t border-[#ECE4D8]/80 text-[11px] text-[#918578] font-serif-sc">
          <span>{entry.createdAt ? new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '手记'}</span>
          <span className="tracking-wider text-[#A3978A]">TAP TO READ</span>
        </div>
      </div>
    );
  }

  // ==================== TYPE B: PHOTO MEMORY ====================
  if (isTypeB_PhotoMemory) {
    const photo = entry.photos[0];
    return (
      <div className="h-full flex flex-col justify-between p-5 relative">
        {renderBookmark()}
        {renderDateHeader(true)}

        {/* Prominent White-Bordered Printed Photo */}
        <div className="relative my-auto bg-white p-2 pb-3 rounded-[3px] shadow-[0_3px_10px_rgba(40,30,20,0.12)] border border-[#E3DACB]">
          <div className="aspect-[4/3] w-full rounded-[1px] overflow-hidden bg-[#ECE6DC]">
            <img
              src={photo.url}
              alt={photo.caption || entry.title || 'Memory photo'}
              className="w-full h-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
          {(photo.caption || entry.title) && (
            <p className="font-serif-sc text-[12px] text-[#554A3E] text-center mt-2.5 px-1 truncate italic">
              {photo.caption || entry.title}
            </p>
          )}
        </div>

        {/* Bottom footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#ECE4D8]/80 text-[11px] text-[#8E8275] font-serif-sc">
          {renderMetadataPills()}
          <span className="text-[11px] tracking-wider text-[#A3978A]">1 PHOTO</span>
        </div>
      </div>
    );
  }

  // ==================== TYPE D: MULTI PHOTO ====================
  if (isTypeD_MultiPhoto) {
    return (
      <div className="h-full flex flex-col justify-between p-5 relative">
        {renderBookmark()}
        {renderDateHeader(true)}

        {/* Title / Caption */}
        {entry.title && (
          <h3 className="font-serif-sc font-medium text-[15px] text-[#292119] line-clamp-1 mb-2">
            {entry.title}
          </h3>
        )}

        {/* 2 Photos Laid Out on Paper */}
        <div className="grid grid-cols-2 gap-2 my-auto">
          {entry.photos.slice(0, 2).map((img, i) => (
            <div
              key={img.id || i}
              className="bg-white p-1.5 pb-2 rounded-[2px] shadow-[0_2px_8px_rgba(40,30,20,0.1)] border border-[#E3DACB]"
            >
              <div className="aspect-square w-full rounded-[1px] overflow-hidden bg-[#ECE6DC]">
                <img
                  src={img.url}
                  alt={img.caption || ''}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              {img.caption && (
                <p className="font-serif-sc text-[10px] text-[#6E6356] truncate mt-1 text-center">
                  {img.caption}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Excerpt if present */}
        {bodyText && (
          <p className="font-serif-sc text-[12.5px] text-[#5A4F44] leading-relaxed line-clamp-2 mt-2 px-0.5">
            {bodyText}
          </p>
        )}

        {/* Bottom footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#ECE4D8]/80 text-[11px] text-[#8E8275] font-serif-sc mt-2">
          {renderMetadataPills()}
          <span className="text-[10.5px] tracking-wider text-[#A3978A]">{entry.photos.length} PHOTOS</span>
        </div>
      </div>
    );
  }

  // ==================== TYPE C: PHOTO + TEXT BALANCE ====================
  if (isTypeC_PhotoText) {
    const photo = entry.photos[0];
    return (
      <div className="h-full flex flex-col justify-between p-5 relative">
        {renderBookmark()}
        {renderDateHeader(true)}

        {/* Compact Photo with White Border */}
        <div className="bg-white p-1.5 pb-2 rounded-[2px] shadow-[0_2px_8px_rgba(40,30,20,0.1)] border border-[#E3DACB] mb-2.5">
          <div className="aspect-[16/9] w-full rounded-[1px] overflow-hidden bg-[#ECE6DC]">
            <img
              src={photo.url}
              alt={photo.caption || entry.title || ''}
              className="w-full h-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Title and 2-3 Line Excerpt */}
        <div className="flex-1 flex flex-col justify-center">
          {entry.title && (
            <h3 className="font-serif-sc font-medium text-[15px] text-[#292119] line-clamp-1 mb-1.5">
              {entry.title}
            </h3>
          )}
          <p className="font-serif-sc text-[12.5px] text-[#4E4338] leading-relaxed line-clamp-3">
            {bodyText}
          </p>
        </div>

        {/* Bottom footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#ECE4D8]/80 text-[11px] text-[#8E8275] font-serif-sc mt-2">
          {renderMetadataPills()}
          <span className="text-[10.5px] tracking-wider text-[#A3978A]">READ MORE</span>
        </div>
      </div>
    );
  }

  // ==================== TYPE A: TEXT MEMORY ====================
  // (Pure paper sheet, editorial excerpt)
  return (
    <div className="h-full flex flex-col justify-between p-6 relative">
      {renderBookmark()}
      {renderDateHeader()}

      {/* Main Editorial Preview */}
      <div className="flex-1 flex flex-col justify-center my-auto py-2">
        {entry.title && (
          <h3 className="font-serif-sc font-medium text-[17px] text-[#282018] tracking-tight leading-snug mb-3 line-clamp-2">
            {entry.title}
          </h3>
        )}
        <p className="font-serif-sc text-[13.5px] text-[#4A4036] leading-[1.75] line-clamp-4">
          {bodyText}
        </p>
      </div>

      {/* Bottom subtle metadata */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[#ECE4D8] text-[11px] text-[#8E8275] font-serif-sc">
        {renderMetadataPills()}
        <span className="text-[11px] text-[#9C9083]">
          {bodyLength > 0 ? `${bodyLength} 字` : '随笔'}
        </span>
      </div>
    </div>
  );
};
