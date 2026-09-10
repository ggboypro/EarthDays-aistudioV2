import React from 'react';
import { PhotoAsset } from '../../../core/types/photo';
import {
  PuppyPawPrint,
  DaisyDriedFlower,
  HandwrittenAutumnNote,
} from '../illustrations/DiaryIllustrations';

interface SinglePolaroidProps {
  photo: PhotoAsset;
  rotation?: string;
  tape?: boolean;
  pin?: boolean;
  handwrittenNote?: string;
  className?: string;
  size?: 'normal' | 'large' | 'compact';
}

/**
 * 实体拍立得相纸 (Polaroid Photo Material)
 * 严格还原效果图视觉：
 * - 纯白厚相纸留白边缘 (White border)
 * - 柔和自然的物理阴影 (Subtle shadow)
 * - 轻微自然倾角 (Slight rotation)
 * - 顶部半透明撕边美纹纸胶带 (Washi Tape) 或复古黄铜圆图钉 (Brass Pin)
 * - 相纸底部经典手写注记 (Handwritten editorial footnote)
 */
export const SinglePolaroid: React.FC<SinglePolaroidProps> = ({
  photo,
  rotation = 'rotate-[2deg]',
  tape = true,
  pin = false,
  handwrittenNote,
  className = '',
  size = 'normal',
}) => {
  const note = photo.caption || handwrittenNote;

  const sizeClasses = {
    compact: 'w-[125px] sm:w-[155px] p-2 pb-5 sm:pb-6',
    normal: 'w-[155px] sm:w-[210px] p-2.5 pb-6 sm:p-3 sm:pb-8',
    large: 'w-full max-w-[320px] p-3 pb-8 sm:p-3.5 sm:pb-10',
  }[size];

  return (
    <div
      className={`relative select-none transition-transform duration-300 hover:scale-[1.02] ${rotation} ${className}`}
    >
      {/* 顶部美纹纸胶带 (Washi Masking Tape) */}
      {tape && (
        <div
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 sm:w-15 h-3.5 sm:h-4 bg-[#E2D4BE]/85 border-t border-b border-[#D4C1A8]/60 shadow-[0_1px_2px_rgba(30,20,10,0.08)] backdrop-blur-[0.5px] z-20 pointer-events-none rotate-[-1.5deg]"
          style={{
            clipPath: 'polygon(3% 0%, 97% 0%, 100% 100%, 0% 100%)',
          }}
        />
      )}

      {/* 黄铜圆图钉 (Brass Pin) */}
      {pin && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center">
          <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#E2B771] via-[#C99742] to-[#8C6222] shadow-[0_2px_4px_rgba(30,20,10,0.35)] border border-[#F6DE9F]/70 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#FFF2CE]/60" />
          </div>
        </div>
      )}

      {/* 实体纯白相纸 */}
      <div
        className={`bg-white rounded-[1.5px] border border-[#E0D5C5]/90 shadow-[0_6px_20px_-3px_rgba(45,35,25,0.13),0_2px_6px_rgba(45,35,25,0.06)] flex flex-col ${sizeClasses}`}
      >
        {/* 照片冲印区域 (固定比例，防布局跳动) */}
        <div className="aspect-[4/3] w-full overflow-hidden bg-[#ECE5DA] rounded-[0.5px] border border-[#EAE3D7]">
          <img
            src={photo.url}
            alt={photo.caption || '日记相片'}
            className="w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* 相纸留白底部：手写字注记 */}
        {note ? (
          <p
            className="font-hand text-[12px] sm:text-[13px] text-[#6E6152] text-center mt-2 px-1 truncate tracking-wide"
            style={{ fontFamily: "'Ma Shan Zheng', 'Playfair Display', cursive" }}
          >
            {note}
          </p>
        ) : (
          <div className="h-2" />
        )}
      </div>
    </div>
  );
};

interface DiaryPolaroidLayoutProps {
  photos: PhotoAsset[];
  index: number;
  composition: 'right' | 'left' | 'center' | 'stacked';
  decorativeIcon?: 'paw' | 'flower' | 'none';
}

/**
 * 照片版式管理器 (支持左右结构、叠放结构、居中上下结构)
 */
export const DiaryPolaroidLayout: React.FC<DiaryPolaroidLayoutProps> = ({
  photos,
  index,
  composition,
  decorativeIcon = 'none',
}) => {
  if (!photos || photos.length === 0) return null;

  const count = photos.length;

  // 1 张照片：单张拍立得
  if (count === 1) {
    const photo = photos[0];
    const rotation = index % 2 === 0 ? 'rotate-[2deg]' : '-rotate-[2deg]';

    // 居中大相纸模式 (上下结构)
    if (composition === 'center') {
      return (
        <div className="relative w-full my-4 sm:my-5 flex justify-center">
          <SinglePolaroid
            photo={photo}
            size="large"
            rotation={rotation}
            tape={true}
          />
        </div>
      );
    }

    // 左右结构中的单相纸 (并排在左或右)
    return (
      <div className="relative shrink-0 flex items-start justify-end">
        <SinglePolaroid
          photo={photo}
          size="normal"
          rotation={rotation}
          tape={true}
        />

        {/* 动态散落插画点缀 (如效果图第 1 篇金毛爪印 🐾 或第 3 篇干花) */}
        {decorativeIcon === 'paw' && (
          <div className="absolute -bottom-2 -right-3 z-10 pointer-events-none">
            <PuppyPawPrint className="w-5 h-5 opacity-70 rotate-[15deg]" color="#A88264" />
          </div>
        )}
        {decorativeIcon === 'flower' && (
          <div className="absolute -bottom-4 -right-5 z-10 pointer-events-none">
            <DaisyDriedFlower className="w-12 h-18 opacity-85 rotate-[12deg]" />
          </div>
        )}
      </div>
    );
  }

  // 2 张照片及以上：复合叠放结构 (完美对应效果图第 2 篇咖啡与秋叶叠放)
  if (composition === 'stacked' || count >= 2) {
    const mainPhoto = photos[0];
    const subPhoto = photos[1];

    return (
      <div className="relative shrink-0 w-[180px] sm:w-[230px] h-[210px] sm:h-[260px] select-none">
        {/* 右上角红墨水手写字 (如效果图“秋天真好~♡”) */}
        <div className="absolute -top-2 -right-2 sm:right-0 z-30 pointer-events-none">
          <HandwrittenAutumnNote className="scale-75 sm:scale-90" />
        </div>

        {/* 底层主相纸 (带米黄胶带，微顺时针旋转) */}
        <div className="absolute top-1 left-0 z-10">
          <SinglePolaroid
            photo={mainPhoto}
            size="compact"
            rotation="rotate-[1deg]"
            tape={true}
            pin={false}
          />
        </div>

        {/* 顶层右下角斜插叠放相纸 (带金黄黄铜图钉，微逆时针旋转) */}
        {subPhoto && (
          <div className="absolute bottom-1 right-0 z-20">
            <SinglePolaroid
              photo={subPhoto}
              size="compact"
              rotation="-rotate-[4deg]"
              tape={false}
              pin={true}
            />
          </div>
        )}
      </div>
    );
  }

  return null;
};
