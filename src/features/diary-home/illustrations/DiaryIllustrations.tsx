import React from 'react';

/**
 * 1. 焦糖金黄秋天枯落叶标本 (Autumn Dried Leaf)
 * 对应效果图左侧边缘探出的逼真落叶：细腻的叶脉、微卷曲边缘与温暖焦糖渐变
 */
export const AutumnDriedLeaf: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <svg
    viewBox="0 0 100 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-[2px_6px_8px_rgba(40,25,15,0.18)] ${className}`}
  >
    {/* 叶片主体 */}
    <path
      d="M50 168C48 140 38 120 22 95C6 70 12 40 35 15C42 7 54 2 57 2C60 2 70 12 78 28C88 48 92 75 80 105C70 130 54 150 50 168Z"
      fill="url(#autumn_leaf_grad)"
    />
    {/* 叶脉主干 */}
    <path
      d="M50 170C50 150 48 110 52 70C55 40 57 2 57 2"
      stroke="#724620"
      strokeWidth="2.2"
      strokeLinecap="round"
      opacity="0.85"
    />
    {/* 侧向细叶脉 */}
    <path
      d="M51 130C38 118 28 108 24 100M51 105C36 92 24 80 18 72M52 80C40 68 28 55 24 45M53 55C44 45 35 35 32 28"
      stroke="#805128"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.65"
    />
    <path
      d="M51 135C62 122 72 112 76 106M51 110C64 96 74 84 80 75M52 85C65 72 75 60 78 50M54 60C62 50 70 38 72 30"
      stroke="#805128"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.65"
    />
    {/* 卷曲叶边缘微反光 */}
    <path
      d="M22 95C12 75 16 50 35 15"
      stroke="#C88E4B"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.45"
    />
    <defs>
      <linearGradient id="autumn_leaf_grad" x1="15" y1="20" x2="85" y2="160" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#C48842" />
        <stop offset="35%" stopColor="#A86B30" />
        <stop offset="70%" stopColor="#8C5124" />
        <stop offset="100%" stopColor="#683915" />
      </linearGradient>
    </defs>
  </svg>
);

/**
 * 2. 素雅满天星/雏菊干花花束枝丫 (Daisy Dried Flower)
 * 对应效果图第 3 篇右侧散落的纯美干花植物
 */
export const DaisyDriedFlower: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <svg
    viewBox="0 0 110 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-[1px_3px_5px_rgba(30,20,10,0.12)] ${className}`}
  >
    {/* 枯褐色细主枝 */}
    <path
      d="M60 155C58 120 54 85 45 50C42 40 38 30 35 20"
      stroke="#7A6854"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M50 100C60 85 75 70 82 55"
      stroke="#887662"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M44 65C30 52 20 40 18 28"
      stroke="#887662"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M58 80C68 72 80 62 86 48"
      stroke="#887662"
      strokeWidth="1.3"
      strokeLinecap="round"
    />

    {/* 花朵 1 (顶部白色小雏菊) */}
    <g transform="translate(34, 18)">
      <circle cx="0" cy="-6" r="3" fill="#FAF6EE" />
      <circle cx="6" cy="-2" r="3" fill="#FAF6EE" />
      <circle cx="4" cy="5" r="3" fill="#FAF6EE" />
      <circle cx="-4" cy="5" r="3" fill="#FAF6EE" />
      <circle cx="-6" cy="-2" r="3" fill="#FAF6EE" />
      <circle cx="0" cy="0" r="3.2" fill="#D4A745" />
    </g>

    {/* 花朵 2 (右上侧) */}
    <g transform="translate(82, 52)">
      <circle cx="0" cy="-5" r="2.8" fill="#FAF6EE" />
      <circle cx="5" cy="-1.5" r="2.8" fill="#FAF6EE" />
      <circle cx="3" cy="4.5" r="2.8" fill="#FAF6EE" />
      <circle cx="-3.5" cy="4.5" r="2.8" fill="#FAF6EE" />
      <circle cx="-5" cy="-1.5" r="2.8" fill="#FAF6EE" />
      <circle cx="0" cy="0" r="2.8" fill="#C99839" />
    </g>

    {/* 花朵 3 (左侧小朵) */}
    <g transform="translate(18, 26)">
      <circle cx="0" cy="-4" r="2.2" fill="#F4EEE2" />
      <circle cx="4" cy="-1" r="2.2" fill="#F4EEE2" />
      <circle cx="2.5" cy="3.5" r="2.2" fill="#F4EEE2" />
      <circle cx="-2.5" cy="3.5" r="2.2" fill="#F4EEE2" />
      <circle cx="-4" cy="-1" r="2.2" fill="#F4EEE2" />
      <circle cx="0" cy="0" r="2.2" fill="#D4A745" />
    </g>

    {/* 干花细叶片 */}
    <path d="M47 115C42 110 38 108 34 112C38 116 43 118 47 115Z" fill="#91816C" />
    <path d="M53 92C58 87 63 86 65 90C61 93 57 95 53 92Z" fill="#91816C" />
  </svg>
);

/**
 * 3. 温暖小猫/小狗爪印 (Puppy Paw Print)
 * 对应效果图第 1 篇金毛相片旁边的淡褐爪印 🐾
 */
export const PuppyPawPrint: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#A37E60',
}) => (
  <svg
    viewBox="0 0 50 46"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className}`}
  >
    {/* 主掌垫 */}
    <path
      d="M25 18C18 18 13 25 14 34C15 40 20 44 25 44C30 44 35 40 36 34C37 25 32 18 25 18Z"
      fill={color}
      opacity="0.65"
    />
    {/* 四个小趾垫 */}
    <ellipse cx="11" cy="15" rx="4.5" ry="6" transform="rotate(-25 11 15)" fill={color} opacity="0.65" />
    <ellipse cx="20" cy="8" rx="4.5" ry="6.5" transform="rotate(-8 20 8)" fill={color} opacity="0.65" />
    <ellipse cx="30" cy="8" rx="4.5" ry="6.5" transform="rotate(8 30 8)" fill={color} opacity="0.65" />
    <ellipse cx="39" cy="15" rx="4.5" ry="6" transform="rotate(25 39 15)" fill={color} opacity="0.65" />
  </svg>
);

/**
 * 4. 红墨水手写字注与爱心涂鸦 “秋天真好~♡”
 * 对应效果图第 2 篇相片右上角的手写红字
 */
export const HandwrittenAutumnNote: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <div
    className={`select-none flex flex-col items-center pointer-events-none ${className}`}
    style={{ fontFamily: "'Ma Shan Zheng', cursive" }}
  >
    <div className="flex flex-col items-center text-[#9E3628] leading-[1.25] text-[18px] sm:text-[20px] font-normal rotate-[3deg] opacity-90">
      <span>秋天</span>
      <span>真好</span>
      <span className="text-[14px] mt-0.5 tracking-tighter">~ ♡</span>
    </div>
  </div>
);

/**
 * 5. 手绘双勾红爱心涂鸦 (Handdrawn Heart)
 */
export const HanddrawnHeart: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#9E3628',
}) => (
  <svg
    viewBox="0 0 36 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className}`}
  >
    <path
      d="M18 28C16 26 5 18 3 10C1 4 6 1 11 2C15 3 17 6 18 8C19 6 21 3 25 2C30 1 35 4 33 10C31 18 20 26 18 28Z"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.8"
    />
    <path
      d="M17 26C15 24 6 17 4.5 10.5C3.2 5.5 7.5 3 11 3.8C14.2 4.5 16 7.5 17 9"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

/**
 * 6. 复古咖啡杯底水渍圈与咖啡豆 (Coffee Stain Ring)
 */
export const CoffeeStainRing: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className}`}
  >
    {/* 不规则咖啡杯底浅水渍圆环 */}
    <circle
      cx="40"
      cy="40"
      r="32"
      stroke="#8C6645"
      strokeWidth="3.2"
      strokeDasharray="6 3 14 4 20 3"
      opacity="0.22"
    />
    <circle
      cx="40.5"
      cy="39.5"
      r="30"
      stroke="#7A5435"
      strokeWidth="1.2"
      strokeDasharray="18 5 28 8"
      opacity="0.16"
    />
    {/* 咖啡豆 1 */}
    <g transform="translate(48, 48) rotate(25)">
      <ellipse cx="6" cy="4" rx="6" ry="4" fill="#6E4A2E" opacity="0.45" />
      <path d="M1 4C4 5 8 3 11 4" stroke="#FAF5EB" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    </g>
  </svg>
);

/**
 * 7. 复古双环圆形做旧日记邮戳印章 (Vintage Postmark Stamp)
 */
export const VintagePostmarkStamp: React.FC<{ className?: string; text?: string; date?: string }> = ({
  className = '',
  text = 'EARTH DIARY',
  date = 'RECORDED',
}) => (
  <div
    className={`w-20 h-20 rounded-full border border-dashed border-[#8E7966]/40 p-1 flex items-center justify-center select-none pointer-events-none rotate-[-8deg] ${className}`}
  >
    <div className="w-full h-full rounded-full border border-[#8E7966]/60 flex flex-col items-center justify-center p-1">
      <span className="font-classical text-[8px] text-[#7C6958] tracking-widest leading-none">
        {text}
      </span>
      <div className="w-8 h-[0.8px] bg-[#8E7966]/40 my-1" />
      <span className="font-editorial text-[8.5px] font-bold text-[#8E7966] tracking-wider leading-none">
        {date}
      </span>
      <div className="flex gap-1 text-[7px] text-[#A69585] mt-1">★ ★ ★</div>
    </div>
  </div>
);

/**
 * 8. 植物标本尤加利细小枝叶 (Botanical Branch)
 */
export const BotanicalBranch: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <svg
    viewBox="0 0 60 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className}`}
  >
    <path d="M30 115C29 85 30 50 32 5" stroke="#7E6C58" strokeWidth="1.8" strokeLinecap="round" />
    <ellipse cx="20" cy="22" rx="9" ry="6" transform="rotate(-28 20 22)" fill="#8C7D69" opacity="0.45" />
    <ellipse cx="42" cy="38" rx="10" ry="6.5" transform="rotate(22 42 38)" fill="#8C7D69" opacity="0.45" />
    <ellipse cx="18" cy="58" rx="11" ry="7" transform="rotate(-30 18 58)" fill="#8C7D69" opacity="0.45" />
    <ellipse cx="44" cy="76" rx="11.5" ry="7.5" transform="rotate(25 44 76)" fill="#8C7D69" opacity="0.45" />
    <ellipse cx="22" cy="95" rx="10" ry="6.5" transform="rotate(-24 22 95)" fill="#8C7D69" opacity="0.45" />
  </svg>
);

/**
 * 9. 手绘小星芒光斑 (Handdrawn Sparkles)
 */
export const HanddrawnSparkles: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#C99E52',
}) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className}`}
  >
    {/* 主四角星 */}
    <path
      d="M20 2C20 12 28 20 38 20C28 20 20 28 20 38C20 28 12 20 2 20C12 20 20 12 20 2Z"
      fill={color}
      opacity="0.65"
    />
    <circle cx="33" cy="7" r="1.8" fill={color} opacity="0.5" />
    <circle cx="8" cy="32" r="1.5" fill={color} opacity="0.4" />
  </svg>
);

/**
 * 10. 手绘温暖小太阳 (Vintage Golden Sun)
 */
export const VintageGoldenSun: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#D19B4C',
}) => (
  <svg
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className}`}
  >
    <circle cx="25" cy="25" r="9" fill={color} opacity="0.75" />
    {/* 八道放射光芒手绘线 */}
    <path
      d="M25 4V11M25 39V46M4 25H11M39 25H46M10 10L15 15M35 35L40 40M40 10L35 15M10 40L15 35"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      opacity="0.7"
    />
  </svg>
);

/**
 * 11. 橡树枯叶标本 (Oak Vintage Leaf)
 */
export const OakVintageLeaf: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <svg
    viewBox="0 0 70 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className}`}
  >
    <path
      d="M35 110C35 95 33 60 35 10C35 10 20 14 18 28C16 38 26 42 22 52C17 62 8 68 12 80C15 90 28 95 35 110Z"
      fill="#9E6B3C"
      opacity="0.6"
    />
    <path
      d="M35 110C35 95 37 60 35 10C35 10 50 14 52 28C54 38 44 42 48 52C53 62 62 68 58 80C55 90 42 95 35 110Z"
      fill="#8C5C30"
      opacity="0.7"
    />
    <path d="M35 112V8" stroke="#5E381A" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
  </svg>
);
