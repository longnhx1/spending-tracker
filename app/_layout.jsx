// app/_layout.jsx
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { initDatabase } from "../database/db";
import useStore from "../store/useStore";

export default function RootLayout() {
  const loadTransactions = useStore((state) => state.loadTransactions);
  const loadDebts = useStore((state) => state.loadDebts);
  const loadCategories = useStore((state) => state.loadCategories);
  const isDark = useStore((state) => state.isDark);

  useEffect(() => {
    initDatabase();
    loadTransactions();
    loadDebts();
    loadCategories();
  }, []);

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="add" options={{ headerShown: false }} />
        <Stack.Screen name="stats" options={{ headerShown: false }} />
        <Stack.Screen name="debt" options={{ headerShown: false }} />
        <Stack.Screen name="budget" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

