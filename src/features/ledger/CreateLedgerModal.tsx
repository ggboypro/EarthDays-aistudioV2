import React, { useState } from 'react';
import { Ledger } from '../../core/types/ledger';
import { generateThemeFromCover } from '../../core/theme/colorExtractor';
import { diaryRepo } from '../../core/storage/diaryRepository';
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
    <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-[#FAF7F2] rounded-[8px] border border-[#DDD3C4] shadow-2xl p-6 overflow-hidden"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D5] mb-4">
          <h2 className="font-serif-sc text-[17px] font-semibold text-[#2C241E]">
            {ledgerToEdit ? '修改账本信息' : '拿出一本空白账本'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8C7F72] hover:text-[#332A22] font-serif-sc text-[13px] cursor-pointer"
          >
            取消
          </button>
        </div>

        <div className="space-y-4">
          {/* Name input */}
          <div>
            <label className="block font-serif-sc text-[12px] text-[#7A6F62] mb-1">
              账本名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：京都游记、我们的家、小猫咪日记"
              className="w-full font-serif-sc text-[14px] text-[#2C241E] bg-[#F4EFE6] border border-[#D8CEBF] rounded-[4px] px-3 py-2 outline-none"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block font-serif-sc text-[12px] text-[#7A6F62] mb-1">
              副标题（可选）
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="例如：记录细碎而珍贵的时光"
              className="w-full font-serif-sc text-[13px] text-[#2C241E] bg-[#F4EFE6] border border-[#D8CEBF] rounded-[4px] px-3 py-2 outline-none"
            />
          </div>

          {/* Select Cover */}
          <div>
            <label className="block font-serif-sc text-[12px] text-[#7A6F62] mb-1.5">
              选择封面照片
            </label>
            <div className="grid grid-cols-4 gap-2">
              {SAMPLE_COVERS.map((cov, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedCover(cov.url)}
                  className={`relative rounded-[3px] overflow-hidden aspect-[3/4] border-2 transition-transform cursor-pointer ${
                    selectedCover === cov.url
                      ? 'border-[#2C241E] scale-102 shadow-md'
                      : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={cov.url} alt={cov.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* 08 主题配色预览 (基于封面自动生成) */}
          <div className="p-3 bg-[#F0EAE0] rounded-[6px] border border-[#DDD3C4]">
            <span className="font-serif-sc text-[11px] text-[#7A6F62] block mb-2">
              自动衍生出版物色彩世界 (Theme)
            </span>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <div
                  style={{ backgroundColor: themePreview.primary }}
                  className="w-6 h-6 rounded-full shadow-sm"
                />
                <span className="text-[10px] font-serif-sc text-[#7A6F62]">主色</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div
                  style={{ backgroundColor: themePreview.secondary }}
                  className="w-6 h-6 rounded-full shadow-sm"
                />
                <span className="text-[10px] font-serif-sc text-[#7A6F62]">辅助色</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div
                  style={{ backgroundColor: themePreview.paper }}
                  className="w-6 h-6 rounded-full shadow-sm border border-black/10"
                />
                <span className="text-[10px] font-serif-sc text-[#7A6F62]">纸张色</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div
                  style={{ backgroundColor: themePreview.ink }}
                  className="w-6 h-6 rounded-full shadow-sm"
                />
                <span className="text-[10px] font-serif-sc text-[#7A6F62]">墨水色</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div
                  style={{ backgroundColor: themePreview.accent }}
                  className="w-6 h-6 rounded-full shadow-sm"
                />
                <span className="text-[10px] font-serif-sc text-[#7A6F62]">强调色</span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-2.5 rounded-[4px] bg-[#2C241E] text-white font-serif-sc text-[13.5px] font-medium hover:bg-[#43372C] transition-colors cursor-pointer shadow-sm"
          >
            {ledgerToEdit ? '保存修改' : '放入书架并开始书写'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
