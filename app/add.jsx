import { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS, CATEGORIES } from "../constants/theme";
import useStore from "../store/useStore";
import styles from "../styles/addStyles";

const formatMoney = (amount) => {
  const n = Number.isFinite(amount) ? amount : 0;
  return Math.abs(n).toLocaleString("vi-VN");
};

const pad2 = (n) => String(n).padStart(2, "0");
const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

const normalize = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const localClassify = (note) => {
  const t = normalize(note);
  if (!t) return null;

  const rules = [
    { id: "an_uong", kw: ["an", "uong", "com", "pho", "cafe", "tra sua"] },
    { id: "di_chuyen", kw: ["xang", "grab", "taxi", "xe buyt", "gui xe"] },
    { id: "hoc_tap", kw: ["sach", "khoa hoc", "hoc phi", "luyen thi"] },
    { id: "giai_tri", kw: ["netflix", "spotify", "game", "rap phim"] },
    { id: "suc_khoe", kw: ["thuoc", "kham", "vien phi", "nha thuoc"] },
    { id: "mua_sam", kw: ["shopee", "lazada", "ao", "quan", "giay"] },
    { id: "tien_ich", kw: ["dien", "nuoc", "mang", "internet", "tien nha"] },
  ];

  for (const r of rules) {
    if (r.kw.some((k) => t.includes(k))) return r.id;
  }
  return "khac";
};

async function getApiKey() {
  const candidates = ["GEMINI_API_KEY", "gemini_api_key", "GOOGLE_API_KEY"];
  for (const k of candidates) {
    const v = (await AsyncStorage.getItem(k)) || "";
    if (v.trim()) return v.trim();
  }
  return "";
}

async function classifyWithAI(note) {
  const key = await getApiKey();
  if (!key) return null;

  const prompt = [
    "Bạn là bộ phân loại danh mục chi tiêu.",
    "Trả về DUY NHẤT 1 id danh mục trong danh sách hợp lệ, không kèm giải thích.",
    `Danh mục hợp lệ: ${CATEGORIES.map((c) => c.id).join(", ")}.`,
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
  return CATEGORIES.some((c) => c.id === candidate) ? candidate : null;
}

export default function AddScreen() {
  const router = useRouter();
  const addTransaction = useStore((s) => s.addTransaction);

  const [type, setType] = useState("expense"); // 'expense' | 'income'
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(todayISO());

  const [isClassifying, setIsClassifying] = useState(false);

  const amountNumber = useMemo(() => {
    const cleaned = String(amount).replace(/[^\d]/g, "");
    return cleaned ? parseInt(cleaned, 10) : 0;
  }, [amount]);

  const handleNoteBlur = async () => {
    if (type !== "expense") return;
    const raw = (note || "").trim();
    if (!raw) return;

    setIsClassifying(true);
    try {
      const ai = (await classifyWithAI(raw)) || localClassify(raw);
      if (ai) setCategory(ai);
    } catch (_e) {
      const fallback = localClassify(raw);
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
      date,
    );

    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
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
            <Text style={styles.amountCur}>₫</Text>
            <TextInput
              style={[
                styles.amountInput,
                { color: type === "expense" ? COLORS.danger : COLORS.success },
              ]}
              value={
                amount
                  ? parseInt(amount.replace(/\./g, "")).toLocaleString("vi-VN")
                  : ""
              }
              onChangeText={(text) => {
                const raw = text.replace(/\./g, "");
                if (!isNaN(raw)) setAmount(raw);
              }}
              placeholder="0"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              autoCorrect={false}
              autoComplete="off"
              spellCheck={false}
              textContentType="none"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>NGÀY</Text>
          <TextInput
            style={styles.fieldInput}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={COLORS.textMuted}
          />
        </View>

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
            <TouchableOpacity
              style={styles.aiBtn}
              onPress={handleNoteBlur}
              disabled={isClassifying}
            >
              {isClassifying ? (
                <ActivityIndicator size="small" color={COLORS.accent} />
              ) : (
                <Text style={styles.aiBtnText}>✨ AI</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {type === "expense" && (
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>DANH MỤC</Text>
            <View style={styles.catGrid}>
              {CATEGORIES.map((cat) => {
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
