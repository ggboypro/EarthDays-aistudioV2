import React from 'react';

interface HanddrawnUnderlineProps {
  seed?: string | number;
  className?: string;
  width?: number | string;
  color?: string;
}

/**
 * 手绘线条系统 (Handdrawn Underline System)
 * 包含 5 种形态的手绘水彩与蜡笔笔刷线条，支持随机或基于标题哈希确定性分发
 */
export const HanddrawnUnderline: React.FC<HanddrawnUnderlineProps> = ({
  seed = 'default',
  className = '',
  width = 'w-16 sm:w-20',
  color = '#D6A775',
}) => {
  // 根据 seed 计算确定的 index (0 - 4)
  const hash = typeof seed === 'number'
    ? seed
    : Array.from(String(seed)).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variant = Math.abs(hash) % 5;

  // 1. 顿挫粗毛边蜡笔线条 (如效果图“元宝”下的手绘笔刷)
  if (variant === 0) {
    return (
      <svg
        viewBox="0 0 120 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`h-2.5 sm:h-3 ${width} ${className}`}
        preserveAspectRatio="none"
      >
        <path
          d="M3 6.5C24 4.5 48 8 72 5.5C92 3.5 106 6.8 117 6"
          stroke={color}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />
        <path
          d="M8 8C32 6.5 60 7 88 5.8C101 5.2 112 7 115 6.5"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    );
  }

  // 2. 微弧度波浪水彩横线 (如效果图“秋天开始有一点凉了”下的横线)
  if (variant === 1) {
    return (
      <svg
        viewBox="0 0 160 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`h-2.5 sm:h-3 ${width} ${className}`}
        preserveAspectRatio="none"
      >
        <path
          d="M4 8C35 4.5 75 11 115 6.5C135 4.2 148 7.5 156 6"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>
    );
  }

  // 3. 前细后粗、顿笔收锋笔刷
  if (variant === 2) {
    return (
      <svg
        viewBox="0 0 130 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`h-2.5 sm:h-3 ${width} ${className}`}
        preserveAspectRatio="none"
      >
        <path
          d="M3 6.8C25 6 52 5 78 6.2C98 7.2 115 6 126 5.5"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M18 8.5C40 7.8 72 7 100 8.2"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>
    );
  }

  // 4. 双道轻微重叠草图线
  if (variant === 3) {
    return (
      <svg
        viewBox="0 0 140 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`h-3 sm:h-3.5 ${width} ${className}`}
        preserveAspectRatio="none"
      >
        <path
          d="M4 6C36 4.8 78 7.5 118 5C128 4.2 134 5.5 137 5.8"
          stroke={color}
          strokeWidth="3.2"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M10 9C42 8.2 82 9.5 120 7.8C127 7.5 132 8.2 134 8"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.45"
        />
      </svg>
    );
  }

  // 5. 斑驳炭笔/轻柔手划线
  return (
    <svg
      viewBox="0 0 120 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`h-2.5 sm:h-3 ${width} ${className}`}
      preserveAspectRatio="none"
    >
      <path
        d="M2 7C22 5.5 54 8 82 6C98 5 110 7.2 118 6.5"
        stroke={color}
        strokeWidth="3.8"
        strokeLinecap="round"
        strokeDasharray="1 1"
        opacity="0.85"
      />
    </svg>
  );
};
