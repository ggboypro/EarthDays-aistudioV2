import React, { useState } from 'react';
import { BookDraft } from '../../core/types/book';
import { diaryRepo } from '../../core/storage/diaryRepository';
import { motion } from 'motion/react';

interface BookCoverCustomizerModalProps {
  book: BookDraft;
  onClose: () => void;
  onSaved: (updatedBook: BookDraft) => void;
}

const COVER_COLORS = [
  { name: '深黛绿', hex: '#2C3A2E' },
  { name: '复古赭红', hex: '#632B25' },
  { name: '暖灰麻本', hex: '#4A4139' },
  { name: '午夜靛蓝', hex: '#232F3D' },
  { name: '大地深棕', hex: '#3E2E23' },
];

const PAPER_TYPES = [
  {
    id: 'classic_warm_cream_140g',
    name: '140g 温暖象牙米白纸',
    desc: '触感温润，吸墨柔和，最适宜日常散文与复古照片',
  },
  {
    id: 'matte_art_157g',
    name: '157g 哑光特种艺术纸',
    desc: '色彩还原度极高，冲印级照片画册首选',
  },
  {
    id: 'fine_grain_offset_160g',
    name: '160g 细纹重磅胶版纸',
    desc: '纸面带微糙纹理，翻阅挺括，富有实体手感',
  },
];

export const BookCoverCustomizerModal: React.FC<BookCoverCustomizerModalProps> = ({
  book,
  onClose,
  onSaved,
}) => {
  const [title, setTitle] = useState(book.title);
  const [subtitle, setSubtitle] = useState(book.subtitle);
  const [authorName, setAuthorName] = useState(book.authorName);
  const [coverColor, setCoverColor] = useState(book.coverColor || '#2C3A2E');
  const [paperType, setPaperType] = useState(book.paperType || 'classic_warm_cream_140g');

  const handleSave = () => {
    const updated: BookDraft = {
      ...book,
      title: title.trim() || book.title,
      subtitle: subtitle.trim(),
      authorName: authorName.trim() || '地球记录者',
      coverColor,
      paperType: paperType as any,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    diaryRepo.saveBook(updated);
    onSaved(updated);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-[#FAF7F2] rounded-[12px] border border-[#D5CBBF] shadow-2xl p-6 overflow-y-auto max-h-[90vh]"
      >
        {/* Background Texture backage.png */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-50"
          style={{ backgroundImage: "url('/assets/backage.png')" }}
        />
        <div className="absolute inset-0 bg-[#FAF7F2]/75 pointer-events-none" />
        <div className="relative z-10">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D5] mb-4">
          <div>
            <h3 className="font-serif-sc text-[16.5px] font-bold text-[#2C241E]">
              装帧与出版定制
            </h3>
            <p className="font-serif-sc text-[11px] text-[#7A6F62]">
              定义实体书精装封面、书名及特种内页纸张
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#EAE2D5] text-[#554A3E] flex items-center justify-center text-[12px] font-serif-sc cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 font-serif-sc">
          {/* Cover Preview Mini */}
          <div className="flex items-center gap-4 p-3.5 bg-[#F0EAE0] rounded-[6px] border border-[#DDD3C4]">
            <div
              style={{ backgroundColor: coverColor }}
              className="w-16 h-22 rounded-[2px] shadow-book-spine border border-black/20 p-1 flex flex-col justify-between text-white shrink-0"
            >
              <div className="h-9 overflow-hidden rounded-[1px]">
                <img src={book.coverImage} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="text-[7.5px] font-serif-sc truncate font-bold text-center">
                {title || '画册标题'}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[12px] font-medium text-[#2C241E] block">
                {title || '画册标题'}
              </span>
              <span className="text-[10.5px] text-[#7A6F62] block">
                署名：{authorName} · {book.totalPageCount} 页精装
              </span>
              <span className="text-[10px] text-[#A64434] block">
                300 DPI 印刷标准校对通过
              </span>
            </div>
          </div>

          {/* Book Title */}
          <div>
            <label className="block text-[12px] text-[#7A6F62] mb-1">画册书名</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-[13.5px] text-[#2C241E] bg-[#F4EFE6] border border-[#D8CEBF] rounded-[4px] px-3 py-2 outline-none"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-[12px] text-[#7A6F62] mb-1">副标题</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full text-[13px] text-[#2C241E] bg-[#F4EFE6] border border-[#D8CEBF] rounded-[4px] px-3 py-2 outline-none"
            />
          </div>

          {/* Author Name */}
          <div>
            <label className="block text-[12px] text-[#7A6F62] mb-1">作者/记录者署名</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full text-[13px] text-[#2C241E] bg-[#F4EFE6] border border-[#D8CEBF] rounded-[4px] px-3 py-2 outline-none"
            />
          </div>

          {/* Cover Spine Color */}
          <div>
            <label className="block text-[12px] text-[#7A6F62] mb-1.5">布面封壳色泽</label>
            <div className="flex items-center gap-3">
              {COVER_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setCoverColor(c.hex)}
                  title={c.name}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer border-2 ${
                    coverColor === c.hex ? 'scale-115 border-[#2C241E] shadow-sm' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Paper Type Selection */}
          <div>
            <label className="block text-[12px] text-[#7A6F62] mb-1.5">内页特种纸质工艺</label>
            <div className="space-y-2">
              {PAPER_TYPES.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setPaperType(p.id)}
                  className={`p-2.5 rounded-[4px] border cursor-pointer transition-colors ${
                    paperType === p.id
                      ? 'bg-[#EFE8DD] border-[#8C7E70]'
                      : 'bg-[#F7F3EB] border-[#E2D8CA]'
                  }`}
                >
                  <div className="text-[12px] font-semibold text-[#2C241E]">{p.name}</div>
                  <div className="text-[10.5px] text-[#7A6F62] mt-0.5">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-2.5 rounded-[4px] bg-[#2C241E] text-white font-serif-sc text-[13.5px] font-medium hover:bg-[#43372C] transition-colors cursor-pointer shadow-sm mt-4"
          >
            保存装帧设定
          </button>
        </div>
        </div>
      </motion.div>
    </div>
  );
};
