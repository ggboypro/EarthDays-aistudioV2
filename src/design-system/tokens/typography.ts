// src/design-system/tokens/typography.ts
// EarthDays Design System V5 - Typography Tokens

export const typographyTokens = {
  fontFamilies: {
    serifSC: "var(--font-serif-sc, 'Noto Serif SC', serif)",
    editorial: "var(--font-editorial, 'Playfair Display', serif)",
    sans: "var(--font-sans, 'Plus Jakarta Sans', system-ui, sans-serif)",
    hand: "var(--font-hand, 'Ma Shan Zheng', cursive)",
    classical: "var(--font-classical, 'Cinzel', serif)",
  },
  
  sizes: {
    xs: '12px',
    sm: '13.5px',
    base: '15.5px',
    lg: '18px',
    xl: '21px',
    '2xl': '26px',
    '3xl': '32px',
  },

  lineHeights: {
    tight: 1.25,
    snug: 1.4,
    normal: 1.6,
    relaxed: 1.85,
  },
} as const;
