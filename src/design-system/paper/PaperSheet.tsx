import React from 'react';
import { useTheme } from '../../core/theme/ThemeContext';

interface PaperSheetProps {
  children: React.ReactNode;
  className?: string;
  elevation?: 'flat' | 'low' | 'medium';
  hasDeckleEdge?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const PaperSheet: React.FC<PaperSheetProps> = ({
  children,
  className = '',
  elevation = 'low',
  hasDeckleEdge = false,
  onClick,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: theme.paper,
        borderColor: theme.paperBorder,
        ...style,
      }}
      className={`relative transition-all duration-200 border rounded-[3px] shadow-paper-l1 paper-grain ${
        hasDeckleEdge ? 'torn-paper-edge-bottom' : ''
      } ${className}`}
    >
      {/* Subtle top ambient highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-white/60 pointer-events-none rounded-t-[3px]" />
      {children}
    </div>
  );
};
