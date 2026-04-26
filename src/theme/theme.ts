// theme.ts

export const LightTheme = {
  mode: 'light',

  colors: {
    primary: '#5295ED',
    primaryDark: '#3E7BD6',
    primaryLight: '#EAF2FF',

    background: '#F7F9FC',
    surface: '#FFFFFF',

    textPrimary: '#1F2A44',
    textSecondary: '#6B7A99',

    border: '#D6E4FF',

    success: '#6FCF97',
    warning: '#F2A65A',
    error: '#EB5757',
  },
};

export const DarkTheme = {
  mode: 'dark',

  colors: {
    primary: '#5295ED',
    primaryDark: '#3E7BD6',
    primaryLight: '#1E3A5F',

    background: '#0F172A',
    surface: '#1E293B',

    textPrimary: '#E2E8F0',
    textSecondary: '#94A3B8',

    border: '#334155',

    success: '#6FCF97',
    warning: '#F2A65A',
    error: '#EB5757',
  },
};

export type ThemeType = typeof LightTheme;