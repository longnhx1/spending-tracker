import * as FileSystem from "expo-file-system/legacy";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CATEGORIES } from "../constants/theme";
import { useAppColors } from "../context/AppThemeContext";
import useStore from "../store/useStore";

export default function StatsScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const transactions = useStore((state) => state.transactions || []);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthTx = transactions.filter((tx) =>
    tx.date?.startsWith ? tx.date.startsWith(currentMonth) : false,
  );

  const [activeAction, setActiveAction] = useState(null); // 'export' | 'insights' | 'goals'

  // Tạo nội dung CSV từ dữ liệu giao dịch
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
      const [y, m] = currentMonth.split("-");
      const fileName = `BaoCaoChiTieu_${m}_${y}.csv`;
      const filePath = FileSystem.documentDirectory + fileName;

      // Ghi file CSV
      await FileSystem.writeAsStringAsync(filePath, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Mở share sheet
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(filePath, {
          mimeType: "text/csv",
          dialogTitle: `Báo cáo chi tiêu tháng ${m}/${y}`,
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
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Thống kê</Text>
            <Text style={styles.subtitle}>
              Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
            </Text>
          </View>
        </View>

        <View style={styles.container}>
          <Text style={styles.text}>Tổng giao dịch tháng này</Text>
          <Text style={styles.value}>{monthTx.length}</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

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

/** @param {import('../constants/theme').AppColors} c */
function createStyles(c) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.bg0 },
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 8,
    },
    title: { fontSize: 24, color: c.textPrimary, fontWeight: "800" },
    subtitle: { fontSize: 11, color: c.silver, opacity: 0.5, marginTop: 2 },
    container: {
      alignItems: "center",
      padding: 20,
    },
    text: { color: c.textPrimary, fontSize: 14, opacity: 0.7 },
    value: {
      fontSize: 28,
      color: c.accent,
      fontWeight: "700",
      marginTop: 6,
    },
    actionBar: {
      flexDirection: "row",
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: c.bg0,
      borderTopWidth: 1,
      borderTopColor: c.navBarBorder,
    },
    actionPill: {
      flex: 1,
      backgroundColor: c.bg3,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      paddingVertical: 8,
      alignItems: "center",
      gap: 4,
    },
    actionPillActive: {
      borderColor: c.accent,
      backgroundColor: c.actionPillActiveBg,
    },
    actionPillIco: { fontSize: 16 },
    actionPillTxt: {
      fontSize: 8,
      color: c.silver,
      opacity: 0.5,
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },
    actionPillTxtActive: {
      color: c.accent,
      opacity: 1,
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
