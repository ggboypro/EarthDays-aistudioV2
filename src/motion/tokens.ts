// src/motion/tokens.ts
// Unified spring physics and duration hierarchy for EarthDays

export const motionTokens = {
  // Spring configurations
  spring: {
    gentle: {
      type: 'spring' as const,
      stiffness: 180,
      damping: 24,
      mass: 1,
    },
    standard: {
      type: 'spring' as const,
      stiffness: 260,
      damping: 28,
      mass: 1,
    },
    expressive: {
      type: 'spring' as const,
      stiffness: 380,
      damping: 32,
      mass: 0.9,
    },
    settle: {
      type: 'spring' as const,
      stiffness: 220,
      damping: 26,
      mass: 1,
    },
    snappy: {
      type: 'spring' as const,
      stiffness: 420,
      damping: 34,
      mass: 0.8,
    },
  },

  // Discrete transition durations in seconds
  duration: {
    micro: 0.15,
    short: 0.25,
    medium: 0.4,
    long: 0.7,
    settleTimeMs: 240,
  },

  // Easing curves
  ease: {
    natural: [0.25, 1, 0.5, 1] as [number, number, number, number],
    smooth: [0.32, 0.72, 0, 1] as [number, number, number, number],
    inOut: [0.4, 0, 0.2, 1] as [number, number, number, number],
  },
} as const;
