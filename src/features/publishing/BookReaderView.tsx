import React, { useState } from 'react';
import { BookDraft, BookPageSlot, BookPageLayoutType } from '../../core/types/book';
import { LayoutRenderer } from './LayoutRenderer';
import { BookCoverCustomizerModal } from './BookCoverCustomizerModal';
import { diaryRepo } from '../../core/storage/diaryRepository';
import { motion, AnimatePresence } from 'motion/react';

interface BookReaderViewProps {
  book: BookDraft;
  onClose: () => void;
}

export const BookReaderView: React.FC<BookReaderViewProps> = ({
  book: initialBook,
  onClose,
}) => {
  const [book, setBook] = useState<BookDraft>(initialBook);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showCoverCustomizer, setShowCoverCustomizer] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showLayoutSwitcher, setShowLayoutSwitcher] = useState(false);

  // Flatten all pages from chapters
  const allPages: BookPageSlot[] = book.chapters.flatMap((c) => c.pages);
  const totalPages = allPages.length;

  const currentPage = allPages[currentPageIndex] || allPages[0];

  const handleNextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const handleSwitchLayout = (newLayout: BookPageLayoutType) => {
    const updatedChapters = book.chapters.map((ch) => ({
      ...ch,
      pages: ch.pages.map((p) => (p.id === currentPage.id ? { ...p, layout: newLayout } : p)),
    }));
    const updatedBook = { ...book, chapters: updatedChapters };
    setBook(updatedBook);
    diaryRepo.saveBook(updatedBook);
    setShowLayoutSwitcher(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#25211D] text-[#EFEBE4] flex flex-col justify-between overflow-hidden">
      {/* Top Bar Navigation */}
      <header className="px-4 py-3 bg-[#1C1815]/90 border-b border-[#3A332C] flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 rounded-[4px] bg-[#332D26] hover:bg-[#423A31] text-[#D8CEBF] font-serif-sc text-[12px] cursor-pointer"
          >
            ← 退出预览
          </button>
          <div className="hidden sm:block">
            <h1 className="font-serif-sc text-[14px] font-bold text-[#EFEAE2] truncate max-w-xs">
              {book.title}
            </h1>
            <span className="font-serif-sc text-[10.5px] text-[#A69C90]">
              {book.version} · {book.paperType === 'matte_art_157g' ? '157g 哑光艺术纸' : '140g 温暖象牙米白纸'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Change layout */}
          <button
            type="button"
            onClick={() => setShowLayoutSwitcher(!showLayoutSwitcher)}
            className="px-2.5 py-1 rounded-[4px] bg-[#332D26] hover:bg-[#423A31] text-[#D8CEBF] font-serif-sc text-[12px] cursor-pointer"
          >
            📐 切换版式
          </button>

          {/* Book Settings */}
          <button
            type="button"
            onClick={() => setShowCoverCustomizer(true)}
            className="px-2.5 py-1 rounded-[4px] bg-[#332D26] hover:bg-[#423A31] text-[#D8CEBF] font-serif-sc text-[12px] cursor-pointer"
          >
            🎨 装帧定制
          </button>

          {/* Order physical book */}
          <button
            type="button"
            onClick={() => setShowOrderModal(true)}
            className="px-3 py-1 rounded-[4px] bg-[#B24436] hover:bg-[#C85244] text-white font-serif-sc text-[12px] font-medium cursor-pointer shadow-sm"
          >
            📦 订制实体书
          </button>
        </div>
      </header>

      {/* Main Book Display Stage */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden relative">
        {/* Physical Hardcover Book Container */}
        <div className="relative w-full max-w-md sm:max-w-lg aspect-[3/4.2] max-h-[75vh] bg-[#FAF8F5] rounded-[4px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-[#C5BBAA] flex flex-col overflow-hidden text-[#2C241E]">
          {/* Left Book Spine Binding Contact Shadow & Gutter */}
          <div className="absolute left-0 inset-y-0 w-4 bg-gradient-to-r from-black/25 via-black/5 to-transparent pointer-events-none z-10" />
          <div className="absolute left-3 inset-y-0 w-[1px] bg-[#DDD2C2] pointer-events-none z-10" />

          {/* Page Content Viewport */}
          <div className="flex-1 overflow-y-auto pl-4 pr-3 py-2 paper-grain relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPageIndex}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {currentPage ? (
                  <LayoutRenderer page={currentPage} />
                ) : (
                  <div className="h-full flex items-center justify-center font-serif-sc text-[#8C8072]">
                    空白页
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Book Footer Page Number (Publisher standard: - 03 - ) */}
          <footer className="px-6 py-2.5 bg-[#FAF8F5] border-t border-[#EAE2D5] flex items-center justify-between text-[11px] font-serif-sc text-[#8C7F72] shrink-0">
            <span>{book.title}</span>
            <span className="font-editorial font-bold tracking-widest">
              — {currentPageIndex + 1} —
            </span>
            <span>共 {totalPages} 页</span>
          </footer>
        </div>

        {/* Layout Switcher Floating Menu */}
        {showLayoutSwitcher && (
          <div className="absolute top-4 right-4 z-40 w-48 bg-[#FAF7F2] text-[#2C241E] rounded-[6px] border border-[#DDD3C4] shadow-2xl p-2 font-serif-sc text-[12px] space-y-1">
            <div className="text-[10.5px] font-semibold text-[#8C7F72] px-2 py-1 border-b border-[#EAE2D5]">
              选择当前页出版物版式
            </div>
            <button
              type="button"
              onClick={() => handleSwitchLayout('L01_single_hero')}
              className="w-full text-left px-2 py-1.5 hover:bg-[#EAE1D3] rounded-[3px] cursor-pointer"
            >
              🖼️ L01 单张大图手记
            </button>
            <button
              type="button"
              onClick={() => handleSwitchLayout('L03_two_photos')}
              className="w-full text-left px-2 py-1.5 hover:bg-[#EAE1D3] rounded-[3px] cursor-pointer"
            >
              📷 L03 双张照片对比
            </button>
            <button
              type="button"
              onClick={() => handleSwitchLayout('L06_photo_with_story')}
              className="w-full text-left px-2 py-1.5 hover:bg-[#EAE1D3] rounded-[3px] cursor-pointer"
            >
              📖 L06 照片与故事长文
            </button>
            <button
              type="button"
              onClick={() => handleSwitchLayout('L08_chapter_opener')}
              className="w-full text-left px-2 py-1.5 hover:bg-[#EAE1D3] rounded-[3px] cursor-pointer"
            >
              🔖 L08 章节首页
            </button>
            <button
              type="button"
              onClick={() => handleSwitchLayout('L09_quote_whitespace')}
              className="w-full text-left px-2 py-1.5 hover:bg-[#EAE1D3] rounded-[3px] cursor-pointer"
            >
              💬 L09 留白与金句
            </button>
          </div>
        )}
      </main>

      {/* Bottom Page Flipping Controls */}
      <footer className="px-6 py-4 bg-[#1C1815] border-t border-[#3A332C] flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevPage}
          disabled={currentPageIndex === 0}
          className="px-4 py-2 rounded-[4px] bg-[#2E2822] hover:bg-[#3C342C] disabled:opacity-30 disabled:cursor-not-allowed font-serif-sc text-[13px] text-[#D8CEBF] cursor-pointer transition-colors"
        >
          ← 上一页 (翻阅)
        </button>

        {/* Page Slider / Dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentPageIndex(i)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                currentPageIndex === i ? 'bg-[#D8CEBF] w-4' : 'bg-[#554A3E]'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNextPage}
          disabled={currentPageIndex >= totalPages - 1}
          className="px-4 py-2 rounded-[4px] bg-[#2E2822] hover:bg-[#3C342C] disabled:opacity-30 disabled:cursor-not-allowed font-serif-sc text-[13px] text-[#D8CEBF] cursor-pointer transition-colors"
        >
          下一页 (翻阅) →
        </button>
      </footer>

      {/* Cover Customizer Modal */}
      {showCoverCustomizer && (
        <BookCoverCustomizerModal
          book={book}
          onClose={() => setShowCoverCustomizer(false)}
          onSaved={(updated) => {
            setBook(updated);
            setShowCoverCustomizer(false);
          }}
        />
      )}

      {/* Order Physical Book Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md bg-[#FAF7F2] text-[#2C241E] rounded-[12px] border border-[#D5CBBF] shadow-2xl p-6 font-serif-sc overflow-hidden"
          >
            {/* Background Texture backage.png */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-50"
              style={{ backgroundImage: "url('/assets/backage.png')" }}
            />
            <div className="absolute inset-0 bg-[#FAF7F2]/75 pointer-events-none" />
            <div className="relative z-10">
              <div className="text-center pb-4 border-b border-[#EAE2D5]">
              <div className="w-12 h-12 rounded-full bg-[#EAE2D5] flex items-center justify-center text-[22px] mx-auto mb-2">
                📦
              </div>
              <h3 className="text-[17px] font-bold text-[#2C241E]">
                实体书打样与印制
              </h3>
              <p className="text-[12px] text-[#7A6F62] mt-0.5">
                将《{book.title}》印制为真正的硬壳布面出版级实物
              </p>
            </div>

            <div className="py-4 space-y-2.5 text-[12.5px] text-[#42382D]">
              <div className="flex justify-between py-1 border-b border-[#EAE2D5]">
                <span className="text-[#7A6F62]">装帧规格</span>
                <span className="font-semibold">布面精装 Hardcover (185 × 245 mm)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE2D5]">
                <span className="text-[#7A6F62]">内页工艺</span>
                <span className="font-semibold">140g 温暖象牙米白纸 · 锁线胶订</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE2D5]">
                <span className="text-[#7A6F62]">打样校对</span>
                <span className="text-[#2F7C48] font-semibold">✓ 300 DPI 印刷校色通过</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE2D5]">
                <span className="text-[#7A6F62]">预计制作周期</span>
                <span>3-5 个工作日手工装订出库</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => {
                  alert('已提交实体样书印制需求！我们将开始手工锁线装订您的记忆。');
                  setShowOrderModal(false);
                }}
                className="w-full py-2.5 rounded-[4px] bg-[#B24436] hover:bg-[#C85244] text-white font-semibold text-[13.5px] cursor-pointer shadow-sm"
              >
                确认提交印制申请 (实物纪念版)
              </button>
              <button
                type="button"
                onClick={() => setShowOrderModal(false)}
                className="w-full py-2 bg-transparent text-[#7A6F62] hover:text-[#2C241E] text-[12px] cursor-pointer"
              >
                稍后再说
              </button>
            </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
