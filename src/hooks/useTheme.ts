import { useEffect, useState } from 'react';

export type ThemeMode = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'chitrahaar-theme';

const isThemeMode = (value: string | null): value is ThemeMode => value === 'dark' || value === 'light';

const resolveTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (isThemeMode(storedTheme)) {
    return storedTheme;
  }

  const domTheme = document.documentElement.dataset.theme;
  if (isThemeMode(domTheme ?? null)) {
    return domTheme as ThemeMode;
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

const applyTheme = (theme: ThemeMode) => {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
};

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => resolveTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return { theme, setTheme, toggleTheme };
};
