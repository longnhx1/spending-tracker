// styles/homeStyles.js
import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

export default StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.bg0 },
    scroll: { flex: 1 },
    header: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 16,
    },
    greeting: {
        fontSize: 11, color: COLORS.silver,
        letterSpacing: 2, opacity: 0.6,
        fontFamily: FONTS.medium,
    },
    username: {
        fontSize: 24, color: COLORS.textPrimary,
        fontFamily: FONTS.extrabold, marginTop: 2,
    },
    avatarRing: {
        width: 42, height: 42, borderRadius: 21,
        borderWidth: 1.5, borderColor: COLORS.accent,
        alignItems: 'center', justifyContent: 'center',
    },
    avatarInner: {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: COLORS.navy,
        alignItems: 'center', justifyContent: 'center',
    },
    avatarText: {
        fontSize: 14, color: COLORS.accent, fontFamily: FONTS.bold,
    },
    heroCard: {
        margin: 20, backgroundColor: COLORS.bg2,
        borderWidth: 1, borderColor: '#1A2D45',
        borderRadius: 22, padding: 20,
    },
    heroLabel: {
        fontSize: 9, color: COLORS.silver,
        letterSpacing: 2.5, opacity: 0.5, fontFamily: FONTS.medium,
    },
    heroAmount: {
        fontSize: 36, color: COLORS.textPrimary,
        marginTop: 6, marginBottom: 2,
        letterSpacing: -1, fontFamily: FONTS.extrabold,
    },
    heroCur: { fontSize: 18, color: COLORS.accent },
    heroSub: {
        fontSize: 10, color: COLORS.silver,
        opacity: 0.4, fontFamily: FONTS.regular,
    },
    pillRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
    pill: {
        flex: 1, backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1, borderColor: '#1E2D3D', borderRadius: 12, padding: 10,
    },
    pillLabel: {
        fontSize: 8, color: COLORS.silver,
        opacity: 0.4, letterSpacing: 1.5, fontFamily: FONTS.semibold,
    },
    pillVal: { fontSize: 14, marginTop: 3, fontFamily: FONTS.semibold },
    qaRow: {
        flexDirection: 'row', gap: 8,
        paddingHorizontal: 20, marginBottom: 4,
    },
    qaBtn: {
        flex: 1, backgroundColor: COLORS.bg3,
        borderWidth: 1, borderColor: COLORS.border,
        borderRadius: 14, padding: 12, alignItems: 'center', gap: 5,
    },
    qaIcon: { fontSize: 20 },
    qaLabel: {
        fontSize: 9, color: COLORS.silver,
        opacity: 0.6, fontFamily: FONTS.medium,
    },
    secHead: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', paddingHorizontal: 20,
        paddingTop: 16, paddingBottom: 8,
    },
    secTitle: {
        fontSize: 14, color: COLORS.textPrimary, fontFamily: FONTS.bold,
    },
    secMore: {
        fontSize: 10, color: COLORS.accent,
        letterSpacing: 1, fontFamily: FONTS.semibold,
    },
    emptyBox: {
        margin: 20, padding: 24, backgroundColor: COLORS.bg3,
        borderRadius: 16, borderWidth: 1,
        borderColor: COLORS.border, alignItems: 'center',
    },
    emptyText: {
        color: COLORS.silver, opacity: 0.5,
        textAlign: 'center', fontSize: 13,
        lineHeight: 22, fontFamily: FONTS.regular,
    },
    txItem: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 20, paddingVertical: 10, gap: 12,
    },
    txIcon: {
        width: 40, height: 40, borderRadius: 13,
        backgroundColor: 'rgba(0,168,255,0.08)',
        alignItems: 'center', justifyContent: 'center',
    },
    txEmoji: { fontSize: 18 },
    txInfo: { flex: 1 },
    txName: { fontSize: 14, color: '#DDD', fontFamily: FONTS.semibold },
    txMeta: {
        fontSize: 10, color: COLORS.silver,
        opacity: 0.4, marginTop: 2, fontFamily: FONTS.regular,
    },
    txAmount: { fontSize: 14, fontFamily: FONTS.semibold },
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
        fontSize: 8, color: COLORS.silver, opacity: 0.3,
        letterSpacing: 1, textTransform: 'uppercase', fontFamily: FONTS.medium,
    },
    navLabelActive: { color: COLORS.accent, opacity: 1 },
});
