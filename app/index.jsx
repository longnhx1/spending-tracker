// app/index.jsx

// Import các thư viện cần thiết từ React Native và Expo
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import các constants và store từ project
import { CATEGORIES, COLORS } from "../constants/theme";
import useStore from "../store/useStore";

// Hàm format số tiền: chuyển số thành chuỗi có dấu chấm ngăn cách (VD: 2450000 → "2.450.000")
const formatMoney = (amount) => {
  return Math.abs(amount).toLocaleString("vi-VN");
};

// Hàm tìm emoji tương ứng với category id
const getCategoryEmoji = (categoryId) => {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  return cat ? cat.emoji : "📦";
};

// Component chính: Màn hình Home hiển thị tổng quan tài chính
export default function HomeScreen() {
  // Khởi tạo router để điều hướng
  const router = useRouter();

  // Lấy dữ liệu từ Zustand store
  const transactions = useStore((state) => state.transactions);
  const debts = useStore((state) => state.debts);
  const getMonthlySummary = useStore((state) => state.getMonthlySummary);

  // Tính toán tổng thu, chi, và số dư trong tháng hiện tại
  const { income, expense, balance } = getMonthlySummary();

  // Chỉ lấy 5 giao dịch gần nhất để hiển thị
  const recentTx = transactions.slice(0, 5);

  // Tính tổng số nợ còn lại
  const totalDebt = debts.reduce((sum, d) => sum + d.remaining_amount, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header: Phần chào mừng và avatar người dùng */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>XIN CHÀO</Text>
            <Text style={styles.username}>Long 👋</Text>
          </View>
          <View style={styles.avatarRing}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarText}>L</Text>
            </View>
          </View>
        </View>

        {/* Balance Card: Thẻ hiển thị số dư và tổng quan tài chính */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>SỐ DƯ HIỆN TẠI</Text>
          <Text
            style={[
              styles.heroAmount,
              { color: balance < 0 ? COLORS.danger : COLORS.textPrimary },
            ]}
          >
            <Text style={styles.heroCur}>₫</Text>
            {balance < 0 ? "-" : ""}
            {formatMoney(Math.abs(balance))}
          </Text>
          <Text style={styles.heroSub}>
            Tháng {new Date().getMonth() + 1} · {new Date().getFullYear()}
          </Text>

          {/* Các pill hiển thị thu, chi, nợ */}
          <View style={styles.pillRow}>
            <View style={styles.pill}>
              <Text style={styles.pillLabel}>THU</Text>
              <Text style={[styles.pillVal, { color: COLORS.success }]}>
                +{formatMoney(income)}
              </Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillLabel}>CHI</Text>
              <Text style={[styles.pillVal, { color: COLORS.danger }]}>
                -{formatMoney(expense)}
              </Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillLabel}>NỢ</Text>
              <Text style={[styles.pillVal, { color: COLORS.danger }]}>
                {formatMoney(totalDebt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions: Các nút hành động nhanh */}
        <View style={styles.qaRow}>
          {[
            { icon: "➕", label: "Thêm", route: "/add" },
            { icon: "📊", label: "Thống kê", route: "/stats" },
            { icon: "💳", label: "Nợ", route: "/debt" },
            { icon: "🎯", label: "Ngân sách", route: "/budget" },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.qaBtn}
              onPress={() => router.push(item.route)}
            >
              <Text style={styles.qaIcon}>{item.icon}</Text>
              <Text style={styles.qaLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Transactions: Phần hiển thị giao dịch gần đây */}
        <View style={styles.secHead}>
          <Text style={styles.secTitle}>Gần đây</Text>
          <TouchableOpacity onPress={() => router.push("/stats")}>
            <Text style={styles.secMore}>Tất cả →</Text>
          </TouchableOpacity>
        </View>

        {/* Hiển thị danh sách giao dịch hoặc thông báo trống */}
        {recentTx.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              Chưa có giao dịch nào.{"\n"}
              Bấm ➕ để thêm giao dịch đầu tiên!
            </Text>
          </View>
        ) : (
          recentTx.map((tx) => (
            <View key={tx.id} style={styles.txItem}>
              <View style={styles.txIcon}>
                <Text style={styles.txEmoji}>
                  {getCategoryEmoji(tx.category)}
                </Text>
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txName}>{tx.note || tx.category}</Text>
                <Text style={styles.txMeta}>
                  {tx.category} · {tx.date}
                </Text>
              </View>
              <Text
                style={[
                  styles.txAmount,
                  {
                    color:
                      tx.type === "income" ? COLORS.success : COLORS.danger,
                  },
                ]}
              >
                {tx.type === "income" ? "+" : "-"}
                {formatMoney(tx.amount)}
              </Text>
            </View>
          ))
        )}

        {/* Khoảng trống để tránh bị che bởi bottom nav */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation: Thanh điều hướng dưới cùng */}
      <View style={styles.bottomNav}>
        {[
          { icon: "🏠", label: "Home", route: "/" },
          { icon: "📊", label: "Stats", route: "/stats" },
          { icon: "➕", label: "Add", route: "/add" },
          { icon: "💳", label: "Nợ", route: "/debt" },
        ].map((item) => {
          const isActive = item.route === "/";
          return (
            <TouchableOpacity
              key={item.label}
              style={styles.navItem}
              onPress={() => router.push(item.route)}
            >
              <Text style={[styles.navIcon, isActive && styles.navIconActive]}>
                {item.icon}
              </Text>
              <View style={[styles.navDot, isActive && styles.navDotActive]} />
              <Text
                style={[styles.navLabel, isActive && styles.navLabelActive]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg0,
  },
  scroll: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  greeting: {
    fontSize: 10,
    color: COLORS.silver,
    letterSpacing: 2,
    opacity: 0.6,
  },
  username: {
    fontSize: 22,
    color: COLORS.textPrimary,
    fontWeight: "700",
    marginTop: 2,
  },
  avatarRing: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.accent,
  },
  heroCard: {
    margin: 20,
    backgroundColor: COLORS.bg2,
    borderWidth: 1,
    borderColor: "#1A2D45",
    borderRadius: 22,
    padding: 20,
  },
  heroLabel: {
    fontSize: 9,
    color: COLORS.silver,
    letterSpacing: 2.5,
    opacity: 0.5,
  },
  heroAmount: {
    fontSize: 32,
    color: COLORS.textPrimary,
    fontWeight: "400",
    marginTop: 6,
    marginBottom: 2,
    letterSpacing: -1,
  },
  heroCur: {
    fontSize: 16,
    color: COLORS.accent,
  },
  heroSub: {
    fontSize: 10,
    color: COLORS.silver,
    opacity: 0.4,
  },
  pillRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  pill: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "#1E2D3D",
    borderRadius: 12,
    padding: 10,
  },
  pillLabel: {
    fontSize: 8,
    color: COLORS.silver,
    opacity: 0.4,
    letterSpacing: 1.5,
  },
  pillVal: {
    fontSize: 13,
    marginTop: 3,
    fontWeight: "500",
  },
  qaRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  qaBtn: {
    flex: 1,
    backgroundColor: COLORS.bg3,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    gap: 5,
  },
  qaIcon: { fontSize: 18 },
  qaLabel: {
    fontSize: 8,
    color: COLORS.silver,
    opacity: 0.5,
    letterSpacing: 0.8,
  },
  secHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  secTitle: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  secMore: {
    fontSize: 10,
    color: COLORS.accent,
    letterSpacing: 1,
  },
  emptyBox: {
    margin: 20,
    padding: 24,
    backgroundColor: COLORS.bg3,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.silver,
    opacity: 0.5,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 22,
  },
  txItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 12,
  },
  txIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(0,168,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  txEmoji: { fontSize: 16 },
  txInfo: { flex: 1 },
  txName: {
    fontSize: 13,
    color: "#CCC",
    fontWeight: "500",
  },
  txMeta: {
    fontSize: 10,
    color: COLORS.silver,
    opacity: 0.4,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 13,
    fontWeight: "500",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
    paddingBottom: 28,
    paddingHorizontal: 8,
    backgroundColor: "#0A0E13",
    borderTopWidth: 1,
    borderTopColor: "#141C26",
  },
  navItem: {
    alignItems: "center",
    gap: 3,
  },
  navIcon: {
    fontSize: 20,
    opacity: 0.3,
  },
  navIconActive: {
    opacity: 1,
  },
  navDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.accent,
    opacity: 0,
  },
  navDotActive: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 8,
    color: COLORS.silver,
    opacity: 0.3,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  navLabelActive: {
    color: COLORS.accent,
    opacity: 1,
  },
});
