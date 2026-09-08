import React, { useState } from 'react';
import { diaryRepo } from '../../core/storage/diaryRepository';
import { PaperSheet } from '../../design-system/paper/PaperSheet';
import {
  LedgerBookIcon,
  AlbumIcon,
  BookmarkRibbonIcon,
  SettingsStampIcon,
} from '../../design-system/icons/EarthDiaryIcons';
import { DataPrivacyModal } from './DataPrivacyModal';
import { useTheme } from '../../core/theme/ThemeContext';

interface ProfileDeskViewProps {
  onOpenBookshelf: () => void;
  onOpenAlbum: () => void;
  onReplayWelcome?: () => void;
}

export const ProfileDeskView: React.FC<ProfileDeskViewProps> = ({
  onOpenBookshelf,
  onOpenAlbum,
  onReplayWelcome,
}) => {
  const { theme } = useTheme();
  const ledgers = diaryRepo.getLedgers();
  const allEntries = diaryRepo.getAllEntries();
  const memories = diaryRepo.getMemories();
  const books = diaryRepo.getBooks();
  const favoriteEntries = allEntries.filter((e) => e.isFavorite);

  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <div className="min-h-screen pb-28 pt-4 px-4 max-w-md mx-auto">
      {/* Header */}
      <header className="pb-4 mb-4 border-b border-[#DCD3C5] flex items-center justify-between">
        <div>
          <h1 className="font-serif-sc text-[22px] font-bold text-[#2A231C]">
            我的私人书桌
          </h1>
          <p className="font-serif-sc text-[12px] text-[#7A6F62] mt-0.5">
            记录生活 · 留住记忆 · 成为一本书
          </p>
        </div>

        {onReplayWelcome && (
          <button
            type="button"
            onClick={onReplayWelcome}
            title="查看品牌仪式与启动页"
            className="px-2.5 py-1 rounded-[4px] bg-[#FAF7F2] border border-[#DDD3C4] text-[#6A5E50] font-serif-sc text-[11.5px] hover:bg-[#EFE8DC] cursor-pointer shadow-xs"
          >
            品牌启动页
          </button>
        )}
      </header>

      {/* Desk Overview Card */}
      <PaperSheet className="p-5 mb-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D5]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#E5DDD0] border border-[#D5C9B8] flex items-center justify-center font-serif-sc text-[18px] text-[#42382E] font-medium shadow-inner">
              我
            </div>
            <div>
              <div className="font-serif-sc text-[15px] font-semibold text-[#2C241E]">
                地球记录者
              </div>
              <div className="font-serif-sc text-[11.5px] text-[#8C8072]">
                已陪伴记录 {allEntries.length} 篇生活碎片 · {books.length} 部已排版书册
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2 py-1 text-center">
          <div
            onClick={onOpenBookshelf}
            className="p-2 bg-[#FAF7F2] rounded-[4px] border border-[#EAE2D5] cursor-pointer hover:bg-[#F3ECE0]"
          >
            <div className="font-editorial text-[17px] font-bold text-[#2B231C]">
              {ledgers.length}
            </div>
            <div className="font-serif-sc text-[10.5px] text-[#85796D]">账本</div>
          </div>
          <div className="p-2 bg-[#FAF7F2] rounded-[4px] border border-[#EAE2D5]">
            <div className="font-editorial text-[17px] font-bold text-[#2B231C]">
              {allEntries.length}
            </div>
            <div className="font-serif-sc text-[10.5px] text-[#85796D]">日记篇数</div>
          </div>
          <div
            onClick={onOpenAlbum}
            className="p-2 bg-[#FAF7F2] rounded-[4px] border border-[#EAE2D5] cursor-pointer hover:bg-[#F3ECE0]"
          >
            <div className="font-editorial text-[17px] font-bold text-[#2B231C]">
              {memories.length}
            </div>
            <div className="font-serif-sc text-[10.5px] text-[#85796D]">主题记忆</div>
          </div>
          <div
            onClick={onOpenAlbum}
            className="p-2 bg-[#FAF7F2] rounded-[4px] border border-[#EAE2D5] cursor-pointer hover:bg-[#F3ECE0]"
          >
            <div className="font-editorial text-[17px] font-bold text-[#2B231C]">
              {books.length}
            </div>
            <div className="font-serif-sc text-[10.5px] text-[#85796D]">出版画册</div>
          </div>
        </div>
      </PaperSheet>

      {/* Navigation Desk Items */}
      <div className="space-y-3">
        {/* Bookshelf */}
        <PaperSheet
          onClick={onOpenBookshelf}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#FDFBF9] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[4px] bg-[#EDE5D8] flex items-center justify-center text-[#55493D]">
              <LedgerBookIcon size={18} />
            </div>
            <div>
              <div className="font-serif-sc text-[14px] font-medium text-[#2C241E]">
                我的账本 (实体书架)
              </div>
              <div className="font-serif-sc text-[11px] text-[#8A7E71]">
                陈列拥有的 {ledgers.length} 本独立人生空间
              </div>
            </div>
          </div>
          <span className="text-[#998C7F] text-[13px]">→</span>
        </PaperSheet>

        {/* Albums & Memories & Books */}
        <PaperSheet
          onClick={onOpenAlbum}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#FDFBF9] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[4px] bg-[#EDE5D8] flex items-center justify-center text-[#55493D]">
              <AlbumIcon size={18} />
            </div>
            <div>
              <div className="font-serif-sc text-[14px] font-medium text-[#2C241E]">
                相册、记忆与出版画册
              </div>
              <div className="font-serif-sc text-[11px] text-[#8A7E71]">
                把散落的日子整理成一本真正的实体书 (300 DPI 排版)
              </div>
            </div>
          </div>
          <span className="text-[#998C7F] text-[13px]">→</span>
        </PaperSheet>

        {/* Data & Privacy */}
        <PaperSheet
          onClick={() => setShowPrivacyModal(true)}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#FDFBF9] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[4px] bg-[#EDE5D8] flex items-center justify-center text-[#55493D]">
              <SettingsStampIcon size={18} />
            </div>
            <div>
              <div className="font-serif-sc text-[14px] font-medium text-[#2C241E]">
                数据、隐私与 iCloud 同步
              </div>
              <div className="font-serif-sc text-[11px] text-[#8A7E71]">
                本地存储优先 · 全量 JSON/Markdown 导出 · 云备份
              </div>
            </div>
          </div>
          <span className="text-[#998C7F] text-[13px]">→</span>
        </PaperSheet>
      </div>

      {/* Brand philosophy statement at footer */}
      <div className="mt-8 text-center space-y-1">
        <p className="font-hand text-[16px] text-[#7A6E61]">
          生活会忘记，但照片和文字不会。
        </p>
        <p className="font-editorial text-[11px] text-[#A69C90] tracking-wider uppercase">
          Same Days, A Better Me.
        </p>
      </div>

      {/* Data & Privacy Modal */}
      {showPrivacyModal && (
        <DataPrivacyModal onClose={() => setShowPrivacyModal(false)} />
      )}
    </div>
  );
};

