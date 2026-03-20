// app/settings.jsx
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import useStore from '../store/useStore';
import { FONTS } from '../constants/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const colors = useStore((s) => s.colors);
  const isDark = useStore((s) => s.isDark);
  const toggleTheme = useStore((s) => s.toggleTheme);

  const s = makeStyles(colors);

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Cài đặt</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Section: Giao diện */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>GIAO DIỆN</Text>

        <View style={s.row}>
          <View style={s.rowLeft}>
            <Text style={s.rowIcon}>{isDark ? '🌙' : '☀️'}</Text>
            <View>
              <Text style={s.rowTitle}>
                {isDark ? 'Chế độ tối' : 'Chế độ sáng'}
              </Text>
              <Text style={s.rowSub}>
                {isDark ? 'Đang dùng nền tối' : 'Đang dùng nền sáng'}
              </Text>
            </View>
          </View>
          <Switch
            value={!isDark}
            onValueChange={toggleTheme}
            trackColor={{
              false: colors.surface2,
              true: colors.accentMid,
            }}
            thumbColor={colors.accent}
            ios_backgroundColor={colors.surface2}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.bg0,
    },

    // ── Header ──────────────────────────────────────
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border,
    },
    backBtn: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      backgroundColor: colors.surface2,
    },
    backIcon: {
      fontSize: 18,
      color: colors.text1,
      fontFamily: FONTS.medium,
    },
    headerTitle: {
      fontSize: 17,
      fontFamily: FONTS.semiBold,
      color: colors.text1,
    },

    // ── Section ─────────────────────────────────────
    section: {
      marginTop: 24,
      marginHorizontal: 16,
      backgroundColor: colors.surface,
      borderRadius: 14,
      borderWidth: 0.5,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    sectionLabel: {
      fontSize: 11,
      fontFamily: FONTS.semiBold,
      color: colors.text3,
      letterSpacing: 0.8,
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 8,
    },

    // ── Row ─────────────────────────────────────────
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderTopWidth: 0.5,
      borderTopColor: colors.border,
    },
    rowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    rowIcon: {
      fontSize: 22,
      width: 36,
      textAlign: 'center',
    },
    rowTitle: {
      fontSize: 15,
      fontFamily: FONTS.medium,
      color: colors.text1,
    },
    rowSub: {
      fontSize: 12,
      fontFamily: FONTS.regular,
      color: colors.text3,
      marginTop: 2,
    },
  });
