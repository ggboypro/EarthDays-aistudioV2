import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemePalette } from '../types/theme';
import { THEME_MY_DAYS } from './defaultThemes';

interface ThemeContextType {
  theme: ThemePalette;
  setTheme: (theme: ThemePalette) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: THEME_MY_DAYS,
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{
  initialTheme?: ThemePalette;
  children: React.ReactNode;
}> = ({ initialTheme = THEME_MY_DAYS, children }) => {
  const [theme, setTheme] = useState<ThemePalette>(initialTheme);

  useEffect(() => {
    // Inject dynamic CSS variables to root for seamless physical theme changes
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-paper', theme.paper);
    root.style.setProperty('--color-paper-border', theme.paperBorder);
    root.style.setProperty('--color-ink', theme.ink);
    root.style.setProperty('--color-ink-muted', theme.inkMuted);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-canvas-bg', theme.canvasBg);
    root.style.setProperty('--color-shadow', theme.shadowColor);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
