// app/settings.jsx
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { useAuth } from "../context/AuthContext";
import { FONTS } from "../constants/theme";
import { isSupabaseConfigured } from "../lib/supabase";
import useStore from "../store/useStore";
import { BackIcon } from "../components/icons";

export default function SettingsScreen() {
  const router = useRouter();
  const { session, signOut } = useAuth();
  const colors = useStore((s) => s.colors);
  const isDark = useStore((s) => s.isDark);
  const setThemeIsDark = useStore((s) => s.setThemeIsDark);

  const s = makeStyles(colors);
  const email = session?.user?.email?.trim() || "";
  const version =
    Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? "—";

  const onSignOut = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => {
          signOut();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <BackIcon size={18} color={colors.text1} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Cài đặt</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.section}>
          <Text style={s.sectionLabel}>TÀI KHOẢN</Text>
          <View style={s.row}>
            <View style={s.rowLeft}>
              <Text style={s.rowIcon}>👤</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.rowTitle}>Email</Text>
                <Text style={s.rowSub} numberOfLines={2}>
                  {email || "Chưa đăng nhập"}
                </Text>
              </View>
            </View>
          </View>
          {session ? (
            <TouchableOpacity style={s.signOutRow} onPress={onSignOut}>
              <Text style={s.signOutText}>Đăng xuất</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={s.section}>
          <Text style={s.sectionLabel}>ĐỒNG BỘ</Text>
          <View style={s.row}>
            <View style={s.rowLeft}>
              <Text style={s.rowIcon}>☁️</Text>
              <View>
                <Text style={s.rowTitle}>Supabase</Text>
                <Text style={s.rowSub}>
                  {isSupabaseConfigured
                    ? "Đã cấu hình — dữ liệu có thể lưu trên cloud"
                    : "Chưa cấu hình — chỉ dùng dữ liệu trên máy"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionLabel}>GIAO DIỆN</Text>

          <View style={s.row}>
            <View style={s.rowLeft}>
              <Text style={s.rowIcon}>{isDark ? "🌙" : "☀️"}</Text>
              <View>
                <Text style={s.rowTitle}>
                  {isDark ? "Chế độ tối" : "Chế độ sáng"}
                </Text>
                <Text style={s.rowSub}>
                  {isDark ? "Đang dùng nền tối" : "Đang dùng nền sáng"}
                </Text>
              </View>
            </View>
            <Switch
              value={!isDark}
              onValueChange={(light) => setThemeIsDark(!light)}
              trackColor={{
                false: colors.surface2,
                true: colors.accentMid,
              }}
              thumbColor={colors.accent}
              ios_backgroundColor={colors.surface2}
            />
          </View>
        </View>

        <Text style={s.version}>Phiên bản {version}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.bg0,
    },
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 32 },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border,
    },
    backBtn: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      backgroundColor: colors.surface2,
    },
    headerTitle: {
      fontSize: 17,
      fontFamily: FONTS.semiBold,
      color: colors.text1,
    },

    section: {
      marginTop: 20,
      marginHorizontal: 16,
      backgroundColor: colors.surface,
      borderRadius: 14,
      borderWidth: 0.5,
      borderColor: colors.border,
      overflow: "hidden",
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

    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderTopWidth: 0.5,
      borderTopColor: colors.border,
    },
    rowLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    rowIcon: {
      fontSize: 22,
      width: 36,
      textAlign: "center",
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

    signOutRow: {
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderTopWidth: 0.5,
      borderTopColor: colors.border,
      alignItems: "center",
    },
    signOutText: {
      fontSize: 15,
      fontFamily: FONTS.semiBold,
      color: colors.danger,
    },

    version: {
      textAlign: "center",
      fontSize: 12,
      fontFamily: FONTS.regular,
      color: colors.text3,
      marginTop: 24,
      opacity: 0.7,
    },
  });
