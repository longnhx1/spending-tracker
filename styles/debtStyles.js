import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.bg0 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 16, paddingBottom: 8,
    },
    title: { fontSize: 24, color: COLORS.textPrimary, fontWeight: '800' },
    subtitle: { fontSize: 11, color: COLORS.silver, opacity: 0.5, marginTop: 2 },
    addBtn: {
        backgroundColor: COLORS.navy,
        borderWidth: 1, borderColor: COLORS.accent,
        borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8,
    },
    addBtnText: { color: COLORS.accent, fontSize: 12, fontWeight: '600' },
    totalCard: {
        margin: 20,
        backgroundColor: COLORS.bg2,
        borderWidth: 1, borderColor: '#1A2D45',
        borderRadius: 22, padding: 20,
    },
    totalLabel: {
        fontSize: 9, color: COLORS.silver,
        opacity: 0.5, letterSpacing: 2.5,
    },
    totalAmount: {
        fontSize: 36, color: COLORS.danger,
        fontWeight: '300', marginTop: 6, letterSpacing: -1,
    },
    totalSub: { fontSize: 11, color: COLORS.silver, opacity: 0.4, marginTop: 4 },
    emptyBox: {
        margin: 20, padding: 40,
        backgroundColor: COLORS.bg3,
        borderRadius: 20, borderWidth: 1,
        borderColor: COLORS.border, alignItems: 'center',
    },
    emptyEmoji: { fontSize: 48, marginBottom: 12 },
    emptyText: { fontSize: 16, color: COLORS.textPrimary, fontWeight: '600' },
    emptySub: {
        fontSize: 12, color: COLORS.silver,
        opacity: 0.5, marginTop: 6, textAlign: 'center',
    },
    debtCard: {
        marginHorizontal: 20, marginBottom: 12,
        backgroundColor: COLORS.bg3,
        borderWidth: 1, borderColor: 'rgba(255,77,109,0.2)',
        borderRadius: 18, padding: 16,
    },
    debtCardPaid: { borderColor: 'rgba(0,229,160,0.2)', opacity: 0.7 },
    debtTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    debtLeft: { flex: 1 },
    debtName: { fontSize: 15, color: COLORS.textPrimary, fontWeight: '600' },
    debtDue: { fontSize: 10, color: COLORS.silver, opacity: 0.5, marginTop: 3 },
    debtRight: { alignItems: 'flex-end' },
    debtRemaining: { fontSize: 16, color: COLORS.danger, fontWeight: '500' },
    debtTotal: { fontSize: 10, color: COLORS.silver, opacity: 0.4, marginTop: 2 },
    progressTrack: {
        height: 4, backgroundColor: '#1A2535',
        borderRadius: 2, marginBottom: 10,
    },
    progressFill: {
        height: '100%', borderRadius: 2,
        backgroundColor: COLORS.danger,
    },
    debtBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between', alignItems: 'center',
    },
    progressText: { fontSize: 11, color: COLORS.silver, opacity: 0.5 },
    actionBtns: { flexDirection: 'row', gap: 8, alignItems: 'center' },
    editBtn: {
        backgroundColor: COLORS.bg2,
        borderWidth: 1, borderColor: COLORS.border,
        borderRadius: 8, padding: 6,
    },
    editBtnText: { fontSize: 14 },
    deleteBtn: {
        backgroundColor: COLORS.bg2,
        borderWidth: 1, borderColor: 'rgba(255,77,109,0.3)',
        borderRadius: 8, padding: 6,
    },
    deleteBtnText: { fontSize: 14 },
    payBtn: {
        backgroundColor: COLORS.navy,
        borderWidth: 1, borderColor: COLORS.accent,
        borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6,
    },
    payBtnText: { color: COLORS.accent, fontSize: 11, fontWeight: '600' },
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
        fontSize: 18, color: COLORS.textPrimary,
        fontWeight: '700', marginBottom: 4,
    },
    modalSub: {
        fontSize: 12, color: COLORS.silver,
        opacity: 0.5, marginBottom: 16,
    },
    inputLabel: {
        fontSize: 9, color: COLORS.silver,
        opacity: 0.4, letterSpacing: 2,
        textTransform: 'uppercase', marginBottom: 6, marginTop: 12,
    },
    input: {
        backgroundColor: COLORS.bg3,
        borderWidth: 1, borderColor: COLORS.border,
        borderRadius: 12, padding: 12,
        color: COLORS.textPrimary, fontSize: 14,
    },
    modalBtns: { flexDirection: 'row', gap: 10, marginTop: 20 },
    modalCancelBtn: {
        flex: 1, padding: 14, borderRadius: 12,
        backgroundColor: COLORS.bg3,
        borderWidth: 1, borderColor: COLORS.border,
        alignItems: 'center',
    },
    modalCancelText: { color: COLORS.silver, fontWeight: '600' },
    modalSaveBtn: {
        flex: 2, padding: 14, borderRadius: 12,
        backgroundColor: COLORS.electric, alignItems: 'center',
    },
    modalSaveText: { color: '#fff', fontWeight: '700', fontSize: 14 },
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