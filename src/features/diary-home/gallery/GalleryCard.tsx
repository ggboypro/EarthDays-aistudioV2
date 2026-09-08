// src/features/diary-home/gallery/GalleryCard.tsx
// Physical paper sheet container with continuous depth, rotation, elevation, and preview focus

import React from 'react';
import { DiaryEntry } from '../../../core/types/diary';
import { SpatialCardProps } from './GallerySpatialEngine';
import { GalleryCardContent } from './GalleryCardContent';
import { motion } from 'motion/react';

interface GalleryCardProps {
  entry: DiaryEntry;
  spatial: SpatialCardProps;
  isSettling: boolean;
  isNewlyInserted?: boolean;
  onCardClick: () => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({
  entry,
  spatial,
  isSettling,
  isNewlyInserted = false,
  onCardClick,
  onToggleFavorite,
}) => {
  const { scale, opacity, rotation, offsetY, zIndex, isCenter } = spatial;

  // Focus scale
  const activeScale = isCenter ? (isSettling ? scale * 1.015 : scale) : scale;

  // Shadow depth
  const shadowClass = isCenter
    ? isSettling
      ? 'shadow-[0_16px_32px_-8px_rgba(35,26,18,0.16),0_4px_12px_rgba(35,26,18,0.06)]'
      : 'shadow-[0_10px_24px_-6px_rgba(35,26,18,0.12),0_3px_8px_rgba(35,26,18,0.05)]'
    : 'shadow-[0_4px_14px_-4px_rgba(40,30,20,0.08),0_2px_4px_rgba(40,30,20,0.03)]';

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onCardClick();
      }}
      style={{
        zIndex,
        opacity,
        transform: `translateY(${offsetY}px) scale(${activeScale}) rotate(${rotation}deg)`,
        transition: isSettling
          ? 'transform 360ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 360ms ease, opacity 300ms ease'
          : 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease, opacity 260ms ease',
        transformOrigin: 'center 85%',
      }}
      className={`relative select-none cursor-pointer w-[280px] sm:w-[330px] md:w-[370px] lg:w-[400px] h-[390px] sm:h-[430px] md:h-[460px] lg:h-[480px] shrink-0 ${
        isCenter ? 'pointer-events-auto' : 'pointer-events-auto hover:opacity-90'
      }`}
    >
      {/* Insertion Drop Spring Container */}
      <motion.div
        initial={
          isNewlyInserted
            ? { y: -160, opacity: 0.6, scale: 1.06, rotate: -2.5 }
            : false
        }
        animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          mass: 0.85,
        }}
        className="w-full h-full relative"
      >
        {/* Physical Paper Sheet */}
        <div
          className={`w-full h-full bg-[#FAF7F2] rounded-[5px] border border-[#E3DAC9] ${shadowClass} relative overflow-hidden flex flex-col`}
        >
          {/* Subtle interior highlight border */}
          <div className="absolute inset-0 rounded-[4px] border border-white/70 pointer-events-none" />

          {/* Paper texture overlay */}
          <div className="absolute inset-0 paper-grain opacity-35 pointer-events-none" />

          {/* Content View */}
          <div className="relative z-10 w-full h-full">
            <GalleryCardContent
              entry={entry}
              onToggleFavorite={onToggleFavorite}
            />
          </div>

          {/* Newly published landing aura */}
          {isNewlyInserted && (
            <>
              <motion.div
                initial={{ opacity: 0.95, scale: 0.97 }}
                animate={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                className="absolute inset-0 rounded-[5px] ring-2 ring-[#B84337]/60 pointer-events-none z-30"
              />
              <motion.div
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="absolute -inset-1 bg-[#B84337]/15 rounded-[8px] blur-xs pointer-events-none z-20"
              />
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
