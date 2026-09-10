import React, { useEffect, useRef, useCallback } from 'react';
import { DiaryEntry } from '../../../core/types/diary';
import { DiaryVerticalCard } from './DiaryVerticalCard';
import {
  AutumnDriedLeaf,
  OakVintageLeaf,
  BotanicalBranch,
  HanddrawnSparkles,
} from '../illustrations/DiaryIllustrations';

interface DiaryVerticalFeedProps {
  entries: DiaryEntry[];
  currentId: string;
  onSelectId: (id: string) => void;
  onEntryClick: (entry: DiaryEntry) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onWriteClick: () => void;
}

/**
 * 纵向日记阅读流 (EarthDays Editorial Reading Stream)
 * - 纯正深暖古朴纸张质感 (Warm Vintage Parchment)
 * - 散落背景插画系统 (效果图同款落叶、干花标本与星芒)
 * - 左右结构 / 上下结构 / 纯文字结构动态排版
 * - 右下角悬浮向下快速翻阅微交互
 */
export const DiaryVerticalFeed: React.FC<DiaryVerticalFeedProps> = ({
  entries,
  currentId,
  onSelectId,
  onEntryClick,
  onToggleFavorite,
  onWriteClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialScrolledRef = useRef<boolean>(false);
  const activeVisibleIdRef = useRef<string>(currentId);
  const debounceTimerRef = useRef<number | null>(null);

  // 1. 切换到纵向流时的初始锚点定位
  useEffect(() => {
    if (!initialScrolledRef.current && currentId) {
      initialScrolledRef.current = true;
      const timer = window.setTimeout(() => {
        const target = document.getElementById(`diary-vertical-card-${currentId}`);
        if (target) {
          target.scrollIntoView({ block: 'start', behavior: 'instant' });
        }
      }, 50);
      return () => window.clearTimeout(timer);
    }
  }, [currentId]);

  // 2. 稳定的防抖同步 active id 到上层
  const syncActiveIdDebounced = useCallback(
    (newId: string) => {
      if (activeVisibleIdRef.current === newId) return;
      activeVisibleIdRef.current = newId;

      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = window.setTimeout(() => {
        onSelectId(newId);
      }, 250);
    },
    [onSelectId]
  );

  // 3. IntersectionObserver 追踪当前阅读到的日记
  useEffect(() => {
    if (entries.length === 0) return;

    const observer = new IntersectionObserver(
      (observerEntries) => {
        const visibleEntries = observerEntries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );
          const topEl = visibleEntries[0].target as HTMLElement;
          const entryId = topEl.getAttribute('data-entry-id');
          if (entryId) {
            syncActiveIdDebounced(entryId);
          }
        }
      },
      {
        root: containerRef.current,
        rootMargin: '-5% 0px -55% 0px',
        threshold: [0, 0.2, 0.5],
      }
    );

    const cardElements = document.querySelectorAll('[data-entry-id]');
    cardElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
      if (activeVisibleIdRef.current) {
        onSelectId(activeVisibleIdRef.current);
      }
    };
  }, [entries, syncActiveIdDebounced, onSelectId]);

  // 平滑向下翻阅一页 (对应效果图右下角向下圆钮)
  const handleScrollNext = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        top: window.innerHeight * 0.65,
        behavior: 'smooth',
      });
    }
  };

  // 空数据状态
  if (entries.length === 0) {
    return (
      <div className="w-full h-[55vh] flex flex-col items-center justify-center text-center px-4 bg-transparent">
        <p className="font-serif-sc text-[15.5px] text-[#7A6F62] mb-4 tracking-wide">
          这一本账本还没有留存记忆。
        </p>
        <button
          type="button"
          onClick={onWriteClick}
          className="px-5 py-2 rounded-[3px] bg-[#9E3628] font-serif-sc text-[13px] text-white shadow-sm hover:opacity-95 transition-opacity cursor-pointer active:scale-95"
        >
          写下第一页日记
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full max-h-[calc(100vh-140px)] overflow-y-auto overscroll-contain px-4 sm:px-6 pt-2 pb-36 select-auto bg-transparent"
      style={{
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* ========================================================
          背景插画散落层 (Scattered Background Illustrations)
         ======================================================== */}
      {/* 1. 效果图同款左侧边缘探出的焦糖枯落叶标本 */}
      <div className="absolute top-[320px] -left-6 sm:left-[-15px] z-10 pointer-events-none select-none rotate-[-12deg]">
        <AutumnDriedLeaf className="w-16 sm:w-20 h-auto" />
      </div>

      {/* 2. 背景中下部散落的淡雅橡树叶与小星芒 */}
      <div className="absolute top-[880px] right-2 sm:right-6 pointer-events-none select-none opacity-40 rotate-[22deg]">
        <OakVintageLeaf className="w-14 sm:w-16 h-auto" />
      </div>

      <div className="absolute top-[1480px] -left-4 pointer-events-none select-none opacity-30 rotate-[-18deg]">
        <BotanicalBranch className="w-12 sm:w-16 h-auto" />
      </div>

      <div className="absolute top-[620px] right-8 pointer-events-none select-none opacity-40">
        <HanddrawnSparkles className="w-6 h-6" />
      </div>

      {/* 桌面端宽度严格收敛为 max-w-[720px] 优雅阅读栏 */}
      <div className="relative z-20 w-full max-w-[720px] mx-auto flex flex-col">
        {entries.map((entry, index) => (
          <DiaryVerticalCard
            key={entry.id}
            entry={entry}
            index={index}
            onCardClick={() => onEntryClick(entry)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}

        {/* 底部纸张落款 */}
        <div className="w-full py-16 text-center select-none">
          <div className="w-6 h-[1px] bg-[#D4C8B6] mx-auto mb-3" />
          <p className="font-serif-sc text-[12px] text-[#8C7D6C] tracking-widest">
            已经翻阅到本册最后一页
          </p>
        </div>
      </div>

      {/* ========================================================
          右下角悬浮向下翻阅按钮 (效果图同款向下箭头圆钮)
         ======================================================== */}
      <button
        type="button"
        onClick={handleScrollNext}
        title="翻阅下一页"
        aria-label="向下翻阅"
        className="fixed bottom-20 sm:bottom-24 right-4 sm:right-8 z-30 w-10 sm:w-11 h-10 sm:h-11 rounded-full bg-[#241C15] text-[#EDE4D6] shadow-[0_4px_14px_rgba(25,18,12,0.35)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer border border-[#48392C]/40"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <polyline points="19 12 12 19 5 12" />
        </svg>
      </button>
    </div>
  );
};
