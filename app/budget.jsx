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
import useStore from "../store/useStore";
import { getDb } from "../database/db";
import makeBudgetStyles from "../styles/budgetStyle";

const formatMoney = (amount) => Math.abs(amount).toLocaleString("vi-VN");

const getRawNumber = (text) => text.replace(/\./g, "");

export default function BudgetScreen() {
  const router = useRouter();
  const transactions = useStore((state) => state.transactions);
  const loadTransactions = useStore((state) => state.loadTransactions);
  const colors = useStore((state) => state.colors);
  const styles = makeBudgetStyles(colors);
  const categories = useStore((state) => state.categories);
  const addCategory = useStore((state) => state.addCategory);
  const updateCategory = useStore((state) => state.updateCategory);
  const deleteCategory = useStore((state) => state.deleteCategory);

  const [budgets, setBudgets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [budgetAmount, setBudgetAmount] = useState("");

  // ── Manage categories (CRUD) ──────────────────────────────
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryMode, setCategoryMode] = useState("create"); // 'create' | 'edit'
  const [categoryFormLabel, setCategoryFormLabel] = useState("");
  const [categoryFormEmoji, setCategoryFormEmoji] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

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

  // ── Manage categories helpers ──────────────────────────────
  const normalize = (s) =>
    (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  // Tạo id “ổn định” để lưu vào DB (giữ nguyên khi update label/emoji)
  const makeCategoryId = (label) => {
    const base = normalize(label)
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "_");
    return base || "";
  };

  const openCreateCategoryModal = () => {
    setCategoryMode("create");
    setEditingCategory(null);
    setCategoryFormLabel("");
    setCategoryFormEmoji("");
    setShowCategoryModal(true);
  };

  const openEditCategoryModal = (cat) => {
    setCategoryMode("edit");
    setEditingCategory(cat);
    setCategoryFormLabel(cat.label);
    setCategoryFormEmoji(cat.emoji);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = () => {
    const label = (categoryFormLabel || "").trim();
    const emoji = (categoryFormEmoji || "").trim();

    if (!label) {
      Alert.alert("Lỗi", "Vui lòng nhập tên danh mục");
      return;
    }
    if (!emoji) {
      Alert.alert("Lỗi", "Vui lòng nhập emoji cho danh mục");
      return;
    }

    if (categoryMode === "create") {
      const id = makeCategoryId(label);
      if (!id) {
        Alert.alert("Lỗi", "Không thể tạo id danh mục từ tên");
        return;
      }
      if (id === "thu_nhap") {
        Alert.alert("Lỗi", "Không thể tạo danh mục trùng id hệ thống");
        return;
      }
      addCategory(id, label, emoji);
    } else if (editingCategory) {
      updateCategory(editingCategory.id, label, emoji);
    }

    setShowCategoryModal(false);
    setCategoryFormLabel("");
    setCategoryFormEmoji("");
    setEditingCategory(null);
  };

  const handleDeleteCategory = (cat) => {
    if (!cat?.id) return;
    if (cat.id === "other") {
      Alert.alert("Không thể xóa", "Danh mục `other` dùng để thay thế khi xóa danh mục khác.");
      return;
    }

    Alert.alert("Xóa danh mục", `Xóa "${cat.label}" và gán lại về "Khác"?`, [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          // 1) Reassign toàn bộ transactions sang 'other'
          const db = await getDb();
          await db.runAsync(
            "UPDATE transactions SET category = ? WHERE category = ?",
            ["other", cat.id],
          );

          // 2) Xóa budgets của danh mục đó ở tháng hiện tại
          await db.runAsync(
            "DELETE FROM budgets WHERE category = ? AND month = ?",
            [cat.id, currentMonth],
          );

          // 3) Xóa danh mục
          deleteCategory(cat.id);

          // 4) Refresh UI
          await loadBudgets();
          setSelectedCat(null);
          setShowModal(false);
          setShowCategoryModal(false);
          setEditingCategory(null);
        },
      },
    ]);
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
                <Text style={[styles.overviewVal, { color: colors.danger }]}>
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
                          ? colors.success
                          : colors.danger,
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
                      totalSpent > totalBudget ? colors.danger : colors.accent,
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

          {categories.map((cat) => {
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
                            { color: isOver ? colors.danger : colors.accent },
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
                            ? colors.danger
                            : colors.accent,
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

        {/* Quản lý danh mục */}
        <View style={{ paddingHorizontal: 20, marginTop: 10, marginBottom: 6 }}>
          <Text style={styles.sectionTitle}>Quản lý danh mục</Text>
          <Text style={styles.sectionSub}>
            Tạo/sửa/xóa danh mục chi tiêu
          </Text>

          <TouchableOpacity
            onPress={openCreateCategoryModal}
            style={{
              backgroundColor: colors.bg3,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: "center",
              marginTop: 6,
            }}
          >
            <Text style={{ color: colors.accent, fontWeight: "800" }}>
              + Thêm danh mục
            </Text>
          </TouchableOpacity>

          <View style={{ marginTop: 12 }}>
            {categories.map((cat) => (
              <View
                key={cat.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                  gap: 10,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <Text style={{ fontSize: 22 }}>{cat.emoji}</Text>
                  <Text style={{ color: colors.textPrimary, fontWeight: "700" }}>
                    {cat.label}
                  </Text>
                </View>

                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => openEditCategoryModal(cat)}
                    style={{
                      backgroundColor: colors.bg3,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 10,
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                    }}
                  >
                    <Text>✏️</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDeleteCategory(cat)}
                    disabled={cat.id === "other"}
                    style={{
                      backgroundColor: colors.bg3,
                      borderWidth: 1,
                      borderColor: colors.danger,
                      borderRadius: 10,
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      opacity: cat.id === "other" ? 0.4 : 1,
                    }}
                  >
                    <Text style={{ color: colors.danger }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
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
                placeholderTextColor={colors.textMuted}
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

      {/* Modal quản lý danh mục */}
      <Modal visible={showCategoryModal} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalEmoji}>
                  {categoryMode === "create"
                    ? categoryFormEmoji || "📦"
                    : editingCategory?.emoji || categoryFormEmoji || "📦"}
                </Text>
                <View>
                  <Text style={styles.modalTitle}>
                    {categoryMode === "create"
                      ? "Thêm danh mục"
                      : "Cập nhật danh mục"}
                  </Text>
                  <Text style={styles.modalSub}>
                    ID:{" "}
                    {categoryMode === "create"
                      ? makeCategoryId(categoryFormLabel)
                      : editingCategory?.id}
                  </Text>
                </View>
              </View>

              <Text style={styles.inputLabel}>TÊN DANH MỤC</Text>
              <TextInput
                style={[styles.input, { fontSize: 14, fontWeight: "700", letterSpacing: 0 }]}
                value={categoryFormLabel}
                onChangeText={setCategoryFormLabel}
                placeholder="VD: Du lịch"
                placeholderTextColor={colors.textMuted}
                autoFocus
              />

              <Text style={styles.inputLabel}>EMOJI</Text>
              <TextInput
                style={[styles.input, { fontSize: 18, fontWeight: "700", letterSpacing: 0, textAlign: "center" }]}
                value={categoryFormEmoji}
                onChangeText={setCategoryFormEmoji}
                placeholder="VD: ✈️"
                placeholderTextColor={colors.textMuted}
              />

              <View style={styles.modalBtns}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setShowCategoryModal(false)}
                >
                  <Text style={styles.cancelText}>Huỷ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSaveCategory}
                >
                  <Text style={styles.saveText}>Lưu</Text>
                </TouchableOpacity>
              </View>

              {categoryMode === "edit" &&
                editingCategory &&
                editingCategory.id !== "other" && (
                  <TouchableOpacity
                    style={{
                      marginTop: 14,
                      backgroundColor: colors.bg3,
                      borderWidth: 1,
                      borderColor: colors.danger,
                      borderRadius: 12,
                      paddingVertical: 12,
                      alignItems: "center",
                    }}
                    onPress={() => handleDeleteCategory(editingCategory)}
                  >
                    <Text style={{ color: colors.danger, fontWeight: "800" }}>
                      Xóa danh mục
                    </Text>
                  </TouchableOpacity>
                )}
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
