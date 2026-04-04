import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppColors } from "../context/AppThemeContext";
import { useAuth } from "../context/AuthContext";
import { formatAuthAlertMessage } from "../lib/formatAuthAlertMessage";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const { signIn, signInWithGoogle, isSupabaseConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const styles = useMemo(() => createStyles(colors), [colors]);

  const submit = async () => {
    if (!isSupabaseConfigured) {
      Alert.alert(
        "Chưa cấu hình Supabase",
        "Tạo file .env từ .env.example và điền EXPO_PUBLIC_SUPABASE_URL cùng EXPO_PUBLIC_SUPABASE_ANON_KEY.",
      );
      return;
    }
    if (!email.trim() || !EMAIL_RE.test(email.trim())) {
      Alert.alert("Email", "Nhập địa chỉ email hợp lệ.");
      return;
    }
    if (!password) {
      Alert.alert("Thiếu thông tin", "Nhập mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (e) {
      Alert.alert(
        "Lỗi",
        formatAuthAlertMessage(e, "Không thể đăng nhập."),
      );
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    if (!isSupabaseConfigured) {
      Alert.alert(
        "Chưa cấu hình Supabase",
        "Cấu hình Supabase và bật Google provider trong Dashboard.",
      );
      return;
    }
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      Alert.alert(
        "Google",
        formatAuthAlertMessage(e, "Không thể đăng nhập bằng Google."),
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
        >
          <Text style={styles.title}>SpendingTracker</Text>
          <Text style={styles.sub}>
            Đăng nhập để đồng bộ dữ liệu giữa các thiết bị.
          </Text>

          {!isSupabaseConfigured && (
            <View style={styles.warn}>
              <Text style={styles.warnText}>
                Chưa có EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY.
                Sao chép .env.example thành .env và điền thông tin từ Supabase
                Dashboard.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.googleBtn,
              (loading || googleLoading) && styles.btnDisabled,
            ]}
            onPress={onGoogle}
            disabled={loading || googleLoading}
          >
            {googleLoading ? (
              <ActivityIndicator color={colors.textPrimary} />
            ) : (
              <Text style={styles.googleBtnText}>Đăng nhập với Google</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>hoặc email</Text>
            <View style={styles.divider} />
          </View>

          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            placeholder="you@example.com"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.label}>MẬT KHẨU</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
          />

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={submit}
            disabled={loading || googleLoading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>ĐĂNG NHẬP</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchBtn}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.switchText}>Chưa có tài khoản? Đăng ký</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/** @param {import('../constants/theme').AppColors} c */
function createStyles(c) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.bg0 },
    flex: { flex: 1 },
    scroll: {
      padding: 24,
      paddingTop: 48,
    },
    title: {
      fontSize: 26,
      fontWeight: "700",
      color: c.textPrimary,
      letterSpacing: -0.5,
    },
    sub: {
      marginTop: 8,
      fontSize: 14,
      color: c.silver,
      opacity: 0.7,
      lineHeight: 20,
      marginBottom: 28,
    },
    warn: {
      backgroundColor: "rgba(255,184,0,0.12)",
      borderWidth: 1,
      borderColor: "rgba(255,184,0,0.35)",
      borderRadius: 12,
      padding: 14,
      marginBottom: 20,
    },
    warnText: { color: c.warning, fontSize: 13, lineHeight: 20 },
    googleBtn: {
      backgroundColor: c.bg3,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 14,
      padding: 16,
      alignItems: "center",
    },
    googleBtnText: {
      color: c.textPrimary,
      fontSize: 14,
      fontWeight: "600",
    },
    dividerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginVertical: 22,
    },
    divider: { flex: 1, height: 1, backgroundColor: c.border },
    dividerText: {
      fontSize: 11,
      color: c.silver,
      opacity: 0.5,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    label: {
      fontSize: 9,
      color: c.silver,
      opacity: 0.5,
      letterSpacing: 2,
      marginBottom: 8,
    },
    input: {
      backgroundColor: c.bg3,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      padding: 14,
      color: c.textPrimary,
      fontSize: 15,
      marginBottom: 16,
    },
    btn: {
      backgroundColor: c.electric,
      borderRadius: 14,
      padding: 16,
      alignItems: "center",
      marginTop: 8,
    },
    btnDisabled: { opacity: 0.7 },
    btnText: {
      color: "#fff",
      fontSize: 13,
      fontWeight: "700",
      letterSpacing: 1.2,
    },
    switchBtn: { marginTop: 20, alignItems: "center" },
    switchText: { color: c.accent, fontSize: 13 },
  });
}
