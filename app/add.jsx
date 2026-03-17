// app/add.jsx
// Màn hình thêm giao dịch mới cho ứng dụng theo dõi chi tiêu
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CATEGORIES, COLORS } from "../constants/theme";
import useStore from "../store/useStore";

// API Key cho Gemini AI - cần thay thế bằng key thật
const GEMINI_API_KEY = "AIzaSyCveq_XEaDGhYyHc0Gj9yn1TFbystsUMCs";

// Hàm gọi Gemini AI để tự động phân loại giao dịch dựa trên ghi chú
const classifyWithAI = async (note) => {
  try {
    // Lấy danh sách ID các danh mục để gửi cho AI
    const categoryIds = CATEGORIES.map((c) => c.id).join(", ");
    // Gửi request đến Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Phân loại khoản chi tiêu sau vào đúng 1 danh mục.
Ghi chú: "${note}"
Các danh mục: ${categoryIds}
Chỉ trả về JSON, không giải thích: {"category": "tên_danh_mục"}`,
                },
              ],
            },
          ],
        }),
      },
    );
    const data = await response.json();
    // Lấy text từ response và làm sạch
    const text = data.candidates[0].content.parts[0].text;
    const clean = text.replace(/```json|```/g, "").trim();
    // Parse JSON để lấy category
    const parsed = JSON.parse(clean);
    return parsed.category;
  } catch (e) {
    // Nếu có lỗi, trả về null
    return null;
  }
};

export default function AddScreen() {
  const router = useRouter();
  const addTransaction = useStore((state) => state.addTransaction);

  const [type, setType] = useState("expense"); // 'expense' | 'income'
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");
  const [isClassifying, setIsClassifying] = useState(false);
  const [date] = useState(new Date().toISOString().slice(0, 10));

  // Khi user gõ xong note, gọi AI phân loại
  const handleNoteBlur = async () => {
    if (!note.trim()) return;
    setIsClassifying(true);
    const result = await classifyWithAI(note);
    if (result) setCategory(result);
    setIsClassifying(false);
  };

  // Format số tiền khi nhập: 2450000 → 2.450.000
  const handleAmountChange = (text) => {
    const raw = text.replace(/\./g, "");
    if (isNaN(raw)) return;
    setAmount(raw);
  };

  const formatDisplay = (raw) => {
    if (!raw) return "";
    return parseInt(raw).toLocaleString("vi-VN");
  };

  const handleSave = () => {
    if (!amount || parseInt(amount) <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ");
      return;
    }
    if (!category) {
      Alert.alert("Lỗi", "Vui lòng chọn danh mục");
      return;
    }

    addTransaction(parseInt(amount), type, category, note, date);

    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header với nút back và tiêu đề */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Thêm giao dịch</Text>
        </View>

        {/* Toggle chọn loại giao dịch: Chi tiêu hoặc Thu nhập */}
        <View style={styles.toggle}>
          <TouchableOpacity
            style={[styles.togBtn, type === "expense" && styles.togBtnExpense]}
            onPress={() => setType("expense")}
          >
            <Text
              style={[
                styles.togText,
                type === "expense" && { color: COLORS.danger },
              ]}
            >
              Chi tiêu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.togBtn, type === "income" && styles.togBtnIncome]}
            onPress={() => setType("income")}
          >
            <Text
              style={[
                styles.togText,
                type === "income" && { color: COLORS.success },
              ]}
            >
              Thu nhập
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input số tiền với format VND */}
        <View style={styles.amountBox}>
          <Text style={styles.amountCur}>VND</Text>
          <TextInput
            style={[
              styles.amountInput,
              {
                color: type === "expense" ? COLORS.danger : COLORS.success,
              },
            ]}
            value={formatDisplay(amount)}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={COLORS.textMuted}
          />
        </View>

        {/* Field ghi chú - AI sẽ đọc để phân loại */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>GHI CHÚ</Text>
          <View style={styles.fieldRow}>
            <TextInput
              style={[styles.fieldInput, { flex: 1 }]}
              value={note}
              onChangeText={setNote}
              onBlur={handleNoteBlur}
              placeholder="Nhập ghi chú để AI tự phân loại..."
              placeholderTextColor={COLORS.textMuted}
            />
            {/* Hiển thị loading khi AI đang phân loại */}
            {isClassifying && (
              <ActivityIndicator
                size="small"
                color={COLORS.accent}
                style={{ marginLeft: 10 }}
              />
            )}
          </View>
          {/* Hiển thị hint khi AI đang hoạt động */}
          {isClassifying && (
            <Text style={styles.aiHint}>✨ AI đang phân loại...</Text>
          )}
        </View>

        {/* Grid chọn danh mục */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>DANH MỤC</Text>
          <View style={styles.catGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.catItem,
                  category === cat.id && styles.catItemSelected,
                  category === cat.id && {
                    borderColor:
                      type === "expense" ? COLORS.danger : COLORS.success,
                  },
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <Text style={styles.catEmoji}>{cat.emoji}</Text>
                <Text
                  style={[
                    styles.catName,
                    category === cat.id && {
                      color:
                        type === "expense" ? COLORS.danger : COLORS.success,
                    },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Nút lưu giao dịch */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>LƯU GIAO DỊCH</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Container chính với background
  safe: { flex: 1, backgroundColor: COLORS.bg0 },
  // Header với nút back và tiêu đề
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  // Nút back
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.bg3,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { color: COLORS.silver, fontSize: 16 },
  title: { fontSize: 18, color: COLORS.textPrimary, fontWeight: "700" },
  // Toggle chọn loại giao dịch
  toggle: {
    flexDirection: "row",
    margin: 20,
    backgroundColor: COLORS.bg3,
    borderRadius: 14,
    padding: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  togBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  togBtnExpense: { backgroundColor: "rgba(255,77,109,0.15)" },
  togBtnIncome: { backgroundColor: "rgba(0,229,160,0.1)" },
  togText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.silver,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  // Container nhập số tiền
  amountBox: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  amountCur: {
    fontSize: 11,
    color: COLORS.silver,
    opacity: 0.4,
    letterSpacing: 2,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: "300",
    letterSpacing: -2,
    textAlign: "center",
    minWidth: 100,
  },
  // Style chung cho các field
  field: { paddingHorizontal: 20, marginBottom: 16 },
  fieldLabel: {
    fontSize: 9,
    color: COLORS.silver,
    opacity: 0.4,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  fieldRow: { flexDirection: "row", alignItems: "center" },
  fieldInput: {
    backgroundColor: COLORS.bg3,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  aiHint: {
    fontSize: 10,
    color: COLORS.accent,
    marginTop: 6,
    opacity: 0.7,
  },
  // Grid hiển thị danh mục
  catGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  // Item danh mục
  catItem: {
    width: "22%",
    backgroundColor: COLORS.bg3,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    gap: 4,
  },
  catItemSelected: {
    backgroundColor: "rgba(255,77,109,0.08)",
  },
  catEmoji: { fontSize: 20 },
  catName: {
    fontSize: 9,
    color: COLORS.silver,
    opacity: 0.5,
    textAlign: "center",
  },
  // Nút lưu giao dịch
  saveBtn: {
    margin: 20,
    backgroundColor: COLORS.electric,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
});
