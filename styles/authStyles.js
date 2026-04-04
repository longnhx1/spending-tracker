import { StyleSheet } from "react-native";
import { FONTS } from "../constants/theme";

/**
 * Login / Register — cùng token với home/settings (surface, border2, FONTS).
 * @param {import('../constants/theme').AppColors} colors
 */
export default function makeAuthStyles(colors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg0 },
    flex: { flex: 1 },
    scroll: {
      paddingHorizontal: 20,
      paddingTop: 36,
      paddingBottom: 32,
    },
    brandTitle: {
      fontSize: 28,
      fontFamily: FONTS.bold,
      letterSpacing: -0.8,
      color: colors.text1,
    },
    brandSub: {
      marginTop: 8,
      fontSize: 14,
      fontFamily: FONTS.regular,
      lineHeight: 20,
      color: colors.text2,
      opacity: 0.85,
      marginBottom: 22,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      borderWidth: 0.5,
      borderColor: colors.border2,
      padding: 18,
      marginBottom: 8,
    },
    warn: {
      backgroundColor: colors.amberDim,
      borderWidth: 0.5,
      borderColor: colors.amber,
      borderRadius: 12,
      padding: 14,
      marginBottom: 16,
    },
    warnText: {
      fontSize: 13,
      fontFamily: FONTS.regular,
      lineHeight: 20,
      color: colors.amber,
    },
    googleBtn: {
      backgroundColor: colors.chipBg,
      borderWidth: 0.5,
      borderColor: colors.border2,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: "center",
    },
    googleBtnText: {
      fontSize: 14,
      fontFamily: FONTS.semiBold,
      color: colors.text1,
    },
    dividerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginVertical: 18,
    },
    divider: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
    dividerText: {
      fontSize: 10,
      fontFamily: FONTS.semiBold,
      color: colors.text3,
      letterSpacing: 1.2,
      textTransform: "uppercase",
    },
    label: {
      fontSize: 9,
      fontFamily: FONTS.bold,
      letterSpacing: 2,
      color: colors.text3,
      opacity: 0.75,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.surface2,
      borderWidth: 0.5,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 13,
      fontSize: 15,
      fontFamily: FONTS.regular,
      color: colors.text1,
      marginBottom: 14,
    },
    btn: {
      backgroundColor: colors.accent,
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: "center",
      marginTop: 6,
    },
    btnDisabled: { opacity: 0.65 },
    btnText: {
      color: "#fff",
      fontSize: 13,
      fontFamily: FONTS.bold,
      letterSpacing: 1.2,
    },
    switchBtn: { marginTop: 18, alignItems: "center", paddingVertical: 8 },
    switchText: {
      fontSize: 13,
      fontFamily: FONTS.medium,
      color: colors.accent,
    },
  });
}
