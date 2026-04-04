import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppThemeProvider, useAppTheme } from "../context/AppThemeContext";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { initDatabase } from "../database/db";
import { migrateLocalToCloud } from "../lib/migrateLocalToSupabase";
import useStore from "../store/useStore";

function ThemedStatusBar() {
  const { isDark } = useAppTheme();
  return <StatusBar style={isDark ? "light" : "dark"} />;
}

function RootNavigation() {
  const { session, initialized, isSupabaseConfigured } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const loadTransactions = useStore((state) => state.loadTransactions);
  const loadDebts = useStore((state) => state.loadDebts);
  const loadCategories = useStore((state) => state.loadCategories);
  const clearLocalData = useStore((state) => state.clearLocalData);
  const setCloudSyncEnabled = useStore((state) => state.setCloudSyncEnabled);

  useEffect(() => {
    if (!initialized) return;
    const root = segments[0];
    const inAuth =
      root === "login" ||
      root === "register" ||
      (root === "auth" && segments[1] === "callback");

    if (!isSupabaseConfigured) {
      if (!inAuth) router.replace("/register");
      return;
    }
    if (!session && !inAuth) {
      router.replace("/register");
    } else if (session && (root === "login" || root === "register")) {
      router.replace("/");
    } else if (session && root === "auth" && segments[1] === "callback") {
      router.replace("/");
    }
  }, [
    initialized,
    session,
    segments,
    isSupabaseConfigured,
    router,
  ]);

  useEffect(() => {
    setCloudSyncEnabled(Boolean(session?.user?.id && isSupabaseConfigured));
  }, [session?.user?.id, isSupabaseConfigured, setCloudSyncEnabled]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await initDatabase();
      loadCategories();
      if (session?.user?.id && isSupabaseConfigured) {
        await migrateLocalToCloud(session.user.id);
        if (cancelled) return;
        await loadTransactions();
        await loadDebts();
      } else if (!isSupabaseConfigured) {
        loadTransactions();
        loadDebts();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    session?.user?.id,
    isSupabaseConfigured,
    loadTransactions,
    loadDebts,
    loadCategories,
  ]);

  useEffect(() => {
    if (!session) {
      clearLocalData();
    }
  }, [session, clearLocalData]);

  return (
    <>
      <ThemedStatusBar />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="register" />
        <Stack.Screen name="login" />
        <Stack.Screen name="auth/callback" />
        <Stack.Screen name="index" />
        <Stack.Screen name="add" />
        <Stack.Screen name="stats" />
        <Stack.Screen name="debt" />
        <Stack.Screen name="budget" />
        <Stack.Screen name="settings" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppThemeProvider>
        <RootNavigation />
      </AppThemeProvider>
    </AuthProvider>
  );
}
