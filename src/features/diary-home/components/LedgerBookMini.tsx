// src/features/diary-home/components/LedgerBookMini.tsx
// Physical miniature bound desk notebook (approx 50x50px) for Ledger Row

import React from 'react';
import { Ledger } from '../../../core/types/ledger';
import { motion } from 'motion/react';
import { motionTokens } from '../../../motion/tokens';

interface LedgerBookMiniProps {
  ledger: Ledger;
  isSelected: boolean;
  onClick: () => void;
}

export const LedgerBookMini: React.FC<LedgerBookMiniProps> = ({
  ledger,
  isSelected,
  onClick,
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2, scale: isSelected ? 1.08 : 0.98 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: isSelected ? 1.06 : 0.94,
        opacity: isSelected ? 1 : 0.76,
        y: isSelected ? -1 : 0,
      }}
      transition={motionTokens.spring.standard}
      className={`relative group shrink-0 flex flex-col items-center cursor-pointer p-0.5 outline-none focus:outline-none select-none`}
      title={`${ledger.name} (${ledger.entryCount} 篇)`}
    >
      {/* 3D Physical Mini Book Shell */}
      <div
        className={`relative w-[48px] h-[56px] rounded-[3px] overflow-hidden transition-all duration-300 ${
          isSelected
            ? 'shadow-[0_6px_16px_rgba(35,25,18,0.28),0_1px_3px_rgba(0,0,0,0.12)] ring-1.5 ring-[#B84337] ring-offset-2 ring-offset-[#EAE4D9]'
            : 'shadow-[0_2px_6px_rgba(35,25,18,0.15)] group-hover:shadow-[0_4px_10px_rgba(35,25,18,0.2)]'
        }`}
        style={{
          backgroundColor: ledger.spineColor || '#2E2620',
        }}
      >
        {/* Cover Image */}
        <img
          src={ledger.coverImage}
          alt={ledger.name}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          referrerPolicy="no-referrer"
        />

        {/* Embossed Left Book Spine Shade */}
        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none" />

        {/* Layered Paper Edge on Right Edge */}
        <div className="absolute right-0 top-0.5 bottom-0.5 w-[2.5px] bg-[#EFE9DF] border-l border-black/15 pointer-events-none" />

        {/* Top/Bottom Edge highlights */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-black/30 pointer-events-none" />

        {/* Micro Title Tag Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent pt-3 pb-1 px-1 flex justify-center">
          <span className="font-serif-sc text-[9px] text-white/95 font-medium truncate max-w-full leading-tight tracking-tight">
            {ledger.name.replace(/^[\p{Emoji}\u200d\s]+/gu, '') || ledger.name}
          </span>
        </div>
      </div>
    </motion.button>
  );
};
