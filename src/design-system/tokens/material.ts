// src/design-system/tokens/material.ts
// Standardized material constants for EarthDays physical metaphor

export const materialTokens = {
  paper: {
    bg: '#FAF7F2',
    bgAlt: '#F5EFE6',
    border: '#E3DAC9',
    innerBorder: 'rgba(255, 255, 255, 0.65)',
    // Layered realistic paper shadow with top-left key ambient light
    shadow: '0 2px 8px -2px rgba(40, 32, 22, 0.08), 0 12px 28px -6px rgba(40, 32, 22, 0.14)',
    shadowElevated: '0 4px 14px -2px rgba(35, 28, 20, 0.12), 0 24px 44px -8px rgba(35, 28, 20, 0.22)',
    shadowSide: '0 2px 6px -1px rgba(40, 32, 22, 0.06), 0 8px 18px -4px rgba(40, 32, 22, 0.09)',
    radius: '6px',
  },

  photo: {
    frameBg: '#FFFFFF',
    frameBorder: 'rgba(0, 0, 0, 0.06)',
    innerShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.08)',
    shadow: '0 3px 10px -2px rgba(30, 24, 18, 0.18), 0 1px 3px rgba(30, 24, 18, 0.08)',
    printPadding: '7px 7px 14px 7px',
    radius: '2px',
  },

  bookmark: {
    color: '#B24436', // Terracotta vermillion silk ribbon
    colorSecondary: '#355E3B', // Forest jade
    width: '18px',
    shadow: '2px 4px 10px rgba(35, 25, 18, 0.35)',
  },

  ink: {
    primary: '#2A231C',
    secondary: '#5C5144',
    tertiary: '#8A7D6F',
    faint: '#B8ADA0',
    vermillion: '#A64434',
    seal: '#963628',
  },
} as const;
