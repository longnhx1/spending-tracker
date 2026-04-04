import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { openBrowserAsync, WebBrowserPresentationStyle } from "expo-web-browser";
import { useAppTheme } from "../context/AppThemeContext";

const GITHUB_URL = "https://github.com/longnhx1";

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark, setIsDark, colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const openGithub = async () => {
    await openBrowserAsync(GITHUB_URL, {
      presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Cài đặt</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>Giao diện</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>
              {isDark ? "🌙 Chế độ tối" : "☀️ Chế độ sáng"}
            </Text>
            <Switch
              value={isDark}
              onValueChange={setIsDark}
              trackColor={{ false: colors.trackMuted, true: colors.electric }}
              thumbColor="#f4f4f5"
            />
          </View>
          <Text style={styles.hint}>
            Bật để dùng nền tối chữ sáng; tắt để nền sáng chữ tối.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Giới thiệu</Text>
        <View style={styles.card}>
          <Text style={styles.aboutTitle}>Nhà phát triển & mã nguồn</Text>
          <Text style={styles.aboutBody}>
            Dự án SpendingTracker — xem mã nguồn và cập nhật trên GitHub.
          </Text>
          <TouchableOpacity onPress={openGithub}>
            <Text style={styles.link}>{GITHUB_URL}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => Linking.openURL(GITHUB_URL)}
          >
            <Text style={styles.secondaryBtnText}>Mở trong trình duyệt hệ thống</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/** @param {import('../constants/theme').AppColors} c */
function createStyles(c) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.bg0 },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 8,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: c.bg3,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: "center",
      justifyContent: "center",
    },
    backText: { color: c.silver, fontSize: 18 },
    title: { fontSize: 20, fontWeight: "700", color: c.textPrimary },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
    sectionLabel: {
      fontSize: 10,
      color: c.silver,
      opacity: 0.5,
      letterSpacing: 2,
      marginTop: 20,
      marginBottom: 10,
    },
    card: {
      backgroundColor: c.bg3,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 16,
      padding: 16,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    rowLabel: {
      fontSize: 15,
      color: c.textPrimary,
      fontWeight: "600",
      flex: 1,
      paddingRight: 12,
    },
    hint: {
      marginTop: 10,
      fontSize: 12,
      color: c.silver,
      opacity: 0.65,
      lineHeight: 18,
    },
    aboutTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: c.textPrimary,
      marginBottom: 8,
    },
    aboutBody: {
      fontSize: 13,
      color: c.silver,
      lineHeight: 20,
      marginBottom: 12,
    },
    link: {
      fontSize: 14,
      color: c.accent,
      fontWeight: "600",
    },
    secondaryBtn: { marginTop: 14 },
    secondaryBtnText: {
      fontSize: 12,
      color: c.silver,
      textDecorationLine: "underline",
    },
  });
}
