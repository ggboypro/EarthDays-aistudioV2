// src/design-system/navigation/PaperBottomNav.tsx
// Quiet desk tool strip with writing object affordance

import React from 'react';
import { DiaryIcon, ProfileDeskIcon, WritePenIcon } from '../icons/EarthDiaryIcons';
import { colorTokens } from '../tokens/colors';
import { shadowTokens } from '../tokens/shadows';

export type MainTab = 'diary' | 'profile';

interface PaperBottomNavProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  onWriteClick: () => void;
}

export const PaperBottomNav: React.FC<PaperBottomNavProps> = ({
  activeTab,
  onTabChange,
  onWriteClick,
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 max-w-xs sm:max-w-sm mx-auto pointer-events-none pb-[env(safe-area-inset-bottom,12px)] sm:pb-5 px-4">
      {/* Paper tool strip */}
      <div 
        style={{
          backgroundColor: `${colorTokens.navBg}FA`,
          borderColor: colorTokens.navBorder,
          boxShadow: shadowTokens.nav,
        }}
        className="relative pointer-events-auto flex items-center justify-between h-13 sm:h-14 px-5 sm:px-6 border rounded-full backdrop-blur-xs"
      >
        {/* Paper texture */}
        <div className="absolute inset-0 paper-grain rounded-full pointer-events-none opacity-40" />
        
        {/* Left: 日记 Tab */}
        <button
          type="button"
          onClick={() => onTabChange('diary')}
          style={{
            backgroundColor: activeTab === 'diary' ? colorTokens.navActiveBg : 'transparent',
            color: activeTab === 'diary' ? colorTokens.textPrimary : colorTokens.textSecondary,
          }}
          className="relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
        >
          <DiaryIcon size={17} color={activeTab === 'diary' ? colorTokens.textPrimary : colorTokens.textSecondary} />
          <span className="font-serif-sc text-[12.5px] tracking-wider">日记</span>
        </button>

        {/* Center: Desk Pen Writing Object FAB */}
        <div className="relative z-20">
          <button
            type="button"
            onClick={onWriteClick}
            style={{
              backgroundColor: colorTokens.fabBg,
              boxShadow: shadowTokens.fab,
            }}
            className="group flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#B45C42] transition-all duration-200 cursor-pointer active:scale-95"
            title="执笔书写"
          >
            <WritePenIcon size={18} color={colorTokens.fabIcon} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>

        {/* Right: 我的 Tab */}
        <button
          type="button"
          onClick={() => onTabChange('profile')}
          style={{
            backgroundColor: activeTab === 'profile' ? colorTokens.navActiveBg : 'transparent',
            color: activeTab === 'profile' ? colorTokens.textPrimary : colorTokens.textSecondary,
          }}
          className="relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
        >
          <ProfileDeskIcon size={17} color={activeTab === 'profile' ? colorTokens.textPrimary : colorTokens.textSecondary} />
          <span className="font-serif-sc text-[12.5px] tracking-wider">我的</span>
        </button>
      </div>
    </div>
  );
};

