// colors.ts

export const Colors = {
  primary: {
    main: '#5295ED',
    dark: '#3E7BD6',
    light: '#EAF2FF',
  },

  background: {
    app: '#F7F9FC',
    surface: '#FFFFFF',
  },

  text: {
    primary: '#1F2A44',
    secondary: '#6B7A99',
    disabled: '#A0AEC0',
    inverse: '#FFFFFF',
  },

  border: {
    light: '#EAF2FF',
    default: '#D6E4FF',
  },

  status: {
    success: '#6FCF97',
    warning: '#F2A65A',
    error: '#EB5757',
  },

  button: {
    primary: {
      bg: '#5295ED',
      text: '#FFFFFF',
      pressed: '#3E7BD6',
      disabledBg: '#E2E8F0',
      disabledText: '#A0AEC0',
    },
    secondary: {
      bg: '#EAF2FF',
      text: '#5295ED',
    },
  },

  input: {
    bg: '#FFFFFF',
    border: '#D6E4FF',
    focus: '#5295ED',
    error: '#EB5757',
  },

  navigation: {
    headerBg: '#5295ED',
    headerText: '#FFFFFF',
    active: '#5295ED',
    inactive: '#6B7A99',
  },

  gradient: {
    primary: ['#5295ED', '#7BAAF7'],
  },
} as const;

export type ColorsType = typeof Colors;