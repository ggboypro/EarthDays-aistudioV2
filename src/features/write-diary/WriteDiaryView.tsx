// src/features/write-diary/WriteDiaryView.tsx
// EarthDays Write & Publish Flow: Replicated 1:1 from real paper design mockup

import React, { useState, useRef } from 'react';
import { Ledger } from '../../core/types/ledger';
import { DiaryEntry, MoodType } from '../../core/types/diary';
import { PhotoAsset } from '../../core/types/photo';
import { diaryRepo } from '../../core/storage/diaryRepository';
import { MOOD_PRESETS, MoodStamp } from '../../design-system/elements/MoodStamp';
import { PaperGrainOverlay } from '../../design-system/paper/PaperGrainOverlay';
import { useTheme } from '../../core/theme/ThemeContext';
import { motion } from 'motion/react';
import { MapPin, Sun, ChevronDown, ChevronRight, X } from 'lucide-react';

interface WriteDiaryViewProps {
  initialLedger?: Ledger;
  editingEntry?: DiaryEntry;
  onClose: () => void;
  onSaved: (entry: DiaryEntry) => void;
}

// Botanical leaf branch & script watermark decoration at bottom right
const BotanicalWatermark: React.FC = () => (
  <div className="absolute right-5 bottom-3 pointer-events-none opacity-85 select-none flex items-end gap-1.5 z-0">
    <div className="text-right pb-1">
      <div
        className="text-[13px] leading-tight text-[#A39686] font-serif italic"
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
      >
        Good days
      </div>
      <div
        className="text-[13px] leading-tight text-[#A39686] font-serif italic"
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
      >
        make a good life.
      </div>
    </div>
    {/* Delicate Leaf Branch SVG */}
    <svg
      width="38"
      height="62"
      viewBox="0 0 38 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-[#8F8170]"
    >
      <path
        d="M10 58C14 44 24 26 34 3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M34 3C28 7 22 13 24 19C26 25 34 19 34 3Z"
        fill="currentColor"
        fillOpacity="0.25"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M24 22C16 23 12 27 15 33C18 39 25 31 24 22Z"
        fill="currentColor"
        fillOpacity="0.25"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M18 37C11 39 8 44 11 49C14 54 20 47 18 37Z"
        fill="currentColor"
        fillOpacity="0.25"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M29 14C34 16 36 21 33 25C30 29 28 22 29 14Z"
        fill="currentColor"
        fillOpacity="0.25"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M25 29C30 33 32 38 29 41C26 44 24 37 25 29Z"
        fill="currentColor"
        fillOpacity="0.25"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  </div>
);

export const WriteDiaryView: React.FC<WriteDiaryViewProps> = ({
  initialLedger,
  editingEntry,
  onClose,
  onSaved,
}) => {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  const ledgers = diaryRepo.getLedgers();
  const currentLedger = initialLedger || diaryRepo.getCurrentLedger();

  const today = new Date();
  const dateStr = editingEntry ? editingEntry.diaryDate : '2026-09-08';

  const calculateDayOfWeek = (dStr: string) => {
    const parts = dStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      if (!isNaN(d.getTime())) {
        return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()];
      }
    }
    return '周二';
  };

  const weekdayStr = editingEntry
    ? editingEntry.dayOfWeek
    : calculateDayOfWeek(dateStr);

  const [selectedLedgerId, setSelectedLedgerId] = useState<string>(
    editingEntry ? editingEntry.ledgerId : currentLedger.id
  );
  const [diaryDate, setDiaryDate] = useState<string>(dateStr);
  const [dayOfWeek, setDayOfWeek] = useState<string>(weekdayStr);

  // Default sample content matching the picture if new diary, or loaded editing entry
  const defaultTitle = editingEntry?.title ?? '秋天的公园';
  const defaultBody = editingEntry?.body ?? 
    `今天的阳光很好，带着一点点秋天的凉意。\n我在公园里走了很久，看到树叶开始变黄，风吹过来的时候，有一种很安静的感觉。\n\n生活好像总是在这样的瞬间，\n突然变得柔软起来。`;

  // Pre-load default sample photos matching mockup if available
  const defaultSamplePhotos: PhotoAsset[] = [
    {
      id: 'mock_1',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
      aspectRatio: 1,
    },
    {
      id: 'mock_2',
      url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=400&q=80',
      aspectRatio: 1,
    },
    {
      id: 'mock_3',
      url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80',
      aspectRatio: 1,
    },
    {
      id: 'mock_4',
      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80',
      aspectRatio: 1,
    },
  ];

  const initialPhotos = editingEntry ? editingEntry.photos : defaultSamplePhotos;

  const [title, setTitle] = useState<string>(defaultTitle);
  const [body, setBody] = useState<string>(defaultBody);
  const [photos, setPhotos] = useState<PhotoAsset[]>(initialPhotos);
  const [locationName, setLocationName] = useState<string>(
    editingEntry?.location?.name || '上海 · 公园'
  );
  const [isEditingLocation, setIsEditingLocation] = useState<boolean>(false);
  const [selectedMood, setSelectedMood] = useState<MoodType>(
    editingEntry?.mood?.type || 'sunny'
  );

  // Dropdown pickers
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [showLedgerPicker, setShowLedgerPicker] = useState(false);

  // Publishing status
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // Date change handler
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (newDate) {
      setDiaryDate(newDate);
      setDayOfWeek(calculateDayOfWeek(newDate));
    }
  };

  // Upload local images
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files as FileList).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newPhoto: PhotoAsset = {
            id: `photo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            url: event.target.result as string,
            aspectRatio: 1,
          };
          setPhotos((prev) => [...prev, newPhoto]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  // Publish entry
  const handlePublish = () => {
    if (!body.trim() && photos.length === 0 && !title.trim()) {
      alert('请写下一些字句或放上一张照片吧');
      return;
    }

    if (isPublishing) return;

    const moodObj = MOOD_PRESETS.find((m) => m.type === selectedMood);

    let savedEntry: DiaryEntry;

    if (editingEntry) {
      savedEntry = {
        ...editingEntry,
        ledgerId: selectedLedgerId,
        diaryDate,
        dayOfWeek,
        title: title.trim() || undefined,
        body,
        photos,
        location: locationName.trim() ? { name: locationName.trim() } : undefined,
        mood: moodObj ? { type: moodObj.type, label: moodObj.label } : undefined,
        updatedAt: new Date().toISOString(),
      };
      diaryRepo.updateEntry(savedEntry);
    } else {
      savedEntry = {
        id: `entry_${Date.now()}`,
        ledgerId: selectedLedgerId,
        diaryDate,
        dayOfWeek,
        title: title.trim() || undefined,
        body,
        photos,
        location: locationName.trim() ? { name: locationName.trim() } : undefined,
        mood: moodObj ? { type: moodObj.type, label: moodObj.label } : undefined,
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      diaryRepo.addEntry(savedEntry);
    }

    setIsPublishing(true);

    setTimeout(() => {
      onSaved(savedEntry);
      onClose();
    }, 400);
  };

  const activeLedgerObj = ledgers.find((l) => l.id === selectedLedgerId) || currentLedger;
  const activeMoodObj = MOOD_PRESETS.find((m) => m.type === selectedMood) || MOOD_PRESETS[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isPublishing ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: isPublishing ? 0.35 : 0.2, ease: 'easeOut' }}
      className="fixed inset-0 z-50 bg-[rgba(35,29,24,0.38)] backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto select-none sm:select-auto"
    >
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Hidden Native Date Input */}
      <input
        ref={dateInputRef}
        type="date"
        value={diaryDate}
        onChange={handleDateChange}
        className="hidden"
      />

      {/* 
        Outer Base Card Layer (最外边一层卡片底座)
        Creating the double-layered superimposed card effect from mockup
      */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        animate={{
          opacity: 1,
          scale: isPublishing ? 0.88 : 1,
          y: isPublishing ? -200 : 0,
        }}
        exit={{ opacity: 0, scale: 0.95, y: 24 }}
        transition={{
          duration: isPublishing ? 0.4 : 0.25,
          ease: isPublishing ? [0.16, 1, 0.3, 1] : 'easeOut',
        }}
        className="relative w-full max-w-[480px] bg-[#F3EEE4] rounded-[32px] p-2.5 border border-[#E2D7C5] shadow-[0_24px_60px_-12px_rgba(35,28,20,0.32)] flex flex-col my-auto max-h-[92vh] overflow-hidden"
      >
        <PaperGrainOverlay />

        {/* 
          Inner Floating Card Layer (里层悬浮的日记纸张卡片)
          Features delicate micro-grain SVG texture
        */}
        <div className="w-full h-full rounded-[24px] bg-[#FAF8F2] border border-[#EAE1D1] shadow-inner-card-float flex flex-col relative overflow-hidden">
          <PaperGrainOverlay />
          
          {/* 1. Header Bar: 取消  写日记  [悬浮发布按钮] */}
          <header className="px-6 py-4 flex items-center justify-between border-b border-[#E7DEC8] shrink-0 bg-[#FAF5EC]/90 backdrop-blur-xs z-20">
            <button
              type="button"
              onClick={onClose}
              disabled={isPublishing}
              className="font-serif-sc text-[14.5px] text-[#736556] hover:text-[#302820] cursor-pointer disabled:opacity-30 transition-colors"
            >
              取消
            </button>

            <h1 className="font-serif-sc text-[18px] font-semibold text-[#302820] tracking-wide">
              写日记
            </h1>

            {/* Right Top Floating Publish Button with Elevated 3D Depth */}
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              className="bg-[#A24D33] hover:bg-[#96432E] active:bg-[#853825] text-[#FFF9F2] font-serif-sc text-[14px] px-4.5 py-1.5 rounded-[10px] font-medium shadow-floating-terracotta border border-[#C26248]/30 transition-all cursor-pointer disabled:opacity-50 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isPublishing ? '发布中...' : '发布'}
            </button>
          </header>

          {/* Scrollable Content Paper Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 relative z-10">
            
            {/* 2. Date & Mood Row */}
            <div className="flex items-center justify-between">
              {/* Date Picker Trigger */}
              <button
                type="button"
                onClick={() =>
                  dateInputRef.current?.showPicker
                    ? dateInputRef.current.showPicker()
                    : dateInputRef.current?.click()
                }
                className="flex items-center gap-1 font-serif-sc text-[13.5px] text-[#6B5E50] hover:text-[#302820] cursor-pointer transition-colors"
              >
                <span>{diaryDate}</span>
                <span>{dayOfWeek}</span>
                <ChevronDown size={13} className="text-[#9E9181]" />
              </button>

              {/* Mood Selector Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMoodPicker(!showMoodPicker)}
                  className="flex items-center gap-1 font-serif-sc text-[13.5px] text-[#52453B] hover:text-[#302820] cursor-pointer transition-colors"
                >
                  <Sun size={15} className="text-[#D86B27] fill-[#D86B27]/15" />
                  <span>{activeMoodObj.label}</span>
                  <ChevronDown size={13} className="text-[#9E9181]" />
                </button>

                {/* Mood Dropdown */}
                {showMoodPicker && (
                  <div className="absolute right-0 top-full mt-1 z-40 p-1.5 bg-[#FAF5EC] border border-[#E7DEC8] rounded-[10px] shadow-lg flex gap-1.5">
                    {MOOD_PRESETS.map((m) => (
                      <button
                        key={m.type}
                        type="button"
                        onClick={() => {
                          setSelectedMood(m.type);
                          setShowMoodPicker(false);
                        }}
                        className={`px-2.5 py-1 rounded-[6px] hover:bg-[#EFE7D8] cursor-pointer flex items-center gap-1 font-serif-sc text-[12.5px] transition-colors ${
                          selectedMood === m.type
                            ? 'bg-[#EFE7D8] text-[#302820] font-medium'
                            : 'text-[#6B5E50]'
                        }`}
                      >
                        <MoodStamp mood={{ type: m.type, label: m.label }} size={14} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 3. Title Input */}
            <div className="pt-1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="标题"
                className="w-full font-serif-sc text-[22px] font-bold text-[#302820] placeholder:text-[#B8AC9C] bg-transparent border-none outline-none tracking-tight py-0.5"
              />
            </div>

            {/* 4. Body Text Area */}
            <div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="写下今天的日子、心绪，或者发生的微小瞬间……"
                rows={7}
                className="w-full font-serif-sc text-[15px] text-[#302820] placeholder:text-[#B8AC9C] bg-transparent border-none outline-none resize-none leading-[1.85] tracking-normal min-h-[160px]"
              />
            </div>

            {/* 5. Photos Row */}
            <div className="pt-1 flex items-center gap-2.5 overflow-x-auto pb-1">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative shrink-0 w-[72px] h-[72px] rounded-[6px] overflow-hidden bg-white p-[3px] border border-[#E2D7C5] shadow-sm"
                >
                  <img
                    src={photo.url}
                    alt=""
                    className="w-full h-full object-cover rounded-[3px]"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#5C5043]/80 text-white flex items-center justify-center text-[10px] cursor-pointer hover:bg-[#302820] transition-colors z-10"
                    title="删除照片"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}

              {/* Add Photo Dashed Box */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 w-[72px] h-[72px] rounded-[8px] border border-dashed border-[#D2C5B2] bg-[#F2EBDE]/60 hover:bg-[#EBE2D4] flex flex-col items-center justify-center cursor-pointer transition-colors"
              >
                <span className="text-[17px] text-[#6B5E50] font-light leading-none mb-0.5">
                  ＋
                </span>
                <span className="font-serif-sc text-[11px] text-[#6B5E50]">
                  添加照片
                </span>
              </button>
            </div>

            {/* 6. Location Row */}
            <div className="pt-2 border-y border-[#E7DEC8] py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <MapPin size={15} className="text-[#5C5043]" />
                  {isEditingLocation ? (
                    <input
                      type="text"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      onBlur={() => {
                        if (!locationName.trim()) setIsEditingLocation(false);
                      }}
                      autoFocus
                      placeholder="例如: 上海 · 公园"
                      className="font-serif-sc text-[13.5px] text-[#302820] bg-transparent border-b border-dashed border-[#D2C5B2] outline-none px-1 py-0.5 w-44"
                    />
                  ) : (
                    <span
                      onClick={() => setIsEditingLocation(true)}
                      className="font-serif-sc text-[13.5px] text-[#302820] cursor-pointer"
                    >
                      {locationName || '添加位置'}
                    </span>
                  )}
                </div>

                {locationName.trim() && (
                  <button
                    type="button"
                    onClick={() => {
                      setLocationName('');
                      setIsEditingLocation(false);
                    }}
                    className="w-4 h-4 rounded-full bg-[#E3D9C9] text-[#5C5043] flex items-center justify-center cursor-pointer hover:bg-[#D4C8B6] transition-colors"
                    title="清除位置"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            </div>

            {/* 7. Ledger Selection Row */}
            <div className="pt-1 relative pb-6">
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  {activeLedgerObj.coverImage ? (
                    <img
                      src={activeLedgerObj.coverImage}
                      alt=""
                      className="w-7 h-7 rounded-[4px] object-cover border border-[#D2C5B2]"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-[4px] bg-[#F2EBDE] border border-[#D2C5B2] flex items-center justify-center text-[12px]">
                      🐕
                    </div>
                  )}
                  <div className="flex items-center gap-1 font-serif-sc text-[13.5px] text-[#302820]">
                    <span className="text-[#6B5E50]">放入账本：</span>
                    <span className="font-medium">{activeLedgerObj.name}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowLedgerPicker(!showLedgerPicker)}
                  className="flex items-center gap-0.5 font-serif-sc text-[13px] text-[#736556] hover:text-[#302820] cursor-pointer"
                >
                  <span>更换</span>
                  <ChevronRight size={13} />
                </button>
              </div>

              {/* Ledger Picker Dropdown */}
              {showLedgerPicker && (
                <div className="absolute left-0 right-0 bottom-full mb-1 z-40 bg-[#FAF5EC] border border-[#E7DEC8] rounded-[10px] shadow-lg p-1.5 space-y-1 max-h-48 overflow-y-auto">
                  {ledgers.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => {
                        setSelectedLedgerId(l.id);
                        setShowLedgerPicker(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-[6px] text-left hover:bg-[#EFE7D8] cursor-pointer transition-colors ${
                        selectedLedgerId === l.id ? 'bg-[#EFE7D8] font-medium' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {l.coverImage && (
                          <img
                            src={l.coverImage}
                            alt=""
                            className="w-5 h-5 object-cover rounded-[3px]"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <span className="font-serif-sc text-[13px] text-[#302820]">
                          {l.name}
                        </span>
                      </div>
                      <span className="font-serif-sc text-[11px] text-[#9E9181]">
                        {l.entryCount}篇
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 8. Botanical Illustration & Handwriting Script Watermark (Bottom Right) */}
          <BotanicalWatermark />
        </div>
      </motion.div>
    </motion.div>
  );
};
