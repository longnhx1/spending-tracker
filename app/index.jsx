// app/index.jsx
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import makeHomeStyles from "../styles/homeStyles";
import NavBar from "../components/NavBar";
import { SettingsIcon } from "../components/icons";

import useStore from "../store/useStore";
import { formatMoney, formatMoneyHero } from "../utils/formatMoney";
import { getCategoryEmoji, getCategoryLabel } from "../utils/categoryUtils";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useStore((s) => s.colors);
  const styles = makeHomeStyles(colors);
  const categories = useStore((s) => s.categories);
  const goals = useStore((s) => s.goals);
  const addGoal = useStore((s) => s.addGoal);
  const addGoalProgress = useStore((s) => s.addGoalProgress);

  const transactions = useStore((state) => state.transactions);
  const debts = useStore((state) => state.debts);
  const getMonthlySummary = useStore((state) => state.getMonthlySummary);
  const headerStyles = makeHeaderStyles(colors);
  const currentMonthStr = useStore((s) => s.currentMonth);

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
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalSaved, setGoalSaved] = useState("");
  const [goalProgressInput, setGoalProgressInput] = useState("");
  const [showProgressModal, setShowProgressModal] = useState(false);
  const topGoal = goals[0];

  const saveGoal = () => {
    const targetAmount = parseInt(goalTarget || "0", 10);
    const savedAmount = parseInt(goalSaved || "0", 10);
    if (!goalTitle.trim() || targetAmount <= 0) return;
    addGoal(goalTitle, targetAmount, savedAmount);
    setGoalTitle("");
    setGoalTarget("");
    setGoalSaved("");
    setShowGoalModal(false);
  };

  const saveGoalProgress = () => {
    if (!topGoal) return;
    const progressAmount = parseInt(goalProgressInput || "0", 10);
    if (progressAmount <= 0) return;
    addGoalProgress(topGoal.id, progressAmount);
    setGoalProgressInput("");
    setShowProgressModal(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Header với nút Settings ── */}
      <View style={headerStyles.header}>
        <Text style={headerStyles.appName}>SpendingTracker</Text>
        <TouchableOpacity
          style={headerStyles.settingsBtn}
          onPress={() => router.push("/settings")}
        >
          <SettingsIcon size={18} color={colors.text2} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>SỐ DƯ HIỆN TẠI</Text>
          <View style={styles.heroAmountRow}>
            <Text style={styles.heroAmount}>{formatMoneyHero(Math.abs(balance))}</Text>
            <Text style={styles.heroCur}>đ</Text>
          </View>
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
                {formatMoney(income, "signed")}
              </Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillLabel}>CHI</Text>
              <Text style={[styles.pillVal, { color: colors.danger }]}>
                {formatMoney(-expense, "signed")}
              </Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillLabel}>NỢ</Text>
              <Text style={[styles.pillVal, { color: colors.danger }]}>
                {formatMoney(-totalDebt, "signed")}
              </Text>
            </View>
          </View>
        </View>

        {/* Goal shortcut row */}
        <TouchableOpacity style={styles.addRow} onPress={() => setShowGoalModal(true)}>
          <View style={styles.addRowLeft}>
            <View style={styles.addRowIcon}>
              <Text style={{ fontSize: 18, color: colors.accent, fontWeight: "800" }}>
                🎯
              </Text>
            </View>
            <View>
              <Text style={styles.addRowTitle}>Đặt mục tiêu</Text>
              <Text style={styles.addRowSub}>Theo dõi món đồ bạn muốn mua</Text>
            </View>
          </View>
          <Text style={styles.addRowArrow}>›</Text>
        </TouchableOpacity>
        {topGoal && (
          <View style={styles.goalCard}>
            <View style={styles.goalHead}>
              <View>
                <Text style={styles.goalTitle}>{topGoal.title}</Text>
                <Text style={styles.goalMeta}>Mục tiêu mua sắm</Text>
              </View>
              <Text style={styles.goalAmount}>
                {formatMoney(topGoal.savedAmount)} / {formatMoney(topGoal.targetAmount)}
              </Text>
            </View>
            <View style={styles.goalTrack}>
              <View
                style={[
                  styles.goalFill,
                  {
                    width: `${Math.min(
                      100,
                      Math.round((topGoal.savedAmount / Math.max(1, topGoal.targetAmount)) * 100),
                    )}%`,
                  },
                ]}
              />
            </View>
            <View style={styles.goalFoot}>
              <Text style={styles.goalPercent}>
                {Math.min(
                  100,
                  Math.round((topGoal.savedAmount / Math.max(1, topGoal.targetAmount)) * 100),
                )}
                %
              </Text>
              <TouchableOpacity
                style={styles.goalAddBtn}
                onPress={() => setShowProgressModal(true)}
              >
                <Text style={styles.goalAddText}>+ Nạp thêm</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

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
                  {getCategoryEmoji(tx.category, categories)}
                </Text>
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txName}>
                  {tx.note || getCategoryLabel(tx.category, categories)}
                </Text>
                <Text style={styles.txMeta}>
                  {getCategoryLabel(tx.category, categories)} · {tx.date}
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
                {formatMoney(tx.type === "income" ? tx.amount : -tx.amount, "signed")}
              </Text>
            </View>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <NavBar activeRoute="/" />

      <Modal visible={showGoalModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Đặt mục tiêu mua sắm</Text>
            <TextInput
              style={styles.modalInput}
              value={goalTitle}
              onChangeText={setGoalTitle}
              placeholder="Tên món đồ (VD: iPad, xe máy...)"
              placeholderTextColor={colors.text3}
            />
            <TextInput
              style={styles.modalInput}
              value={goalTarget}
              onChangeText={(v) => setGoalTarget(v.replace(/[^\d]/g, ""))}
              placeholder="Số tiền mục tiêu"
              keyboardType="numeric"
              placeholderTextColor={colors.text3}
            />
            <TextInput
              style={styles.modalInput}
              value={goalSaved}
              onChangeText={(v) => setGoalSaved(v.replace(/[^\d]/g, ""))}
              placeholder="Đã để dành (tuỳ chọn)"
              keyboardType="numeric"
              placeholderTextColor={colors.text3}
            />
            <View style={styles.modalRow}>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => setShowGoalModal(false)}
              >
                <Text style={styles.modalBtnText}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnPrimary]}
                onPress={saveGoal}
              >
                <Text style={[styles.modalBtnText, styles.modalBtnTextPrimary]}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showProgressModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Nạp thêm cho mục tiêu</Text>
            <TextInput
              style={styles.modalInput}
              value={goalProgressInput}
              onChangeText={(v) => setGoalProgressInput(v.replace(/[^\d]/g, ""))}
              placeholder="Số tiền vừa để dành"
              keyboardType="numeric"
              placeholderTextColor={colors.text3}
            />
            <View style={styles.modalRow}>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => setShowProgressModal(false)}
              >
                <Text style={styles.modalBtnText}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnPrimary]}
                onPress={saveGoalProgress}
              >
                <Text style={[styles.modalBtnText, styles.modalBtnTextPrimary]}>Cập nhật</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
