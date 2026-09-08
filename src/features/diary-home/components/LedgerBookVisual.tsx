// src/features/diary-home/components/LedgerBookVisual.tsx
// EarthDays V4.2: Shared 3D Ledger Book Visual component (Used in Mini & Expanded Focus states)

import React from 'react';
import { Ledger } from '../../../core/types/ledger';

interface LedgerBookVisualProps {
  ledger: Ledger;
  isExpanded?: boolean;
  isSelected?: boolean;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  dataFlipId?: string;
}

export const LedgerBookVisual: React.FC<LedgerBookVisualProps> = ({
  ledger,
  isExpanded = false,
  isSelected = false,
  className = '',
  onClick,
  style,
  dataFlipId,
}) => {
  if (isExpanded) {
    // ==========================================
    // EXPANDED 3D DESK BOOK (Approx 230 x 310px)
    // ==========================================
    return (
      <div
        data-flip-id={dataFlipId}
        onClick={onClick}
        style={{
          width: 226,
          height: 304,
          transformStyle: 'preserve-3d',
          ...style,
        }}
        className={`relative select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        {/* 1. Deep warm contact shadow on table surface */}
        <div
          className="absolute -bottom-4 inset-x-4 h-8 rounded-full blur-md pointer-events-none"
          style={{
            backgroundColor: 'rgba(26, 18, 12, 0.42)',
            transform: 'translateZ(-30px)',
          }}
        />

        {/* 2. Heavy Back Cover Board (Underneath page block) */}
        <div
          className="absolute inset-0 rounded-[4px] pointer-events-none"
          style={{
            backgroundColor: '#1E1915',
            transform: 'translateZ(-8px) translateX(3px) translateY(2px)',
            boxShadow:
              '0 26px 52px -10px rgba(32, 22, 14, 0.46), 0 10px 22px -5px rgba(25, 18, 12, 0.28)',
          }}
        />

        {/* 3. Layered Page Block on Right Edge (Realistic paper thickness) */}
        <div
          className="absolute right-[-8px] top-[4px] bottom-[4px] w-[10px] rounded-r-[2px] pointer-events-none border-y border-r border-[#C6BBA8]"
          style={{
            transform: 'translateZ(-4px) rotateY(40deg)',
            background:
              'repeating-linear-gradient(to right, #FAF4E8 0px, #FAF4E8 1.5px, #E0D6C3 2px, #D0C5B0 2.5px)',
            boxShadow: 'inset 2px 0 4px rgba(0,0,0,0.18)',
          }}
        />

        {/* 4. Layered Page Block on Bottom Edge */}
        <div
          className="absolute inset-x-[6px] -bottom-[6px] h-[8px] rounded-b-[2px] pointer-events-none border-x border-b border-[#C6BBA8]"
          style={{
            transform: 'translateZ(-4px) rotateX(-50deg)',
            background:
              'repeating-linear-gradient(to bottom, #FAF4E8 0px, #FAF4E8 1.5px, #E0D6C3 2px, #D0C5B0 2.5px)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.22)',
          }}
        />

        {/* 5. Front Cover Shell */}
        <div
          className="relative w-full h-full rounded-[4px] overflow-hidden border border-black/25"
          style={{
            backgroundColor: ledger.spineColor || '#2E2620',
            transform: 'translateZ(0px)',
            boxShadow:
              '0 20px 40px -8px rgba(30, 20, 12, 0.38), 0 2px 6px rgba(0,0,0,0.14)',
          }}
        >
          {/* Cover Photo */}
          <img
            src={ledger.coverImage}
            alt={ledger.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />

          {/* Embossed Left Spine Shadow Groove */}
          <div className="absolute left-0 top-0 bottom-0 w-[14px] bg-gradient-to-r from-black/70 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute left-[13px] top-0 bottom-0 w-[1px] bg-white/30 pointer-events-none" />
          <div className="absolute left-[14px] top-0 bottom-0 w-[1px] bg-black/30 pointer-events-none" />

          {/* Right Page Edge Indicator on Front Cover */}
          <div className="absolute right-0 top-1 bottom-1 w-[3px] bg-[#EFE8DD] border-l border-black/20 pointer-events-none rounded-r-[1px] opacity-85" />

          {/* Surface Lighting Sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/20 pointer-events-none" />

          {/* Bottom Title Bar on Cover */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-10 pb-4 px-3 text-center">
            <h2 className="font-serif-sc text-[17px] sm:text-[19px] font-semibold text-white tracking-wider drop-shadow-md">
              {ledger.name}
            </h2>
            {ledger.subtitle && (
              <p className="font-serif-sc text-[11px] text-white/80 truncate mt-0.5 max-w-full px-2">
                {ledger.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MINI BOUND DESK BOOK (Approx 50 x 58px)
  // ==========================================
  return (
    <div
      data-flip-id={dataFlipId}
      onClick={onClick}
      style={{
        width: 50,
        height: 58,
        ...style,
      }}
      className={`relative shrink-0 rounded-[3px] overflow-hidden select-none cursor-pointer transition-shadow ${
        isSelected
          ? 'shadow-[0_6px_16px_rgba(35,25,18,0.32),0_1px_3px_rgba(0,0,0,0.15)] ring-2 ring-[#B84337] ring-offset-2 ring-offset-[#EAE4D9]'
          : 'shadow-[0_2px_6px_rgba(35,25,18,0.18)] hover:shadow-[0_4px_10px_rgba(35,25,18,0.25)]'
      } ${className}`}
      title={`${ledger.name} (${ledger.entryCount} 篇)`}
    >
      {/* Mini Cover Image */}
      <img
        src={ledger.coverImage}
        alt={ledger.name}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />

      {/* Embossed Left Book Spine Shade */}
      <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-gradient-to-r from-black/55 via-black/25 to-transparent pointer-events-none" />
      <div className="absolute left-[4px] top-0 bottom-0 w-[0.75px] bg-white/20 pointer-events-none" />

      {/* Layered Paper Edge on Right Edge */}
      <div className="absolute right-0 top-0.5 bottom-0.5 w-[2.5px] bg-[#EFE9DF] border-l border-black/20 pointer-events-none rounded-r-[0.5px]" />

      {/* Top/Bottom Edge highlights */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-white/25 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-black/35 pointer-events-none" />

      {/* Micro Title Tag Overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent pt-3 pb-1 px-1 flex justify-center">
        <span className="font-serif-sc text-[9px] text-white/95 font-medium truncate max-w-full leading-tight tracking-tight">
          {ledger.name.replace(/^[\p{Emoji}\u200d\s]+/gu, '') || ledger.name}
        </span>
      </div>
    </div>
  );
};
