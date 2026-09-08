import React from 'react';
import { motion } from 'motion/react';

interface BookmarkRibbonProps {
  isFavorite: boolean;
  onClick?: () => void;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BookmarkRibbon: React.FC<BookmarkRibbonProps> = ({
  isFavorite,
  onClick,
  color = '#A63828', // Classic vermillion fabric ribbon
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
          backgroundColor: isFavorite ? color : '#9C8F80',
        }}
        className="relative shadow-bookmark rounded-b-[1px] transition-colors"
      >
        {/* Fabric subtle weave line */}
        <div className="absolute inset-x-0 top-0 h-full border-x border-white/20 pointer-events-none" />

        {/* V-shaped ribbon cutout at bottom */}
        <div
          className="absolute bottom-0 inset-x-0 w-0 h-0 border-l-[9px] border-r-[9px] border-b-[8px] border-transparent"
          style={{
            borderLeftWidth: width / 2,
            borderRightWidth: width / 2,
            borderBottomColor: 'transparent',
          }}
        />
        <svg
          viewBox="0 0 20 30"
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
        >
          <polygon
            points="0,30 10,22 20,30 20,0 0,0"
            fill={isFavorite ? color : '#8F8578'}
          />
        </svg>

        {/* Subtle gold stitch detail */}
        {isFavorite && (
          <div className="absolute top-1 inset-x-1 border-t border-[#F5E2B3]/50" />
        )}
      </motion.div>
    </button>
  );
};
