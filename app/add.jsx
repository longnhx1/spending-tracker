import { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import useStore from "../store/useStore";
import makeAddStyles from "../styles/addStyles";
import { formatMoney } from "../utils/formatMoney";
import {
  BackIcon,
  CalendarIcon,
  ChevronRightIcon,
} from "../components/icons";

const pad2 = (n) => String(n).padStart(2, "0");
const formatDateDisplay = (d) => {
  const days = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${days[d.getDay()]}, ${dd}/${mm}/${yyyy}`;
};

const formatDateISO = (d) => {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
};

const normalize = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const localClassify = (note, validIds) => {
  const t = normalize(note);
  if (!t) return null;

  const rules = [
    { id: "food", kw: ["an", "uong", "com", "pho", "cafe", "tra sua"] },
    { id: "transport", kw: ["xang", "grab", "taxi", "xe buyt", "gui xe"] },
    { id: "education", kw: ["sach", "khoa hoc", "hoc phi", "luyen thi"] },
    { id: "entertain", kw: ["netflix", "spotify", "game", "rap phim"] },
    { id: "health", kw: ["thuoc", "kham", "vien phi", "nha thuoc"] },
    { id: "shopping", kw: ["shopee", "lazada", "ao", "quan", "giay"] },
    { id: "housing", kw: ["dien", "nuoc", "mang", "internet", "tien nha"] },
  ];

  for (const r of rules) {
    if (r.kw.some((k) => t.includes(k))) {
      return validIds.has(r.id) ? r.id : null;
    }
  }
  if (validIds.has("other")) return "other";
  return validIds.values().next().value || null;
};

async function getApiKey() {
  const candidates = ["GEMINI_API_KEY", "gemini_api_key", "GOOGLE_API_KEY"];
  for (const k of candidates) {
    const v = (await AsyncStorage.getItem(k)) || "";
    if (v.trim()) return v.trim();
  }
  return "";
}

async function classifyWithAI(note, categories) {
  const key = await getApiKey();
  if (!key) return null;

  const prompt = [
    "Bạn là bộ phân loại danh mục chi tiêu.",
    "Trả về DUY NHẤT 1 id danh mục trong danh sách hợp lệ, không kèm giải thích.",
    `Danh mục hợp lệ: ${categories.map((c) => c.id).join(", ")}.`,
    `Ghi chú: "${note}".`,
    "Trả về 1 id.",
  ].join("\n");

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0, maxOutputTokens: 10 },
  };

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent" +
    `?key=${encodeURIComponent(key)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const out =
    data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim?.() ||
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "";
  const candidate = out.split(/\s+/)[0].trim();
  return categories.some((c) => c.id === candidate) ? candidate : null;
}

export default function AddScreen() {
  const router = useRouter();
  const addTransaction = useStore((s) => s.addTransaction);
  const colors = useStore((s) => s.colors);
  const styles = makeAddStyles(colors);
  const categories = useStore((s) => s.categories);

  const [type, setType] = useState("expense"); // 'expense' | 'income'
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [isClassifying, setIsClassifying] = useState(false);

  const amountNumber = useMemo(() => {
    const cleaned = String(amount).replace(/[^\d]/g, "");
    return cleaned ? parseInt(cleaned, 10) : 0;
  }, [amount]);

  const handleNoteBlur = async () => {
    if (type !== "expense") return;
    const raw = (note || "").trim();
    if (!raw) return;

    const validIds = new Set(categories.map((c) => c.id));
    setIsClassifying(true);
    try {
      const ai = (await classifyWithAI(raw, categories)) || localClassify(raw, validIds);
      if (ai) setCategory(ai);
    } catch (_e) {
      const fallback = localClassify(raw, validIds);
      if (fallback) setCategory(fallback);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleSave = () => {
    if (!amountNumber || amountNumber <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ");
      return;
    }
    if (type === "expense" && !category) {
      Alert.alert("Lỗi", "Vui lòng chọn danh mục");
      return;
    }

    addTransaction(
      parseInt(amount.replace(/\./g, "") || "0"),
      type,
      type === "income" ? "thu_nhap" : category,
      note,
      formatDateISO(date),
    );

    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <BackIcon size={18} color={colors.text1} />
        </TouchableOpacity>
        <Text style={styles.title}>Thêm giao dịch</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[
              styles.typePill,
              type === "expense" && styles.typePillActive,
            ]}
            onPress={() => setType("expense")}
          >
            <Text
              style={[
                styles.typeText,
                type === "expense" && styles.typeTextActive,
              ]}
            >
              Chi tiêu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typePill,
              type === "income" && styles.typePillActive,
            ]}
            onPress={() => setType("income")}
          >
            <Text
              style={[
                styles.typeText,
                type === "income" && styles.typeTextActive,
              ]}
            >
              Thu nhập
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>SỐ TIỀN</Text>
          <View style={styles.amountRow}>
            <TextInput
              style={[
                styles.amountInput,
                { flex: 1, minWidth: 0 },
                { color: type === "expense" ? colors.danger : colors.success },
              ]}
              value={
                amount
                  ? formatMoney(parseInt(amount.replace(/\./g, ""), 10), "full").replace("đ", "")
                  : ""
              }
              onChangeText={(text) => {
                const raw = text.replace(/\./g, "");
                if (!isNaN(raw)) setAmount(raw);
              }}
              placeholder="0"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              autoCorrect={false}
              autoComplete="off"
              spellCheck={false}
              textContentType="none"
            />
            <Text style={[styles.amountCur, { marginRight: 0, marginLeft: 8 }]}>
              đ
            </Text>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>NGÀY</Text>
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => setShowPicker(true)}
            activeOpacity={0.7}
          >
            <View style={styles.dateBtnIcon}>
              <CalendarIcon color={colors.accent} size={16} />
            </View>
            <Text style={styles.dateBtnText}>{formatDateDisplay(date)}</Text>
            <ChevronRightIcon color={colors.text3} size={14} />
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowPicker(Platform.OS === "ios");
                if (selectedDate) setDate(selectedDate);
              }}
              locale="vi-VN"
              style={{ marginTop: 8 }}
            />
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>GHI CHÚ</Text>
          <View style={styles.fieldRow}>
            <TextInput
              style={[styles.fieldInput, { flex: 1 }]}
              value={note}
              onChangeText={setNote}
              onBlur={handleNoteBlur}
              placeholder="Nhập ghi chú để Auto phân loại"
              placeholderTextColor={colors.textMuted}
            />
            <TouchableOpacity
              style={styles.aiBtn}
              onPress={handleNoteBlur}
              disabled={isClassifying}
            >
              {isClassifying ? (
                <ActivityIndicator size="small" color={colors.accent} />
              ) : (
                <Text style={styles.aiBtnText}>Auto</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {type === "expense" && (
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>DANH MỤC</Text>
            <View style={styles.catGrid}>
              {categories.map((cat) => {
                const active = category === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.catItem, active && styles.catItemActive]}
                    onPress={() => setCategory(cat.id)}
                  >
                    <Text style={styles.catEmoji}>{cat.emoji}</Text>
                    <Text
                      style={[styles.catLabel, active && styles.catLabelActive]}
                      numberOfLines={1}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Lưu</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>

    </SafeAreaView>
  );
}
