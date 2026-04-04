// constants/theme.js

/** @typedef {typeof DARK_COLORS} AppColors */

export const DARK_COLORS = {
  bg0: "#0B0F14",
  bg1: "#121212",
  bg2: "#0A1A2F",
  bg3: "#0D1B2A",
  gray1: "#2C2F33",
  gray2: "#3A3F44",
  silver: "#8A9BA8",
  navy: "#1F4068",
  accent: "#00A8FF",
  cyan: "#00FFFF",
  electric: "#0096FF",
  success: "#00E5A0",
  danger: "#FF4D6D",
  warning: "#FFB800",
  textPrimary: "#FFFFFF",
  textSecondary: "#8A9BA8",
  textMuted: "#3A3F44",
  border: "#1A2535",
  cardBorderStrong: "#1A2D45",
  trackMuted: "#1A2535",
  navBarBg: "#0A0E13",
  navBarBorder: "#141C26",
  txTitle: "#CCCCCC",
  pillInnerBg: "rgba(255,255,255,0.03)",
  heroCardBorder: "#1A2D45",
  modalOverlay: "rgba(0,0,0,0.7)",
  catItemSelectedExpense: "rgba(255,77,109,0.08)",
  catItemSelectedIncome: "rgba(0,229,160,0.08)",
  toggleExpenseBg: "rgba(255,77,109,0.15)",
  toggleIncomeBg: "rgba(0,229,160,0.1)",
  actionPillActiveBg: "rgba(0,168,255,0.08)",
  txIconBg: "rgba(0,168,255,0.08)",
  pillBorder: "#1E2D3D",
};

export const LIGHT_COLORS = {
  bg0: "#F1F5F9",
  bg1: "#FFFFFF",
  bg2: "#E2E8F0",
  bg3: "#FFFFFF",
  gray1: "#E2E8F0",
  gray2: "#CBD5E1",
  silver: "#64748B",
  navy: "#1E40AF",
  accent: "#0284C7",
  cyan: "#0891B2",
  electric: "#0369A1",
  success: "#059669",
  danger: "#DC2626",
  warning: "#D97706",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  border: "#E2E8F0",
  cardBorderStrong: "#CBD5E1",
  trackMuted: "#E2E8F0",
  navBarBg: "#FFFFFF",
  navBarBorder: "#E2E8F0",
  txTitle: "#334155",
  pillInnerBg: "rgba(15,23,42,0.04)",
  heroCardBorder: "#CBD5E1",
  modalOverlay: "rgba(15,23,42,0.45)",
  catItemSelectedExpense: "rgba(220,38,38,0.08)",
  catItemSelectedIncome: "rgba(5,150,105,0.1)",
  toggleExpenseBg: "rgba(220,38,38,0.12)",
  toggleIncomeBg: "rgba(5,150,105,0.12)",
  actionPillActiveBg: "rgba(2,132,199,0.1)",
  txIconBg: "rgba(2,132,199,0.12)",
  pillBorder: "#CBD5E1",
};

/** @param {boolean} isDark */
export function getAppColors(isDark) {
  return isDark ? DARK_COLORS : LIGHT_COLORS;
}

/** Expo template / useThemeColor — system light-dark (separate from in-app theme switch) */
export const Colors = {
  light: {
    text: LIGHT_COLORS.textPrimary,
    background: LIGHT_COLORS.bg0,
    tint: LIGHT_COLORS.accent,
    icon: LIGHT_COLORS.silver,
    tabIconDefault: LIGHT_COLORS.silver,
    tabIconSelected: LIGHT_COLORS.accent,
  },
  dark: {
    text: DARK_COLORS.textPrimary,
    background: DARK_COLORS.bg0,
    tint: DARK_COLORS.accent,
    icon: DARK_COLORS.silver,
    tabIconDefault: DARK_COLORS.silver,
    tabIconSelected: DARK_COLORS.accent,
  },
};

/** @deprecated Prefer useAppColors() for theme-aware UI */
export const COLORS = DARK_COLORS;

export const CATEGORIES = [
  { id: "an_uong", label: "Ăn uống", emoji: "🍜" },
  { id: "di_chuyen", label: "Di chuyển", emoji: "🚗" },
  { id: "hoc_tap", label: "Học tập", emoji: "📚" },
  { id: "giai_tri", label: "Giải trí", emoji: "🎮" },
  { id: "suc_khoe", label: "Sức khỏe", emoji: "🏥" },
  { id: "mua_sam", label: "Mua sắm", emoji: "🛍" },
  { id: "tien_ich", label: "Tiện ích", emoji: "💡" },
  { id: "khac", label: "Khác", emoji: "📦" },
];

export const FONTS = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};
