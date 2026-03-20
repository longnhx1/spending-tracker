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
import useStore from "../store/useStore";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import makeStatsStyles from "../styles/statsStyles";

const formatMoney = (amount) => Math.abs(amount).toLocaleString("vi-VN");
const pad2 = (n) => String(n).padStart(2, "0");
const formatCompactVnd = (value) => {
  const n = Math.abs(Number(value) || 0);
  if (n >= 1_000_000) return `${Math.round((n / 1_000_000) * 10) / 10}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return `${Math.round(n)}`;
};

export default function StatsScreen() {
  const router = useRouter();
  const transactions = useStore((state) => state.transactions);
  const loadTransactions = useStore((state) => state.loadTransactions);
  const updateTransaction = useStore((state) => state.updateTransaction);
  const deleteTransaction = useStore((state) => state.deleteTransaction);
  const colors = useStore((state) => state.colors);
  const styles = makeStatsStyles(colors);
  const categories = useStore((state) => state.categories);

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
  const byCategory = categories.map((cat) => {
    const total = monthTx
      .filter((tx) => tx.type === "expense" && tx.category === cat.id)
      .reduce((sum, tx) => sum + tx.amount, 0);
    return { ...cat, total };
  })
    .filter((cat) => cat.total > 0)
    .sort((a, b) => b.total - a.total);

  const maxCatAmount = byCategory[0]?.total || 1;

  // So sánh theo tuần trong tháng hiện tại (Tuần 1..4)
  const [wy, wm] = currentMonth.split("-").map(Number);
  const daysInMonth = new Date(wy, wm, 0).getDate();
  const weekComparisons = [1, 2, 3, 4].map((week) => {
    const startDay = (week - 1) * 7 + 1;
    if (startDay > daysInMonth) {
      return { week, weekIncome: 0, weekExpense: 0 };
    }
    const endDay = Math.min(daysInMonth, startDay + 6);
    const startISO = `${currentMonth}-${pad2(startDay)}`;
    const endISO = `${currentMonth}-${pad2(endDay)}`;

    const weekTx = monthTx.filter((tx) => tx.date >= startISO && tx.date <= endISO);
    const weekIncome = weekTx
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);
    const weekExpense = weekTx
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);

    return { week, weekIncome, weekExpense };
  });
  const maxWeekValue = Math.max(
    1,
    ...weekComparisons.map((w) => Math.max(w.weekIncome, w.weekExpense)),
  );

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
    Alert.alert(tx.note || "Giao dịch", `${formatMoney(tx.amount)} vnd`, [
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
          categories.find((c) => c.id === tx.category)?.label || tx.category;
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
            <Text style={[styles.summaryAmount, { color: colors.success }]}>
              +{formatMoney(income)} vnd
            </Text>
          </View>
          <View
            style={[
              styles.summaryCard,
              { borderColor: "rgba(255,77,109,0.2)" },
            ]}
          >
            <Text style={styles.summaryLabel}>CHI TIÊU</Text>
            <Text style={[styles.summaryAmount, { color: colors.danger }]}>
              -{formatMoney(expense)} vnd
            </Text>
          </View>
        </View>

        {/* Số dư */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>SỐ DƯ THÁNG NÀY</Text>
          <Text
            style={[
              styles.balanceAmount,
              { color: balance >= 0 ? colors.success : colors.danger },
            ]}
          >
            {balance >= 0 ? "+" : "-"}{formatMoney(balance)} vnd
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
                      {formatMoney(cat.total)} vnd
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

        {/* So sánh theo tuần */}
        <View style={styles.section}>
          <Text style={styles.weekCompareTitle}>SO SÁNH TUẦN</Text>
          {weekComparisons.map((w) => {
            const pctExpense = (w.weekExpense / maxWeekValue) * 100;
            const pctIncome = (w.weekIncome / maxWeekValue) * 100;
            return (
              <View key={w.week} style={styles.weekRow}>
                <Text style={styles.weekLabel}>{`Tuần ${w.week}`}</Text>
                <View style={styles.weekBarTrack}>
                  <View
                    style={[
                      styles.weekBarExpense,
                      { width: `${pctExpense}%` },
                    ]}
                  />
                  <View
                    style={[
                      styles.weekBarIncome,
                      { width: `${pctIncome}%` },
                    ]}
                  />
                </View>
                <Text style={styles.weekValue}>{formatCompactVnd(w.weekExpense)}</Text>
              </View>
            );
          })}
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
              const cat = categories.find((c) => c.id === tx.category);
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
                          tx.type === "income" ? colors.success : colors.danger,
                      },
                    ]}
                  >
                    {tx.type === "income" ? "+" : "-"}
                    {formatMoney(tx.amount)} vnd
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
                      editType === "expense" && { color: colors.danger },
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
                      editType === "income" && { color: colors.success },
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
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.inputLabel}>GHI CHÚ</Text>
              <TextInput
                style={styles.input}
                value={editNote}
                onChangeText={setEditNote}
                placeholderTextColor={colors.textMuted}
              />

              {editType === "expense" && (
                <>
                  <Text style={styles.inputLabel}>DANH MỤC</Text>
                  <View style={styles.catGrid}>
                    {categories.map((cat) => (
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
                            editCategory === cat.id && { color: colors.danger },
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
              Xuất CSV
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
              "Tính năng Thông tin trí tuệ nhân tạo đang được phát triển! 🚀",
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
            Thông tin trí tuệ nhân tạo
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
          { icon: "🏠", label: "Trang chủ", route: "/" },
          { icon: "📊", label: "Thống kê", route: "/stats" },
          { icon: "➕", label: "Thêm", route: "/add" },
          { icon: "💳", label: "Nợ", route: "/debt" },
        ].map((item) => {
          const isActive = item.route === "/stats";
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
