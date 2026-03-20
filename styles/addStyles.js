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
    title: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: "600",
    },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },

    typeRow: {
      flexDirection: "row",
      gap: 0,
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 3,
      marginHorizontal: 16,
      marginTop: 6,
    },
    typePill: {
      flex: 1,
      borderRadius: 11,
      paddingVertical: 8,
      alignItems: "center",
    },
    typePillActive: {
      backgroundColor: colors.bg0,
    },
    typeText: { color: colors.silver, opacity: 0.7, fontSize: 12 },
    typeTextActive: { color: colors.accent, opacity: 1, fontWeight: "700" },

    field: { marginTop: 14 },
    fieldLabel: {
      fontSize: 8,
      color: colors.text3,
      letterSpacing: 2.5,
      fontWeight: "700",
      opacity: 0.6,
      marginBottom: 8,
    },
    fieldInput: {
      backgroundColor: colors.surface,
      borderWidth: 0.5,
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
    dateBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: colors.surface,
      borderWidth: 0.5,
      borderColor: colors.border,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 13,
    },
    dateBtnIcon: {
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: colors.accentDim,
      alignItems: "center",
      justifyContent: "center",
    },
    dateBtnText: {
      flex: 1,
      fontSize: 14,
      fontWeight: "600",
      color: colors.text1,
      fontFamily: FONTS.semiBold,
    },

    amountRow: { flexDirection: "row", alignItems: "baseline" },
    amountCur: { color: colors.text3, fontSize: 14, marginRight: 8 },
    amountInput: {
      fontSize: 40,
      fontWeight: "800",
      letterSpacing: -2,
      textAlign: "center",
      minWidth: 0,
      color: colors.textPrimary,
    },
    catGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    catItem: {
      width: "23%",
      backgroundColor: colors.surface,
      borderWidth: 0.5,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 8,
      paddingHorizontal: 8,
      alignItems: "center",
      gap: 6,
    },
    catItemActive: {
      borderColor: colors.accent,
      backgroundColor: colors.accentDim,
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
      borderRadius: 16,
      paddingVertical: 14,
      alignItems: "center",
    },
    saveText: { color: "#fff", fontWeight: "800", fontSize: 14 },

    aiBtn: {
      marginLeft: "auto",
      backgroundColor: colors.accentDim,
      borderRadius: 99,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    aiBtnText: {
      color: colors.accent,
      fontSize: 9,
      fontWeight: "700",
    },

  });

export default makeStyles;