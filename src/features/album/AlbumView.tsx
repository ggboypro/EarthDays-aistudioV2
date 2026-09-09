import React, { useState } from 'react';
import { diaryRepo } from '../../core/storage/diaryRepository';
import { DiaryEntry } from '../../core/types/diary';
import { Memory, BookDraft } from '../../core/types/book';
import { PaperSheet } from '../../design-system/paper/PaperSheet';
import { PaperGrainOverlay } from '../../design-system/paper/PaperGrainOverlay';
import { CreateMemoryModal } from '../memory/CreateMemoryModal';
import { motion, AnimatePresence } from 'motion/react';

interface AlbumViewProps {
  onClose: () => void;
  onEntryClick: (entry: DiaryEntry) => void;
  onOpenMemory: (memory: Memory) => void;
  onOpenBook: (book: BookDraft) => void;
}

export const AlbumView: React.FC<AlbumViewProps> = ({
  onClose,
  onEntryClick,
  onOpenMemory,
  onOpenBook,
}) => {
  const [memories, setMemories] = useState<Memory[]>(diaryRepo.getMemories());
  const [books, setBooks] = useState<BookDraft[]>(diaryRepo.getBooks());
  const entries = diaryRepo.getAllEntries();
  const [activeSubTab, setActiveSubTab] = useState<'memories' | 'books' | 'photos'>('memories');
  const [showCreateMemoryModal, setShowCreateMemoryModal] = useState(false);

  // Collect all photos from all entries
  const allPhotos = entries.flatMap((e) =>
    (e.photos || []).map((p) => ({ ...p, entryId: e.id, date: e.diaryDate }))
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#282420]/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center p-0 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="relative w-full max-w-lg mx-auto bg-[#FAF8F2] rounded-t-[16px] sm:rounded-[8px] border border-[#DDD4C6] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        <PaperGrainOverlay />
        <div className="relative z-10 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="px-5 pt-4 pb-2 border-b border-[#EAE2D5] bg-[#FAF7F2]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif-sc text-[18px] font-bold text-[#2C241E]">
                我的相册与记忆
              </h2>
              <p className="font-serif-sc text-[11.5px] text-[#7A6F62] mt-0.5">
                记录生活 · 留住记忆 · 成为一本书
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCreateMemoryModal(true)}
                className="px-2.5 py-1 rounded-[4px] bg-[#2C241E] text-white font-serif-sc text-[11.5px] font-medium cursor-pointer shadow-xs"
              >
                + 新建记忆
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-[#EAE2D5] text-[#554A3E] flex items-center justify-center text-[12px] font-serif-sc cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-4 mt-3 border-b border-[#EAE2D5] font-serif-sc text-[13px]">
            <button
              type="button"
              onClick={() => setActiveSubTab('memories')}
              className={`pb-2 border-b-2 font-medium cursor-pointer transition-colors ${
                activeSubTab === 'memories'
                  ? 'border-[#2C241E] text-[#2C241E]'
                  : 'border-transparent text-[#8C8072] hover:text-[#42382D]'
              }`}
            >
              主题记忆 ({memories.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('books')}
              className={`pb-2 border-b-2 font-medium cursor-pointer transition-colors ${
                activeSubTab === 'books'
                  ? 'border-[#2C241E] text-[#2C241E]'
                  : 'border-transparent text-[#8C8072] hover:text-[#42382D]'
              }`}
            >
              已出版画册 ({books.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('photos')}
              className={`pb-2 border-b-2 font-medium cursor-pointer transition-colors ${
                activeSubTab === 'photos'
                  ? 'border-[#2C241E] text-[#2C241E]'
                  : 'border-transparent text-[#8C8072] hover:text-[#42382D]'
              }`}
            >
              散落照片墙 ({allPhotos.length})
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeSubTab === 'memories' && (
            <div className="space-y-4">
              {memories.map((mem) => (
                <div
                  key={mem.id}
                  onClick={() => {
                    onClose();
                    onOpenMemory(mem);
                  }}
                  className="rounded-[6px] overflow-hidden border border-[#D8CEBF] bg-[#FAF8F5] shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="h-32 w-full relative overflow-hidden">
                    <img
                      src={mem.coverImage}
                      alt={mem.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-3 text-white">
                      <h3 className="font-serif-sc text-[16px] font-bold">{mem.title}</h3>
                      <span className="font-editorial text-[11px] text-white/75">
                        {mem.startDate} ~ {mem.endDate}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between font-serif-sc text-[12px] text-[#6B5F52]">
                    <span className="truncate max-w-[200px]">{mem.subtitle || '收录精彩日子'}</span>
                    <span className="text-[#A64434] font-medium">
                      {mem.diaryIds.length} 篇日记 · 查看详情 →
                    </span>
                  </div>
                </div>
              ))}

              {/* Blank Add Memory Card */}
              <div
                onClick={() => setShowCreateMemoryModal(true)}
                className="p-6 border-2 border-dashed border-[#D5CBBF] rounded-[6px] text-center hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              >
                <span className="text-[24px] font-light text-[#8C7F72] block mb-1">+</span>
                <span className="font-serif-sc text-[13px] font-semibold text-[#42382D] block">
                  创建新的主题记忆
                </span>
                <span className="font-serif-sc text-[11px] text-[#8C8072] mt-0.5 block">
                  将一段旅行、一段恋情或宠物的成长串联起来
                </span>
              </div>
            </div>
          )}

          {activeSubTab === 'books' && (
            <div className="space-y-4">
              {books.map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    onClose();
                    onOpenBook(b);
                  }}
                  className="p-4 bg-[#FAF7F1] rounded-[6px] border border-[#D5CBBF] shadow-book-spine cursor-pointer hover:scale-[1.01] transition-all flex items-center gap-4"
                >
                  <div
                    style={{ backgroundColor: b.coverColor }}
                    className="w-16 h-22 rounded-[2px] shadow-sm border border-black/20 p-1 flex flex-col justify-between text-white shrink-0"
                  >
                    <div className="h-9 overflow-hidden rounded-[1px]">
                      <img src={b.coverImage} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="text-[8px] font-serif-sc truncate font-bold text-center">
                      {b.title}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif-sc text-[15px] font-bold text-[#2A231C] truncate">
                      {b.title}
                    </h3>
                    <p className="font-serif-sc text-[11.5px] text-[#7A6F62] truncate mt-0.5">
                      {b.subtitle}
                    </p>
                    <div className="flex items-center gap-3 font-serif-sc text-[10.5px] text-[#8C7F72] mt-2">
                      <span>{b.totalPageCount} 页出版物</span>
                      <span>·</span>
                      <span className="text-[#A64434] font-medium">{b.version}</span>
                    </div>
                  </div>

                  <span className="text-[#8C7F72] text-[13px]">翻阅 →</span>
                </div>
              ))}
            </div>
          )}

          {activeSubTab === 'photos' && (
            <div className="grid grid-cols-3 gap-2">
              {allPhotos.map((ph, idx) => (
                <div
                  key={ph.id || idx}
                  onClick={() => {
                    const found = entries.find((e) => e.id === ph.entryId);
                    if (found) {
                      onClose();
                      onEntryClick(found);
                    }
                  }}
                  className="aspect-square rounded-[3px] overflow-hidden border border-[#D8CEBF] shadow-xs cursor-pointer hover:opacity-90 relative group"
                >
                  <img src={ph.url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-[9.5px] text-white font-editorial truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {ph.date}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Memory Sub-modal */}
        {showCreateMemoryModal && (
          <CreateMemoryModal
            onClose={() => setShowCreateMemoryModal(false)}
            onCreated={(newMem) => {
              setMemories(diaryRepo.getMemories());
              setShowCreateMemoryModal(false);
              onClose();
              onOpenMemory(newMem);
            }}
          />
        )}
        </div>
      </motion.div>
    </div>
  );
};
