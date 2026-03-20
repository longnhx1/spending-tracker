// app/index.jsx

// Import các thư viện cần thiết từ React Native và Expo
import { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/homeStyles";

// Import các constants và store từ project
import { COLORS, CATEGORIES } from "../constants/theme";
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
            <Text style={styles.greeting}>こんにちは</Text>
            <Text style={styles.username}>お兄ちゃん</Text>
          </View>
          <View style={styles.avatarRing}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarText}>兄</Text>
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
