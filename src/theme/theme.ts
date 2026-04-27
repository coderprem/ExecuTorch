// theme.ts

export type themeMode = 'light' | 'dark';

export const LightTheme = {
  mode: 'light',

  colors: {
    primary: '#4F7DF3',
    onPrimary: '#FFFFFF',

    primaryContainer: '#E0EAFF',
    onPrimaryContainer: '#0B1B3F',

    background: '#F8FAFF',
    surface: '#FFFFFF',
    surfaceVariant: '#EEF2FF',

    textPrimary: '#0F172A',
    textSecondary: '#64748B',

    border: '#E2E8F0',
    outline: '#CBD5F5',

    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',

    // 🔥 gradient (matches your logo)
    gradientPrimary: ['#4F7DF3', '#7BAAF7', '#A5C8FF'],
  },
};

export const DarkTheme = {
  mode: 'dark',

  colors: {
    primary: '#8FB4FF',
    onPrimary: '#0B1B3F',

    primaryContainer: '#1E3A8A',
    onPrimaryContainer: '#DCE7FF',

    background: '#0B1220',   // softer than your current
    surface: '#111827',      // layered UI
    surfaceVariant: '#1F2937',

    textPrimary: '#E5E7EB',
    textSecondary: '#9CA3AF',

    border: '#1F2A44',
    outline: '#334155',

    success: '#4ADE80',
    warning: '#FBBF24',
    error: '#F87171',

    gradientPrimary: ['#3B82F6', '#6366F1', '#8B5CF6'], // 🔥 AI vibe
  },
};

export type ThemeType = typeof LightTheme;