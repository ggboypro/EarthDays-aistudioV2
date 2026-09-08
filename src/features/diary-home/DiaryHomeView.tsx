// src/features/diary-home/DiaryHomeView.tsx
// EarthDays V4.2: Shared Spatial Presentation Stage with GSAP Flip & Core Region Integration

import React, { useState, useEffect } from 'react';
import { Ledger } from '../../core/types/ledger';
import { DiaryEntry } from '../../core/types/diary';
import { diaryRepo } from '../../core/storage/diaryRepository';
import { LedgerPresentationStage } from './components/LedgerPresentationStage';
import { MemoryGallery } from './gallery/MemoryGallery';
import { CreateLedgerModal } from '../ledger/CreateLedgerModal';
import { useTheme } from '../../core/theme/ThemeContext';
import { AnimatePresence } from 'motion/react';

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

  // Ledger & Diary Repository State
  const [ledgers, setLedgers] = useState<Ledger[]>(diaryRepo.getLedgers());
  const [currentLedger, setCurrentLedger] = useState<Ledger>(diaryRepo.getCurrentLedger());
  const [entries, setEntries] = useState<DiaryEntry[]>(diaryRepo.getEntriesByLedger(currentLedger.id));
  const [currentEntryId, setCurrentEntryId] = useState<string>(entries[0]?.id || '');

  // Create Ledger Modal
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

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

  return (
    <div className="w-full min-h-[calc(100vh-70px)] flex flex-col justify-between overflow-x-hidden relative">
      {/* 1. SHARED SPATIAL PRESENTATION STAGE (Houses Ledger Shelf, Focus Stage & Core Gallery) */}
      <LedgerPresentationStage
        ledgers={ledgers}
        currentLedgerId={currentLedger.id}
        onSelectLedger={handleSelectLedger}
        onOpenAddLedger={() => setShowCreateModal(true)}
      >
        {/* Core Memory Gallery: Always mounted, horizontal physics and card positions completely preserved */}
        <MemoryGallery
          entries={entries}
          currentId={currentEntryId}
          newlyInsertedId={newlyInsertedId}
          onSelectId={setCurrentEntryId}
          onEntryClick={onEntryClick}
          onToggleFavorite={handleToggleFavorite}
          onWriteClick={onWriteClick}
        />
      </LedgerPresentationStage>

      {/* 2. Create Ledger Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateLedgerModal
            onClose={() => setShowCreateModal(false)}
            onCreated={(newLedger) => {
              setShowCreateModal(false);
              handleSelectLedger(newLedger);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
