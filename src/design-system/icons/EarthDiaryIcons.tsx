import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  color?: string;
}

/**
 * 07 图标系统 (原创设计):
 * 日记 · 写日记 · 账本 · 收藏 · 相册 · 地点 · 心情 · 分享 · 更多 · 设置
 */

// 1. 日记 (打开的日记本)
export const DiaryIcon: React.FC<IconProps> = ({ size = 22, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <line x1="8" y1="6" x2="16" y2="6" strokeWidth="1.3" opacity="0.6" />
    <line x1="8" y1="10" x2="14" y2="10" strokeWidth="1.3" opacity="0.6" />
    <path d="M12 2v6l2-1.5 2 1.5V2" fill={color} fillOpacity="0.2" />
  </svg>
);

// 2. 写日记 (羽毛钢笔 / 笔尖)
export const WritePenIcon: React.FC<IconProps> = ({ size = 22, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18" />
    <path d="M2 2l7.586 7.586" />
    <circle cx="11" cy="11" r="1" fill={color} />
  </svg>
);

// 3. 账本 (精装书脊与厚度)
export const LedgerBookIcon: React.FC<IconProps> = ({ size = 22, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect x="5" y="3" width="14" height="18" rx="1.5" />
    <line x1="9" y1="3" x2="9" y2="21" strokeWidth="1.8" />
    <line x1="5" y1="7" x2="9" y2="7" strokeWidth="1.2" />
    <line x1="5" y1="17" x2="9" y2="17" strokeWidth="1.2" />
    <path d="M12 7h4" strokeWidth="1.2" opacity="0.7" />
  </svg>
);

// 4. 收藏 (丝带书签)
export const BookmarkRibbonIcon: React.FC<IconProps & { filled?: boolean }> = ({ size = 22, filled = false, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    {filled && <path d="M9 3v7l3-2 3 2V3" fill="rgba(255,255,255,0.4)" />}
  </svg>
);

// 5. 相册 (叠放装订相片)
export const AlbumIcon: React.FC<IconProps> = ({ size = 22, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" fill={color} fillOpacity="0.3" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

// 6. 地点 (手写图钉印记)
export const LocationMarkIcon: React.FC<IconProps> = ({ size = 18, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" fill={color} fillOpacity="0.2" />
  </svg>
);

// 7. 心情 (母版太阳情绪印记)
export const MoodSunIcon: React.FC<IconProps> = ({ size = 18, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="12" cy="12" r="4" fill={color} fillOpacity="0.2" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

// 8. 心情 (平静/微风波纹)
export const MoodCalmIcon: React.FC<IconProps> = ({ size = 18, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12h8" strokeWidth="1.8" />
    <path d="M9 15h6" strokeWidth="1.3" opacity="0.6" />
    <circle cx="9" cy="9" r="0.75" fill={color} />
    <circle cx="15" cy="9" r="0.75" fill={color} />
  </svg>
);

// 9. 心情 (爱心印记)
export const MoodHeartIcon: React.FC<IconProps> = ({ size = 18, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// 10. 分享 (递出纸页/照片)
export const SharePhotoIcon: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

// 11. 更多 (页边三点)
export const MoreDotsIcon: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="12" cy="12" r="1.5" fill={color} />
    <circle cx="19" cy="12" r="1.5" fill={color} />
    <circle cx="5" cy="12" r="1.5" fill={color} />
  </svg>
);

// 12. 设置 (印章齿轮)
export const SettingsStampIcon: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

// 13. 书桌/我的 用户头像
export const ProfileDeskIcon: React.FC<IconProps> = ({ size = 22, className = '', color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// 14. 封蜡火漆印 (核心写日记按钮)
export const WaxSealBadge: React.FC<{ size?: number; className?: string }> = ({ size = 52, className = '' }) => (
  <div 
    style={{ width: size, height: size }}
    className={`relative rounded-full flex items-center justify-center cursor-pointer transition-transform active:scale-95 shadow-wax-seal ${className}`}
  >
    {/* Outer bronze/brass vintage ring */}
    <div className="absolute inset-0 rounded-full border border-[#D4AF37]/50 bg-gradient-to-br from-[#8C3A27] via-[#6D2617] to-[#45140A] p-[3px]">
      <div className="w-full h-full rounded-full border border-[#F4D068]/30 flex items-center justify-center shadow-inner">
        {/* Embossed quill pen inside wax */}
        <WritePenIcon size={size * 0.46} color="#E8C59A" className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" />
      </div>
    </div>
  </div>
);
