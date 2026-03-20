import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.bg0 },
    header: {
        paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4,
    },
    title: { fontSize: 24, color: COLORS.textPrimary, fontWeight: '800' },
    subtitle: {
        fontSize: 11, color: COLORS.silver,
        opacity: 0.5, marginTop: 2,
    },
    monthRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20, paddingVertical: 12,
    },
    monthArrow: {
        width: 32, height: 32,
        backgroundColor: COLORS.bg3,
        borderWidth: 1, borderColor: COLORS.border,
        borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    },
    monthArrowText: { fontSize: 20, color: COLORS.silver },
    monthName: {
        fontSize: 12, color: COLORS.silver,
        fontWeight: '600', letterSpacing: 2,
    },
    summaryRow: {
        flexDirection: 'row', gap: 10,
        paddingHorizontal: 20, marginBottom: 10,
    },
    summaryCard: {
        flex: 1, backgroundColor: COLORS.bg3,
        borderWidth: 1, borderRadius: 16, padding: 14,
    },
    summaryLabel: {
        fontSize: 8, color: COLORS.silver,
        opacity: 0.5, letterSpacing: 2,
    },
    summaryAmount: {
        fontSize: 15, fontWeight: '600',
        marginTop: 6, letterSpacing: -0.5,
    },
    balanceCard: {
        marginHorizontal: 20, marginBottom: 20,
        backgroundColor: COLORS.bg2,
        borderWidth: 1, borderColor: '#1A2D45',
        borderRadius: 18, padding: 18,
    },
    balanceLabel: {
        fontSize: 9, color: COLORS.silver,
        opacity: 0.5, letterSpacing: 2.5,
    },
    balanceAmount: {
        fontSize: 32, fontWeight: '300',
        marginTop: 6, letterSpacing: -1,
    },
    balanceSub: {
        fontSize: 11, color: COLORS.silver,
        opacity: 0.4, marginTop: 4,
    },
    section: { paddingHorizontal: 20, marginBottom: 20 },
    sectionTitle: {
        fontSize: 13, color: COLORS.textPrimary,
        fontWeight: '600', marginBottom: 12,
    },
    emptyBox: {
        padding: 20, backgroundColor: COLORS.bg3,
        borderRadius: 14, borderWidth: 1,
        borderColor: COLORS.border, alignItems: 'center',
    },
    emptyText: {
        fontSize: 12, color: COLORS.silver, opacity: 0.5,
    },
    catRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10, marginBottom: 12,
    },
    catLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10, width: 130,
    },
    catEmoji: { fontSize: 22 },
    catName: {
        fontSize: 12, color: COLORS.textPrimary, fontWeight: '500',
    },
    catAmount: {
        fontSize: 10, color: COLORS.silver, opacity: 0.5, marginTop: 1,
    },
    catBarWrap: {
        flex: 1, height: 6,
        backgroundColor: '#1A2535', borderRadius: 3,
    },
    catBar: {
        height: '100%', borderRadius: 3,
        backgroundColor: COLORS.accent,
    },
    catPercent: {
        fontSize: 10, color: COLORS.silver,
        opacity: 0.5, width: 32, textAlign: 'right',
    },
    txItem: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 10, gap: 12,
        borderBottomWidth: 1, borderBottomColor: '#141C26',
    },
    txIcon: {
        width: 36, height: 36, borderRadius: 12,
        backgroundColor: 'rgba(0,168,255,0.08)',
        alignItems: 'center', justifyContent: 'center',
    },
    txEmoji: { fontSize: 16 },
    txInfo: { flex: 1 },
    txName: { fontSize: 13, color: '#CCC', fontWeight: '500' },
    txMeta: {
        fontSize: 10, color: COLORS.silver,
        opacity: 0.4, marginTop: 2,
    },
    txAmount: { fontSize: 13, fontWeight: '500' },
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modalBox: {
        backgroundColor: COLORS.bg1,
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: 24, borderTopWidth: 1, borderColor: COLORS.border,
    },
    modalTitle: {
        fontSize: 18, color: COLORS.textPrimary, fontWeight: '700', marginBottom: 4,
    },
    modalSub: { fontSize: 11, color: COLORS.silver, opacity: 0.5, marginBottom: 12 },
    toggle: {
        flexDirection: 'row', marginBottom: 14,
        backgroundColor: COLORS.bg3, borderRadius: 14,
        padding: 4, gap: 4, borderWidth: 1, borderColor: COLORS.border,
    },
    togBtn: { flex: 1, padding: 9, borderRadius: 10, alignItems: 'center' },
    togBtnExpense: { backgroundColor: 'rgba(255,77,109,0.15)' },
    togBtnIncome: { backgroundColor: 'rgba(0,229,160,0.1)' },
    togText: { fontSize: 11, fontWeight: '600', color: COLORS.silver },
    inputLabel: {
        fontSize: 9, color: COLORS.silver, opacity: 0.4,
        letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, marginTop: 10,
    },
    input: {
        backgroundColor: COLORS.bg3, borderWidth: 1,
        borderColor: COLORS.border, borderRadius: 12,
        padding: 12, color: COLORS.textPrimary, fontSize: 14,
    },
    catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
    catItem: {
        width: '22%', backgroundColor: COLORS.bg3,
        borderWidth: 1, borderColor: COLORS.border,
        borderRadius: 12, padding: 10, alignItems: 'center', gap: 4,
    },
    catItemSelected: { backgroundColor: 'rgba(255,77,109,0.08)', borderColor: COLORS.danger },
    catName: { fontSize: 8, color: COLORS.silver, opacity: 0.5, textAlign: 'center' },
    modalBtns: { flexDirection: 'row', gap: 10, marginTop: 16 },
    modalCancelBtn: {
        flex: 1, padding: 14, borderRadius: 12,
        backgroundColor: COLORS.bg3, borderWidth: 1,
        borderColor: COLORS.border, alignItems: 'center',
    },
    modalCancelText: { color: COLORS.silver, fontWeight: '600' },
    modalSaveBtn: { flex: 2, padding: 14, borderRadius: 12, backgroundColor: COLORS.electric, alignItems: 'center' },
    modalSaveText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    actionBar: {
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: COLORS.bg0,
        borderTopWidth: 1,
        borderTopColor: '#141C26',
    },
    actionPill: {
        flex: 1,
        backgroundColor: COLORS.bg3,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingVertical: 8,
        alignItems: 'center',
        gap: 4,
    },
    actionPillActive: {
        borderColor: COLORS.accent,
        backgroundColor: 'rgba(0,168,255,0.08)',
    },
    actionPillIco: { fontSize: 16 },
    actionPillTxt: {
        fontSize: 8,
        color: COLORS.silver,
        opacity: 0.5,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    actionPillTxtActive: {
        color: COLORS.accent,
        opacity: 1,
    },
    bottomNav: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        flexDirection: 'row', justifyContent: 'space-around',
        paddingTop: 10, paddingBottom: 28, paddingHorizontal: 8,
        backgroundColor: '#0A0E13',
        borderTopWidth: 1, borderTopColor: '#141C26',
    },
    navItem: { alignItems: 'center', gap: 3 },
    navIcon: { fontSize: 20, opacity: 0.3 },
    navIconActive: { opacity: 1 },
    navDot: {
        width: 4, height: 4, borderRadius: 2,
        backgroundColor: COLORS.accent, opacity: 0,
    },
    navDotActive: { opacity: 1 },
    navLabel: {
        fontSize: 8, color: COLORS.silver,
        opacity: 0.3, letterSpacing: 1, textTransform: 'uppercase',
    },
    navLabelActive: { color: COLORS.accent, opacity: 1 },
});

export default styles;