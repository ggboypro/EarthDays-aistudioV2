import React, { useEffect, useRef, useCallback } from 'react';
import { DiaryEntry } from '../../../core/types/diary';
import { DiaryVerticalCard } from './DiaryVerticalCard';

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
 * - 非传统 UI Card Feed，而是一叠展开翻阅的温润日记纸页
 * - 桌面端严控 max-w-[720px] 纯净阅读栏，移动端 20~24px 呼吸间距
 * - 原生轻量滚动，仅在停止滚动时防抖对齐当前活动日记 ID，杜绝频繁全局重渲染
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

  // 1. 切换到纵向流时的初始锚点精准定位 (Scroll to currentId)
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

  // 2. 稳定的防抖同步 active id 到上层，杜绝在滚动中触发全局重渲
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

  // 3. 使用 IntersectionObserver 高效追踪当前阅读到的日记
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

  // 空数据状态 (Empty state)
  if (entries.length === 0) {
    return (
      <div className="w-full h-[55vh] flex flex-col items-center justify-center text-center px-4">
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
      className="w-full h-full max-h-[calc(100vh-140px)] overflow-y-auto overscroll-contain px-5 sm:px-6 pt-2 pb-36 select-auto"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* 桌面端宽度严格收敛为 max-w-[720px] 优雅阅读栏 */}
      <div className="w-full max-w-[720px] mx-auto flex flex-col">
        {entries.map((entry, index) => (
          <DiaryVerticalCard
            key={entry.id}
            entry={entry}
            index={index}
            onCardClick={() => onEntryClick(entry)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}

        {/* 底部落款 */}
        <div className="w-full py-16 text-center">
          <div className="w-6 h-[1px] bg-[#D6CDC0] mx-auto mb-3" />
          <p className="font-serif-sc text-[12px] text-[#9E9182] tracking-widest">
            已经翻阅到本册最后一页
          </p>
        </div>
      </div>
    </div>
  );
};
