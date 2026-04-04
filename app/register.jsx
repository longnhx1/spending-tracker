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

export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { signUp, isSupabaseConfigured } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const styles = useMemo(() => makeAuthStyles(colors), [colors]);

  const submit = async () => {
    if (!isSupabaseConfigured) {
      Alert.alert(
        "Chưa cấu hình Supabase",
        "Tạo file .env từ .env.example và điền EXPO_PUBLIC_SUPABASE_URL cùng EXPO_PUBLIC_SUPABASE_ANON_KEY.",
      );
      return;
    }
    if (!username.trim()) {
      Alert.alert("Thiếu thông tin", "Nhập tên hiển thị (username).");
      return;
    }
    if (!email.trim() || !EMAIL_RE.test(email.trim())) {
      Alert.alert("Email", "Nhập địa chỉ email hợp lệ.");
      return;
    }
    if (!password || password.length < 6) {
      Alert.alert("Mật khẩu", "Mật khẩu cần ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, username);
      Alert.alert(
        "Đăng ký",
        "Kiểm tra email để xác nhận tài khoản (nếu bật xác nhận email trên Supabase), sau đó đăng nhập.",
      );
    } catch (e) {
      Alert.alert(
        "Lỗi",
        formatAuthAlertMessage(e, "Không thể đăng ký."),
      );
    } finally {
      setLoading(false);
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
          <Text style={styles.brandSub}>Tạo tài khoản để đồng bộ dữ liệu.</Text>

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
            <Text style={styles.label}>USERNAME</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoComplete="username"
              placeholder="Tên hiển thị"
              placeholderTextColor={colors.text3}
            />

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
              autoComplete="new-password"
              placeholder="••••••••"
              placeholderTextColor={colors.text3}
            />

            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={submit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>ĐĂNG KÝ</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.switchBtn}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.switchText}>Đã có tài khoản? Đăng nhập</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
