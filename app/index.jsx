// app/index.jsx

import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CATEGORIES } from "../constants/theme";
import { useAppColors } from "../context/AppThemeContext";
import { useAuth } from "../context/AuthContext";
import useStore from "../store/useStore";

const formatMoney = (amount) => {
  return Math.abs(amount).toLocaleString("vi-VN");
};

const getCategoryEmoji = (categoryId) => {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  return cat ? cat.emoji : "📦";
};

function getDisplayName(user) {
  if (!user) return "Bạn";
  const meta = user.user_metadata ?? {};
  const fromMeta =
    meta.username?.trim?.() ||
    meta.display_name?.trim?.() ||
    meta.full_name?.trim?.();
  if (fromMeta) return fromMeta;
  const email = user.email ?? "";
  return email ? email.split("@")[0] : "Bạn";
}

export default function HomeScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const { session, signOut } = useAuth();
  const displayName = getDisplayName(session?.user);

  const transactions = useStore((state) => state.transactions);
  const debts = useStore((state) => state.debts);
  const getMonthlySummary = useStore((state) => state.getMonthlySummary);

  const { income, expense, balance } = getMonthlySummary();
  const recentTx = transactions.slice(0, 5);
  const totalDebt = debts.reduce((sum, d) => sum + d.remaining_amount, 0);

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>XIN CHÀO</Text>
            <Text style={styles.username}>{displayName} 👋</Text>
            <TouchableOpacity
              onPress={() => router.push("/settings")}
              hitSlop={12}
            >
              <Text style={styles.settingsLink}>Cài đặt</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => signOut()} hitSlop={12}>
              <Text style={styles.signOut}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.avatarRing}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarText}>
                {(displayName[0] || "?").toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>SỐ DƯ HIỆN TẠI</Text>
          <Text
            style={[
              styles.heroAmount,
              { color: balance < 0 ? colors.danger : colors.textPrimary },
            ]}
          >
            <Text style={styles.heroCur}>₫</Text>
            {balance < 0 ? "-" : ""}
            {formatMoney(Math.abs(balance))}
          </Text>
          <Text style={styles.heroSub}>
            Tháng {new Date().getMonth() + 1} · {new Date().getFullYear()}
          </Text>

          <View style={styles.pillRow}>
            <View style={styles.pill}>
              <Text style={styles.pillLabel}>THU</Text>
              <Text style={[styles.pillVal, { color: colors.success }]}>
                +{formatMoney(income)}
              </Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillLabel}>CHI</Text>
              <Text style={[styles.pillVal, { color: colors.danger }]}>
                -{formatMoney(expense)}
              </Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillLabel}>NỢ</Text>
              <Text style={[styles.pillVal, { color: colors.danger }]}>
                {formatMoney(totalDebt)}
              </Text>
            </View>
          </View>
        </View>

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
              <View style={[styles.txIcon, { backgroundColor: colors.txIconBg }]}>
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
                      tx.type === "income" ? colors.success : colors.danger,
                  },
                ]}
              >
                {tx.type === "income" ? "+" : "-"}
                {formatMoney(tx.amount)}
              </Text>
            </View>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

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

/** @param {import('../constants/theme').AppColors} c */
function createStyles(c) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: c.bg0,
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
      color: c.silver,
      letterSpacing: 2,
      opacity: 0.6,
    },
    username: {
      fontSize: 22,
      color: c.textPrimary,
      fontWeight: "700",
      marginTop: 2,
    },
    settingsLink: {
      marginTop: 8,
      fontSize: 11,
      color: c.silver,
      letterSpacing: 0.5,
      opacity: 0.85,
    },
    signOut: {
      marginTop: 6,
      fontSize: 11,
      color: c.accent,
      letterSpacing: 0.5,
    },
    avatarRing: {
      width: 42,
      height: 42,
      borderRadius: 21,
      borderWidth: 1.5,
      borderColor: c.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarInner: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: c.navy,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      fontSize: 14,
      fontWeight: "700",
      color: c.accent,
    },
    heroCard: {
      margin: 20,
      backgroundColor: c.bg2,
      borderWidth: 1,
      borderColor: c.heroCardBorder,
      borderRadius: 22,
      padding: 20,
    },
    heroLabel: {
      fontSize: 9,
      color: c.silver,
      letterSpacing: 2.5,
      opacity: 0.5,
    },
    heroAmount: {
      fontSize: 32,
      color: c.textPrimary,
      fontWeight: "400",
      marginTop: 6,
      marginBottom: 2,
      letterSpacing: -1,
    },
    heroCur: {
      fontSize: 16,
      color: c.accent,
    },
    heroSub: {
      fontSize: 10,
      color: c.silver,
      opacity: 0.4,
    },
    pillRow: {
      flexDirection: "row",
      gap: 8,
      marginTop: 14,
    },
    pill: {
      flex: 1,
      backgroundColor: c.pillInnerBg,
      borderWidth: 1,
      borderColor: c.pillBorder,
      borderRadius: 12,
      padding: 10,
    },
    pillLabel: {
      fontSize: 8,
      color: c.silver,
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
      backgroundColor: c.bg3,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 14,
      padding: 12,
      alignItems: "center",
      gap: 5,
    },
    qaIcon: { fontSize: 18 },
    qaLabel: {
      fontSize: 8,
      color: c.silver,
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
      color: c.textPrimary,
      fontWeight: "600",
    },
    secMore: {
      fontSize: 10,
      color: c.accent,
      letterSpacing: 1,
    },
    emptyBox: {
      margin: 20,
      padding: 24,
      backgroundColor: c.bg3,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: "center",
    },
    emptyText: {
      color: c.silver,
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
      alignItems: "center",
      justifyContent: "center",
    },
    txEmoji: { fontSize: 16 },
    txInfo: { flex: 1 },
    txName: {
      fontSize: 13,
      color: c.txTitle,
      fontWeight: "500",
    },
    txMeta: {
      fontSize: 10,
      color: c.silver,
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
      backgroundColor: c.navBarBg,
      borderTopWidth: 1,
      borderTopColor: c.navBarBorder,
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
      backgroundColor: c.accent,
      opacity: 0,
    },
    navDotActive: {
      opacity: 1,
    },
    navLabel: {
      fontSize: 8,
      color: c.silver,
      opacity: 0.3,
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    navLabelActive: {
      color: c.accent,
      opacity: 1,
    },
  });
}
