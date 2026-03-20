import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.bg0 },
    header: {
        paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8,
    },
    title: { fontSize: 24, color: COLORS.textPrimary, fontWeight: '800' },
    subtitle: { fontSize: 11, color: COLORS.silver, opacity: 0.5, marginTop: 2 },
    overviewCard: {
        margin: 20,
        backgroundColor: COLORS.bg2,
        borderWidth: 1, borderColor: '#1A2D45',
        borderRadius: 22, padding: 20,
    },
    overviewLabel: {
        fontSize: 9, color: COLORS.silver,
        opacity: 0.5, letterSpacing: 2.5,
    },
    overviewAmount: {
        fontSize: 30, color: COLORS.textPrimary,
        fontWeight: '300', marginTop: 6, letterSpacing: -1,
    },
    overviewRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 14, marginBottom: 12,
    },
    overviewSub: {
        fontSize: 9, color: COLORS.silver,
        opacity: 0.4, letterSpacing: 1,
    },
    overviewVal: {
        fontSize: 14, color: COLORS.textPrimary,
        fontWeight: '500', marginTop: 3,
    },
    masterTrack: {
        height: 6, backgroundColor: '#1A2535',
        borderRadius: 3,
    },
    masterFill: {
        height: '100%', borderRadius: 3,
    },
    section: { paddingHorizontal: 20, marginBottom: 10 },
    sectionTitle: {
        fontSize: 13, color: COLORS.textPrimary,
        fontWeight: '600', marginBottom: 4,
    },
    sectionSub: {
        fontSize: 11, color: COLORS.silver,
        opacity: 0.4, marginBottom: 14,
    },
    catCard: {
        backgroundColor: COLORS.bg3,
        borderWidth: 1, borderColor: COLORS.border,
        borderRadius: 16, padding: 14, marginBottom: 10,
    },
    catCardOver: { borderColor: 'rgba(255,77,109,0.4)' },
    catTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    catLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    catEmoji: { fontSize: 24 },
    catName: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '600' },
    catSub: { fontSize: 10, color: COLORS.silver, opacity: 0.5, marginTop: 2 },
    catSubMuted: {
        fontSize: 10, color: COLORS.silver,
        opacity: 0.3, marginTop: 2, fontStyle: 'italic',
    },
    catRight: { alignItems: 'flex-end' },
    catPercent: { fontSize: 14, fontWeight: '600' },
    overTag: {
        fontSize: 9, color: COLORS.danger,
        backgroundColor: 'rgba(255,77,109,0.1)',
        paddingHorizontal: 6, paddingVertical: 2,
        borderRadius: 4, marginTop: 3,
    },
    addTag: {
        fontSize: 11, color: COLORS.accent,
        opacity: 0.6,
    },
    progressTrack: {
        height: 4, backgroundColor: '#1A2535', borderRadius: 2,
    },
    progressFill: {
        height: '100%', borderRadius: 2,
    },
    hint: {
        fontSize: 11, color: COLORS.silver,
        opacity: 0.3, textAlign: 'center',
        marginTop: 8, marginBottom: 4,
    },
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modalBox: {
        backgroundColor: COLORS.bg1,
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: 24, borderTopWidth: 1, borderColor: COLORS.border,
    },
    modalHeader: {
        flexDirection: 'row', alignItems: 'center',
        gap: 12, marginBottom: 16,
    },
    modalEmoji: { fontSize: 32 },
    modalTitle: {
        fontSize: 16, color: COLORS.textPrimary, fontWeight: '700',
    },
    modalSub: { fontSize: 11, color: COLORS.silver, opacity: 0.5, marginTop: 2 },
    inputLabel: {
        fontSize: 9, color: COLORS.silver,
        opacity: 0.4, letterSpacing: 2,
        textTransform: 'uppercase', marginBottom: 8,
    },
    input: {
        backgroundColor: COLORS.bg3,
        borderWidth: 1, borderColor: COLORS.border,
        borderRadius: 12, padding: 14,
        color: COLORS.textPrimary, fontSize: 20,
        fontWeight: '300', letterSpacing: -0.5,
    },
    modalBtns: { flexDirection: 'row', gap: 10, marginTop: 16 },
    cancelBtn: {
        flex: 1, padding: 14, borderRadius: 12,
        backgroundColor: COLORS.bg3,
        borderWidth: 1, borderColor: COLORS.border,
        alignItems: 'center',
    },
    cancelText: { color: COLORS.silver, fontWeight: '600' },
    saveBtn: {
        flex: 2, padding: 14, borderRadius: 12,
        backgroundColor: COLORS.electric, alignItems: 'center',
    },
    saveText: { color: '#fff', fontWeight: '700', fontSize: 14 },
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