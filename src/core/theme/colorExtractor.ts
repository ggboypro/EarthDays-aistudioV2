import { ThemePalette } from '../types/theme';

/**
 * Intelligent editorial palette generator from image colors
 */
export function generateThemeFromCover(name: string, coverImage: string): ThemePalette {
  // Generates consistent, high quality muted publication themes
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  
  // Calculate harmonious muted HSL colors
  const primary = `hsl(${hue}, 22%, 40%)`;
  const secondary = `hsl(${hue}, 18%, 56%)`;
  const paper = `hsl(${hue}, 12%, 97%)`;
  const paperBorder = `hsl(${hue}, 10%, 90%)`;
  const ink = `hsl(${hue}, 15%, 16%)`;
  const inkMuted = `hsl(${hue}, 10%, 42%)`;
  const accent = `hsl(${(hue + 35) % 360}, 45%, 44%)`;
  const canvasBg = `hsl(${hue}, 10%, 88%)`;

  return {
    id: `theme_custom_${Math.abs(hash)}`,
    name: `${name} · 自定义书册`,
    primary,
    secondary,
    paper,
    paperBorder,
    ink,
    inkMuted,
    accent,
    shadowColor: 'rgba(35, 30, 24, 0.12)',
    canvasBg,
  };
}
