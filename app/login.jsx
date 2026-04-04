import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../hooks/useTheme";
import { formatAuthAlertMessage } from "../lib/formatAuthAlertMessage";
import makeAuthStyles from "../styles/authStyles";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { signIn, signInWithGoogle, isSupabaseConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const styles = useMemo(() => makeAuthStyles(colors), [colors]);

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
          <Text style={styles.brandTitle}>SpendingTracker</Text>
          <Text style={styles.brandSub}>
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

          <View style={styles.card}>
            <TouchableOpacity
              style={[
                styles.googleBtn,
                (loading || googleLoading) && styles.btnDisabled,
              ]}
              onPress={onGoogle}
              disabled={loading || googleLoading}
            >
              {googleLoading ? (
                <ActivityIndicator color={colors.text1} />
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
              placeholderTextColor={colors.text3}
            />

            <Text style={styles.label}>MẬT KHẨU</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              placeholder="••••••••"
              placeholderTextColor={colors.text3}
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
          </View>

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
