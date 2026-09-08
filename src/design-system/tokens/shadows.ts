// src/design-system/tokens/shadows.ts
// EarthDays Design System V5 - Soft Physical Shadows

export const shadowTokens = {
  // Paper lying on desk (Contact + Ambient)
  paper: '0 1px 2px rgba(35, 28, 20, 0.04), 0 4px 10px -2px rgba(35, 28, 20, 0.07)',
  
  // Elevated Paper / Modal / Sheet
  paperElevated: '0 2px 6px rgba(35, 28, 20, 0.06), 0 16px 36px -6px rgba(35, 28, 20, 0.16)',
  
  // Photo Paper
  photo: '0 2px 6px rgba(30, 24, 18, 0.10), 0 1px 3px rgba(30, 24, 18, 0.06)',
  photoStack: '2px 5px 12px -2px rgba(28, 22, 16, 0.14), 0 2px 4px rgba(28, 22, 16, 0.05)',

  // Fabric Bookmark
  bookmark: '2px 4px 8px rgba(35, 25, 18, 0.22), 0 1px 2px rgba(35, 25, 18, 0.15)',

  // Bottom Navigation Environmental Shadow (spreading upwards)
  nav: '0 -4px 16px -2px rgba(35, 28, 20, 0.06)',

  // Floating Action Button (Leather / Metal Object)
  fab: '0 4px 12px rgba(30, 24, 18, 0.20)',

  // Book Spine & Shelf Grooves
  bookSpine: 'inset -4px 0 8px rgba(0, 0, 0, 0.30), inset 4px 0 6px rgba(255, 255, 255, 0.20), 4px 8px 18px -3px rgba(18, 14, 10, 0.30)',
  shelfGroove: '0 6px 14px -4px rgba(15, 12, 9, 0.35), inset 0 2px 5px rgba(0, 0, 0, 0.20)',
} as const;
