import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, CATEGORIES } from "../constants/theme";
import useStore from "../store/useStore";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import styles from "../styles/statsStyles";

const formatMoney = (amount) => Math.abs(amount).toLocaleString("vi-VN");

export default function StatsScreen() {
  const router = useRouter();
  const transactions = useStore((state) => state.transactions);
  const loadTransactions = useStore((state) => state.loadTransactions);
  const updateTransaction = useStore((state) => state.updateTransaction);
  const deleteTransaction = useStore((state) => state.deleteTransaction);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editType, setEditType] = useState("expense");
  const [activeAction, setActiveAction] = useState(null); // 'export' | 'insights' | 'goals'

  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );

  useEffect(() => {
    loadTransactions();
  }, []);

  // Lọc giao dịch theo tháng đang xem
  const monthTx = transactions.filter((tx) => tx.date.startsWith(currentMonth));

  const income = monthTx
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const expense = monthTx
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const balance = income - expense;

  // Tính chi tiêu theo danh mục
  const byCategory = CATEGORIES.map((cat) => {
    const total = monthTx
      .filter((tx) => tx.type === "expense" && tx.category === cat.id)
      .reduce((sum, tx) => sum + tx.amount, 0);
    return { ...cat, total };
  })
    .filter((cat) => cat.total > 0)
    .sort((a, b) => b.total - a.total);

  const maxCatAmount = byCategory[0]?.total || 1;

  // Điều hướng tháng
  const changeMonth = (direction) => {
    const [year, month] = currentMonth.split("-").map(Number);
    let newMonth = month + direction;
    let newYear = year;

    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }

    const monthStr = String(newMonth).padStart(2, "0");
    setCurrentMonth(`${newYear}-${monthStr}`);
  };

  const [y, m] = currentMonth.split("-").map(Number);
  const monthLabel = new Date(y, m - 1, 1).toLocaleDateString("vi-VN", {
    month: "long",
    year: "numeric",
  });

  const handleLongPress = (tx) => {
    Alert.alert(tx.note || "Giao dịch", `₫${formatMoney(tx.amount)}`, [
      { text: "Huỷ", style: "cancel" },
      {
        text: "✏️ Sửa",
        onPress: () => {
          setEditingTx(tx);
          setEditAmount(String(tx.amount));
          setEditNote(tx.note || "");
          setEditCategory(tx.category);
          setEditType(tx.type);
          setShowEditModal(true);
        },
      },
      {
        text: "🗑️ Xoá",
        style: "destructive",
        onPress: () => {
          Alert.alert("Xoá giao dịch", "Bạn có chắc muốn xoá giao dịch này?", [
            { text: "Huỷ", style: "cancel" },
            {
              text: "Xoá",
              style: "destructive",
              onPress: () => deleteTransaction(tx.id),
            },
          ]);
        },
      },
    ]);
  };

  const handleEditSave = async () => {
    if (!editAmount || parseInt(editAmount) <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ");
      return;
    }
    await updateTransaction(
      editingTx.id,
      parseInt(editAmount.replace(/\./g, "")),
      editType,
      editType === "income" ? "thu_nhap" : editCategory,
      editNote,
      editingTx.date,
    );
    setShowEditModal(false);
    setEditingTx(null);
  };

  const generateCSV = (txList) => {
    const header = "Ngày,Loại,Danh mục,Ghi chú,Số tiền\n";
    const rows = txList
      .map((tx) => {
        const type = tx.type === "income" ? "Thu nhập" : "Chi tiêu";
        const cat =
          CATEGORIES.find((c) => c.id === tx.category)?.label || tx.category;
        const note = tx.note ? `"${tx.note.replace(/"/g, '""')}"` : "";
        return `${tx.date},${type},${cat},${note},${tx.amount}`;
      })
      .join("\n");
    return header + rows;
  };

  const handleExportCSV = async () => {
    if (monthTx.length === 0) {
      Alert.alert(
        "Không có dữ liệu",
        "Tháng này chưa có giao dịch nào để xuất.",
      );
      return;
    }

    try {
      const csv = generateCSV(monthTx);
      const [yy, mm] = currentMonth.split("-");
      const fileName = `BaoCaoChiTieu_${mm}_${yy}.csv`;
      const filePath = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(filePath, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(filePath, {
          mimeType: "text/csv",
          dialogTitle: `Báo cáo chi tiêu tháng ${mm}/${yy}`,
          UTI: "public.comma-separated-values-text",
        });
      } else {
        Alert.alert("Thành công", `File đã lưu tại: ${filePath}`);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể xuất file. Vui lòng thử lại.");
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Thống kê</Text>
          <Text style={styles.subtitle}>Tổng quan chi tiêu</Text>
        </View>

        {/* Chọn tháng */}
        <View style={styles.monthRow}>
          <TouchableOpacity
            style={styles.monthArrow}
            onPress={() => changeMonth(-1)}
          >
            <Text style={styles.monthArrowText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthName}>{monthLabel.toUpperCase()}</Text>
          <TouchableOpacity
            style={styles.monthArrow}
            onPress={() => changeMonth(1)}
          >
            <Text style={styles.monthArrowText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Tổng quan tháng */}
        <View style={styles.summaryRow}>
          <View
            style={[styles.summaryCard, { borderColor: "rgba(0,229,160,0.2)" }]}
          >
            <Text style={styles.summaryLabel}>THU NHẬP</Text>
            <Text style={[styles.summaryAmount, { color: COLORS.success }]}>
              +₫{formatMoney(income)}
            </Text>
          </View>
          <View
            style={[
              styles.summaryCard,
              { borderColor: "rgba(255,77,109,0.2)" },
            ]}
          >
            <Text style={styles.summaryLabel}>CHI TIÊU</Text>
            <Text style={[styles.summaryAmount, { color: COLORS.danger }]}>
              -₫{formatMoney(expense)}
            </Text>
          </View>
        </View>

        {/* Số dư */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>SỐ DƯ THÁNG NÀY</Text>
          <Text
            style={[
              styles.balanceAmount,
              { color: balance >= 0 ? COLORS.success : COLORS.danger },
            ]}
          >
            {balance >= 0 ? "+" : "-"}₫{formatMoney(balance)}
          </Text>
          {expense > 0 && income > 0 && (
            <Text style={styles.balanceSub}>
              Đã tiêu {Math.round((expense / income) * 100)}% thu nhập
            </Text>
          )}
        </View>

        {/* Chi tiêu theo danh mục */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi tiêu theo danh mục</Text>

          {byCategory.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                Chưa có giao dịch nào trong tháng này
              </Text>
            </View>
          ) : (
            byCategory.map((cat) => (
              <View key={cat.id} style={styles.catRow}>
                <View style={styles.catLeft}>
                  <Text style={styles.catEmoji}>{cat.emoji}</Text>
                  <View>
                    <Text style={styles.catName}>{cat.label}</Text>
                    <Text style={styles.catAmount}>
                      ₫{formatMoney(cat.total)}
                    </Text>
                  </View>
                </View>
                <View style={styles.catBarWrap}>
                  <View
                    style={[
                      styles.catBar,
                      { width: `${(cat.total / maxCatAmount) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.catPercent}>
                  {Math.round((cat.total / expense) * 100)}%
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Lịch sử giao dịch tháng này */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Giao dịch tháng này ({monthTx.length})
          </Text>

          {monthTx.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Chưa có giao dịch nào</Text>
            </View>
          ) : (
            monthTx.map((tx) => {
              const cat = CATEGORIES.find((c) => c.id === tx.category);
              return (
                <TouchableOpacity
                  key={tx.id}
                  style={styles.txItem}
                  onLongPress={() => handleLongPress(tx)}
                  delayLongPress={400}
                >
                  <View style={styles.txIcon}>
                    <Text style={styles.txEmoji}>
                      {tx.type === "income" ? "💸" : cat?.emoji || "📦"}
                    </Text>
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={styles.txName}>
                      {tx.note || cat?.label || tx.category}
                    </Text>
                    <Text style={styles.txMeta}>{tx.date}</Text>
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
                    {tx.type === "income" ? "+" : "-"}₫{formatMoney(tx.amount)}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <Modal visible={showEditModal} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Sửa giao dịch</Text>
              <Text style={styles.modalSub}>{editingTx?.date}</Text>

              <View style={styles.toggle}>
                <TouchableOpacity
                  style={[
                    styles.togBtn,
                    editType === "expense" && styles.togBtnExpense,
                  ]}
                  onPress={() => setEditType("expense")}
                >
                  <Text
                    style={[
                      styles.togText,
                      editType === "expense" && { color: COLORS.danger },
                    ]}
                  >
                    Chi tiêu
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.togBtn,
                    editType === "income" && styles.togBtnIncome,
                  ]}
                  onPress={() => setEditType("income")}
                >
                  <Text
                    style={[
                      styles.togText,
                      editType === "income" && { color: COLORS.success },
                    ]}
                  >
                    Thu nhập
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>SỐ TIỀN</Text>
              <TextInput
                style={styles.input}
                value={
                  editAmount
                    ? parseInt(editAmount.replace(/\./g, "")).toLocaleString(
                        "vi-VN",
                      )
                    : ""
                }
                onChangeText={(text) => setEditAmount(text.replace(/\./g, ""))}
                keyboardType="numeric"
                placeholderTextColor={COLORS.textMuted}
              />

              <Text style={styles.inputLabel}>GHI CHÚ</Text>
              <TextInput
                style={styles.input}
                value={editNote}
                onChangeText={setEditNote}
                placeholderTextColor={COLORS.textMuted}
              />

              {editType === "expense" && (
                <>
                  <Text style={styles.inputLabel}>DANH MỤC</Text>
                  <View style={styles.catGrid}>
                    {CATEGORIES.map((cat) => (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.catItem,
                          editCategory === cat.id && styles.catItemSelected,
                        ]}
                        onPress={() => setEditCategory(cat.id)}
                      >
                        <Text style={styles.catEmoji}>{cat.emoji}</Text>
                        <Text
                          style={[
                            styles.catName,
                            editCategory === cat.id && { color: COLORS.danger },
                          ]}
                        >
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              <View style={styles.modalBtns}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setShowEditModal(false)}
                >
                  <Text style={styles.modalCancelText}>Huỷ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSaveBtn}
                  onPress={handleEditSave}
                >
                  <Text style={styles.modalSaveText}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[
            styles.actionPill,
            activeAction === "export" && styles.actionPillActive,
          ]}
          onPress={() => {
            setActiveAction("export");
            handleExportCSV();
          }}
        >
          <Text style={styles.actionPillIco}>📤</Text>
          <Text
            style={[
              styles.actionPillTxt,
              activeAction === "export" && styles.actionPillTxtActive,
            ]}
          >
            Export
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionPill,
            activeAction === "insights" && styles.actionPillActive,
          ]}
          onPress={() => {
            setActiveAction("insights");
            Alert.alert(
              "Sắp ra mắt",
              "Tính năng AI Insights đang được phát triển! 🚀",
            );
          }}
        >
          <Text style={styles.actionPillIco}>✨</Text>
          <Text
            style={[
              styles.actionPillTxt,
              activeAction === "insights" && styles.actionPillTxtActive,
            ]}
          >
            AI Insights
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionPill,
            activeAction === "goals" && styles.actionPillActive,
          ]}
          onPress={() => {
            setActiveAction("goals");
            Alert.alert(
              "Sắp ra mắt",
              "Tính năng Mục tiêu tiết kiệm đang được phát triển! 🎯",
            );
          }}
        >
          <Text style={styles.actionPillIco}>🎯</Text>
          <Text
            style={[
              styles.actionPillTxt,
              activeAction === "goals" && styles.actionPillTxtActive,
            ]}
          >
            Mục tiêu
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {[
          { icon: "🏠", label: "Home", route: "/" },
          { icon: "📊", label: "Stats", route: "/stats" },
          { icon: "➕", label: "Add", route: "/add" },
          { icon: "💳", label: "Nợ", route: "/debt" },
        ].map((item) => {
          const isActive = item.route === "/stats";
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
