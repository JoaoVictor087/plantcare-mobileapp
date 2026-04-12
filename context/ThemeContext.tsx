import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, type ThemeColors } from '../constants/themePalettes';

const STORAGE_KEY = '@plantcare_theme_mode';

export type ThemeMode = 'light' | 'dark';

export type { ThemeColors };

type ThemeContextValue = {
  mode: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  setMode: (m: ThemeMode) => void;
  toggleMode: () => void;
  hydrated: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;
        if (saved === 'light' || saved === 'dark') {
          setModeState(saved);
        } else if (system === 'dark') {
          setModeState('dark');
        }
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [system]);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    AsyncStorage.setItem(STORAGE_KEY, m).catch(() => undefined);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next: ThemeMode = prev === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem(STORAGE_KEY, next).catch(() => undefined);
      return next;
    });
  }, []);

  const isDark = mode === 'dark';
  const colors = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);

  const value = useMemo(
    () => ({ mode, colors, isDark, setMode, toggleMode, hydrated }),
    [mode, colors, isDark, setMode, toggleMode, hydrated]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return ctx;
}
