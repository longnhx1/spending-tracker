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
import { SafeAreaView } from "react-native-safe-area-context";
import dbSync, { getDb } from "../database/db";
import useStore from "../store/useStore";
import makeDebtStyles from "../styles/debtStyles";
import { formatMoney, formatMoneyHero } from "../utils/formatMoney";
import NavBar from "../components/NavBar";

export default function DebtScreen() {
  const debts = useStore((state) => state.debts);
  const addDebt = useStore((state) => state.addDebt);
  const updateDebtRemaining = useStore((state) => state.updateDebtRemaining);
  const loadDebts = useStore((state) => state.loadDebts);
  const colors = useStore((state) => state.colors);
  const styles = makeDebtStyles(colors);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);

  // Form thêm nợ mới
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDueDate, setNewDueDate] = useState("");

  // Form trả nợ
  const [payAmount, setPayAmount] = useState("");

  // Form sửa
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  useEffect(() => {
    loadDebts();
  }, []);

  const totalDebt = debts.reduce((sum, d) => sum + d.remaining_amount, 0);

  const getProgress = (debt) => {
    if (debt.total_amount === 0) return 0;
    return (1 - debt.remaining_amount / debt.total_amount) * 100;
  };

  const getRawNumber = (formatted) => {
    return formatted.replace(/\./g, "");
  };

  const handleAddDebt = () => {
    if (!newName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên khoản nợ");
      return;
    }
    if (!newAmount || parseInt(newAmount) <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ");
      return;
    }
    addDebt(newName.trim(), parseInt(newAmount), newDueDate || null);
    setNewName("");
    setNewAmount("");
    setNewDueDate("");
    setShowAddModal(false);
  };

  const handlePay = () => {
    if (!payAmount || parseInt(payAmount) <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền trả");
      return;
    }
    const paid = parseInt(payAmount);
    const remaining = selectedDebt.remaining_amount - paid;
    if (remaining < 0) {
      Alert.alert("Lỗi", "Số tiền trả vượt quá số nợ còn lại");
      return;
    }
    updateDebtRemaining(selectedDebt.id, remaining);
    setPayAmount("");
    setShowPayModal(false);
    setSelectedDebt(null);
  };

  const handleEdit = async () => {
    if (!editName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên khoản nợ");
      return;
    }
    if (!editAmount || parseInt(editAmount) <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ");
      return;
    }
    // Cập nhật trực tiếp vào database
    const db = (typeof getDb === "function" ? await getDb() : null) || dbSync;
    const sql =
      "UPDATE debts SET name = ?, total_amount = ?, due_date = ? WHERE id = ?";
    const params = [
      editName.trim(),
      parseInt(editAmount),
      editDueDate || null,
      selectedDebt.id,
    ];
    if (typeof db.runAsync === "function") {
      await db.runAsync(sql, params);
    } else {
      db.runSync(sql, params);
    }
    await loadDebts();
    setShowEditModal(false);
    setSelectedDebt(null);
  };

  const handleDelete = (debt) => {
    Alert.alert("Xoá khoản nợ", `Bạn có chắc muốn xoá "${debt.name}"?`, [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          const db =
            (typeof getDb === "function" ? await getDb() : null) || dbSync;
          const sql = "DELETE FROM debts WHERE id = ?";
          const params = [debt.id];
          if (typeof db.runAsync === "function") {
            await db.runAsync(sql, params);
          } else {
            db.runSync(sql, params);
          }
          await loadDebts();
        },
      },
    ]);
  };

  const openEdit = (debt) => {
    setSelectedDebt(debt);
    setEditName(debt.name);
    setEditAmount(String(debt.total_amount));
    setEditDueDate(debt.due_date || "");
    setShowEditModal(true);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Theo dõi nợ</Text>
            <Text style={styles.subtitle}>Quản lý các khoản cần trả</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.addBtnText}>+ Thêm nợ</Text>
          </TouchableOpacity>
        </View>

        {/* Tổng nợ */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>TỔNG NỢ HIỆN TẠI</Text>
          <View style={styles.heroAmountRow}>
            <Text style={styles.totalAmount}>{formatMoneyHero(totalDebt)}</Text>
            <Text style={styles.heroCur}>đ</Text>
          </View>
          <Text style={styles.totalSub}>
            {debts.length} khoản nợ đang theo dõi
          </Text>
        </View>

        {/* Danh sách nợ */}
        {debts.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>🎉</Text>
            <Text style={styles.emptyText}>Không có khoản nợ nào!</Text>
            <Text style={styles.emptySub}>
              Bấm "+ Thêm nợ" để theo dõi các khoản cần trả
            </Text>
          </View>
        ) : (
          debts.map((debt) => {
            const progress = getProgress(debt);
            const isPaid = debt.remaining_amount === 0;
            return (
              <View
                key={debt.id}
                style={[styles.debtCard, isPaid && styles.debtCardPaid]}
              >
                <View style={styles.debtTop}>
                  <View style={styles.debtLeft}>
                    <Text style={styles.debtName}>{debt.name}</Text>
                    {debt.due_date && (
                      <Text style={styles.debtDue}>Hạn: {debt.due_date}</Text>
                    )}
                  </View>
                  <View style={styles.debtRight}>
                    <Text style={styles.debtRemaining}>
                      {formatMoney(debt.remaining_amount, "full")}
                    </Text>
                    <Text style={styles.debtTotal}>
                      / {formatMoney(debt.total_amount, "full")}
                    </Text>
                  </View>
                </View>

                {/* Progress bar */}
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${progress}%` },
                      isPaid && { backgroundColor: colors.success },
                    ]}
                  />
                </View>

                {/* Actions */}
                <View style={styles.debtBottom}>
                  <Text style={styles.progressText}>
                    {isPaid
                      ? "✅ Đã trả xong!"
                      : `Đã trả ${Math.round(progress)}%`}
                  </Text>
                  <View style={styles.actionBtns}>
                    {/* Nút sửa */}
                    <TouchableOpacity
                      style={styles.editBtn}
                      onPress={() => openEdit(debt)}
                    >
                      <Text style={styles.editBtnText}>✏️</Text>
                    </TouchableOpacity>

                    {/* Nút xoá */}
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => handleDelete(debt)}
                    >
                      <Text style={styles.deleteBtnText}>🗑️</Text>
                    </TouchableOpacity>

                    {/* Nút trả nợ */}
                    {!isPaid && (
                      <TouchableOpacity
                        style={styles.payBtn}
                        onPress={() => {
                          setSelectedDebt(debt);
                          setShowPayModal(true);
                        }}
                      >
                        <Text style={styles.payBtnText}>Trả nợ</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Modal thêm nợ */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Thêm khoản nợ</Text>

              <Text style={styles.inputLabel}>TÊN KHOẢN NỢ</Text>
              <TextInput
                style={styles.input}
                value={newName}
                onChangeText={setNewName}
                placeholder="VD: ZaloPay, MoMo, bạn bè..."
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.inputLabel}>SỐ TIỀN NỢ</Text>
              <TextInput
                style={styles.input}
                value={
                  newAmount
                    ? formatMoney(parseInt(newAmount.replace(/\./g, ""), 10), "full").replace("đ", "")
                    : ""
                }
                onChangeText={(text) => setNewAmount(getRawNumber(text))}
                keyboardType="numeric"
                placeholder="VD: 1.200.000"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.inputLabel}>HẠN TRẢ (tuỳ chọn)</Text>
              <TextInput
                style={styles.input}
                value={newDueDate}
                onChangeText={setNewDueDate}
                placeholder="VD: 2026-04-30"
                placeholderTextColor={colors.textMuted}
              />

              <View style={styles.modalBtns}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setShowAddModal(false)}
                >
                  <Text style={styles.modalCancelText}>Huỷ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSaveBtn}
                  onPress={handleAddDebt}
                >
                  <Text style={styles.modalSaveText}>Thêm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal sửa nợ */}
      <Modal visible={showEditModal} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Sửa khoản nợ</Text>

              <Text style={styles.inputLabel}>TÊN KHOẢN NỢ</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.inputLabel}>TỔNG SỐ TIỀN NỢ</Text>
              <TextInput
                style={styles.input}
                value={
                  editAmount
                    ? formatMoney(parseInt(editAmount.replace(/\./g, ""), 10), "full").replace("đ", "")
                    : ""
                }
                onChangeText={(text) => setEditAmount(getRawNumber(text))}
                keyboardType="numeric"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.inputLabel}>HẠN TRẢ (tuỳ chọn)</Text>
              <TextInput
                style={styles.input}
                value={editDueDate}
                onChangeText={setEditDueDate}
                placeholder="VD: 2026-04-30"
                placeholderTextColor={colors.textMuted}
              />

              <View style={styles.modalBtns}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setShowEditModal(false)}
                >
                  <Text style={styles.modalCancelText}>Huỷ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSaveBtn}
                  onPress={handleEdit}
                >
                  <Text style={styles.modalSaveText}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal trả nợ */}
      <Modal visible={showPayModal} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>
                Trả nợ — {selectedDebt?.name}
              </Text>
              <Text style={styles.modalSub}>
                Còn lại: {formatMoney(selectedDebt?.remaining_amount || 0, "full")}
              </Text>

              <Text style={styles.inputLabel}>SỐ TIỀN TRẢ</Text>
              <TextInput
                style={styles.input}
                value={
                  payAmount
                    ? formatMoney(parseInt(payAmount.replace(/\./g, ""), 10), "full").replace("đ", "")
                    : ""
                }
                onChangeText={(text) => setPayAmount(getRawNumber(text))}
                keyboardType="numeric"
                placeholder="Nhập số tiền vừa trả..."
                placeholderTextColor={colors.textMuted}
              />

              <View style={styles.modalBtns}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setShowPayModal(false)}
                >
                  <Text style={styles.modalCancelText}>Huỷ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSaveBtn}
                  onPress={handlePay}
                >
                  <Text style={styles.modalSaveText}>Xác nhận</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <NavBar activeRoute="/debt" />
    </SafeAreaView>
  );
}
