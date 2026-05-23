import React, { createContext, useContext, useState } from 'react';
import { 
  MOCK_SCHEDULE, 
  MOCK_HISTORY, 
  MOCK_CLASSES, 
  MOCK_STUDENTS_ATTENDANCE,
  MOCK_SESSION_HISTORY,
  MOCK_STATS,
  MOCK_STUDENTS_ADMIN,
  MOCK_ACTIVITIES,
  MOCK_TEACHERS
} from '../constants/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // === Sinh viên ===
  const [schedule, setSchedule] = useState(MOCK_SCHEDULE);
  const [history, setHistory] = useState(MOCK_HISTORY);

  // === Giảng viên ===
  const [teacherClasses, setTeacherClasses] = useState(MOCK_CLASSES);
  const [sessionHistory, setSessionHistory] = useState(MOCK_SESSION_HISTORY);
  const [activeSession, setActiveSession] = useState(null); // { classId, subject, room, students: [] }

  // === Admin (Dùng tạm mock, sau này có thể tự tính toán) ===
  const [adminStats, setAdminStats] = useState(MOCK_STATS);
  const [adminStudents, setAdminStudents] = useState(MOCK_STUDENTS_ADMIN);
  const [adminActivities, setAdminActivities] = useState(MOCK_ACTIVITIES);
  const [adminTeachers, setAdminTeachers] = useState(MOCK_TEACHERS);

  // --- ACTIONS ---

  // 1. Giảng viên mở phiên
  const startSession = (classInfo) => {
    // Clone danh sách mock thành danh sách cho phiên này (tất cả đều vắng/null lúc đầu)
    const initialStudents = MOCK_STUDENTS_ATTENDANCE.map(s => ({
      ...s,
      status: 'absent',
      time: null
    }));

    setActiveSession({
      classId: classInfo.id,
      subject: classInfo.subject,
      room: classInfo.room,
      class: classInfo.class,
      students: initialStudents,
      startTime: new Date()
    });
  };

  // 2. Sinh viên quét QR thành công
  const markAttendance = (classId, studentCode) => {
    const nowTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    // A. Cập nhật danh sách LiveMonitor của Giảng viên (nếu phiên đúng)
    if (activeSession && activeSession.classId === classId) {
      setActiveSession(prev => ({
        ...prev,
        students: prev.students.map(s => 
          s.code === studentCode ? { ...s, status: 'present', time: nowTime } : s
        )
      }));
    }

    // B. Cập nhật lịch học của Sinh viên thành "Đã điểm danh"
    setSchedule(prev => prev.map(item => 
      item.id === classId ? { ...item, status: 'done' } : item
    ));

    // C. Thêm vào Lịch sử điểm danh của Sinh viên
    // Tìm tên môn học từ schedule để thêm vào history
    const matchedClass = schedule.find(c => c.id === classId);
    if (matchedClass) {
      const newHistoryRecord = {
        id: Date.now().toString(),
        subject: matchedClass.subject,
        date: new Date().toLocaleDateString('vi-VN'),
        status: 'present'
      };
      setHistory(prev => [newHistoryRecord, ...prev]);
    }
  };

  // 3. Giảng viên kết thúc phiên
  const endSession = () => {
    if (!activeSession) return;

    // Tổng hợp số liệu
    const presentCount = activeSession.students.filter(s => s.status === 'present').length;
    const lateCount = activeSession.students.filter(s => s.status === 'late').length;
    const absentCount = activeSession.students.filter(s => s.status === 'absent').length;
    const totalCount = activeSession.students.length;

    // A. Lưu vào lịch sử phiên
    const newSessionRecord = {
      id: Date.now().toString(),
      subject: activeSession.subject,
      class: activeSession.class,
      room: activeSession.room,
      date: new Date().toLocaleDateString('vi-VN'),
      time: activeSession.startTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      present: presentCount,
      late: lateCount,
      absent: absentCount,
      total: totalCount
    };
    setSessionHistory(prev => [newSessionRecord, ...prev]);

    // B. Đánh dấu lớp đã hoàn thành bên TeacherHome
    setTeacherClasses(prev => prev.map(cls => 
      cls.id === activeSession.classId ? { ...cls, done: true } : cls
    ));

    // C. Clear phiên đang active
    setActiveSession(null);
  };

  return (
    <AppContext.Provider value={{
      // State
      schedule, history, teacherClasses, sessionHistory, activeSession,
      adminStats, adminStudents, adminActivities, adminTeachers,
      // Actions
      startSession, markAttendance, endSession
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
