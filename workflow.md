# Workflow — từ setup môi trường đến build APK (Spending Tracker)

Tài liệu này mô tả **chuẩn bị môi trường** và **build file `.apk` cục bộ** cho project Expo / React Native (đã có thư mục `android/`). Áp dụng cho **Windows**; Linux/macOS chỉ khác đường dẫn SDK và lệnh shell.

---

## 1. Tổng quan luồng

1. Cài **Node.js**, **JDK 17**, **Android SDK** (thường qua Android Studio).  
2. Khai báo **`ANDROID_HOME`** (hoặc `ANDROID_SDK_ROOT`) và/hoặc file **`android/local.properties`**.  
3. Trong thư mục gốc project: **`npm install`**.  
4. Trong thư mục `android`: chạy **Gradle** (`gradlew`) để ra APK.  
5. (Tuỳ chọn) Đính kèm APK lên **GitHub Releases**.

**Lưu ý:** Build native cần `node` trên PATH — Gradle gọi Expo CLI để đóng gói JS (`export:embed`).

---

## 2. Node.js

- Cài [Node.js LTS](https://nodejs.org/) (project đã dùng npm).  
- Kiểm tra:

```powershell
node -v
npm -v
```

- Trong thư mục gốc repository:

```powershell
cd D:\_code\Profile\SpendingTracker
npm install
```

---

## 3. JDK 17

- Android Gradle Plugin / React Native 0.81 khuyến nghị **JDK 17**.  
- Kiểm tra:

```powershell
java -version
```

- Nên có biến **`JAVA_HOME`** trỏ tới JDK 17 (ví dụ Eclipse Adoptium hoặc **Embedded JBR** của Android Studio: `...\Android Studio\jbr`).

---

## 4. Android Studio và Android SDK

1. Tải và cài [Android Studio](https://developer.android.com/studio).  
2. Mở **SDK Manager** (More Actions → SDK Manager hoặc trong project).  
3. Cài tối thiểu:
   - **Android SDK Platform** tương ứng **compileSdk** của project (hiện log build có thể báo **API 36**).  
   - **Android SDK Build-Tools** (bản Studio đề xuất, thường khớp platform).  
   - **Android SDK Command-line Tools** (hữu ích cho `sdkmanager` nếu cần).

Đường dẫn SDK mặc định trên Windows thường là:

`%LOCALAPPDATA%\Android\Sdk`  
(ví dụ `C:\Users\<tên>\AppData\Local\Android\Sdk`).

---

## 5. Biến môi trường `ANDROID_HOME`

Giúp Gradle và nhiều công cụ tìm SDK mà không cần chỉ trong `local.properties`.

**Windows (User):**

```powershell
[System.Environment]::SetEnvironmentVariable(
  "ANDROID_HOME",
  "C:\Users\<tên>\AppData\Local\Android\Sdk",
  "User"
)
```

Đóng và mở lại terminal (hoặc đăng xuất Windows) để biến có hiệu lực.

Kiểm tra:

```powershell
echo $env:ANDROID_HOME
```

(Có thể dùng thêm `ANDROID_SDK_ROOT` giống giá trị `ANDROID_HOME` nếu tool yêu cầu.)

---

## 6. File `android/local.properties`

Gradle **bắt buộc** biết chỗ đặt SDK. Cách an toàn nhất: tạo file **`android/local.properties`** (file này **không commit** — đã nằm trong `android/.gitignore`).

**Cách A:** Mở folder **`android`** bằng Android Studio một lần — Studio thường tự tạo `local.properties`.

**Cách B:** Sao chép mẫu trong repo:

```powershell
copy android\local.properties.example android\local.properties
```

Sửa dòng `sdk.dir` cho đúng đường dẫn SDK trên máy bạn. Trên Windows, dùng dạng escape dấu `\` và `:`:

```properties
sdk.dir=C\:\\Users\\TenBan\\AppData\\Local\\Android\\Sdk
```

Nếu thiếu file hoặc sai đường dẫn, build sẽ báo lỗi dạng:

`SDK location not found. Define a valid SDK location with an ANDROID_HOME environment variable or by setting the sdk.dir path in your project's local properties file`

---

## 7. Cấu hình app (`.env`)

Ứng dụng dùng Supabase qua biến `EXPO_PUBLIC_*`. Build APK **không** nhúng file `.env` theo cách web — với Expo, giá trị thường được bake vào bundle lúc build **release** tùy cách bạn inject env (xem [Expo Environment variables](https://docs.expo.dev/guides/environment-variables/)).

Thực tế: tạo `.env` từ `.env.example`, điền URL và anon key **trước khi** chạy `assembleRelease` nếu bạn đang dùng `EXPO_PUBLIC_*` trong code (như `lib/supabase.js`).

```powershell
copy .env.example .env
# chỉnh nội dung .env
```

---

## 8. Build APK (local)

Mở terminal tại thư mục **`android`** của project.

### 8.1. Bản release (tối ưu hơn debug để chia sẻ)

Project hiện ký **release** bằng **debug keystore** trong `android/app/build.gradle` — đủ để cài thử / gửi bạn bè, **không** dùng cho Google Play (Play cần keystore / AAB riêng).

```powershell
cd D:\_code\Profile\SpendingTracker\android
.\gradlew.bat assembleRelease
```

### 8.2. Build nhanh hơn (chỉ CPU **arm64-v8a** — điện thoại thật phổ biến)

Giảm thời gian và dung lượng APK so với build đủ `armeabi-v7a`, `x86`, `x86_64`:

```powershell
.\gradlew.bat assembleRelease -PreactNativeArchitectures=arm64-v8a
```

### 8.3. Bản debug (phát triển)

```powershell
.\gradlew.bat assembleDebug -PreactNativeArchitectures=arm64-v8a
```

---

## 9. File APK output

Sau khi build thành công:

| Variant | Đường dẫn thường gặp |
|--------|------------------------|
| Release | `android\app\build\outputs\apk\release\app-release.apk` |
| Debug | `android\app\build\outputs\apk\debug\app-debug.apk` |

Có thể đổi tên file (ví dụ `SpendingTracker-v1.0.0.apk`) trước khi upload **GitHub Releases**.

---

## 10. Tuỳ chọn: `expo run:android`

Từ thư mục gốc project:

```powershell
cd D:\_code\Profile\SpendingTracker
npx expo run:android --variant release
```

Lệnh này cũng dựa trên Gradle; vẫn cần SDK và `local.properties` / `ANDROID_HOME` đúng.

---

## 11. Đưa APK lên GitHub

1. Vào repo trên GitHub → **Releases** → **Draft a new release**.  
2. Tạo tag (ví dụ `v1.0.0`).  
3. **Attach** file `.apk`.  
4. Trong `README.md` có thể trỏ link tải trực tiếp từ release đó.

Không nên commit file `.apk` vào nhánh `main` (file lớn, làm nặng lịch sử Git).

---

## 12. Xử lý sự cố thường gặp

| Hiện tượng | Hướng xử lý |
|------------|-------------|
| `SDK location not found` | Tạo/sửa `android/local.properties` (`sdk.dir`) và/hoặc đặt `ANDROID_HOME`. |
| `node` không tìm thấy khi build | Cài Node, mở terminal mới; build từ terminal có PATH đầy đủ. |
| Lỗi thiếu platform / build-tools | Mở SDK Manager, cài đúng API và Build-Tools theo thông báo lỗi. |
| Lần đầu build rất lâu | Gradle tải dependency và cache — lần sau thường nhanh hơn. |
| Cần JDK khác | Đặt `JAVA_HOME` trỏ JDK 17; trong Android Studio chọn JDK embedded hoặc 17. |

---

## 13. Trạng thái kiểm tra trên môi trường build

Lần chạy `.\gradlew.bat assembleRelease -PreactNativeArchitectures=arm64-v8a` gần đây **chưa hoàn tất** trên máy chưa cấu hình SDK (lỗi `SDK location not found`). Sau khi bạn hoàn tất mục **4–6**, chạy lại lệnh ở mục **8** — khi đó build sẽ tiếp tục tải NDK/platform (nếu thiếu) và tạo APK.

---

*Tài liệu này phản ánh cấu hình project tại thời điểm viết (Expo SDK 54, React Native 0.81, thư mục `android/` có sẵn).*
