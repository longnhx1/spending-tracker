// constants/theme.js

// Base theme tokens (tách DARK/LIGHT để toggle được)
export const DARK = {
  bg0: '#0B0F14',
  bg1: '#131920',
  bg2: '#1A2330',
  bg3: '#222E3C',
  surface: '#1E2A38',
  surface2: '#253344',

  accent: '#00A8FF',
  accentDim: 'rgba(0,168,255,0.12)',
  accentMid: 'rgba(0,168,255,0.25)',
  danger: '#FF4D6D',
  dangerDim: 'rgba(255,77,109,0.12)',
  success: '#00E5A0',
  successDim: 'rgba(0,229,160,0.12)',

  text1: '#E8F0F8',
  text2: '#8DA4BE',
  text3: '#4A6380',
  border: 'rgba(0,168,255,0.12)',
  border2: 'rgba(0,168,255,0.22)',

  // UI extras
  glassPill: "rgba(255,255,255,0.07)",
  accentGlass: "rgba(0,168,255,0.08)",
  modalOverlay: "rgba(0,0,0,0.7)",
  amber: "#FFB547",
  amberDim: "rgba(255,181,71,0.12)",
  chipBg: "rgba(255,255,255,0.07)",
};

export const LIGHT = {
  bg0: '#F0F4F8',
  bg1: '#E8EEF5',
  bg2: '#FFFFFF',
  bg3: '#F5F8FC',
  surface: '#FFFFFF',
  surface2: '#EDF2F8',

  accent: '#0085CC',
  accentDim: 'rgba(0,133,204,0.08)',
  accentMid: 'rgba(0,133,204,0.18)',
  danger: '#E0294A',
  dangerDim: 'rgba(224,41,74,0.10)',
  success: '#00B87A',
  successDim: 'rgba(0,184,122,0.10)',

  text1: '#0D1B2A',
  text2: '#4A6380',
  text3: '#8DA4BE',
  border: 'rgba(0,133,204,0.14)',
  border2: 'rgba(0,133,204,0.28)',

  // UI extras
  glassPill: "rgba(255,255,255,0.07)",
  accentGlass: "rgba(0,133,204,0.08)",
  modalOverlay: "rgba(0,0,0,0.7)",
  amber: "#E8920A",
  amberDim: "rgba(232,146,10,0.10)",
  chipBg: "rgba(0,0,0,0.05)",
};

// Alias tiện dùng — component cũ có thể import `COLORS`
// (thực tế nên dùng `useTheme()` để nhận đúng bộ theo mode)
export const COLORS = DARK;

// Danh mục chi tiêu (key/label/icon/color) + alias tương thích code cũ
export const CATEGORIES = [
  { key: 'food', label: 'Ăn uống', icon: '🍜', color: '#00A8FF', id: 'food', emoji: '🍜' },
  {
    key: 'transport',
    label: 'Di chuyển',
    icon: '🚗',
    color: '#00E5A0',
    id: 'transport',
    emoji: '🚗',
  },
  { key: 'housing', label: 'Nhà ở', icon: '🏠', color: '#FFB547', id: 'housing', emoji: '🏠' },
  { key: 'health', label: 'Sức khỏe', icon: '💊', color: '#00E5A0', id: 'health', emoji: '💊' },
  {
    key: 'entertain',
    label: 'Giải trí',
    icon: '🎮',
    color: '#A78BFA',
    id: 'entertain',
    emoji: '🎮',
  },
  {
    key: 'shopping',
    label: 'Mua sắm',
    icon: '🛍️',
    color: '#FF4D6D',
    id: 'shopping',
    emoji: '🛍️',
  },
  {
    key: 'education',
    label: 'Học tập',
    icon: '📚',
    color: '#00A8FF',
    id: 'education',
    emoji: '📚',
  },
  { key: 'other', label: 'Khác', icon: '📦', color: '#8DA4BE', id: 'other', emoji: '📦' },
];

// Font families
export const FONTS = {
  regular: 'BeVietnamPro_400Regular',
  medium: 'BeVietnamPro_500Medium',
  semiBold: 'BeVietnamPro_600SemiBold',
  bold: 'BeVietnamPro_700Bold',

  // alias tương thích code cũ
  semibold: 'BeVietnamPro_600SemiBold',
  extrabold: 'BeVietnamPro_800ExtraBold',
};

// Compatibility aliases for existing styles (để build không vỡ trong bước chuyển theme)
Object.assign(DARK, {
  silver: DARK.text2,
  textPrimary: DARK.text1,
  textSecondary: DARK.text2,
  textMuted: DARK.text3,
  navy: DARK.surface,
  electric: DARK.accentMid,
  cyan: DARK.accent,
  warning: DARK.danger,
  gray1: DARK.surface2,
  gray2: DARK.surface2,
});

Object.assign(LIGHT, {
  silver: LIGHT.text2,
  textPrimary: LIGHT.text1,
  textSecondary: LIGHT.text2,
  textMuted: LIGHT.text3,
  navy: LIGHT.surface,
  electric: LIGHT.accentMid,
  cyan: LIGHT.accent,
  warning: LIGHT.danger,
  gray1: LIGHT.surface2,
  gray2: LIGHT.surface2,
});

Object.assign(DARK, {
  accent: DARK.accent,
  cardBorderStrong: DARK.border2,
  trackMuted: DARK.border,
  navBarBg: DARK.bg0,
  navBarBorder: DARK.border,
  txTitle: DARK.text2,
  pillInnerBg: DARK.chipBg,
  heroCardBorder: DARK.border2,
  catItemSelectedExpense: DARK.dangerDim,
  catItemSelectedIncome: DARK.successDim,
  toggleExpenseBg: DARK.dangerDim,
  toggleIncomeBg: DARK.successDim,
  actionPillActiveBg: DARK.accentDim,
  txIconBg: DARK.accentGlass,
  pillBorder: DARK.border2,
});

Object.assign(LIGHT, {
  accent: LIGHT.accent,
  cardBorderStrong: LIGHT.border2,
  trackMuted: LIGHT.border,
  navBarBg: LIGHT.bg0,
  navBarBorder: LIGHT.border,
  txTitle: LIGHT.text2,
  pillInnerBg: LIGHT.chipBg,
  heroCardBorder: LIGHT.border2,
  catItemSelectedExpense: LIGHT.dangerDim,
  catItemSelectedIncome: LIGHT.successDim,
  toggleExpenseBg: LIGHT.dangerDim,
  toggleIncomeBg: LIGHT.successDim,
  actionPillActiveBg: LIGHT.accentDim,
  txIconBg: LIGHT.accentGlass,
  pillBorder: LIGHT.border2,
});

/** @typedef {typeof DARK} AppColors */

/** @param {boolean} isDark */
export function getAppColors(isDark) {
  return isDark ? DARK : LIGHT;
}

export const DARK_COLORS = DARK;
export const LIGHT_COLORS = LIGHT;

/** Expo template hook compatibility */
export const Colors = {
  light: {
    text: LIGHT.text1,
    background: LIGHT.bg0,
    tint: LIGHT.accent,
    icon: LIGHT.text2,
    tabIconDefault: LIGHT.text3,
    tabIconSelected: LIGHT.accent,
  },
  dark: {
    text: DARK.text1,
    background: DARK.bg0,
    tint: DARK.accent,
    icon: DARK.text2,
    tabIconDefault: DARK.text3,
    tabIconSelected: DARK.accent,
  },
};