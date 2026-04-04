# Spending Tracker — quản lý thu chi cá nhân

Ứng dụng theo dõi dòng tiền, ngân sách và khoản vay/nợ, giao diện sáng/tối.

---

## Tính năng

- Ghi thu/chi nhanh, có danh mục và ghi chú
- Thống kê theo thời gian
- Ngân sách theo danh mục
- Theo dõi vay/nợ
- Giao diện sáng / tối

---

## Nền tảng

Hiện tập trung **Android**. iOS có thể bổ sung sau.

---

## Cài đặt bản APK (người dùng)

1. Tải file **APK** mới nhất từ [Releases](https://github.com/longnhx1/spending-tracker/releases) (hoặc nguồn bạn phát hành).
2. Trên điện thoại: bật cài đặt ứng dụng từ nguồn tương ứng (trình duyệt / quản lý file).
3. Mở file APK và cài đặt.

---

## Chạy mã nguồn (lập trình viên)

Yêu cầu: [Node.js](https://nodejs.org/) (khuyến nghị LTS), npm, và môi trường [Expo](https://docs.expo.dev/) / Android Studio nếu build native.

```bash
git clone https://github.com/longnhx1/spending-tracker.git
cd spending-tracker
npm install
cp .env.example .env   # Windows: copy .env.example .env
```

Chỉnh file **`.env`**: điền `EXPO_PUBLIC_SUPABASE_URL` và `EXPO_PUBLIC_SUPABASE_ANON_KEY` (Supabase → Project Settings → API).

```bash
npx expo start
```

---

## Git & bảo mật — không commit những thứ sau

| Loại | Ghi chú |
|------|--------|
| `.env`, `.env.local`, mọi file `.env.*` (trừ `.env.example`) | Chứa khóa Supabase / cấu hình riêng |
| `google-services.json`, `GoogleService-Info.plist` | Firebase (nếu sau này có) |
| `keystore.properties`, `release.keystore`, `upload-keystore.jks`, `*.pepk` | Ký bản phát hành Play Store |
| `credentials.json` (EAS) | Token / bí mật build Expo |
| `assets/screenshots/` | Ảnh màn hình có thể chứa số tiền / dữ liệu cá nhân; giữ cục bộ hoặc đưa lên Releases nếu cần |

File **`.env.example`** chỉ có tên biến, **không** có giá trị thật — có thể push an toàn.

Sau khi cài lại Windows hoặc chuyển máy: `git pull` / clone lại, `npm install`, tạo lại `.env` (sao lưu secret riêng, ví dụ password manager).

---

## Sử dụng nhanh trong app

1. **Thêm giao dịch**: tab **+** — số tiền, danh mục, ghi chú.
2. **Thống kê**: tab tương ứng để xem tổng hợp.
3. **Ngân sách**: đặt hạn mức theo danh mục.
4. **Vay/nợ**: ghi các khoản cho vay hoặc đang nợ.

---

## Ảnh màn hình

Ảnh demo không lưu trong repo (tránh lộ dữ liệu). Có thể đính kèm trong **Releases** hoặc giữ trong thư mục cục bộ `assets/screenshots/` (thư mục này đã được `.gitignore`).

---

## Phản hồi

Bug hoặc góp ý: mở **Issue** trên repository hoặc liên hệ: *utena.lg1411@gmail.com*
