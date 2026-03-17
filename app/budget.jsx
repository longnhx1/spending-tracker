import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CATEGORIES, COLORS } from "../constants/theme";
import { getDb } from "../database/db";
import useStore from "../store/useStore";

const formatMoney = (amount) => Math.abs(amount).toLocaleString("vi-VN");

const getRawNumber = (text) => text.replace(/\./g, "");

export default function BudgetScreen() {
  const router = useRouter();
  const transactions = useStore((state) => state.transactions);
  const loadTransactions = useStore((state) => state.loadTransactions);

  const [budgets, setBudgets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [budgetAmount, setBudgetAmount] = useState("");

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    loadTransactions();
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    const db = await getDb();
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL UNIQUE,
        amount REAL NOT NULL,
        month TEXT NOT NULL
      );
    `);
    const data = await db.getAllAsync("SELECT * FROM budgets WHERE month = ?", [
      currentMonth,
    ]);
    setBudgets(data);
  };

  // Tính đã chi bao nhiêu theo từng danh mục tháng này
  const getSpent = (categoryId) => {
    return transactions
      .filter(
        (tx) =>
          tx.type === "expense" &&
          tx.category === categoryId &&
          tx.date.startsWith(currentMonth),
      )
      .reduce((sum, tx) => sum + tx.amount, 0);
  };

  const getBudget = (categoryId) => {
    return budgets.find((b) => b.category === categoryId);
  };

  const handleSaveBudget = async () => {
    if (!budgetAmount || parseInt(getRawNumber(budgetAmount)) <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ");
      return;
    }
    const db = await getDb();
    const amount = parseInt(getRawNumber(budgetAmount));
    await db.runAsync(
      `INSERT INTO budgets (category, amount, month)
       VALUES (?, ?, ?)
       ON CONFLICT(category) DO UPDATE SET amount = ?, month = ?`,
      [selectedCat.id, amount, currentMonth, amount, currentMonth],
    );
    await loadBudgets();
    setBudgetAmount("");
    setShowModal(false);
    setSelectedCat(null);
  };

  const handleDeleteBudget = (cat) => {
    Alert.alert("Xoá ngân sách", `Xoá ngân sách cho "${cat.label}"?`, [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          const db = await getDb();
          await db.runAsync(
            "DELETE FROM budgets WHERE category = ? AND month = ?",
            [cat.id, currentMonth],
          );
          await loadBudgets();
        },
      },
    ]);
  };

  const openModal = (cat) => {
    const existing = getBudget(cat.id);
    setSelectedCat(cat);
    setBudgetAmount(existing ? String(existing.amount) : "");
    setShowModal(true);
  };

  // Tổng ngân sách và đã chi
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + getSpent(b.category), 0);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Ngân sách</Text>
            <Text style={styles.subtitle}>
              Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
            </Text>
          </View>
        </View>

        {/* Tổng quan ngân sách */}
        {totalBudget > 0 && (
          <View style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>TỔNG NGÂN SÁCH</Text>
            <Text style={styles.overviewAmount}>
              ₫{formatMoney(totalBudget)}
            </Text>

            <View style={styles.overviewRow}>
              <View>
                <Text style={styles.overviewSub}>Đã chi</Text>
                <Text style={[styles.overviewVal, { color: COLORS.danger }]}>
                  ₫{formatMoney(totalSpent)}
                </Text>
              </View>
              <View>
                <Text style={styles.overviewSub}>Còn lại</Text>
                <Text
                  style={[
                    styles.overviewVal,
                    {
                      color:
                        totalBudget - totalSpent >= 0
                          ? COLORS.success
                          : COLORS.danger,
                    },
                  ]}
                >
                  ₫{formatMoney(Math.abs(totalBudget - totalSpent))}
                </Text>
              </View>
              <View>
                <Text style={styles.overviewSub}>Đã dùng</Text>
                <Text style={styles.overviewVal}>
                  {Math.min(Math.round((totalSpent / totalBudget) * 100), 100)}%
                </Text>
              </View>
            </View>

            {/* Master progress bar */}
            <View style={styles.masterTrack}>
              <View
                style={[
                  styles.masterFill,
                  {
                    width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`,
                    backgroundColor:
                      totalSpent > totalBudget ? COLORS.danger : COLORS.accent,
                  },
                ]}
              />
            </View>
          </View>
        )}

        {/* Danh sách danh mục */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ngân sách theo danh mục</Text>
          <Text style={styles.sectionSub}>
            Bấm vào danh mục để đặt ngân sách
          </Text>

          {CATEGORIES.map((cat) => {
            const budget = getBudget(cat.id);
            const spent = getSpent(cat.id);
            const hasbudget = !!budget;
            const percent = hasbudget
              ? Math.min((spent / budget.amount) * 100, 100)
              : 0;
            const isOver = hasbudget && spent > budget.amount;

            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catCard, isOver && styles.catCardOver]}
                onPress={() => openModal(cat)}
                onLongPress={() => hasbudget && handleDeleteBudget(cat)}
              >
                <View style={styles.catTop}>
                  <View style={styles.catLeft}>
                    <Text style={styles.catEmoji}>{cat.emoji}</Text>
                    <View>
                      <Text style={styles.catName}>{cat.label}</Text>
                      {hasbudget ? (
                        <Text style={styles.catSub}>
                          ₫{formatMoney(spent)} / ₫{formatMoney(budget.amount)}
                        </Text>
                      ) : (
                        <Text style={styles.catSubMuted}>
                          Chưa đặt ngân sách
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.catRight}>
                    {hasbudget ? (
                      <>
                        <Text
                          style={[
                            styles.catPercent,
                            { color: isOver ? COLORS.danger : COLORS.accent },
                          ]}
                        >
                          {Math.round((spent / budget.amount) * 100)}%
                        </Text>
                        {isOver && <Text style={styles.overTag}>Vượt!</Text>}
                      </>
                    ) : (
                      <Text style={styles.addTag}>+ Đặt</Text>
                    )}
                  </View>
                </View>

                {hasbudget && (
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${percent}%`,
                          backgroundColor: isOver
                            ? COLORS.danger
                            : COLORS.accent,
                        },
                      ]}
                    />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          <Text style={styles.hint}>
            💡 Giữ lâu để xoá ngân sách của danh mục
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Modal đặt ngân sách */}
      <Modal visible={showModal} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalEmoji}>{selectedCat?.emoji}</Text>
                <View>
                  <Text style={styles.modalTitle}>
                    Ngân sách — {selectedCat?.label}
                  </Text>
                  <Text style={styles.modalSub}>
                    Đã chi: ₫{formatMoney(getSpent(selectedCat?.id || ""))}
                  </Text>
                </View>
              </View>

              <Text style={styles.inputLabel}>NGÂN SÁCH THÁNG NÀY</Text>
              <TextInput
                style={styles.input}
                value={
                  budgetAmount
                    ? parseInt(getRawNumber(budgetAmount)).toLocaleString(
                        "vi-VN",
                      )
                    : ""
                }
                onChangeText={(text) => setBudgetAmount(getRawNumber(text))}
                keyboardType="numeric"
                placeholder="VD: 2.000.000"
                placeholderTextColor={COLORS.textMuted}
                autoFocus
              />

              <View style={styles.modalBtns}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.cancelText}>Huỷ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSaveBudget}
                >
                  <Text style={styles.saveText}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {[
          { icon: "🏠", label: "Home", route: "/" },
          { icon: "📊", label: "Stats", route: "/stats" },
          { icon: "➕", label: "Add", route: "/add" },
          { icon: "💳", label: "Nợ", route: "/debt" },
        ].map((item) => {
          const isActive = false;
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
  safe: { flex: 1, backgroundColor: COLORS.bg0 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: { fontSize: 24, color: COLORS.textPrimary, fontWeight: "800" },
  subtitle: { fontSize: 11, color: COLORS.silver, opacity: 0.5, marginTop: 2 },
  overviewCard: {
    margin: 20,
    backgroundColor: COLORS.bg2,
    borderWidth: 1,
    borderColor: "#1A2D45",
    borderRadius: 22,
    padding: 20,
  },
  overviewLabel: {
    fontSize: 9,
    color: COLORS.silver,
    opacity: 0.5,
    letterSpacing: 2.5,
  },
  overviewAmount: {
    fontSize: 30,
    color: COLORS.textPrimary,
    fontWeight: "300",
    marginTop: 6,
    letterSpacing: -1,
  },
  overviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    marginBottom: 12,
  },
  overviewSub: {
    fontSize: 9,
    color: COLORS.silver,
    opacity: 0.4,
    letterSpacing: 1,
  },
  overviewVal: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "500",
    marginTop: 3,
  },
  masterTrack: {
    height: 6,
    backgroundColor: "#1A2535",
    borderRadius: 3,
  },
  masterFill: {
    height: "100%",
    borderRadius: 3,
  },
  section: { paddingHorizontal: 20, marginBottom: 10 },
  sectionTitle: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 11,
    color: COLORS.silver,
    opacity: 0.4,
    marginBottom: 14,
  },
  catCard: {
    backgroundColor: COLORS.bg3,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  catCardOver: { borderColor: "rgba(255,77,109,0.4)" },
  catTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  catLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  catEmoji: { fontSize: 24 },
  catName: { fontSize: 13, color: COLORS.textPrimary, fontWeight: "600" },
  catSub: { fontSize: 10, color: COLORS.silver, opacity: 0.5, marginTop: 2 },
  catSubMuted: {
    fontSize: 10,
    color: COLORS.silver,
    opacity: 0.3,
    marginTop: 2,
    fontStyle: "italic",
  },
  catRight: { alignItems: "flex-end" },
  catPercent: { fontSize: 14, fontWeight: "600" },
  overTag: {
    fontSize: 9,
    color: COLORS.danger,
    backgroundColor: "rgba(255,77,109,0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 3,
  },
  addTag: {
    fontSize: 11,
    color: COLORS.accent,
    opacity: 0.6,
  },
  progressTrack: {
    height: 4,
    backgroundColor: "#1A2535",
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  hint: {
    fontSize: 11,
    color: COLORS.silver,
    opacity: 0.3,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: COLORS.bg1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  modalEmoji: { fontSize: 32 },
  modalTitle: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  modalSub: { fontSize: 11, color: COLORS.silver, opacity: 0.5, marginTop: 2 },
  inputLabel: {
    fontSize: 9,
    color: COLORS.silver,
    opacity: 0.4,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.bg3,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "300",
    letterSpacing: -0.5,
  },
  modalBtns: { flexDirection: "row", gap: 10, marginTop: 16 },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: COLORS.bg3,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  cancelText: { color: COLORS.silver, fontWeight: "600" },
  saveBtn: {
    flex: 2,
    padding: 14,
    borderRadius: 12,
    backgroundColor: COLORS.electric,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "700", fontSize: 14 },
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
  navItem: { alignItems: "center", gap: 3 },
  navIcon: { fontSize: 20, opacity: 0.3 },
  navIconActive: { opacity: 1 },
  navDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.accent,
    opacity: 0,
  },
  navDotActive: { opacity: 1 },
  navLabel: {
    fontSize: 8,
    color: COLORS.silver,
    opacity: 0.3,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  navLabelActive: { color: COLORS.accent, opacity: 1 },
});
