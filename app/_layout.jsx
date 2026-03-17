import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { initDatabase } from '../database/db';
import useStore from '../store/useStore';

export default function RootLayout() {
  const loadTransactions = useStore(state => state.loadTransactions);
  const loadDebts = useStore(state => state.loadDebts);

  useEffect(() => {
    const setup = async () => {
      await initDatabase();
      await loadTransactions();
      await loadDebts();
    };
    setup();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="add" options={{ headerShown: false }} />
        <Stack.Screen name="stats" options={{ headerShown: false }} />
        <Stack.Screen name="debt" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}