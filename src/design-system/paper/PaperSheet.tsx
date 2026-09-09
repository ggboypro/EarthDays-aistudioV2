import React from 'react';
import { PaperGrainOverlay } from './PaperGrainOverlay';

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
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#FAF8F2',
        borderColor: '#DED6C9',
        ...style,
      }}
      className={`relative transition-all duration-200 border rounded-[14px] shadow-paper-l1 overflow-hidden ${
        hasDeckleEdge ? 'torn-paper-edge-bottom' : ''
      } ${className}`}
    >
      {/* Design System Unified Paper Grain Material Layer */}
      <PaperGrainOverlay />

      <div className="relative z-10">{children}</div>
    </div>
  );
};
