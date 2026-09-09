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
import { PaperGrainOverlay } from './design-system/paper/PaperGrainOverlay';
import { AnimatePresence, motion } from 'motion/react';

function AppContent() {
  const { theme } = useTheme();

  // Navigation and Modal State
  const [activeTab, setActiveTab] = useState<MainTab>('diary');
  const [detailEntry, setDetailEntry] = useState<DiaryEntry | null>(null);
  const [activeMemory, setActiveMemory] = useState<Memory | null>(null);
  const [readingBook, setReadingBook] = useState<BookDraft | null>(null);

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
      style={{ backgroundColor: '#F2EEE6', color: '#302820' }}
      className="min-h-screen font-sans antialiased relative transition-colors duration-300 select-none sm:select-auto"
    >
      {/* Background ambient lighting pattern & global paper texture material */}
      <div className="fixed inset-0 bg-gradient-to-b from-white/10 to-black/5 pointer-events-none z-0" />
      <PaperGrainOverlay hasHighlightBorder={false} className="fixed inset-0 z-0 pointer-events-none" />

      {/* Main Container - Full viewport responsive workspace */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {/* Full-screen View Hierarchy */}
        {showWelcome ? (
          <div className="w-full max-w-2xl mx-auto min-h-screen">
            <WelcomeView onStart={() => setShowWelcome(false)} />
          </div>
        ) : readingBook ? (
          <BookReaderView
            book={readingBook}
            onClose={() => setReadingBook(null)}
          />
        ) : (
          <>
            {/* Primary Tab Views: Kept mounted so navigation never re-triggers entrance animations */}
            <div className={activeTab === 'diary' ? 'block w-full min-h-screen' : 'hidden'}>
              <DiaryHomeView
                onOpenBookshelf={() => setShowBookshelf(true)}
                onOpenAlbum={() => setShowAlbum(true)}
                onEntryClick={handleEntryClick}
                onWriteClick={() => handleOpenWrite()}
                newlyInsertedId={lastInsertedId}
              />
            </div>

            <div className={activeTab === 'profile' ? 'block w-full max-w-2xl mx-auto min-h-screen' : 'hidden'}>
              <ProfileDeskView
                onOpenBookshelf={() => setShowBookshelf(true)}
                onOpenAlbum={() => setShowAlbum(true)}
                onReplayWelcome={() => setShowWelcome(true)}
              />
            </div>

            {/* Memory Detail Overlay */}
            <AnimatePresence>
              {activeMemory && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-40 bg-[#FBF8F2] overflow-y-auto"
                >
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
                </motion.div>
              )}
            </AnimatePresence>

            {/* Diary Card Detail Overlay */}
            <AnimatePresence>
              {detailEntry && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-50 bg-[#FBF8F2] overflow-y-auto"
                >
                  <DiaryDetailView
                    entry={detailEntry}
                    onBack={() => setDetailEntry(null)}
                    onEdit={handleEditFromDetail}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Bottom Navigation Dock */}
        {!detailEntry && !activeMemory && !readingBook && !showWelcome && (
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
