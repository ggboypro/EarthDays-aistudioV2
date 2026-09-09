// src/features/diary-home/DiaryHomeView.tsx
// EarthDays V4.2: Shared Spatial Presentation Stage with GSAP Flip & Core Region Integration

import React, { useState, useEffect } from 'react';
import { Ledger } from '../../core/types/ledger';
import { DiaryEntry } from '../../core/types/diary';
import { diaryRepo } from '../../core/storage/diaryRepository';
import { LedgerPresentationStage } from './components/LedgerPresentationStage';
import { MemoryGallery } from './gallery/MemoryGallery';
import { DiaryVerticalFeed } from './components/DiaryVerticalFeed';
import { DiaryViewModeButton, DiaryViewMode } from './components/DiaryViewModeButton';
import { CreateLedgerModal } from '../ledger/CreateLedgerModal';
import { useTheme } from '../../core/theme/ThemeContext';
import { AnimatePresence, motion } from 'motion/react';

interface DiaryHomeViewProps {
  onOpenBookshelf: () => void;
  onOpenAlbum: () => void;
  onEntryClick: (entry: DiaryEntry) => void;
  onWriteClick: () => void;
  newlyInsertedId?: string;
}

export const DiaryHomeView: React.FC<DiaryHomeViewProps> = ({
  onOpenBookshelf,
  onOpenAlbum,
  onEntryClick,
  onWriteClick,
  newlyInsertedId,
}) => {
  const { setTheme } = useTheme();

  // View Mode: 'horizontal' | 'vertical' (UI Preference, stored in localStorage)
  const [viewMode, setViewMode] = useState<DiaryViewMode>(() => {
    try {
      const saved = localStorage.getItem('earthdays_diary_view_mode');
      if (saved === 'vertical' || saved === 'horizontal') {
        return saved;
      }
    } catch {
      // localStorage unavailable or security blocked
    }
    return 'horizontal';
  });

  // Ledger & Diary Repository State (Single source of truth)
  const [ledgers, setLedgers] = useState<Ledger[]>(diaryRepo.getLedgers());
  const [currentLedger, setCurrentLedger] = useState<Ledger>(diaryRepo.getCurrentLedger());
  const [entries, setEntries] = useState<DiaryEntry[]>(diaryRepo.getEntriesByLedger(currentLedger.id));
  const [currentEntryId, setCurrentEntryId] = useState<string>(entries[0]?.id || '');

  // Create / Edit Ledger Modal State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [editingLedger, setEditingLedger] = useState<Ledger | undefined>(undefined);

  // Synchronize state on repo changes
  useEffect(() => {
    const unsubscribe = diaryRepo.subscribe(() => {
      const allL = diaryRepo.getLedgers();
      setLedgers(allL);
      const updatedLedger = diaryRepo.getCurrentLedger();
      setCurrentLedger(updatedLedger);
      setTheme(updatedLedger.theme);
      const newEntries = diaryRepo.getEntriesByLedger(updatedLedger.id);
      setEntries(newEntries);
      if (newEntries.length > 0 && !newEntries.some((e) => e.id === currentEntryId)) {
        setCurrentEntryId(newEntries[0].id);
      }
    });
    return unsubscribe;
  }, [currentEntryId, setTheme]);

  // Ensure currentEntryId is valid when entries list changes
  useEffect(() => {
    if (newlyInsertedId) {
      setCurrentEntryId(newlyInsertedId);
    } else if (entries.length > 0 && (!currentEntryId || !entries.some((e) => e.id === currentEntryId))) {
      setCurrentEntryId(entries[0].id);
    }
  }, [entries, currentEntryId, newlyInsertedId]);

  // Handle switching active ledger
  const handleSelectLedger = (ledger: Ledger) => {
    if (ledger.id === currentLedger.id) return;
    diaryRepo.setCurrentLedgerId(ledger.id);
    setCurrentLedger(ledger);
    setTheme(ledger.theme);
    const newEntries = diaryRepo.getEntriesByLedger(ledger.id);
    setEntries(newEntries);
    if (newEntries.length > 0) {
      setCurrentEntryId(newEntries[0].id);
    } else {
      setCurrentEntryId('');
    }
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    diaryRepo.toggleFavorite(id);
  };

  // Toggle View Mode between Horizontal and Vertical
  const handleToggleViewMode = () => {
    setViewMode((prev) => {
      const next: DiaryViewMode = prev === 'horizontal' ? 'vertical' : 'horizontal';
      try {
        localStorage.setItem('earthdays_diary_view_mode', next);
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <div className="w-full min-h-[calc(100vh-70px)] flex flex-col justify-between overflow-x-hidden relative">
      {/* 1. SHARED SPATIAL PRESENTATION STAGE (Houses Ledger Shelf, Focus Stage, View Mode Button & Diary Content) */}
      <LedgerPresentationStage
        ledgers={ledgers}
        currentLedgerId={currentLedger.id}
        onSelectLedger={handleSelectLedger}
        onOpenAddLedger={() => {
          setEditingLedger(undefined);
          setShowCreateModal(true);
        }}
        onEditLedger={(ledger) => {
          setEditingLedger(ledger);
          setShowCreateModal(true);
        }}
        headerRight={
          <DiaryViewModeButton
            mode={viewMode}
            onToggle={handleToggleViewMode}
          />
        }
      >
        {/* Core Diary Content: Smoothly switches renderer with subtle opacity/scale transition */}
        <AnimatePresence mode="wait" initial={false}>
          {viewMode === 'horizontal' ? (
            <motion.div
              key="horizontal-gallery"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex-1 flex flex-col items-center justify-start"
            >
              <MemoryGallery
                entries={entries}
                currentId={currentEntryId}
                newlyInsertedId={newlyInsertedId}
                onSelectId={setCurrentEntryId}
                onEntryClick={onEntryClick}
                onToggleFavorite={handleToggleFavorite}
                onWriteClick={onWriteClick}
              />
            </motion.div>
          ) : (
            <motion.div
              key="vertical-feed"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex-1 flex flex-col items-center justify-start"
            >
              <DiaryVerticalFeed
                entries={entries}
                currentId={currentEntryId}
                onSelectId={setCurrentEntryId}
                onEntryClick={onEntryClick}
                onToggleFavorite={handleToggleFavorite}
                onWriteClick={onWriteClick}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </LedgerPresentationStage>

      {/* 2. Create / Edit Ledger Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateLedgerModal
            ledgerToEdit={editingLedger}
            onClose={() => {
              setShowCreateModal(false);
              setEditingLedger(undefined);
            }}
            onCreated={(savedLedger) => {
              setShowCreateModal(false);
              setEditingLedger(undefined);
              handleSelectLedger(savedLedger);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
