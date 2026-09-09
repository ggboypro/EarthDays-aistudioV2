import React from 'react';

interface PaperGrainOverlayProps {
  className?: string;
  hasHighlightBorder?: boolean;
}

/**
 * PaperGrainOverlay - EarthDays Unified Design System Paper Material Layer
 *
 * Implements fine-grained SVG feTurbulence fractalNoise paper texture:
 * - baseFrequency: 0.85
 * - numOctaves: 2
 * - seed: 42
 * - opacity: ~0.038
 * - mix-blend-mode: multiply
 * - Second-layer radial vignette paper lighting
 * - Zero performance impact (static Data URI overlay, GPU friendly, no JS re-calculo)
 */
export const PaperGrainOverlay: React.FC<PaperGrainOverlayProps> = ({
  className = '',
  hasHighlightBorder = true,
}) => {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden z-0 select-none ${className}`}
    >
      {/* 1. Subtle Paper Surface Radial Vignette / Natural Lighting */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.45) 0%, rgba(240, 233, 220, 0.25) 100%)',
        }}
      />

      {/* 2. Micro SVG feTurbulence Paper Grain Texture */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit] opacity-[0.038] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='42' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperGrain)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '160px 160px',
        }}
      />

      {/* 3. Paper Edge Inner Highlight */}
      {hasHighlightBorder && (
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] border border-[#DED6C9]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]" />
      )}
    </div>
  );
};
