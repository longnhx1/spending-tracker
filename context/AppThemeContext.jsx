import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getAppColors } from "../constants/theme";

const STORAGE_KEY = "app_is_dark";

const AppThemeContext = createContext(null);

export function AppThemeProvider({ children }) {
  const [isDark, setIsDarkState] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (mounted && raw !== null) {
          setIsDarkState(raw === "1");
        }
      } catch {
        /* ignore */
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const setIsDark = useCallback(async (next) => {
    setIsDarkState(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const colors = useMemo(() => getAppColors(isDark), [isDark]);

  const value = useMemo(
    () => ({
      isDark,
      setIsDark,
      colors,
      ready,
    }),
    [isDark, setIsDark, colors, ready],
  );

  return (
    <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(AppThemeContext);
  if (!ctx) {
    throw new Error("useAppTheme must be used within AppThemeProvider");
  }
  return ctx;
}

/** Shorthand for theme-aware palette */
export function useAppColors() {
  return useAppTheme().colors;
}
