import React, { useState } from 'react';
import { Memory } from '../../core/types/book';
import { diaryRepo } from '../../core/storage/diaryRepository';
import { motion } from 'motion/react';

interface CreateMemoryModalProps {
  onClose: () => void;
  onCreated: (newMemory: Memory) => void;
}

export const CreateMemoryModal: React.FC<CreateMemoryModalProps> = ({
  onClose,
  onCreated,
}) => {
  const allEntries = diaryRepo.getAllEntries();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [selectedDiaryIds, setSelectedDiaryIds] = useState<string[]>([]);

  const toggleSelectDiary = (id: string) => {
    if (selectedDiaryIds.includes(id)) {
      setSelectedDiaryIds(selectedDiaryIds.filter((i) => i !== id));
    } else {
      setSelectedDiaryIds([...selectedDiaryIds, id]);
    }
  };

  const handleCreate = () => {
    if (!title.trim()) {
      alert('请为这段记忆命名');
      return;
    }
    if (selectedDiaryIds.length === 0) {
      alert('请至少勾选一篇日记加入记忆');
      return;
    }

    const selectedEntries = allEntries.filter((e) => selectedDiaryIds.includes(e.id));
    const dates = selectedEntries.map((e) => e.diaryDate).sort();
    const startDate = dates[0] || new Date().toISOString().split('T')[0];
    const endDate = dates[dates.length - 1] || startDate;

    // Find cover image from selected entries or fallback
    let cover = 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop&q=80';
    for (const e of selectedEntries) {
      if (e.photos && e.photos.length > 0) {
        cover = e.photos[0].url;
        break;
      }
    }

    const newMem: Memory = {
      id: `memory_${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      coverImage: cover,
      diaryIds: selectedDiaryIds,
      startDate,
      endDate,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    diaryRepo.addMemory(newMem);
    onCreated(newMem);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-[#FAF7F2] rounded-[8px] border border-[#DDD3C4] shadow-2xl p-6 overflow-y-auto max-h-[90vh]"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D5] mb-4">
          <div>
            <h3 className="font-serif-sc text-[16.5px] font-bold text-[#2C241E]">
              创建一段主题记忆
            </h3>
            <p className="font-serif-sc text-[11px] text-[#7A6F62]">
              挑选相关日记组合为记忆片段（如旅途、成长、某一个夏天）
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#EAE2D5] text-[#554A3E] flex items-center justify-center text-[12px] font-serif-sc cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 font-serif-sc">
          {/* Title */}
          <div>
            <label className="block text-[12px] text-[#7A6F62] mb-1">记忆主题名称</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：2026 日本旅行、MOMO成长札记、夏天的风"
              className="w-full text-[13.5px] text-[#2C241E] bg-[#F4EFE6] border border-[#D8CEBF] rounded-[4px] px-3 py-2 outline-none"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-[12px] text-[#7A6F62] mb-1">简短引言（可选）</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="例如：把那些闪闪发光的瞬间串联起来"
              className="w-full text-[13px] text-[#2C241E] bg-[#F4EFE6] border border-[#D8CEBF] rounded-[4px] px-3 py-2 outline-none"
            />
          </div>

          {/* Diary Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[12px] text-[#7A6F62]">
                勾选收录进此记忆的日记 ({selectedDiaryIds.length}/{allEntries.length})
              </label>
              <button
                type="button"
                onClick={() =>
                  setSelectedDiaryIds(
                    selectedDiaryIds.length === allEntries.length ? [] : allEntries.map((e) => e.id)
                  )
                }
                className="text-[11.5px] text-[#A64434] cursor-pointer"
              >
                {selectedDiaryIds.length === allEntries.length ? '取消全选' : '全部选择'}
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {allEntries.map((entry) => {
                const isSelected = selectedDiaryIds.includes(entry.id);
                return (
                  <div
                    key={entry.id}
                    onClick={() => toggleSelectDiary(entry.id)}
                    className={`p-2.5 rounded-[4px] border cursor-pointer flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-[#EFE8DC] border-[#B7A998]'
                        : 'bg-[#F9F6F0] border-[#E8DFC9] opacity-75'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-baseline gap-2">
                        <span className="font-editorial text-[12px] font-bold text-[#2A221B]">
                          {entry.diaryDate}
                        </span>
                        <span className="text-[11px] text-[#867B6E]">{entry.dayOfWeek}</span>
                      </div>
                      <div className="text-[12px] text-[#42382D] truncate">
                        {entry.title || entry.body}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="accent-[#A64434] shrink-0"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action */}
          <button
            type="button"
            onClick={handleCreate}
            className="w-full py-2.5 rounded-[4px] bg-[#2C241E] text-white font-medium text-[13.5px] hover:bg-[#43372C] transition-colors cursor-pointer shadow-sm mt-4"
          >
            收录为一段记忆
          </button>
        </div>
      </motion.div>
    </div>
  );
};
