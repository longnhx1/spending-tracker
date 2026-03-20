// constants/theme.js

// Định nghĩa các màu sắc được sử dụng trong ứng dụng
export const COLORS = {
    // Màu nền chính - các tông màu tối
    bg0: '#0B0F14',
    bg1: '#121212',
    bg2: '#0A1A2F',
    bg3: '#0D1B2A',

    // Màu xám lạnh - cho các thành phần phụ
    gray1: '#2C2F33',
    gray2: '#3A3F44',

    // Màu bạc ánh xanh - cho văn bản phụ
    silver: '#8A9BA8',

    // Màu xanh lam dịu - cho các thành phần điều hướng
    navy: '#1F4068',

    // Màu điểm nhấn - xanh dương sáng
    accent: '#00A8FF',
    cyan: '#00FFFF',
    electric: '#0096FF',

    // Màu trạng thái - cho thông báo và cảnh báo
    success: '#00E5A0',
    danger: '#FF4D6D',
    warning: '#FFB800',

    // Màu văn bản
    textPrimary: '#FFFFFF',
    textSecondary: '#8A9BA8',
    textMuted: '#3A3F44',

    // Màu viền
    border: '#1A2535',
};

// Danh sách các danh mục chi tiêu với nhãn tiếng Việt và biểu tượng emoji
export const CATEGORIES = [
    { id: 'an_uong', label: 'Ăn uống', emoji: '🍜' },
    { id: 'di_chuyen', label: 'Di chuyển', emoji: '🚗' },
    { id: 'hoc_tap', label: 'Học tập', emoji: '📚' },
    { id: 'giai_tri', label: 'Giải trí', emoji: '🎮' },
    { id: 'suc_khoe', label: 'Sức khỏe', emoji: '🏥' },
    { id: 'mua_sam', label: 'Mua sắm', emoji: '🛍' },
    { id: 'tien_ich', label: 'Tiện ích', emoji: '💡' },
    { id: 'khac', label: 'Khác', emoji: '📦' },
];

// Định nghĩa các độ đậm của font chữ
export const FONTS = {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    regular: 'BeVietnamPro_400Regular',
    medium: 'BeVietnamPro_500Medium',
    semibold: 'BeVietnamPro_600SemiBold',
    bold: 'BeVietnamPro_700Bold',
    extrabold: 'BeVietnamPro_800ExtraBold',
};