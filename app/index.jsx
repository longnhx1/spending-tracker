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
import { formatMoney, formatMoneyHero } from "../utils/formatMoney";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useStore((s) => s.colors);
  const styles = makeHomeStyles(colors);
  const categories = useStore((s) => s.categories);

  const transactions = useStore((state) => state.transactions);
  const debts = useStore((state) => state.debts);
  const getMonthlySummary = useStore((state) => state.getMonthlySummary);
  const headerStyles = makeHeaderStyles(colors);
  const currentMonthStr = useStore((s) => s.currentMonth);

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

  // Trend (so sánh balance so với tháng trước)
  const [y, m] = currentMonthStr.split("-").map(Number);
  const prevMonth = new Date(y, m - 2, 1); // m-1 (JS: month 0-based)
  const prevMonthStr = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, "0")}`;

  const currTx = transactions.filter((tx) => tx.date.startsWith(currentMonthStr));
  const prevTx = transactions.filter((tx) => tx.date.startsWith(prevMonthStr));

  const currIncome = currTx.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + tx.amount, 0);
  const currExpense = currTx.filter((tx) => tx.type === "expense").reduce((sum, tx) => sum + tx.amount, 0);
  const prevIncome = prevTx.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + tx.amount, 0);
  const prevExpense = prevTx.filter((tx) => tx.type === "expense").reduce((sum, tx) => sum + tx.amount, 0);

  const currBalance = currIncome - currExpense;
  const prevBalance = prevIncome - prevExpense;

  const trendPercent =
    prevBalance !== 0
      ? ((currBalance - prevBalance) / Math.abs(prevBalance)) * 100
      : currBalance !== 0
        ? 100
        : 0;
  const trendLabel = `${trendPercent >= 0 ? "+" : ""}${trendPercent.toFixed(1)}%`;
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
            style={styles.heroAmount}
          >
            {balance < 0 ? "-" : ""}
            {formatMoneyHero(balance)}
          </Text>
          <Text style={styles.heroCur}>đ</Text>
          <Text
            style={[
              styles.heroSub,
              { color: trendPercent >= 0 ? colors.success : colors.danger },
            ]}
          >
            {trendLabel}
          </Text>

          <View style={styles.pillRow}>
            <View style={styles.pill}>
              <Text style={styles.pillLabel}>THU</Text>
              <Text style={[styles.pillVal, { color: colors.success }]}>
                {formatMoney(income, "signed")} vnd
              </Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillLabel}>CHI</Text>
              <Text style={[styles.pillVal, { color: colors.danger }]}>
                {formatMoney(-expense, "signed")} vnd
              </Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillLabel}>NỢ</Text>
              <Text style={[styles.pillVal, { color: colors.danger }]}>
                {formatMoney(-totalDebt, "signed")} vnd
              </Text>
            </View>
          </View>
        </View>

        {/* Add shortcut row */}
        <TouchableOpacity style={styles.addRow} onPress={() => router.push("/add")}>
          <View style={styles.addRowLeft}>
            <View style={styles.addRowIcon}>
              <Text style={{ fontSize: 18, color: colors.accent, fontWeight: "800" }}>
                +
              </Text>
            </View>
            <View>
              <Text style={styles.addRowTitle}>Thêm giao dịch</Text>
              <Text style={styles.addRowSub}>Ghi nhanh thu · chi</Text>
            </View>
          </View>
          <Text style={styles.addRowArrow}>›</Text>
        </TouchableOpacity>

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
                {formatMoney(tx.type === "income" ? tx.amount : -tx.amount, "signed")} vnd
              </Text>
            </View>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {(() => {
          const activeRoute = "/";
          const NAV_ITEMS = [
            { icon: "🏠", label: "Trang chủ", route: "/" },
            { icon: "📊", label: "Thống kê", route: "/stats" },
            { isPlus: true },
            { icon: "💳", label: "Nợ", route: "/debt" },
            { icon: "🎯", label: "Ngân sách", route: "/budget" },
          ];

          return NAV_ITEMS.map((item) => {
            if (item.isPlus) {
              const isPlusActive = activeRoute === "/add";
              return (
                <TouchableOpacity
                  key="plus"
                  style={styles.navItem}
                  onPress={() => {
                    if (isPlusActive) return;
                    router.push("/add");
                  }}
                >
                  <View
                    style={[
                      styles.navPlusBtn,
                      !isPlusActive && styles.navPlusBtnInactive,
                    ]}
                  >
                    <Text style={[styles.navPlusLabel, { marginTop: 0 }]}>
                      +
                    </Text>
                  </View>
                  {/* label nằm dưới icon để giống tab khác */}
                  <Text
                    style={[
                      styles.navPlusLabel,
                      !isPlusActive && styles.navPlusLabelInactive,
                    ]}
                  >
                    Thêm
                  </Text>
                </TouchableOpacity>
              );
            }

            const isActive = item.route === activeRoute;
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
          });
        })()}
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
