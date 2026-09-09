import React from 'react';
import { motion } from 'motion/react';
import { WaxSealBadge } from '../../design-system/icons/EarthDiaryIcons';
import { PaperGrainOverlay } from '../../design-system/paper/PaperGrainOverlay';

interface WelcomeViewProps {
  onStart: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#FAF8F2] text-[#2C241E] flex flex-col justify-between p-6 max-w-md mx-auto overflow-hidden select-none">
      <PaperGrainOverlay />
      <div className="relative z-10 flex flex-col justify-between h-full">
      {/* Top Brand Ornament & English Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center pt-8 space-y-2"
      >
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-[1px] bg-[#AFA393]" />
          <span className="font-editorial text-[13px] tracking-widest text-[#7A6F62] uppercase font-semibold">
            My Days On Earth
          </span>
          <div className="w-8 h-[1px] bg-[#AFA393]" />
        </div>
      </motion.div>

      {/* Centerpiece Book & Seal Visual Identity */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex flex-col items-center text-center my-auto space-y-6"
      >
        {/* Wax Stamp & Quill Pen Medallion */}
        <div className="transform scale-125">
          <WaxSealBadge size={64} />
        </div>

        {/* Brand Chinese Typography */}
        <div className="space-y-3">
          <h1 className="font-serif-sc text-[30px] font-bold text-[#2A221B] tracking-tight">
            我在地球的日子
          </h1>
          <p className="font-serif-sc text-[14px] text-[#6A5E50] tracking-wide">
            记录生活 · 留住记忆 · 成为一本书
          </p>
        </div>

        {/* Philosophical Emotional Quote */}
        <div className="py-3 px-6 bg-[#EBE4D7] rounded-[4px] border border-[#DDD3C2] max-w-xs shadow-inner">
          <p className="font-hand text-[18px] text-[#4A3F33] leading-relaxed">
            “平凡的日子，也是独一无二的故事。”
          </p>
        </div>
      </motion.div>

      {/* Bottom CTA to start writing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="pb-6 space-y-3 text-center"
      >
        <button
          type="button"
          onClick={onStart}
          className="w-full py-3.5 rounded-[4px] bg-[#2C241E] hover:bg-[#42362A] text-white font-serif-sc text-[15px] font-medium tracking-wide shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>开始我的日记</span>
          <span className="text-[13px] opacity-80">→</span>
        </button>

        <p className="font-serif-sc text-[11px] text-[#918576]">
          本地隐私优先存储 · 随时导出与打样装订
        </p>
      </motion.div>
      </div>
    </div>
  );
};

