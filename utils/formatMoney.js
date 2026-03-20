/**
 * Format money with Vietnamese context.
 *
 * Modes:
 * - compact (default): 185000 -> "185K", 1200000 -> "1.2M"
 * - full: 185000 -> "185.000đ"
 * - signed: adds "+" / "-" to the number
 */
export function formatMoney(amount, mode = "compact") {
  const n = Number(amount);
  const abs = Math.abs(Number.isFinite(n) ? n : 0);

  const sign =
    n < 0
      ? "−"
      : mode === "signed" && n > 0
        ? "+"
        : "";

  if (mode === "full") {
    const formatted = abs.toLocaleString("vi-VN") + "đ";
    return (n < 0 ? "−" : "") + formatted;
  }

  let formatted;
  if (abs >= 1_000_000) {
    const m = abs / 1_000_000;
    formatted = (Number.isInteger(m) ? m.toString() : parseFloat(m.toFixed(2)).toString()) + "M";
  } else if (abs >= 1_000) {
    const k = abs / 1_000;
    formatted = (Number.isInteger(k) ? k.toString() : parseFloat(k.toFixed(1)).toString()) + "K";
  } else {
    formatted = abs.toString();
  }

  return sign + formatted;
}

/**
 * Hero (balance) formatting: always full number without "đ".
 * Example: formatMoneyHero(4250000) => "4.250.000"
 */
export function formatMoneyHero(amount) {
  const n = Number(amount);
  const abs = Math.abs(Number.isFinite(n) ? n : 0);
  return abs.toLocaleString("vi-VN");
}

