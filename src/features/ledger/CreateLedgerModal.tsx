import React, { useState } from 'react';
import { Ledger } from '../../core/types/ledger';
import { generateThemeFromCover } from '../../core/theme/colorExtractor';
import { diaryRepo } from '../../core/storage/diaryRepository';
import { PaperGrainOverlay } from '../../design-system/paper/PaperGrainOverlay';
import { motion } from 'motion/react';

interface CreateLedgerModalProps {
  ledgerToEdit?: Ledger;
  onClose: () => void;
  onCreated: (ledger: Ledger) => void;
}

const SAMPLE_COVERS = [
  {
    name: '海边微风',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: '春日樱花',
    url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: '山野与雾',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: '温暖室内',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
  },
];

export const CreateLedgerModal: React.FC<CreateLedgerModalProps> = ({
  ledgerToEdit,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState(ledgerToEdit ? ledgerToEdit.name : '');
  const [subtitle, setSubtitle] = useState(
    ledgerToEdit ? ledgerToEdit.subtitle || '' : ''
  );
  const [selectedCover, setSelectedCover] = useState(
    ledgerToEdit ? ledgerToEdit.coverImage : SAMPLE_COVERS[0].url
  );

  const themePreview = generateThemeFromCover(name || '新账本', selectedCover);

  const handleSave = () => {
    if (!name.trim()) {
      alert('请为账本起一个名字');
      return;
    }

    if (ledgerToEdit) {
      const updatedLedger: Ledger = {
        ...ledgerToEdit,
        name: name.trim(),
        subtitle: subtitle.trim() || undefined,
        coverImage: selectedCover,
        theme: themePreview,
        spineColor: themePreview.primary,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      diaryRepo.updateLedger(updatedLedger);
      onCreated(updatedLedger);
    } else {
      const newLedger: Ledger = {
        id: `ledger_${Date.now()}`,
        name: name.trim(),
        subtitle: subtitle.trim() || undefined,
        coverImage: selectedCover,
        theme: themePreview,
        entryCount: 0,
        spineColor: themePreview.primary,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };

      diaryRepo.addLedger(newLedger);
      onCreated(newLedger);
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-[rgba(35,29,24,0.30)] backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md bg-[#FAF8F2] rounded-[24px] border border-[#DED6C9] shadow-[0_16px_36px_-6px_rgba(35,28,20,0.16)] p-6 overflow-hidden"
      >
        {/* Background Texture backage.png */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-50"
          style={{ backgroundImage: "url('/assets/backage.png')" }}
        />
        <div className="absolute inset-0 bg-[#FAF8F2]/75 pointer-events-none" />
        <PaperGrainOverlay />
        <div className="relative z-10">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5DDD1] mb-4">
          <h2 className="font-serif-sc text-[17px] font-medium text-[#302820]">
            {ledgerToEdit ? '修改账本信息' : '拿出一本空白账本'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#766C60] hover:text-[#302820] font-serif-sc text-[13.5px] cursor-pointer"
          >
            取消
          </button>
        </div>

        <div className="space-y-4">
          {/* Name input */}
          <div>
            <label className="block font-serif-sc text-[12px] text-[#766C60] mb-1">
              账本名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：京都游记、我们的家、小猫咪日记"
              className="w-full font-serif-sc text-[14px] text-[#302820] placeholder:text-[#B5ACA0] bg-[#FAF7F1] border border-[#DED6C9] rounded-[9px] px-3.5 py-2.5 outline-none focus:border-[#B45C42] transition-colors"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block font-serif-sc text-[12px] text-[#766C60] mb-1">
              副标题（可选）
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="例如：记录细碎而珍贵的时光"
              className="w-full font-serif-sc text-[13.5px] text-[#302820] placeholder:text-[#B5ACA0] bg-[#FAF7F1] border border-[#DED6C9] rounded-[9px] px-3.5 py-2.5 outline-none focus:border-[#B45C42] transition-colors"
            />
          </div>

          {/* Select Cover */}
          <div>
            <label className="block font-serif-sc text-[12px] text-[#766C60] mb-1.5">
              选择封面照片
            </label>
            <div className="grid grid-cols-4 gap-2">
              {SAMPLE_COVERS.map((cov, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedCover(cov.url)}
                  className={`relative rounded-[4px] overflow-hidden aspect-[3/4] border-2 transition-transform cursor-pointer ${
                    selectedCover === cov.url
                      ? 'border-[#B45C42] scale-102 shadow-sm'
                      : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={cov.url} alt={cov.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* 08 主题配色预览 */}
          <div className="p-3 bg-[#FAF7F1] rounded-[9px] border border-[#E5DDD1]">
            <span className="font-serif-sc text-[11px] text-[#766C60] block mb-2">
              自动衍生出版物色彩世界 (Theme)
            </span>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <div
                  style={{ backgroundColor: themePreview.primary }}
                  className="w-6 h-6 rounded-full shadow-sm"
                />
                <span className="text-[10px] font-serif-sc text-[#766C60]">主色</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div
                  style={{ backgroundColor: themePreview.secondary }}
                  className="w-6 h-6 rounded-full shadow-sm"
                />
                <span className="text-[10px] font-serif-sc text-[#766C60]">辅助色</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div
                  style={{ backgroundColor: themePreview.paper }}
                  className="w-6 h-6 rounded-full shadow-sm border border-black/10"
                />
                <span className="text-[10px] font-serif-sc text-[#766C60]">纸张色</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div
                  style={{ backgroundColor: themePreview.ink }}
                  className="w-6 h-6 rounded-full shadow-sm"
                />
                <span className="text-[10px] font-serif-sc text-[#766C60]">墨水色</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div
                  style={{ backgroundColor: themePreview.accent }}
                  className="w-6 h-6 rounded-full shadow-sm"
                />
                <span className="text-[10px] font-serif-sc text-[#766C60]">强调色</span>
              </div>
            </div>
          </div>

          {/* Submit Primary Button */}
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-2.5 rounded-[10px] bg-[#B45C42] hover:bg-[#A9513A] active:bg-[#96432E] text-[#FFF9F2] font-serif-sc text-[14px] font-medium transition-colors cursor-pointer"
          >
            {ledgerToEdit ? '保存修改' : '放入书架并开始书写'}
          </button>
        </div>
        </div>
      </motion.div>
    </div>
  );
};
