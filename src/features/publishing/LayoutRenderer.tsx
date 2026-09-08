import React from 'react';
import { BookPageSlot } from '../../core/types/book';
import { PhotoPrint } from '../../design-system/photo/PhotoPrint';

interface LayoutRendererProps {
  page: BookPageSlot;
  isRightPage?: boolean;
}

export const LayoutRenderer: React.FC<LayoutRendererProps> = ({ page, isRightPage = false }) => {
  switch (page.layout) {
    case 'L08_chapter_opener':
      // L08 章节首页: 大面积留白、章节大字、优美引语
      return (
        <div className="h-full flex flex-col justify-center items-center text-center px-8 py-12">
          <div className="w-8 h-[1px] bg-[#AFA393] mb-6" />
          <h2 className="font-serif-sc text-[22px] font-bold text-[#2A221B] tracking-wider mb-4">
            {page.chapterTitle || '第一章'}
          </h2>
          {page.quote && (
            <p className="font-serif-sc text-[13px] text-[#6B5F52] leading-relaxed italic max-w-xs whitespace-pre-line">
              {page.quote}
            </p>
          )}
          <div className="w-8 h-[1px] bg-[#AFA393] mt-6" />
        </div>
      );

    case 'L01_single_hero':
      // L01 单张大图 + 精致手记
      return (
        <div className="h-full flex flex-col justify-between p-6">
          <div className="space-y-3">
            {page.diaryDate && (
              <div className="font-editorial text-[13px] font-bold text-[#8C7E70] border-b border-[#EAE3D6] pb-1">
                {page.diaryDate}
              </div>
            )}
            {page.photos[0] && (
              <div className="w-full aspect-[4/3] rounded-[2px] overflow-hidden border border-[#D5CBBF] shadow-sm">
                <img src={page.photos[0].url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            )}
            {page.title && (
              <h3 className="font-serif-sc text-[15px] font-bold text-[#2A231C]">
                {page.title}
              </h3>
            )}
            {page.bodyText && (
              <p className="font-serif-sc text-[12.5px] text-[#42382D] leading-[1.75] line-clamp-6">
                {page.bodyText}
              </p>
            )}
          </div>
        </div>
      );

    case 'L03_two_photos':
      // L03 双张照片对比/并列
      return (
        <div className="h-full flex flex-col justify-between p-6">
          <div className="space-y-3">
            {page.diaryDate && (
              <div className="font-editorial text-[13px] font-bold text-[#8C7E70] border-b border-[#EAE3D6] pb-1">
                {page.diaryDate}
              </div>
            )}
            <div className="grid grid-cols-2 gap-2.5">
              {page.photos.slice(0, 2).map((ph, i) => (
                <div key={ph.id || i} className="space-y-1">
                  <div className="aspect-[3/4] rounded-[2px] overflow-hidden border border-[#D5CBBF] shadow-sm">
                    <img src={ph.url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  {ph.caption && (
                    <div className="text-[10px] font-serif-sc text-[#8C8072] text-center truncate">
                      {ph.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {page.title && (
              <h3 className="font-serif-sc text-[14.5px] font-semibold text-[#2A231C]">
                {page.title}
              </h3>
            )}
            {page.bodyText && (
              <p className="font-serif-sc text-[12px] text-[#42382D] leading-[1.7]">
                {page.bodyText}
              </p>
            )}
          </div>
        </div>
      );

    case 'L06_photo_with_story':
      // L06 照片 + 故事散文
      return (
        <div className="h-full flex flex-col justify-between p-6">
          <div className="space-y-3">
            <div className="flex items-baseline justify-between border-b border-[#EAE3D6] pb-1">
              <span className="font-serif-sc text-[14px] font-bold text-[#2A231C]">
                {page.title || '旅途散记'}
              </span>
              <span className="font-editorial text-[12px] text-[#8C7E70]">
                {page.diaryDate}
              </span>
            </div>
            {page.photos[0] && (
              <div className="w-3/5 mx-auto aspect-[3/4] rounded-[2px] overflow-hidden border border-[#D5CBBF] shadow-sm my-2">
                <img src={page.photos[0].url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            )}
            {page.bodyText && (
              <p className="font-serif-sc text-[12px] text-[#3F352B] leading-[1.8] tracking-normal">
                {page.bodyText}
              </p>
            )}
          </div>
        </div>
      );

    case 'L09_quote_whitespace':
      // L09 经典出版物金句与极简留白
      return (
        <div className="h-full flex flex-col justify-center items-center text-center p-8">
          <span className="font-editorial text-[32px] text-[#8C8072]/40 mb-2 leading-none">“</span>
          <p className="font-serif-sc text-[14px] text-[#42382D] leading-[2] tracking-wide whitespace-pre-line font-medium max-w-[240px]">
            {page.quote || '我们在地球上的日子，每一页都算数。'}
          </p>
          <span className="font-editorial text-[32px] text-[#8C8072]/40 mt-2 leading-none">”</span>
        </div>
      );

    case 'L05_four_photos':
    case 'L10_photo_collage':
      // L05 / L10 四图方格拼贴
      return (
        <div className="h-full flex flex-col justify-between p-6">
          <div className="space-y-3">
            {page.diaryDate && (
              <div className="font-editorial text-[13px] font-bold text-[#8C7E70] border-b border-[#EAE3D6] pb-1">
                {page.diaryDate}
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              {page.photos.slice(0, 4).map((ph, i) => (
                <div key={ph.id || i} className="aspect-square rounded-[2px] overflow-hidden border border-[#D5CBBF] shadow-xs">
                  <img src={ph.url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            {page.title && (
              <h3 className="font-serif-sc text-[13.5px] font-semibold text-[#2A231C]">
                {page.title}
              </h3>
            )}
          </div>
        </div>
      );

    default:
      // Default standard page
      return (
        <div className="h-full flex flex-col justify-between p-6">
          <div className="space-y-3">
            {page.diaryDate && (
              <div className="font-editorial text-[13px] font-bold text-[#8C7E70] border-b border-[#EAE3D6] pb-1">
                {page.diaryDate}
              </div>
            )}
            {page.title && (
              <h3 className="font-serif-sc text-[15px] font-bold text-[#2A231C]">
                {page.title}
              </h3>
            )}
            {page.bodyText && (
              <p className="font-serif-sc text-[12.5px] text-[#42382D] leading-[1.8] whitespace-pre-line">
                {page.bodyText}
              </p>
            )}
          </div>
        </div>
      );
  }
};
