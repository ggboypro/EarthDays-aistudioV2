// src/design-system/navigation/UnifiedTopNav.tsx
// Quiet Top Navigation Bar across all secondary pages

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { colorTokens } from '../tokens/colors';

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
    <header className="w-full bg-[#FBF8F2]/95 backdrop-blur-xs border-b border-[#E5DDD1] px-4 py-3 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Left Back Control (Text + Icon quiet affordance) */}
      <div className="flex items-center min-w-[70px]">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-0.5 py-0.5 text-[#766C60] hover:text-[#302820] font-serif-sc text-[13.5px] transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} strokeWidth={1.8} className="text-[#766C60]" />
            <span>{backText}</span>
          </button>
        ) : (
          <div className="w-[70px]" />
        )}
      </div>

      {/* Center Brand Title */}
      <h1 className="font-editorial text-[16px] font-semibold text-[#302820] tracking-wide text-center truncate mx-2">
        {title}
      </h1>

      {/* Right Action Element / Spacer */}
      <div className="flex items-center justify-end min-w-[70px]">
        {rightElement ? rightElement : <div className="w-[70px]" />}
      </div>
    </header>
  );
};

