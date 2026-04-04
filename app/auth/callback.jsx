import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import * as Linking from "expo-linking";
import { useAppColors } from "../../context/AppThemeContext";
import { completeOAuthFromUrl } from "../../lib/authOAuth";

/** Tránh nhầm `error_code=…` với tham số PKCE `code=`. */
function isAuthCallbackUrl(url) {
  if (!url) return false;
  try {
    const u = new URL(url);
    const piece = (u.hash?.replace(/^#/, "") || u.search?.replace(/^\?/, "") || "").trim();
    const params = new URLSearchParams(piece);
    if (params.get("access_token") && params.get("refresh_token")) return true;
    if (params.get("code")) return true;
    if (params.get("error") || params.get("error_description")) return true;
    return false;
  } catch {
    return /(?:^|[?&#])code=/.test(url) || url.includes("access_token");
  }
}

export default function AuthCallbackScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const [message, setMessage] = useState("Đang hoàn tất đăng nhập…");

  useEffect(() => {
    let cancelled = false;

    const handleUrl = async (url) => {
      if (cancelled || !url) return;
      if (!isAuthCallbackUrl(url)) return;
      const { error } = await completeOAuthFromUrl(url);
      if (cancelled) return;
      if (error) setMessage(error.message ?? "Đăng nhập thất bại.");
      else router.replace("/");
    };

    Linking.getInitialURL().then((u) => {
      if (u) handleUrl(u);
    });

    const sub = Linking.addEventListener("url", ({ url }) => {
      handleUrl(url);
    });

    return () => {
      cancelled = true;
      sub.remove();
    };
  }, [router]);

  return (
    <View style={[styles.box, { backgroundColor: colors.bg0 }]}>
      <ActivityIndicator color={colors.accent} />
      <Text style={[styles.txt, { color: colors.silver }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 24,
  },
  txt: { fontSize: 14, textAlign: "center" },
});
