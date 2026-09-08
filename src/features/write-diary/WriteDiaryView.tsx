// src/features/write-diary/WriteDiaryView.tsx
// EarthDays Write & Publish Flow: Continuous Paper Card Flight & Spatial Drop Architecture

import React, { useState } from 'react';
import { Ledger } from '../../core/types/ledger';
import { DiaryEntry, MoodType } from '../../core/types/diary';
import { PhotoAsset } from '../../core/types/photo';
import { diaryRepo } from '../../core/storage/diaryRepository';
import { PhotoPrint } from '../../design-system/photo/PhotoPrint';
import { MOOD_PRESETS, MoodStamp } from '../../design-system/elements/MoodStamp';
import { LocationMarkIcon, WritePenIcon } from '../../design-system/icons/EarthDiaryIcons';
import { useTheme } from '../../core/theme/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Sparkles } from 'lucide-react';

interface WriteDiaryViewProps {
  initialLedger?: Ledger;
  editingEntry?: DiaryEntry;
  onClose: () => void;
  onSaved: (entry: DiaryEntry) => void;
}

export const WriteDiaryView: React.FC<WriteDiaryViewProps> = ({
  initialLedger,
  editingEntry,
  onClose,
  onSaved,
}) => {
  const { theme } = useTheme();
  const ledgers = diaryRepo.getLedgers();
  const currentLedger = initialLedger || diaryRepo.getCurrentLedger();

  const today = new Date();
  const dateStr = editingEntry ? editingEntry.diaryDate : today.toISOString().split('T')[0];
  const weekdayStr = editingEntry
    ? editingEntry.dayOfWeek
    : ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][today.getDay()];

  const [selectedLedgerId, setSelectedLedgerId] = useState<string>(
    editingEntry ? editingEntry.ledgerId : currentLedger.id
  );
  const [diaryDate, setDiaryDate] = useState<string>(dateStr);
  const [dayOfWeek, setDayOfWeek] = useState<string>(weekdayStr);
  const [title, setTitle] = useState<string>(editingEntry?.title || '');
  const [body, setBody] = useState<string>(editingEntry?.body || '');
  const [photos, setPhotos] = useState<PhotoAsset[]>(editingEntry?.photos || []);
  const [locationName, setLocationName] = useState<string>(
    editingEntry?.location?.name || '上海 · 公园'
  );
  const [selectedMood, setSelectedMood] = useState<MoodType>(
    editingEntry?.mood?.type || 'sunny'
  );

  // UI Modal states
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [showLedgerPicker, setShowLedgerPicker] = useState(false);
  const [aiRefining, setAiRefining] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  // Flight & Publishing animation state
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // Quick sample photo presets for demonstration / simulated picker
  const SAMPLE_PHOTOS = [
    'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=700&auto=format&fit=crop&q=80', // cherry blossom
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=700&auto=format&fit=crop&q=80', // cute cat
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=700&auto=format&fit=crop&q=80', // Fuji
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&auto=format&fit=crop&q=80', // Sunset
    'https://images.unsplash.com/photo-1552053831-71594a27632d?w=700&auto=format&fit=crop&q=80', // Dog
  ];

  const handleAddSamplePhoto = (url: string) => {
    const newPhoto: PhotoAsset = {
      id: `photo_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      url,
      aspectRatio: 1,
      rotationDeg: Math.random() * 2.4 - 1.2,
    };
    setPhotos([...photos, newPhoto]);
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
  };

  // Red Pen AI Refine simulation
  const handleAiRefine = () => {
    if (!body.trim()) return;
    setAiRefining(true);
    setTimeout(() => {
      const refined = `${body.trim()}\n\n微风拂过发梢，阳光温和地洒落在石阶上。把这一刻的温暖仔细收拢在字里行间，平凡的日子，也是独一无二的故事。`;
      setAiSuggestion(refined);
      setAiRefining(false);
    }, 800);
  };

  const handleApplyAiSuggestion = () => {
    if (aiSuggestion) {
      setBody(aiSuggestion);
      setAiSuggestion(null);
    }
  };

  // Publish with continuous floating card choreography
  const handlePublish = () => {
    if (!body.trim() && photos.length === 0) {
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

    // Trigger physical card flight animation
    setIsPublishing(true);

    // After card ascends smoothly towards the top zone, close modal and notify parent to slot it in
    setTimeout(() => {
      onSaved(savedEntry);
      onClose();
    }, 420);
  };

  const activeLedgerObj = ledgers.find((l) => l.id === selectedLedgerId) || currentLedger;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isPublishing ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: isPublishing ? 0.38 : 0.22, ease: 'easeOut' }}
      className="fixed inset-0 z-50 bg-[#2C2621]/45 backdrop-blur-xs flex flex-col justify-end sm:justify-center p-0 sm:p-4 overflow-hidden"
    >
      {/* ========================================================================= */}
      {/* 1. WRITING DESK MODAL / FLYING PAPER SHEET */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{
          opacity: 1,
          y: isPublishing ? -320 : 0,
          scale: isPublishing ? 0.88 : 1,
          rotate: isPublishing ? -2.2 : 0,
          boxShadow: isPublishing
            ? '0 36px 70px -12px rgba(28, 18, 10, 0.48), 0 12px 24px -4px rgba(28, 18, 10, 0.22)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
        exit={{ opacity: 0, y: 40 }}
        transition={{
          duration: isPublishing ? 0.42 : 0.28,
          ease: isPublishing ? [0.22, 1, 0.36, 1] : 'easeOut',
        }}
        className="relative w-full max-w-lg mx-auto bg-[#FDFBF7] rounded-t-[16px] sm:rounded-[8px] border border-[#E0D7C8] flex flex-col max-h-[92vh] overflow-hidden select-none"
      >
        {/* Floating Flight Aura during publish */}
        {isPublishing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-tr from-[#FAF7F2] via-white/80 to-[#F5ECE0] z-20 pointer-events-none flex flex-col items-center justify-center p-6 text-center border-2 border-[#B84337]/30 rounded-[8px]"
          >
            <div className="w-10 h-10 rounded-full bg-[#A34335]/10 text-[#A34335] flex items-center justify-center mb-2 animate-bounce">
              <Sparkles size={20} />
            </div>
            <span className="font-serif-sc text-sm font-semibold text-[#2C241E] tracking-wider">
              正在收拢字句 · 收入《{activeLedgerObj.name}》
            </span>
            <span className="font-serif-sc text-xs text-[#7A6D5E] mt-1">
              卡片正升入时光画廊...
            </span>
          </motion.div>
        )}

        {/* 顶部导航: [取消]  写日记  [发布] */}
        <header className="flex items-center justify-between px-5 py-3.5 border-b border-[#EDE6DA] bg-[#FAF7F2]">
          <button
            type="button"
            onClick={onClose}
            disabled={isPublishing}
            className="font-serif-sc text-[14px] text-[#7A7063] hover:text-[#332A22] cursor-pointer disabled:opacity-30"
          >
            取消
          </button>

          <h1 className="font-serif-sc text-[16px] font-semibold text-[#2C241E] tracking-wider">
            {editingEntry ? '编辑日记' : '写日记'}
          </h1>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            style={{ backgroundColor: theme.accent }}
            className="px-3.5 py-1.5 rounded-[4px] font-serif-sc text-[13px] font-medium text-white shadow-sm cursor-pointer hover:opacity-90 active:scale-98 transition-all disabled:opacity-50 flex items-center gap-1"
          >
            {isPublishing ? (
              <>
                <Check size={13} strokeWidth={2.5} />
                <span>发布中...</span>
              </>
            ) : (
              <span>发布</span>
            )}
          </button>
        </header>

        {/* 真实信笺书写区域 */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 paper-grain">
          {/* 1. 日期与心情标头 */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EAE2D5]">
            <div className="flex items-center gap-2">
              <span className="font-editorial text-[14px] text-[#756A5D]">
                🕒 {diaryDate}
              </span>
              <span className="font-serif-sc text-[12px] text-[#918679]">
                {dayOfWeek}
              </span>
            </div>

            {/* 心情切换小印章 */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMoodPicker(!showMoodPicker)}
                className="flex items-center gap-1.5 px-2 py-1 bg-[#FAF7F2] border border-[#E0D7C9] rounded-[4px] cursor-pointer"
              >
                <MoodStamp
                  mood={{
                    type: selectedMood,
                    label:
                      MOOD_PRESETS.find((m) => m.type === selectedMood)?.label || '',
                  }}
                />
                <span className="text-[10px] text-[#9A8F82]">▾</span>
              </button>

              {/* Mood picker dropdown */}
              {showMoodPicker && (
                <div className="absolute right-0 top-full mt-1.5 z-30 p-2 bg-[#FAF7F2] border border-[#DDD3C4] rounded-[6px] shadow-lg flex gap-2">
                  {MOOD_PRESETS.map((m) => (
                    <button
                      key={m.type}
                      type="button"
                      onClick={() => {
                        setSelectedMood(m.type);
                        setShowMoodPicker(false);
                      }}
                      className={`p-1.5 rounded-[4px] hover:bg-[#EAE2D5] cursor-pointer flex flex-col items-center gap-0.5 ${
                        selectedMood === m.type
                          ? 'bg-[#E5DDCE] ring-1 ring-[#9A8A78]'
                          : ''
                      }`}
                    >
                      <MoodStamp mood={m} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 2. 标题输入 */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="记下一个标题（可选）"
            className="w-full font-serif-sc text-[17px] sm:text-[19px] font-semibold text-[#29221C] placeholder:text-[#AAA094] bg-transparent border-none outline-none pb-2 mb-2 tracking-tight"
          />

          {/* 3. 正文输入 */}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="写下今天的日子、心绪，或者发生的微小瞬间..."
            rows={7}
            className="w-full font-serif-sc text-[15px] sm:text-[16px] text-[#3D352D] placeholder:text-[#A69C8F] bg-transparent border-none outline-none resize-none leading-[1.75] tracking-normal mb-4"
          />

          {/* 4. 冲印照片展示与添加栏 */}
          <div className="mb-4">
            <div className="flex flex-wrap items-center gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <PhotoPrint photo={photo} size="md" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#3B2F2F] text-white rounded-full text-[11px] flex items-center justify-center shadow-md cursor-pointer hover:bg-red-700"
                    title="移除照片"
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* 添加照片槽位 */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 border-2 border-dashed border-[#D5CBBF] rounded-[3px] bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] flex flex-col items-center justify-center gap-1 text-[#8B7F72] hover:text-[#3B3026] cursor-pointer transition-all">
                <span className="text-[20px] font-light leading-none">+</span>
                <span className="font-serif-sc text-[11px]">放一张照片</span>
              </div>
            </div>

            {/* Quick sample photo selector */}
            <div className="mt-2.5 flex items-center gap-2 overflow-x-auto py-1">
              <span className="font-serif-sc text-[11px] text-[#9A8F82] shrink-0">
                选择样本相片:
              </span>
              {SAMPLE_PHOTOS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAddSamplePhoto(url)}
                  className="w-8 h-8 rounded-[2px] overflow-hidden border border-[#D5CBBF] hover:scale-105 transition-transform shrink-0"
                >
                  <img
                    src={url}
                    alt="sample"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 5. 红笔小批注 AI 润色 */}
          <div className="mb-4 pt-2 border-t border-[#EDE6DA]">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleAiRefine}
                disabled={aiRefining || !body.trim()}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#FAF2EF] border border-[#ECCDC6] text-[#A64434] font-serif-sc text-[12px] hover:bg-[#FBEAE6] transition-colors cursor-pointer disabled:opacity-50"
              >
                <WritePenIcon size={14} color="#A64434" />
                <span>{aiRefining ? '正在轻声整理...' : '✍️ 帮我润色'}</span>
              </button>

              <span className="font-serif-sc text-[11px] text-[#A69C90]">
                像一支红笔的温柔批注
              </span>
            </div>

            {/* AI Suggestion preview */}
            <AnimatePresence>
              {aiSuggestion && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2.5 p-3 rounded-[4px] bg-[#FFF9F6] border border-[#E9C3BC] text-[#3D302A]"
                >
                  <div className="font-serif-sc text-[11px] text-[#A64434] font-medium mb-1 flex items-center justify-between">
                    <span>润色建议预览</span>
                    <button
                      type="button"
                      onClick={() => setAiSuggestion(null)}
                      className="text-[11px] text-[#9C8F85] hover:text-black cursor-pointer"
                    >
                      关闭
                    </button>
                  </div>
                  <p className="font-serif-sc text-[13.5px] text-[#4A3E38] leading-[1.65] whitespace-pre-line mb-2">
                    {aiSuggestion}
                  </p>
                  <button
                    type="button"
                    onClick={handleApplyAiSuggestion}
                    className="px-2.5 py-1 bg-[#A64434] text-white rounded-[3px] font-serif-sc text-[11.5px] hover:opacity-90 cursor-pointer"
                  >
                    写入正文
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 6. 页脚元数据: 手写地点 & 放入账本 */}
          <div className="pt-3 border-t border-[#EAE2D5] space-y-2.5">
            {/* Location selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <LocationMarkIcon size={14} color="#85786B" />
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="写下手写地点 (例如: 上海 · 公园)"
                  className="font-serif-sc text-[12.5px] text-[#4A4035] bg-transparent border-b border-dashed border-[#C5B9AB] outline-none px-1 py-0.5 w-44"
                />
              </div>
            </div>

            {/* Target Ledger Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLedgerPicker(!showLedgerPicker)}
                className="w-full flex items-center justify-between p-2 rounded-[4px] bg-[#FAF7F2] border border-[#E2D8CA] hover:bg-[#F3EDE3] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-5 rounded-[1px] overflow-hidden border border-black/10 shrink-0">
                    <img
                      src={activeLedgerObj.coverImage}
                      alt=""
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="font-serif-sc text-[12px] text-[#867B6E]">放入账本:</span>
                  <span className="font-serif-sc text-[13px] font-medium text-[#2C241E]">
                    {activeLedgerObj.name}
                  </span>
                </div>
                <span className="text-[#9A8F82] text-[12px]">更换 ▾</span>
              </button>

              {/* Ledger Dropdown list */}
              {showLedgerPicker && (
                <div className="absolute left-0 right-0 bottom-full mb-1 z-30 bg-[#FAF7F2] border border-[#DDD3C4] rounded-[6px] shadow-xl p-1.5 space-y-1">
                  {ledgers.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => {
                        setSelectedLedgerId(l.id);
                        setShowLedgerPicker(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-[4px] text-left hover:bg-[#EAE2D5] cursor-pointer ${
                        selectedLedgerId === l.id ? 'bg-[#E6DDCD] font-medium' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={l.coverImage}
                          alt=""
                          className="w-5 h-6 object-cover rounded-[1px]"
                          referrerPolicy="no-referrer"
                        />
                        <span className="font-serif-sc text-[13px] text-[#2C241E]">
                          {l.name}
                        </span>
                      </div>
                      <span className="font-serif-sc text-[11px] text-[#8C8072]">
                        {l.entryCount}篇
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
