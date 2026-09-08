import React from 'react';
import { useTheme } from '../../../core/theme/ThemeContext';

export type ReadingMode = 'timeline' | 'book';

interface ReadingModeTabsProps {
  mode: ReadingMode;
  onChange: (mode: ReadingMode) => void;
}

export const ReadingModeTabs: React.FC<ReadingModeTabsProps> = ({ mode, onChange }) => {
  const { theme } = useTheme();

  return (
    <div className="flex justify-center my-3 px-4">
      {/* 02 日记首页 纸片便签切换器: [ 时间轴 · | 日记本 ] */}
      <div className="inline-flex p-1 bg-[#E4DDD1] border border-[#D5CBBF] rounded-[4px] shadow-inner">
        {/* 时间轴 Tab */}
        <button
          type="button"
          onClick={() => onChange('timeline')}
          style={{
            backgroundColor: mode === 'timeline' ? theme.paper : 'transparent',
            color: mode === 'timeline' ? theme.ink : '#7D7366',
          }}
          className={`px-4 py-1.5 rounded-[3px] font-serif-sc text-[13px] tracking-wider transition-all duration-200 cursor-pointer ${
            mode === 'timeline'
              ? 'font-medium shadow-paper-l1 border border-[#DED5C7]'
              : 'hover:text-[#4A4035]'
          }`}
        >
          时间轴 {mode === 'timeline' && '·'}
        </button>

        {/* 日记本 Tab */}
        <button
          type="button"
          onClick={() => onChange('book')}
          style={{
            backgroundColor: mode === 'book' ? theme.paper : 'transparent',
            color: mode === 'book' ? theme.ink : '#7D7366',
          }}
          className={`px-4 py-1.5 rounded-[3px] font-serif-sc text-[13px] tracking-wider transition-all duration-200 cursor-pointer ${
            mode === 'book'
              ? 'font-medium shadow-paper-l1 border border-[#DED5C7]'
              : 'hover:text-[#4A4035]'
          }`}
        >
          日记本 {mode === 'book' && '·'}
        </button>
      </div>
    </div>
  );
};
