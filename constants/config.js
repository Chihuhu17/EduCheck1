// ============================================================
// Cấu hình hệ thống EduCheck
// Thay đổi các giá trị này khi deploy thực tế
// ============================================================

// --- GPS / Vị trí phòng học (Đại học Hòa Bình) ---
export const ROOM_LAT = 21.034479;
export const ROOM_LON = 105.750939;

// Bán kính tối đa cho phép điểm danh (mét)
export const MAX_DISTANCE_M = 500;

// --- QR Code ---
// Prefix token QR của hệ thống EduCheck
export const QR_TOKEN_PREFIX = 'EDUCHECK-CLASS-';

// --- Màu chủ đạo ---
export const COLORS = {
  primary: '#1565C0',
  primaryDark: '#0D47A1',
  primaryLight: '#42A5F5',
  accent: '#4FC3F7',
  bgLight: '#BBDEFB',
  bg: '#F0F4FF',
  success: '#2E7D32',
  successBg: '#E8F5E9',
  error: '#C62828',
  errorBg: '#FFEBEE',
  warning: '#E65100',
  warningBg: '#FFF3E0',
};
