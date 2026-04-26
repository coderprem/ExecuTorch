// ThemeContext.tsx

import React, { createContext } from 'react';
import { LightTheme, DarkTheme, ThemeType } from './theme';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { getTheme } from '../store/slice/auth/authSelector';
import { setTheme } from '../store/slice/auth/authReducer';

type ThemeContextType = {
  theme: ThemeType;
  isDark: boolean;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector(getTheme);

  const isDark = currentTheme === 'dark';

  const toggleTheme = () => {
    dispatch(setTheme(isDark ? 'light' : 'dark'));
  };

  const theme = isDark ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};