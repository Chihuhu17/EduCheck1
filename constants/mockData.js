// ============================================================
// Dữ liệu mock của EduCheck
// Khi tích hợp backend thực tế, thay thế bằng API calls
// ============================================================

// --- Tài khoản demo ---
export const MOCK_USERS = [
  { id: '1', studentCode: '522CNT1006', name: 'Trần Quang Bắc', role: 'student', password: '123456', class: '522CNT' },
  { id: '2', studentCode: '522CNT1001', name: 'Nguyễn Đức Anh', role: 'student', password: '123456', class: '522CNT' },
  { id: '3', studentCode: 'GV001', name: 'Dư Đình Viên', role: 'teacher', password: '123456' },
  { id: '4', studentCode: 'ADMIN', name: 'Quản trị viên', role: 'admin', password: '123456' },
];

export const DEMO_ACCOUNTS = [
  { label: 'Sinh viên', code: '522CNT1006', pass: '123456', icon: '🎓' },
  { label: 'Giảng viên', code: 'GV001', pass: '123456', icon: '👨‍🏫' },
  { label: 'Quản trị', code: 'ADMIN', pass: '123456', icon: '🛡️' },
];

// --- Lịch học sinh viên ---
export const MOCK_SCHEDULE = [
  { id: '1', subject: 'Lập trình Mobile', room: 'P.301', time: '07:30 - 09:30', status: 'upcoming', teacher: 'Dư Đình Viên', dayOfWeek: 1 },
  { id: '2', subject: 'Cơ sở dữ liệu', room: 'P.205', time: '09:45 - 11:45', status: 'done', teacher: 'Nguyễn Văn An', dayOfWeek: 1 },
  { id: '3', subject: 'Mạng máy tính', room: 'P.102', time: '13:00 - 15:00', status: 'absent', teacher: 'Trần Thị Bích', dayOfWeek: 2 },
  { id: '4', subject: 'Toán rời rạc', room: 'P.301', time: '07:30 - 09:30', status: 'upcoming', teacher: 'Lê Minh Hoàng', dayOfWeek: 3 },
  { id: '5', subject: 'Lập trình Mobile', room: 'P.301', time: '09:45 - 11:45', status: 'upcoming', teacher: 'Dư Đình Viên', dayOfWeek: 3 },
  { id: '6', subject: 'Cơ sở dữ liệu', room: 'P.205', time: '07:30 - 09:30', status: 'upcoming', teacher: 'Nguyễn Văn An', dayOfWeek: 4 },
  { id: '7', subject: 'Mạng máy tính', room: 'P.102', time: '09:45 - 11:45', status: 'upcoming', teacher: 'Trần Thị Bích', dayOfWeek: 5 },
  { id: '8', subject: 'Kiến trúc máy tính', room: 'P.201', time: '13:00 - 15:00', status: 'upcoming', teacher: 'Phạm Thu Hà', dayOfWeek: 5 },
  { id: '9', subject: 'Tiếng Anh', room: 'P.402', time: '07:30 - 09:30', status: 'upcoming', teacher: 'Ngô Thanh C', dayOfWeek: 6 },
];

// --- Lịch sử điểm danh sinh viên ---
export const MOCK_HISTORY = [
  { id: '1', subject: 'Lập trình Mobile', date: '21/05/2026', status: 'present' },
  { id: '2', subject: 'Cơ sở dữ liệu', date: '21/05/2026', status: 'present' },
  { id: '3', subject: 'Mạng máy tính', date: '20/05/2026', status: 'late' },
  { id: '4', subject: 'Toán rời rạc', date: '20/05/2026', status: 'absent' },
];

// --- Lịch dạy giảng viên ---
export const MOCK_CLASSES = [
  { id: '1', subject: 'Lập trình Mobile', class: '522CNT', room: 'P.301', time: '07:30', students: 32, done: false, dayOfWeek: 1 },
  { id: '2', subject: 'Cơ sở dữ liệu', class: '521CNT', room: 'P.205', time: '09:45', students: 28, done: true, dayOfWeek: 1 },
  { id: '3', subject: 'Mạng máy tính', class: '523CNT', room: 'P.102', time: '13:00', students: 35, done: false, dayOfWeek: 2 },
  { id: '4', subject: 'Lập trình Mobile', class: '522CNT', room: 'P.301', time: '09:45', students: 32, done: false, dayOfWeek: 3 },
  { id: '5', subject: 'Cơ sở dữ liệu', class: '521CNT', room: 'P.205', time: '07:30', students: 28, done: false, dayOfWeek: 4 },
  { id: '6', subject: 'Mạng máy tính', class: '523CNT', room: 'P.102', time: '09:45', students: 35, done: false, dayOfWeek: 5 },
];

// Mapping classId → tên môn học (dùng trong ScanQR)
export const CLASS_NAMES = {
  '1': 'Lập trình Mobile',
  '2': 'Cơ sở dữ liệu',
  '3': 'Mạng máy tính',
};

// --- Danh sách sinh viên (dùng trong LiveMonitor) ---
export const MOCK_STUDENTS_ATTENDANCE = [
  { id: '1', name: 'Trần Quang Bắc', code: '522CNT1006', status: 'present', time: '07:32' },
  { id: '2', name: 'Nguyễn Đức Anh', code: '522CNT1001', status: 'absent', time: null },
  { id: '3', name: 'Nguyễn Quang Duy', code: '522CNT1024', status: 'present', time: '07:35' },
  { id: '4', name: 'Nhâm Tuấn Hùng', code: '522CNT1033', status: 'late', time: '07:48' },
  { id: '5', name: 'Phạm Văn An', code: '522CNT1010', status: 'present', time: '07:31' },
  { id: '6', name: 'Lê Thị Bích', code: '522CNT1015', status: 'absent', time: null },
  { id: '7', name: 'Hoàng Minh Cường', code: '522CNT1018', status: 'present', time: '07:33' },
  { id: '8', name: 'Vũ Thị Dung', code: '522CNT1022', status: 'late', time: '07:52' },
];

// --- Dữ liệu Admin ---
export const MOCK_STATS = {
  totalStudents: 320,
  totalTeachers: 24,
  totalClasses: 18,
  todaySessions: 12,
};

export const MOCK_STUDENTS_ADMIN = [
  { id: '1', code: '522CNT1006', name: 'Trần Quang Bắc', class: '522CNT', rate: 90, status: 'active' },
  { id: '2', code: '522CNT1001', name: 'Nguyễn Đức Anh', class: '522CNT', rate: 85, status: 'active' },
  { id: '3', code: '522CNT1024', name: 'Nguyễn Quang Duy', class: '522CNT', rate: 95, status: 'active' },
  { id: '4', code: '522CNT1033', name: 'Nhâm Tuấn Hùng', class: '522CNT', rate: 62, status: 'warning' },
  { id: '5', code: '521CNT2001', name: 'Lê Thị Bích', class: '521CNT', rate: 78, status: 'active' },
  { id: '6', code: '521CNT2005', name: 'Hoàng Minh Cường', class: '521CNT', rate: 55, status: 'warning' },
];

export const MOCK_ACTIVITIES = [
  { text: 'Lập trình Mobile - 522CNT - 32/32 có mặt', time: '07:30', type: 'success' },
  { text: 'Cơ sở dữ liệu - 521CNT - 25/28 có mặt', time: '09:45', type: 'success' },
  { text: 'Phát hiện gian lận: 1 thiết bị lạ', time: '10:02', type: 'warning' },
  { text: 'Mạng máy tính - 523CNT - 30/35 có mặt', time: '13:00', type: 'success' },
  { text: 'Sinh viên 522CNT1033 vắng 3 buổi liên tiếp', time: '14:00', type: 'alert' },
];

// --- Form đơn xin nghỉ ---
export const LEAVE_SUBJECTS = [
  { name: 'Lập trình Mobile', icon: '📱' },
  { name: 'Cơ sở dữ liệu', icon: '🗄️' },
  { name: 'Mạng máy tính', icon: '🌐' },
  { name: 'Toán rời rạc', icon: '📐' },
];

export const LEAVE_REASONS = [
  'Ốm, có giấy khám bệnh',
  'Việc gia đình đột xuất',
  'Tai nạn / Sự cố',
  'Lý do khác',
];

// --- Đơn xin nghỉ ban đầu (AuthContext) ---
export const INITIAL_LEAVES = [
  { id: '1', name: 'Nguyễn Đức Anh', code: '522CNT1001', subject: 'Lập trình Mobile', date: '22/05/2026', reason: 'Ốm, có giấy khám bệnh', status: 'pending' },
  { id: '2', name: 'Nhâm Tuấn Hùng', code: '522CNT1033', subject: 'Cơ sở dữ liệu', date: '22/05/2026', reason: 'Việc gia đình đột xuất', status: 'pending' },
  { id: '3', name: 'Phạm Văn An', code: '522CNT1010', subject: 'Mạng máy tính', date: '21/05/2026', reason: 'Tai nạn giao thông', status: 'approved' },
];

// --- Danh sách Giảng viên (Admin) ---
export const MOCK_TEACHERS = [
  { id: '1', code: 'GV001', name: 'Dư Đình Viên',   subjects: ['Lập trình Mobile', 'Lập trình Web'], classCount: 5, attendanceRate: 94, status: 'active' },
  { id: '2', code: 'GV002', name: 'Nguyễn Văn An',  subjects: ['Cơ sở dữ liệu'],                   classCount: 3, attendanceRate: 88, status: 'active' },
  { id: '3', code: 'GV003', name: 'Trần Thị Bích',  subjects: ['Mạng máy tính', 'An toàn mạng'],   classCount: 4, attendanceRate: 91, status: 'active' },
  { id: '4', code: 'GV004', name: 'Lê Minh Hoàng',  subjects: ['Toán rời rạc', 'Giải tích'],       classCount: 6, attendanceRate: 97, status: 'active' },
  { id: '5', code: 'GV005', name: 'Phạm Thu Hà',    subjects: ['Kiến trúc máy tính'],              classCount: 2, attendanceRate: 85, status: 'active' },
];

// --- Lịch sử phiên điểm danh (Teacher) ---
export const MOCK_SESSION_HISTORY = [
  { id: '1', subject: 'Lập trình Mobile', class: '522CNT', room: 'P.301', date: '21/05/2026', time: '07:30', present: 30, absent: 1, late: 1, total: 32 },
  { id: '2', subject: 'Lập trình Mobile', class: '522CNT', room: 'P.301', date: '19/05/2026', time: '07:30', present: 28, absent: 3, late: 1, total: 32 },
  { id: '3', subject: 'Cơ sở dữ liệu',   class: '521CNT', room: 'P.205', date: '20/05/2026', time: '09:45', present: 26, absent: 2, late: 0, total: 28 },
  { id: '4', subject: 'Mạng máy tính',   class: '523CNT', room: 'P.102', date: '20/05/2026', time: '13:00', present: 33, absent: 1, late: 1, total: 35 },
  { id: '5', subject: 'Lập trình Mobile', class: '522CNT', room: 'P.301', date: '16/05/2026', time: '07:30', present: 31, absent: 1, late: 0, total: 32 },
  { id: '6', subject: 'Cơ sở dữ liệu',   class: '521CNT', room: 'P.205', date: '15/05/2026', time: '09:45', present: 25, absent: 2, late: 1, total: 28 },
];
