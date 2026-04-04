/**
 * Supabase Auth có thể đặt error.message = JSON.stringify(Response) khi 502/503/504,
 * nên Alert hiển thị cả đối tượng kỹ thuật. Hàm này trả về nội dung ngắn gọn cho người dùng.
 *
 * @param {unknown} error
 * @param {string} fallback
 * @returns {string}
 */
export function formatAuthAlertMessage(error, fallback) {
  if (error == null || typeof error !== "object") {
    return fallback;
  }

  const status =
    "status" in error && typeof error.status === "number"
      ? error.status
      : undefined;

  if (status === 502 || status === 503 || status === 504) {
    return "Máy chủ xác thực tạm thời lỗi hoặc quá tải. Vui lòng thử lại sau vài phút.";
  }

  if (status === 429) {
    return "Đã gửi quá nhiều email xác minh trong thời gian ngắn. Đợi 15–60 phút rồi thử lại, hoặc tắt xác minh email khi dev trong Supabase Dashboard.";
  }

  const name = "name" in error ? error.name : undefined;
  const rawMsg =
    "message" in error && typeof error.message === "string"
      ? error.message
      : "";

  const looksLikeSerializedResponse =
    rawMsg.includes("_bodyInit") ||
    (rawMsg.includes('"url"') && rawMsg.includes('"status"')) ||
    (rawMsg.startsWith("{") && rawMsg.length > 200);

  if (/rate limit|too many requests|email rate limit/i.test(rawMsg)) {
    return "Supabase đang giới hạn số email xác minh gửi đi. Đợi một lúc rồi thử lại; khi test có thể tắt “Confirm email” trong Authentication → Providers → Email.";
  }

  if (
    status === 0 ||
    name === "AuthRetryableFetchError" ||
    looksLikeSerializedResponse
  ) {
    return "Không kết nối được máy chủ xác thực. Kiểm tra mạng và thử lại.";
  }

  if (rawMsg.length > 280) {
    return fallback;
  }

  return rawMsg.trim() || fallback;
}
