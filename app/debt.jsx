import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppColors } from "../context/AppThemeContext";

export default function DebtScreen() {
  const colors = useAppColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Màn hình theo dõi nợ</Text>
    </View>
  );
}

/** @param {import('../constants/theme').AppColors} c */
function createStyles(c) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.bg0,
      alignItems: "center",
      justifyContent: "center",
    },
    text: { color: c.textPrimary, fontSize: 16 },
  });
}
