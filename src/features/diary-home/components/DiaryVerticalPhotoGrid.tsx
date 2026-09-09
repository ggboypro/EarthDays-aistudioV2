import React from 'react';
import { PhotoAsset } from '../../../core/types/photo';

interface DiaryVerticalPhotoGridProps {
  photos: PhotoAsset[];
  title?: string;
}

/**
 * 纵向信息流照片排版 (Editorial Photo Material)
 * 遵循真实相纸质感：
 * - 纯白相纸边缘留白、1px 极细微边、柔和素雅阴影
 * - 单张照片：宽幅展示 (Editorial Image)
 * - 两张照片：双列排布 (2-Column)
 * - 三张及以上：双列网格 (2-Column Grid)
 * - 严格固定 aspect-ratio，杜绝异步加载引起的布局跳动
 */
export const DiaryVerticalPhotoGrid: React.FC<DiaryVerticalPhotoGridProps> = ({
  photos,
  title,
}) => {
  if (!photos || photos.length === 0) return null;

  const count = photos.length;

  // 1 张照片：大画幅 Editorial Image
  if (count === 1) {
    const photo = photos[0];
    return (
      <div className="w-full my-5">
        <figure className="bg-white p-2 pb-3.5 rounded-[1px] border border-[#E3DACB] shadow-[0_4px_14px_rgba(45,35,25,0.07)] transition-transform duration-200 hover:shadow-[0_6px_20px_rgba(45,35,25,0.1)]">
          <div className="aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-[#ECE6DC]">
            <img
              src={photo.url}
              alt={photo.caption || title || '日记照片'}
              className="w-full h-full object-cover select-none"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
          {photo.caption && (
            <figcaption className="font-serif-sc text-[11.5px] text-[#7A6F62] text-center mt-2.5 px-2 truncate italic tracking-wide">
              {photo.caption}
            </figcaption>
          )}
        </figure>
      </div>
    );
  }

  // 2 张照片：双列并排 (2-Column)
  if (count === 2) {
    return (
      <div className="w-full my-5 grid grid-cols-2 gap-3 sm:gap-4">
        {photos.map((photo, i) => (
          <figure
            key={photo.id || i}
            className="bg-white p-1.5 pb-3 rounded-[1px] border border-[#E3DACB] shadow-[0_3px_10px_rgba(45,35,25,0.06)] flex flex-col"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-[#ECE6DC]">
              <img
                src={photo.url}
                alt={photo.caption || ''}
                className="w-full h-full object-cover select-none"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            {photo.caption && (
              <figcaption className="font-serif-sc text-[10.5px] text-[#7A6F62] truncate mt-2 text-center italic tracking-wide">
                {photo.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    );
  }

  // 3 张及以上：2-Column Grid 双列网格布局
  return (
    <div className="w-full my-5 grid grid-cols-2 gap-3 sm:gap-4">
      {photos.map((photo, i) => (
        <figure
          key={photo.id || i}
          className="bg-white p-1.5 pb-2.5 rounded-[1px] border border-[#E3DACB] shadow-[0_3px_10px_rgba(45,35,25,0.06)] flex flex-col"
        >
          <div className="aspect-[4/3] sm:aspect-square w-full overflow-hidden bg-[#ECE6DC]">
            <img
              src={photo.url}
              alt={photo.caption || ''}
              className="w-full h-full object-cover select-none"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
          {photo.caption && (
            <figcaption className="font-serif-sc text-[10px] text-[#7A6F62] truncate mt-1.5 text-center italic tracking-wide">
              {photo.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
};
