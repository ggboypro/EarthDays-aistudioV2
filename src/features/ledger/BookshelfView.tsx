import React, { useState } from 'react';
import { Ledger } from '../../core/types/ledger';
import { diaryRepo } from '../../core/storage/diaryRepository';
import { useTheme } from '../../core/theme/ThemeContext';
import { CreateLedgerModal } from './CreateLedgerModal';
import { motion } from 'motion/react';

interface BookshelfViewProps {
  onClose: () => void;
  onSelectLedger: (ledger: Ledger) => void;
}

export const BookshelfView: React.FC<BookshelfViewProps> = ({
  onClose,
  onSelectLedger,
}) => {
  const { theme, setTheme } = useTheme();
  const [ledgers, setLedgers] = useState<Ledger[]>(diaryRepo.getLedgers());
  const [currentLedger, setCurrentLedger] = useState<Ledger>(diaryRepo.getCurrentLedger());
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleSelect = (ledger: Ledger) => {
    diaryRepo.setCurrentLedgerId(ledger.id);
    setCurrentLedger(ledger);
    setTheme(ledger.theme);
    onSelectLedger(ledger);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#282420]/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center p-0 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="relative w-full max-w-lg mx-auto bg-[#ECE5DA] rounded-t-[16px] sm:rounded-[8px] border border-[#D5CBBF] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* 04 我的账本 顶部标题与副标题 */}
        <header className="px-6 pt-5 pb-3 border-b border-[#DDD4C6] bg-[#FAF7F2] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif-sc text-[20px] font-bold text-[#2A221B] tracking-tight">
                我的账本
              </h1>
            </div>
            <p className="font-serif-sc text-[12px] text-[#7A6F62] mt-0.5">
              书架式独立记忆空间 · 每个账本都是一段独特的人生
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              title="新建账本"
              className="w-8 h-8 rounded-full bg-[#E8DFD3] hover:bg-[#DDD2C4] text-[#4A3F33] flex items-center justify-center font-light text-[18px] transition-colors cursor-pointer"
            >
              +
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#E8DFD3] hover:bg-[#DDD2C4] text-[#6A5F53] flex items-center justify-center text-[13px] font-serif-sc transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </header>

        {/* 实体木质书架陈列区 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Bookshelf Row (2x Grid with Shelf Planks) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-6">
            {ledgers.map((ledger) => {
              const isSelected = ledger.id === currentLedger.id;

              return (
                <div
                  key={ledger.id}
                  onClick={() => handleSelect(ledger)}
                  className={`group flex flex-col items-center cursor-pointer transition-all duration-200 ${
                    isSelected ? 'scale-[1.03]' : 'hover:scale-[1.01]'
                  }`}
                >
                  {/* Hardcover Book Object */}
                  <div className="relative w-28 h-38 sm:w-32 sm:h-44 rounded-[3px] bg-[#FAF8F5] p-1.5 border border-[#CFC5B4] shadow-book-spine overflow-hidden flex flex-col justify-between">
                    {/* Spine band gradient on the left */}
                    <div className="absolute left-0 inset-y-0 w-2.5 bg-gradient-to-r from-black/40 via-black/10 to-transparent z-10 pointer-events-none" />
                    {/* Top glossy corner */}
                    <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-white/30 to-transparent pointer-events-none" />

                    {/* Cover image */}
                    <div className="w-full h-24 sm:h-28 rounded-[1px] overflow-hidden border border-black/10 shadow-inner">
                      <img
                        src={ledger.coverImage}
                        alt={ledger.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Book Cover Label */}
                    <div className="pt-1.5 text-center">
                      <div className="font-serif-sc text-[13px] font-semibold text-[#29221C] truncate px-1">
                        {ledger.name}
                      </div>
                      <div className="font-serif-sc text-[10.5px] text-[#8C8072]">
                        {ledger.entryCount} 篇
                      </div>
                    </div>

                    {/* Active Bookmark Flag Indicator */}
                    {isSelected && (
                      <div
                        style={{ backgroundColor: theme.accent }}
                        className="absolute top-0 right-3 w-3 h-5 shadow-sm rounded-b-[1px]"
                      />
                    )}
                  </div>

                  {/* Wood Shelf Groove beneath */}
                  <div className="w-32 sm:w-36 h-2 mt-1.5 bg-gradient-to-b from-[#C4B7A5] to-[#AFA18E] rounded-[2px] shadow-shelf-groove" />
                </div>
              );
            })}

            {/* Blank Book Slot: + 新建账本 */}
            <div
              onClick={() => setShowCreateModal(true)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="w-28 h-38 sm:w-32 sm:h-44 rounded-[3px] bg-[#FAF8F4]/80 border-2 border-dashed border-[#C5B9A8] hover:border-[#8E8070] hover:bg-[#FAF8F4] flex flex-col items-center justify-center gap-2 p-2 shadow-sm transition-all">
                <span className="text-[26px] font-light text-[#8A7D6F] leading-none">+</span>
                <span className="font-serif-sc text-[12px] text-[#6A5D4F] font-medium">
                  新建账本
                </span>
                <span className="font-serif-sc text-[10px] text-[#9E9284] text-center">
                  开启一段新日子
                </span>
              </div>
              <div className="w-32 sm:w-36 h-2 mt-1.5 bg-gradient-to-b from-[#C4B7A5] to-[#AFA18E] rounded-[2px] shadow-shelf-groove" />
            </div>
          </div>
        </div>

        {/* Create Ledger Sub-modal */}
        {showCreateModal && (
          <CreateLedgerModal
            onClose={() => setShowCreateModal(false)}
            onCreated={(newLedger) => {
              setLedgers(diaryRepo.getLedgers());
              handleSelect(newLedger);
              setShowCreateModal(false);
            }}
          />
        )}
      </motion.div>
    </div>
  );
};
