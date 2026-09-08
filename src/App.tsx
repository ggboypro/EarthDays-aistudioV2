import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './core/theme/ThemeContext';
import { DiaryEntry } from './core/types/diary';
import { Ledger } from './core/types/ledger';
import { Memory, BookDraft } from './core/types/book';
import { PaperBottomNav, MainTab } from './design-system/navigation/PaperBottomNav';
import { DiaryHomeView } from './features/diary-home/DiaryHomeView';
import { WriteDiaryView } from './features/write-diary/WriteDiaryView';
import { DiaryDetailView } from './features/diary-detail/DiaryDetailView';
import { BookshelfView } from './features/ledger/BookshelfView';
import { AlbumView } from './features/album/AlbumView';
import { ProfileDeskView } from './features/profile/ProfileDeskView';
import { WelcomeView } from './features/onboarding/WelcomeView';
import { MemoryDetailView } from './features/memory/MemoryDetailView';
import { BookReaderView } from './features/publishing/BookReaderView';
import { MotionLedgerDemoView } from './features/demo/MotionLedgerDemoView';
import { AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

function AppContent() {
  const { theme } = useTheme();

  // Navigation and Modal State
  const [activeTab, setActiveTab] = useState<MainTab>('diary');
  const [detailEntry, setDetailEntry] = useState<DiaryEntry | null>(null);
  const [activeMemory, setActiveMemory] = useState<Memory | null>(null);
  const [readingBook, setReadingBook] = useState<BookDraft | null>(null);
  const [showMotionDemo, setShowMotionDemo] = useState(false);

  const [showWelcome, setShowWelcome] = useState(false);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | undefined>(undefined);
  const [lastInsertedId, setLastInsertedId] = useState<string | undefined>();
  const [showBookshelf, setShowBookshelf] = useState(false);
  const [showAlbum, setShowAlbum] = useState(false);

  // Handlers
  const handleOpenWrite = (entryToEdit?: DiaryEntry) => {
    setEditingEntry(entryToEdit);
    setShowWriteModal(true);
  };

  const handleEntryClick = (entry: DiaryEntry) => {
    setDetailEntry(entry);
  };

  const handleEditFromDetail = (entry: DiaryEntry) => {
    setDetailEntry(null);
    handleOpenWrite(entry);
  };

  return (
    <div
      style={{ backgroundColor: theme.canvasBg }}
      className="min-h-screen text-[#2D2721] font-sans antialiased relative transition-colors duration-300 select-none sm:select-auto"
    >
      {/* Background ambient lighting pattern */}
      <div className="fixed inset-0 bg-gradient-to-b from-white/20 to-black/5 pointer-events-none" />

      {/* Floating Demo Trigger (Top Right) */}
      {!showMotionDemo && !readingBook && !showWelcome && (
        <div className="fixed top-3 right-3 sm:right-6 z-50">
          <button
            type="button"
            onClick={() => setShowMotionDemo(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2C241E]/90 hover:bg-[#8A2B20] text-[#FAF7F2] text-xs font-serif-sc font-medium shadow-[0_3px_12px_rgba(40,30,20,0.22)] backdrop-blur-xs border border-white/10 transition-all cursor-pointer active:scale-95"
            title="进入 Motion 账本动效实验页面"
          >
            <Sparkles size={13} className="text-amber-300" />
            <span>动效 Demo</span>
          </button>
        </div>
      )}

      {/* Main Container - Full viewport responsive workspace without fake phone shell */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {/* Full-screen View Hierarchy */}
        {showMotionDemo ? (
          <MotionLedgerDemoView
            onBack={() => setShowMotionDemo(false)}
            onEntryClick={(entry) => setDetailEntry(entry)}
            onWriteClick={() => setShowWriteModal(true)}
          />
        ) : showWelcome ? (
          <div className="w-full max-w-2xl mx-auto min-h-screen">
            <WelcomeView onStart={() => setShowWelcome(false)} />
          </div>
        ) : readingBook ? (
          <BookReaderView
            book={readingBook}
            onClose={() => setReadingBook(null)}
          />
        ) : activeMemory ? (
          <div className="w-full max-w-3xl mx-auto min-h-screen">
            <MemoryDetailView
              memory={activeMemory}
              onBack={() => setActiveMemory(null)}
              onOpenBook={(book) => {
                setActiveMemory(null);
                setReadingBook(book);
              }}
              onEntryClick={(entry) => setDetailEntry(entry)}
            />
          </div>
        ) : detailEntry ? (
          <div className="w-full max-w-2xl mx-auto min-h-screen">
            <DiaryDetailView
              entry={detailEntry}
              onBack={() => setDetailEntry(null)}
              onEdit={handleEditFromDetail}
            />
          </div>
        ) : activeTab === 'diary' ? (
          <DiaryHomeView
            onOpenBookshelf={() => setShowBookshelf(true)}
            onOpenAlbum={() => setShowAlbum(true)}
            onEntryClick={handleEntryClick}
            onWriteClick={() => handleOpenWrite()}
            newlyInsertedId={lastInsertedId}
          />
        ) : (
          <div className="w-full max-w-2xl mx-auto min-h-screen">
            <ProfileDeskView
              onOpenBookshelf={() => setShowBookshelf(true)}
              onOpenAlbum={() => setShowAlbum(true)}
              onReplayWelcome={() => setShowWelcome(true)}
            />
          </div>
        )}

        {/* Bottom Navigation Dock */}
        {!detailEntry && !activeMemory && !readingBook && !showWelcome && !showMotionDemo && (
          <PaperBottomNav
            activeTab={activeTab}
            onTabChange={(tab) => {
              setDetailEntry(null);
              setActiveMemory(null);
              setActiveTab(tab);
            }}
            onWriteClick={() => handleOpenWrite()}
          />
        )}
      </div>

      {/* Write Diary Modal (P02) */}
      <AnimatePresence>
        {showWriteModal && (
          <WriteDiaryView
            editingEntry={editingEntry}
            onClose={() => {
              setShowWriteModal(false);
              setEditingEntry(undefined);
            }}
            onSaved={(entry) => {
              setShowWriteModal(false);
              setEditingEntry(undefined);
              setLastInsertedId(entry.id);
              setTimeout(() => setLastInsertedId(undefined), 3200);
            }}
          />
        )}
      </AnimatePresence>

      {/* Bookshelf View (P04) */}
      <AnimatePresence>
        {showBookshelf && (
          <BookshelfView
            onClose={() => setShowBookshelf(false)}
            onSelectLedger={(ledger) => {
              setShowBookshelf(false);
              setActiveTab('diary');
              setDetailEntry(null);
              setActiveMemory(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Album & Memory View (P08 / P09) */}
      <AnimatePresence>
        {showAlbum && (
          <AlbumView
            onClose={() => setShowAlbum(false)}
            onEntryClick={(entry) => {
              setShowAlbum(false);
              setDetailEntry(entry);
            }}
            onOpenMemory={(memory) => {
              setShowAlbum(false);
              setActiveMemory(memory);
            }}
            onOpenBook={(book) => {
              setShowAlbum(false);
              setReadingBook(book);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
