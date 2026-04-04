import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as SplashScreen from "expo-splash-screen";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { completeOAuthFromUrl } from "../lib/authOAuth";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      await SplashScreen.preventAutoHideAsync();

      if (!isSupabaseConfigured) {
        if (mounted) setInitialized(true);
        await SplashScreen.hideAsync();
        return;
      }

      const {
        data: { session: initial },
      } = await supabase.auth.getSession();
      if (mounted) {
        setSession(initial);
        setInitialized(true);
      }
      await SplashScreen.hideAsync();
    })();

    if (!isSupabaseConfigured) {
      return () => {
        mounted = false;
      };
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => {
      if (mounted) setSession(next);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) throw error;
  }, []);

  const signUp = useCallback(async (email, password, username) => {
    const emailRedirectTo = Linking.createURL("auth/callback");
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo,
        data: {
          username: username.trim(),
          display_name: username.trim(),
        },
      },
    });
    if (error) throw error;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const redirectTo = Linking.createURL("auth/callback");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });
    if (error) throw error;
    if (!data?.url) throw new Error("Không lấy được URL đăng nhập Google.");

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type !== "success" || !result.url) {
      return;
    }

    const { error: sessionError } = await completeOAuthFromUrl(result.url);
    if (sessionError) throw sessionError;
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  }, []);

  const value = useMemo(
    () => ({
      session,
      initialized,
      isSupabaseConfigured,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
    }),
    [session, initialized, signIn, signUp, signInWithGoogle, signOut],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
