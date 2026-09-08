// src/design-system/tokens/motion.ts
// EarthDays Design System V5 - Soft Physical Motion Tokens

export const motionTokens = {
  springPhysical: {
    type: 'spring',
    stiffness: 300,
    damping: 28,
    mass: 0.9,
  },
  
  springGentle: {
    type: 'spring',
    stiffness: 220,
    damping: 24,
  },

  easePhysical: [0.16, 1, 0.3, 1] as const,
  
  durations: {
    fast: 0.15,
    normal: 0.25,
    slow: 0.38,
  },
} as const;
