import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (process.env.EXPO_PUBLIC_SUPABASE_URL ?? "").trim();
const supabaseAnonKey = (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey,
);

/** Không được gọi createClient("", …) — SDK ném lỗi; Expo Go cũng có lúc bundle thiếu env. */
const clientUrl = isSupabaseConfigured
  ? supabaseUrl
  : "https://placeholder.supabase.co";
const clientKey = isSupabaseConfigured
  ? supabaseAnonKey
  : "sb-placeholder-anon-key-not-configured";

const authOptions = {
  storage: AsyncStorage,
  autoRefreshToken: isSupabaseConfigured,
  persistSession: isSupabaseConfigured,
  detectSessionInUrl: false,
};
if (!isSupabaseConfigured) {
  authOptions.storageKey = "sb-spendingtracker-env-missing";
}

export const supabase = createClient(clientUrl, clientKey, {
  auth: authOptions,
});
