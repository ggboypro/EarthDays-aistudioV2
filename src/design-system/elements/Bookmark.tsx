import React from 'react';
import { motion } from 'motion/react';
import { colorTokens } from '../tokens/colors';
import { shadowTokens } from '../tokens/shadows';

interface BookmarkRibbonProps {
  isFavorite: boolean;
  onClick?: () => void;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BookmarkRibbon: React.FC<BookmarkRibbonProps> = ({
  isFavorite,
  onClick,
  color = colorTokens.bookmark, // #B45C42 Warm Terracotta silk ribbon
  size = 'md',
}) => {
  const width = size === 'sm' ? 14 : size === 'md' ? 18 : 22;
  const height = size === 'sm' ? 26 : size === 'md' ? 34 : 42;

  return (
    <button
      type="button"
      onClick={onClick}
      title={isFavorite ? '已插入书签（已收藏）' : '插入书签（收藏）'}
      className="relative focus:outline-none cursor-pointer group"
    >
      <motion.div
        initial={false}
        animate={{
          y: isFavorite ? 0 : -height * 0.55,
          opacity: isFavorite ? 1 : 0.45,
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 25 }}
        style={{
          width,
          height,
          backgroundColor: isFavorite ? color : colorTokens.textMuted,
          boxShadow: shadowTokens.bookmark,
        }}
        className="relative rounded-b-[1px] transition-colors"
      >
        {/* Fabric subtle weave line */}
        <div className="absolute inset-x-0 top-0 h-full border-x border-white/20 pointer-events-none" />

        <svg
          viewBox="0 0 20 30"
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
        >
          <polygon
            points="0,30 10,22 20,30 20,0 0,0"
            fill={isFavorite ? color : '#9A9084'}
          />
        </svg>

        {/* Subtle gold/cream stitch detail */}
        {isFavorite && (
          <div className="absolute top-1 inset-x-1 border-t border-[#FBF8F2]/60" />
        )}
      </motion.div>
    </button>
  );
};

