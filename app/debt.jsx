import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export default function DebtScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Màn hình theo dõi nợ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: COLORS.textPrimary, fontSize: 16 },
});