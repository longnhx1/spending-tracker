import useStore from '../store/useStore';

export function useTheme() {
  const colors = useStore((s) => s.colors);
  const isDark = useStore((s) => s.isDark);
  const toggle = useStore((s) => s.toggleTheme);
  return { colors, isDark, toggleTheme: toggle };
}

