import { StyleSheet } from "react-native";
import { FONTS } from "../constants/theme";

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg0,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 10,
    },
    backBtn: {
      width: 34,
      height: 34,
      borderRadius: 12,
      backgroundColor: colors.bg3,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    backText: { color: colors.textPrimary, fontSize: 16, opacity: 0.8 },
    title: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: "600",
    },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },

    typeRow: { flexDirection: "row", gap: 8, marginTop: 6 },
    typePill: {
      flex: 1,
      backgroundColor: colors.bg3,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      paddingVertical: 10,
      alignItems: "center",
    },
    typePillActive: {
      borderColor: colors.accent,
      backgroundColor: "rgba(0,168,255,0.08)",
    },
    typeText: { color: colors.silver, opacity: 0.7, fontSize: 12 },
    typeTextActive: { color: colors.accent, opacity: 1, fontWeight: "700" },

    field: { marginTop: 14 },
    fieldLabel: {
      fontSize: 9,
      color: colors.silver,
      letterSpacing: 2.5,
      opacity: 0.5,
      marginBottom: 8,
    },
    fieldInput: {
      backgroundColor: colors.bg3,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: colors.textPrimary,
      fontSize: 13,
      // Fix font for note/date input
      fontFamily: FONTS.regular,
    },
    fieldRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    amountRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.bg2,
      borderWidth: 1,
      borderColor: colors.border2,
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    amountCur: { color: colors.accent, fontSize: 14, marginRight: 8 },
    amountInput: {
      fontSize: 48,
      fontWeight: "300",
      letterSpacing: -2,
      textAlign: "center",
      minWidth: 100,
      color: colors.textPrimary,
    },
    catGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    catItem: {
      width: "31%",
      backgroundColor: colors.bg3,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      paddingVertical: 10,
      paddingHorizontal: 8,
      alignItems: "center",
      gap: 6,
    },
    catItemActive: {
      borderColor: colors.accent,
      backgroundColor: "rgba(0,168,255,0.10)",
    },
    catEmoji: { fontSize: 18 },
    catLabel: {
      fontSize: 10,
      color: colors.silver,
      opacity: 0.7,
    },
    catLabelActive: { color: colors.accent, opacity: 1, fontWeight: "700" },

    saveBtn: {
      marginTop: 18,
      backgroundColor: colors.accent,
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: "center",
    },
    saveText: { color: "#06121F", fontWeight: "800", fontSize: 13 },

    aiBtn: {
      marginLeft: 8,
      backgroundColor: colors.navy,
      borderWidth: 1,
      borderColor: colors.accent,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    aiBtnText: {
      color: colors.accent,
      fontSize: 12,
      fontWeight: "600",
    },

    // Bottom Nav (5 tabs + plus in middle)
    bottomNav: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "space-around",
      paddingTop: 8,
      paddingBottom: 28,
      paddingHorizontal: 8,
      backgroundColor: colors.bg1,
      borderTopWidth: 0.5,
      borderTopColor: colors.border,
    },
    navItem: { flex: 1, alignItems: "center", gap: 3 },
    navIcon: { fontSize: 20, opacity: 0.3, textAlign: "center" },
    navIconActive: { opacity: 1 },
    navDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.accent, opacity: 0 },
    navDotActive: { opacity: 1 },
    navLabel: {
      fontSize: 8,
      color: colors.text2,
      opacity: 0.3,
      letterSpacing: 1,
      textTransform: "uppercase",
      fontWeight: "600",
    },
    navLabelActive: { color: colors.accent, opacity: 1 },

    navPlusBtn: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 2,
    },
    navPlusBtnInactive: { opacity: 0.6 },
    navPlusLabel: { fontSize: 8, fontWeight: "700", color: colors.accent, marginTop: 2, opacity: 1 },
    navPlusLabelInactive: { opacity: 0.6 },
  });

export default makeStyles;