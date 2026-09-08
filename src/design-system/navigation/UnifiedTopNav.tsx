// src/design-system/navigation/UnifiedTopNav.tsx
// Unified Top Navigation Bar across all secondary pages (二级页)

import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface UnifiedTopNavProps {
  title?: string;
  onBack?: () => void;
  backText?: string;
  rightElement?: React.ReactNode;
}

export const UnifiedTopNav: React.FC<UnifiedTopNavProps> = ({
  title = '我在地球的日子',
  onBack,
  backText = '返回',
  rightElement,
}) => {
  return (
    <header className="w-full bg-[#FAF7F2]/95 backdrop-blur-xs border-b border-[#EDE6DA] px-4 py-2.5 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Left Back Button */}
      <div className="flex items-center min-w-[75px]">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-[#F3EDE2] hover:bg-[#EBE2D3] border border-[#DDD3C3] text-[#5A4F44] font-serif-sc text-[12.5px] font-medium transition-colors cursor-pointer shadow-xs active:scale-95"
          >
            <ChevronLeft size={15} strokeWidth={2.2} />
            <span>{backText}</span>
          </button>
        ) : (
          <div className="w-[75px]" />
        )}
      </div>

      {/* Center Brand Title */}
      <h1 className="font-editorial text-[16px] font-bold text-[#2C241E] tracking-wide text-center truncate mx-2">
        {title}
      </h1>

      {/* Right Action Element / Spacer */}
      <div className="flex items-center justify-end min-w-[75px]">
        {rightElement ? rightElement : <div className="w-[75px]" />}
      </div>
    </header>
  );
};
