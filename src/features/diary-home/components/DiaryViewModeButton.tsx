import React from 'react';
import {
  HorizontalGalleryViewIcon,
  VerticalFeedViewIcon,
} from '../../../design-system/icons/EarthDiaryIcons';

export type DiaryViewMode = 'horizontal' | 'vertical';

interface DiaryViewModeButtonProps {
  mode: DiaryViewMode;
  onToggle: () => void;
}

/**
 * 顶部 View Mode 切换按钮
 * - 只显示图标，无文字、无 Capsule、无按钮背景
 * - 颜色使用 var(--ed-ink-2)
 * - 尺寸 20–22px
 * - 点击立即在 Horizontal 与 Vertical 之间无缝切换
 */
export const DiaryViewModeButton: React.FC<DiaryViewModeButtonProps> = ({
  mode,
  onToggle,
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={mode === 'horizontal' ? '切换为纵向阅读流' : '切换为横向展厅'}
      title={mode === 'horizontal' ? '切换为纵向流' : '切换为横向展厅'}
      className="p-1 cursor-pointer transition-transform active:scale-90 hover:opacity-75 focus:outline-none flex items-center justify-center shrink-0"
      style={{ color: 'var(--ed-ink-2, #63574A)' }}
    >
      {mode === 'horizontal' ? (
        <HorizontalGalleryViewIcon size={21} color="currentColor" />
      ) : (
        <VerticalFeedViewIcon size={21} color="currentColor" />
      )}
    </button>
  );
};
