// app/index.jsx
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
import makeHomeStyles from "../styles/homeStyles";

import useStore from "../store/useStore";

const formatMoney = (amount) => {
  return Math.abs(amount).toLocaleString("vi-VN");
};

export default function HomeScreen() {
  const router = useRouter();
  const colors = useStore((s) => s.colors);
  const styles = makeHomeStyles(colors);
  const categories = useStore((s) => s.categories);

  const transactions = useStore((state) => state.transactions);
  const debts = useStore((state) => state.debts);
  const getMonthlySummary = useStore((state) => state.getMonthlySummary);
  const headerStyles = makeHeaderStyles(colors);

  const getCategoryEmoji = (categoryId) => {
    if (categoryId === "thu_nhap") return "💸";
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.emoji : "📦";
  };

  const getCategoryLabel = (categoryId) => {
    if (categoryId === "thu_nhap") return "Thu nhập";
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.label : categoryId;
  };

  const { income, expense, balance } = getMonthlySummary();
  const recentTx = transactions.slice(0, 5);
  const totalDebt = debts.reduce((sum, d) => sum + d.remaining_amount, 0);

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Header với nút Settings ── */}
      <View style={headerStyles.header}>
        <Text style={headerStyles.appName}>SpendingTracker</Text>
        <TouchableOpacity
          style={headerStyles.settingsBtn}
          onPress={() => router.push("/settings")}
        >
          <Text style={headerStyles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>SỐ DƯ HIỆN TẠI</Text>
          <Text
            style={[
              styles.heroAmount,
              { color: balance < 0 ? colors.danger : colors.textPrimary },
            ]}
          >
            {balance < 0 ? "-" : ""}
            {formatMoney(Math.abs(balance))} vnd
          </Text>
          <Text style={styles.heroSub}>
            Tháng {new Date().getMonth() + 1} · {new Date().getFullYear()}
          </Text>

          <View style={styles.pillRow}>
            <View style={styles.pill}>
              <Text style={styles.pillLabel}>THU</Text>
              <Text style={[styles.pillVal, { color: colors.success }]}>
                +{formatMoney(income)} vnd
              </Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillLabel}>CHI</Text>
              <Text style={[styles.pillVal, { color: colors.danger }]}>
                -{formatMoney(expense)} vnd
              </Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillLabel}>NỢ</Text>
              <Text style={[styles.pillVal, { color: colors.danger }]}>
                {formatMoney(totalDebt)} vnd
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
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

        {/* Recent Transactions */}
        <View style={styles.secHead}>
          <Text style={styles.secTitle}>Gần đây</Text>
          <TouchableOpacity onPress={() => router.push("/stats")}>
            <Text style={styles.secMore}>Tất cả →</Text>
          </TouchableOpacity>
        </View>

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
                <Text style={styles.txName}>
                  {tx.note || getCategoryLabel(tx.category)}
                </Text>
                <Text style={styles.txMeta}>
                  {getCategoryLabel(tx.category)} · {tx.date}
                </Text>
              </View>
              <Text
                style={[
                  styles.txAmount,
                  {
                    color:
                      tx.type === "income" ? colors.success : colors.danger,
                  },
                ]}
              >
                {tx.type === "income" ? "+" : "-"}
                {formatMoney(tx.amount)} vnd
              </Text>
            </View>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { icon: "🏠", label: "Trang chủ", route: "/" },
          { icon: "📊", label: "Thống kê", route: "/stats" },
          { icon: "➕", label: "Thêm", route: "/add" },
          { icon: "💳", label: "Nợ", route: "/debt" },
        ].map((item) => {
          const isActive = item.route === "/";
          return (
            <TouchableOpacity
              key={item.label}
              style={styles.navItem}
              onPress={() => {
                if (isActive) return;
                router.push(item.route);
              }}
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

// Style riêng cho header (để dùng đúng mode theme hiện tại)
const makeHeaderStyles = (colors) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    appName: {
      fontSize: 18,
      fontFamily: "BeVietnamPro_700Bold",
      color: colors.textPrimary,
    },
    settingsBtn: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: colors.surface2 || colors.gray1,
      alignItems: "center",
      justifyContent: "center",
    },
    settingsIcon: {
      fontSize: 20,
    },
  });
