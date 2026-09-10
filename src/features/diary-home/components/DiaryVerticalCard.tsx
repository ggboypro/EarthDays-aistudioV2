import React from 'react';
import { DiaryEntry } from '../../../core/types/diary';
import { DiaryPolaroidLayout } from './DiaryPolaroidLayout';
import { HanddrawnUnderline } from '../illustrations/HanddrawnUnderlines';
import {
  PuppyPawPrint,
  DaisyDriedFlower,
  HanddrawnHeart,
  CoffeeStainRing,
  VintagePostmarkStamp,
  BotanicalBranch,
  HanddrawnSparkles,
  VintageGoldenSun,
} from '../illustrations/DiaryIllustrations';

interface DiaryVerticalCardProps {
  entry: DiaryEntry;
  index: number;
  onCardClick: () => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

// 获取温暖素雅的心情图标
const getMoodIcon = (label?: string) => {
  if (!label) return '✨';
  if (/开心|喜悦|快乐|兴奋|happy|joy/i.test(label)) return '☀️';
  if (/多云|阴|微凉|cloud/i.test(label)) return '☁️';
  if (/宁静|平静|松弛|calm/i.test(label)) return '🌿';
  if (/爱|温暖|感动|love/i.test(label)) return '🍂';
  if (/日常|随笔|思考|咖啡/i.test(label)) return '☕';
  return '✨';
};

/**
 * 纵向时间流日记单页 (EarthDays Editorial Diary Sheet)
 * 严格按照效果图重构：
 * 1. 消除 UI Card 外壳，纸张完全融于深暖做旧底色
 * 2. 动态渲染布局多样化：
 *    - Split-LeftText (左文右图：如效果图第 1 篇金毛、第 2 篇叠放咖啡秋叶)
 *    - Split-RightText (左图右文：交替节奏)
 *    - Top-Bottom (上下画卷结构：相纸居中铺展)
 *    - Pure-Text (纯文字文学排版：点缀邮戳与干花)
 * 3. 动态手绘线条下划线 (5 种形态笔刷) 随机/按 seed 分配在标题下方
 * 4. 丰富精致的插画系统 (爪印 🐾、雏菊干花、水渍圈、邮戳、双勾爱心等) 动态散落点缀
 * 5. 30~34px Editorial Serif 日期视觉锚点，右上角低对比度序号 01/02/03
 * 6. 极小朱砂色书签 + 字数落款
 */
export const DiaryVerticalCard: React.FC<DiaryVerticalCardProps> = React.memo(
  ({ entry, index, onCardClick, onToggleFavorite }) => {
    const photos = entry.photos || [];
    const photoCount = photos.length;
    const rawBody = entry.body?.trim() || '';
    const wordCount = rawBody.length;

    // 正文自然流动 (长文保留前 240 字展开 5~8 行)
    const isLongText = wordCount > 240;
    const bodyPreview = isLongText ? rawBody.slice(0, 240).trim() + '...' : rawBody;

    // 格式化低对比度序号 (01, 02, 03)
    const formattedIndex = String(index + 1).padStart(2, '0');

    // 动态布局结构决定 (丰富多样化排版：左右结构、上下结构、纯文字结构)
    let layoutVariant: 'split-left' | 'split-right' | 'top-bottom' | 'pure-text' = 'split-left';

    if (photoCount === 0) {
      layoutVariant = 'pure-text';
    } else if (photoCount >= 2) {
      // 多照片固定使用左右复合叠放结构 (如效果图第 2 篇)
      layoutVariant = 'split-left';
    } else {
      // 单照片根据索引在左右结构与上下结构间动态变化
      const mod = index % 4;
      if (mod === 0) layoutVariant = 'split-left'; // 经典左文右图
      else if (mod === 1) layoutVariant = 'top-bottom'; // 上下结构大相纸
      else if (mod === 2) layoutVariant = 'split-right'; // 左图右文镜像
      else layoutVariant = 'split-left';
    }

    // 插画系统：根据内容与心情动态决定点缀物
    const isPetRelated = /狗|猫|元宝|宠物|momo|puppy|dog|cat/i.test(
      (entry.title || '') + rawBody
    );
    const isAutumnOrLeaf = /秋|凉|枫|梧桐|落叶|树/i.test(
      (entry.title || '') + rawBody
    );
    const isMountainOrNature = /山|夏|徒步|星|自然|海/i.test(
      (entry.title || '') + rawBody
    );
    const isCoffeeOrCafe = /咖啡|拿铁|店|下午/i.test(
      (entry.title || '') + rawBody
    );

    return (
      <article
        id={`diary-vertical-card-${entry.id}`}
        data-entry-id={entry.id}
        onClick={onCardClick}
        className="group relative w-full cursor-pointer select-auto transition-opacity duration-150 active:opacity-95 pt-8 pb-10 sm:pt-10 sm:pb-12"
      >
        {/* ========================================================
            1. 顶部日期主锚点 (30~34px Editorial Serif) 与右上角序号
           ======================================================== */}
        <header className="flex items-baseline justify-between mb-1.5">
          <div className="flex items-baseline gap-2.5 sm:gap-3.5 flex-wrap">
            <time className="font-editorial text-[28px] sm:text-[34px] font-bold text-[#282019] tracking-tight leading-none">
              {entry.diaryDate}
            </time>
            <span className="font-serif-sc text-[13.5px] sm:text-[15px] text-[#6E6152] font-normal tracking-wide">
              {entry.dayOfWeek}
            </span>
          </div>

          {/* 右上角低对比度序号 01/02/03 */}
          <span className="font-editorial text-[17px] sm:text-[20px] text-[#C2B7A8] tracking-widest select-none pr-0.5">
            {formattedIndex}
          </span>
        </header>

        {/* Location & Mood 紧跟在日期下方 */}
        {(entry.location || entry.mood) && (
          <div className="flex items-center gap-2.5 sm:gap-3 text-[12.5px] sm:text-[13.5px] text-[#7A6D5E] font-serif-sc mb-3 tracking-wide">
            {entry.location && (
              <span className="flex items-center gap-1 text-[#746759]">
                <span className="text-[#A24838]">📍</span> {entry.location.name}
              </span>
            )}
            {entry.mood && (
              <span className="flex items-center gap-1.5 text-[#746759]">
                <span>{getMoodIcon(entry.mood.label)}</span>
                <span>{entry.mood.label}</span>
              </span>
            )}
          </div>
        )}

        {/* ========================================================
            2. 动态布局渲染 (左右结构、上下结构、纯文字结构)
           ======================================================== */}

        {/* 布局 1: 经典左右结构 (左文右图，完美对应效果图第 1、2 篇) */}
        {layoutVariant === 'split-left' && (
          <div className="w-full flex flex-row items-start justify-between gap-3 sm:gap-6 mt-1">
            {/* 左侧文字栏 (占 54%~58%) */}
            <div className="w-[54%] sm:w-[58%] shrink-0 pr-1 sm:pr-2">
              {entry.title && (
                <div className="mb-2">
                  <h2 className="font-serif-sc font-bold text-[24px] sm:text-[28px] text-[#221912] leading-snug tracking-tight">
                    {entry.title}
                  </h2>
                  {/* 动态手绘下划线笔刷 */}
                  <HanddrawnUnderline seed={entry.id || entry.title} />
                </div>
              )}

              {rawBody && (
                <p className="font-serif-sc text-[16px] sm:text-[19px] text-[#3A3026] leading-[1.85] sm:leading-[1.9] whitespace-pre-wrap font-normal tracking-[0.01em] mt-2">
                  {bodyPreview}
                </p>
              )}
            </div>

            {/* 右侧拍立得相纸栏 (占 42%~46%) */}
            <div className="w-[44%] sm:w-[40%] shrink-0 flex justify-end pt-1">
              <DiaryPolaroidLayout
                photos={photos}
                index={index}
                composition={photoCount >= 2 ? 'stacked' : 'right'}
                decorativeIcon={isPetRelated ? 'paw' : isMountainOrNature ? 'flower' : 'none'}
              />
            </div>
          </div>
        )}

        {/* 布局 2: 左右镜像结构 (左图右文) */}
        {layoutVariant === 'split-right' && (
          <div className="w-full flex flex-row items-start justify-between gap-3 sm:gap-6 mt-1">
            {/* 左侧拍立得相纸 */}
            <div className="w-[44%] sm:w-[40%] shrink-0 flex justify-start pt-1">
              <DiaryPolaroidLayout
                photos={photos}
                index={index}
                composition="right"
                decorativeIcon={isMountainOrNature ? 'flower' : 'none'}
              />
            </div>

            {/* 右侧文字栏 */}
            <div className="w-[54%] sm:w-[58%] shrink-0 pl-1 sm:pl-2">
              {entry.title && (
                <div className="mb-2">
                  <h2 className="font-serif-sc font-bold text-[24px] sm:text-[28px] text-[#221912] leading-snug tracking-tight">
                    {entry.title}
                  </h2>
                  <HanddrawnUnderline seed={entry.id || entry.title} />
                </div>
              )}

              {rawBody && (
                <p className="font-serif-sc text-[16px] sm:text-[19px] text-[#3A3026] leading-[1.85] sm:leading-[1.9] whitespace-pre-wrap font-normal tracking-[0.01em] mt-2">
                  {bodyPreview}
                </p>
              )}
            </div>
          </div>
        )}

        {/* 布局 3: 上下画卷结构 (相纸居中横跨铺展) */}
        {layoutVariant === 'top-bottom' && (
          <div className="w-full mt-1">
            {entry.title && (
              <div className="mb-2">
                <h2 className="font-serif-sc font-bold text-[25px] sm:text-[28px] text-[#221912] leading-snug tracking-tight">
                  {entry.title}
                </h2>
                <HanddrawnUnderline seed={entry.id || entry.title} />
              </div>
            )}

            {/* 居中大相纸 */}
            <DiaryPolaroidLayout
              photos={photos}
              index={index}
              composition="center"
            />

            {rawBody && (
              <p className="font-serif-sc text-[16px] sm:text-[19px] text-[#3A3026] leading-[1.85] sm:leading-[1.9] whitespace-pre-wrap font-normal tracking-[0.01em] mt-3 max-w-[620px]">
                {bodyPreview}
              </p>
            )}
          </div>
        )}

        {/* 布局 4: 纯文字文学结构 (点缀干花与复古邮戳) */}
        {layoutVariant === 'pure-text' && (
          <div className="relative w-full mt-1">
            {entry.title && (
              <div className="mb-2.5">
                <h2 className="font-serif-sc font-bold text-[26px] sm:text-[28px] text-[#221912] leading-snug tracking-tight">
                  {entry.title}
                </h2>
                <HanddrawnUnderline seed={entry.id || entry.title} width="w-24 sm:w-28" />
              </div>
            )}

            {rawBody && (
              <p className="font-serif-sc text-[17px] sm:text-[20px] text-[#3A3026] leading-[1.9] whitespace-pre-wrap font-normal tracking-[0.01em] mt-3 max-w-[640px]">
                {bodyPreview}
              </p>
            )}

            {/* 右下角散落复古插画 (如咖啡圈或日记邮戳) */}
            <div className="absolute right-1 bottom-0 pointer-events-none opacity-60">
              {isCoffeeOrCafe ? (
                <CoffeeStainRing className="w-16 h-16" />
              ) : (
                <VintagePostmarkStamp
                  date={entry.diaryDate.slice(5) || 'MEMO'}
                  className="w-16 h-16"
                />
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            3. 底部信息行：极小朱砂色书签 + 字数 (杜绝 READ MORE)
           ======================================================== */}
        <footer className="flex items-center gap-2 mt-4 sm:mt-5 pt-1 text-[13px] text-[#8C7E70] font-serif-sc select-none">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(entry.id, e);
            }}
            title={entry.isFavorite ? '已收录书签' : '轻触标记书签'}
            className="p-1 -ml-1 flex items-center justify-center transition-transform active:scale-90 hover:opacity-85 cursor-pointer focus:outline-none"
          >
            <svg
              width="13"
              height="15"
              viewBox="0 0 14 16"
              fill={entry.isFavorite ? '#9E3628' : '#A24838'}
              className="transition-colors"
            >
              <path
                d="M1 1.5C1 1.22386 1.22386 1 1.5 1H12.5C12.7761 1 13 1.22386 13 1.5V14.5C13 14.8967 12.548 15.1245 12.228 14.8878L7 11.0099L1.77202 14.8878C1.45199 15.1245 1 14.8967 1 14.5V1.5Z"
                stroke="#8A2E20"
                strokeWidth="0.8"
              />
            </svg>
          </button>

          <span>{wordCount > 0 ? `${wordCount} 字` : '生活小记'}</span>

          {photoCount > 0 && (
            <span className="text-[#BDB1A2] text-[11.5px]">
              · {photoCount} 张相片
            </span>
          )}
        </footer>

        {/* 纸页之间的微细分割线 (上下 48~64px 呼吸间距) */}
        <div className="w-full h-[1px] bg-[#DDD2C2]/85 mt-9 sm:mt-11 group-last:hidden" />
      </article>
    );
  }
);

DiaryVerticalCard.displayName = 'DiaryVerticalCard';
