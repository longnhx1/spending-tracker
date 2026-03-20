import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg0,
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
        backgroundColor: COLORS.bg3,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: "center",
        justifyContent: "center",
    },
    backText: { color: COLORS.textPrimary, fontSize: 16, opacity: 0.8 },
    title: {
        color: COLORS.textPrimary,
        fontSize: 14,
        fontWeight: "600",
    },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },

    typeRow: { flexDirection: "row", gap: 8, marginTop: 6 },
    typePill: {
        flex: 1,
        backgroundColor: COLORS.bg3,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 14,
        paddingVertical: 10,
        alignItems: "center",
    },
    typePillActive: {
        borderColor: COLORS.accent,
        backgroundColor: "rgba(0,168,255,0.08)",
    },
    typeText: { color: COLORS.silver, opacity: 0.7, fontSize: 12 },
    typeTextActive: { color: COLORS.accent, opacity: 1, fontWeight: "700" },

    field: { marginTop: 14 },
    fieldLabel: {
        fontSize: 9,
        color: COLORS.silver,
        letterSpacing: 2.5,
        opacity: 0.5,
        marginBottom: 8,
    },
    fieldInput: {
        backgroundColor: COLORS.bg3,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: COLORS.textPrimary,
        fontSize: 13,
    },
    fieldRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    amountRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.bg2,
        borderWidth: 1,
        borderColor: "#1A2D45",
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    amountCur: { color: COLORS.accent, fontSize: 14, marginRight: 8 },
    amountInput: {
        fontSize: 48,
        fontWeight: "300",
        letterSpacing: -2,
        textAlign: "center",
        minWidth: 100,
        color: COLORS.textPrimary,
    },
    catGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    catItem: {
        width: "31%",
        backgroundColor: COLORS.bg3,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 8,
        alignItems: "center",
        gap: 6,
    },
    catItemActive: {
        borderColor: COLORS.accent,
        backgroundColor: "rgba(0,168,255,0.10)",
    },
    catEmoji: { fontSize: 18 },
    catLabel: {
        fontSize: 10,
        color: COLORS.silver,
        opacity: 0.7,
    },
    catLabelActive: { color: COLORS.accent, opacity: 1, fontWeight: "700" },

    saveBtn: {
        marginTop: 18,
        backgroundColor: COLORS.accent,
        borderRadius: 14,
        paddingVertical: 12,
        alignItems: "center",
    },
    saveText: { color: "#06121F", fontWeight: "800", fontSize: 13 },

    aiBtn: {
        marginLeft: 8,
        backgroundColor: COLORS.navy,
        borderWidth: 1,
        borderColor: COLORS.accent,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    aiBtnText: {
        color: COLORS.accent,
        fontSize: 12,
        fontWeight: "600",
    },
});

export default styles;