// src/design-system/navigation/PaperBottomNav.tsx
// Quiet desk tool dock with writing nib affordance

import React from 'react';
import { DiaryIcon, ProfileDeskIcon, WritePenIcon } from '../icons/EarthDiaryIcons';
import { useTheme } from '../../core/theme/ThemeContext';

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
  const { theme } = useTheme();

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 max-w-xs sm:max-w-sm mx-auto pointer-events-none pb-[env(safe-area-inset-bottom,12px)] sm:pb-5 px-4">
      {/* Paper tool dock */}
      <div className="relative pointer-events-auto flex items-center justify-between h-13 sm:h-14 px-5 sm:px-6 bg-[#FAF7F2]/95 backdrop-blur-xs border border-[#E3DACB] rounded-full shadow-[0_8px_24px_-6px_rgba(35,28,20,0.14),0_2px_6px_rgba(35,28,20,0.05)]">
        {/* Paper texture */}
        <div className="absolute inset-0 paper-grain rounded-full pointer-events-none opacity-40" />
        
        {/* Left: 日记 Tab */}
        <button
          type="button"
          onClick={() => onTabChange('diary')}
          className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
            activeTab === 'diary'
              ? 'text-[#2A221A] font-semibold bg-[#EDE4D5]/60'
              : 'text-[#827668] hover:text-[#4A4035]'
          }`}
        >
          <DiaryIcon size={17} color={activeTab === 'diary' ? theme.ink : '#827668'} />
          <span className="font-serif-sc text-[12px] tracking-wider">日记</span>
        </button>

        {/* Center: Desk Pen Nib Writing Tool (Embedded cleanly, no giant balloon FAB) */}
        <div className="relative z-20">
          <button
            type="button"
            onClick={onWriteClick}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-[#2C231B] text-[#FAF7F2] hover:bg-[#8A2B20] shadow-[0_3px_10px_rgba(40,30,20,0.22)] transition-all duration-200 cursor-pointer active:scale-95"
            title="执笔书写"
          >
            <WritePenIcon size={18} color="#FAF7F2" className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>

        {/* Right: 我的 Tab */}
        <button
          type="button"
          onClick={() => onTabChange('profile')}
          className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
            activeTab === 'profile'
              ? 'text-[#2A221A] font-semibold bg-[#EDE4D5]/60'
              : 'text-[#827668] hover:text-[#4A4035]'
          }`}
        >
          <ProfileDeskIcon size={17} color={activeTab === 'profile' ? theme.ink : '#827668'} />
          <span className="font-serif-sc text-[12px] tracking-wider">我的</span>
        </button>
      </div>
    </div>
  );
};
