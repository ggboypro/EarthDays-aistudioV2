// src/design-system/tokens/materials.ts
// EarthDays Design System V5 - Material Hierarchy (4 Main Layers)

import { colorTokens } from './colors';

export const materialTokens = {
  // Layer 1: Warm Desk Background
  desk: {
    bg: colorTokens.desk,
    bgWarm: colorTokens.deskWarm,
    bgAlt: colorTokens.deskAlt,
  },

  // Layer 2: Paper Surface
  paper: {
    bg: colorTokens.paper,
    bgAlt: colorTokens.paperAlt,
    cardBg: colorTokens.paperCard,
    border: colorTokens.border,
    borderLight: colorTokens.borderLight,
    shadow: '0 1px 2px rgba(35, 28, 20, 0.04), 0 4px 10px -2px rgba(35, 28, 20, 0.07)',
    shadowElevated: '0 2px 6px rgba(35, 28, 20, 0.06), 0 16px 36px -6px rgba(35, 28, 20, 0.16)',
    radius: '14px',
  },

  // Layer 3: Photo Paper
  photo: {
    frameBg: colorTokens.photoBg,
    frameBorder: 'rgba(0, 0, 0, 0.06)',
    innerShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.06)',
    shadow: '0 2px 6px rgba(30, 24, 18, 0.10), 0 1px 3px rgba(30, 24, 18, 0.06)',
    radius: '3px',
    printPadding: '6px 6px 12px 6px',
  },

  // Layer 4: Accent Objects (Terracotta Bookmark, Leather/Metal FAB)
  accent: {
    terracotta: colorTokens.primary,
    fabBg: colorTokens.fabBg,
    fabIcon: colorTokens.fabIcon,
    bookmarkShadow: '2px 4px 8px rgba(35, 25, 18, 0.22)',
    fabShadow: '0 4px 12px rgba(30, 24, 18, 0.20)',
  },

  // Ink Typography Palette
  ink: {
    primary: colorTokens.textPrimary,
    secondary: colorTokens.textSecondary,
    tertiary: colorTokens.textMuted,
    placeholder: colorTokens.placeholder,
    terracotta: colorTokens.primary,
  },
} as const;
