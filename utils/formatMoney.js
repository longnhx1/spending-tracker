/**
 * Format số tiền theo ngữ cảnh:
 *
 * formatMoney(185000)              → "185K"
 * formatMoney(1200000)             → "1.2M"
 * formatMoney(8500000)             → "8.5M"
 * formatMoney(4250000)             → "4.25M"
 * formatMoney(185000, 'full')      → "185.000đ"
 * formatMoney(1200000, 'full')     → "1.200.000đ"
 * formatMoney(-185000, 'signed')   → "−185K"
 * formatMoney(8500000, 'signed')   → "+8.5M"
 * formatMoney(0)                   → "0"
 */
export function formatMoney(amount, mode = "compact") {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "−" : mode === "signed" && amount > 0 ? "+" : "";

  let formatted;

  if (mode === "full") {
    // Luôn hiển thị đầy đủ số, có dấu chấm phân cách, kèm "đ"
    formatted = abs.toLocaleString("vi-VN") + "đ";
    return (amount < 0 ? "−" : "") + formatted;
  }

  // compact: rút gọn thông minh
  if (abs >= 1_000_000) {
    // Triệu -> "M"
    const m = abs / 1_000_000;
    // Bỏ phần thập phân nếu là số nguyên
    formatted = (Number.isInteger(m) ? m.toString() : parseFloat(m.toFixed(2)).toString()) + "M";
  } else if (abs >= 1_000) {
    // Nghìn -> "K"
    const k = abs / 1_000;
    formatted = (Number.isInteger(k) ? k.toString() : parseFloat(k.toFixed(1)).toString()) + "K";
  } else {
    formatted = abs.toString();
  }

  return sign + formatted;
}

/**
 * Format cho hero card (số dư lớn) — luôn full, không ký hiệu M/K
 * formatMoneyHero(4250000) -> "4.250.000" (không có "đ", thêm <sub>đ</sub> riêng)
 */
export function formatMoneyHero(amount) {
  return Math.abs(amount).toLocaleString("vi-VN");
}

