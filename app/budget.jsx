import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, CATEGORIES } from "../constants/theme";
import useStore from "../store/useStore";
import { getDb } from "../database/db";
import styles from "../styles/budgetStyle";

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
              {formatMoney(totalBudget)} vnd
            </Text>

            <View style={styles.overviewRow}>
              <View>
                <Text style={styles.overviewSub}>Đã chi</Text>
                <Text style={[styles.overviewVal, { color: COLORS.danger }]}>
                  {formatMoney(totalSpent)} vnd
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
                  {formatMoney(Math.abs(totalBudget - totalSpent))} vnd
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
                          {formatMoney(spent)} vnd / {formatMoney(budget.amount)} vnd
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
                    Đã chi: {formatMoney(getSpent(selectedCat?.id || ""))} vnd
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
          { icon: "🏠", label: "Trang chủ", route: "/" },
          { icon: "📊", label: "Thống kê", route: "/stats" },
          { icon: "➕", label: "Thêm", route: "/add" },
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
