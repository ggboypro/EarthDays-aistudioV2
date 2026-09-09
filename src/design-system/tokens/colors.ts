// src/design-system/tokens/colors.ts
// EarthDays Design System V5 - Color Tokens

export const colorTokens = {
  // 1. Global Background (Warm Desk / Warm Ivory)
  desk: '#F2EEE6',
  deskAlt: '#EEE9DF',
  deskWarm: '#F5F1E9',

  // 2. Paper & Surfaces
  paper: '#FAF8F2',
  paperAlt: '#F5F0E6',
  paperCard: '#FAF8F2',
  control: '#FAF7F1',
  controlHover: '#F2EBDC',
  controlActive: '#E8DFC2',

  // 3. Primary Accent (Warm Terracotta)
  primary: '#B45C42',
  primaryHover: '#A9513A',
  primaryActive: '#96432E',
  primaryMuted: '#C2765D',
  primaryLight: '#F7ECE8',

  // 4. Ink & Typography
  textPrimary: '#302820',
  textSecondary: '#766C60',
  textMuted: '#9A9084',
  placeholder: '#B5ACA0',

  // 5. Borders & Lines
  border: '#DED6C9',
  borderLight: '#E4DDD2',
  divider: '#E5DDD1',

  // 6. Navigation & Controls
  navBg: '#FAF7F1',
  navActiveBg: '#EEE7DC',
  navBorder: '#E5DDD1',

  // 7. Special Physical Objects
  fabBg: '#302820',
  fabIcon: '#F8F3EA',
  overlay: 'rgba(35, 29, 24, 0.30)',
  bookmark: '#B45C42',
  photoBg: '#FFFFFF',
} as const;

export type ColorTokenKey = keyof typeof colorTokens;
