import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, Avatar, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';

const scheduleStatus = {
  upcoming: { label: 'Sắp học', color: '#1565C0', bg: '#E3F2FD' },
  done: { label: 'Đã điểm danh', color: '#2E7D32', bg: '#E8F5E9' },
  absent: { label: 'Vắng mặt', color: '#C62828', bg: '#FFEBEE' },
};

const historyStatus = {
  present: { label: 'Có mặt', color: '#2E7D32', bg: '#E8F5E9', icon: '✅' },
  late: { label: 'Muộn', color: '#E65100', bg: '#FFF3E0', icon: '⏰' },
  absent: { label: 'Vắng', color: '#C62828', bg: '#FFEBEE', icon: '❌' },
};

const barColor = {
  upcoming: '#1565C0',
  done: '#2E7D32',
  absent: '#C62828',
};

export default function StudentHome({ navigation }) {
  const { user, logout } = useAuth();
  const { schedule, history } = useAppContext();
  const [tab, setTab] = useState('schedule');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const generateWeekDays = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1)); // Monday
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      week.push(date);
    }
    return week;
  };
  const weekDays = generateWeekDays();
  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  };

  // Tính stats từ lịch sử
  const presentCount = history.filter(h => h.status === 'present').length;
  const absentCount = history.filter(h => h.status === 'absent').length;
  const lateCount = history.filter(h => h.status === 'late').length;
  const total = history.length;
  const rate = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  const initials = user.name.split(' ').pop().charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#0D47A1', '#1565C0', '#1976D2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {/* Top row: avatar + info + logout */}
        <View style={styles.headerRow}>
          <Avatar.Text
            size={48}
            label={initials}
            style={styles.avatar}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.greeting}>Xin chào 👋</Text>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userCode}>{user.studentCode} • {user.class || 'Sinh viên'}</Text>
          </View>
          <TouchableOpacity style={styles.logoutPill} onPress={handleLogout}>
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={styles.statsBox}>
          <StatItem value={presentCount} label="Có mặt" color="#69F0AE" />
          <View style={styles.statDivider} />
          <StatItem value={absentCount} label="Vắng" color="#FF8A80" />
          <View style={styles.statDivider} />
          <StatItem value={lateCount} label="Muộn" color="#FFD180" />
          <View style={styles.statDivider} />
          <StatItem value={`${rate}%`} label="Tỉ lệ" color="#82B1FF" />
        </View>
      </LinearGradient>

      {/* QR Scan Button */}
      <TouchableOpacity
        style={styles.scanBtnWrapper}
        onPress={() => navigation.navigate('ScanTab')}
        activeOpacity={0.88}
      >
        <LinearGradient
          colors={['#1565C0', '#42A5F5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.scanGradient}
        >
          <Text style={styles.scanEmoji}>📷</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.scanTitle}>Điểm danh ngay</Text>
            <Text style={styles.scanSub}>Quét mã QR từ giảng viên</Text>
          </View>
          <Text style={styles.scanArrow}>›</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, tab === 'schedule' && styles.tabItemActive]}
          onPress={() => setTab('schedule')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, tab === 'schedule' && styles.tabTextActive]}>
            📅 Lịch học
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, tab === 'history' && styles.tabItemActive]}
          onPress={() => setTab('history')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, tab === 'history' && styles.tabTextActive]}>
            📋 Lịch sử
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {tab === 'schedule' ? (
          <>
            <View style={styles.weekContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weekScroll}>
                {weekDays.map((date, index) => {
                  const isSelected = date.toDateString() === selectedDate.toDateString();
                  const isToday = date.toDateString() === new Date().toDateString();
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.dayCard, isSelected && styles.dayCardActive]}
                      onPress={() => setSelectedDate(date)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.dayName, isSelected && styles.dayTextActive]}>{daysOfWeek[index]}</Text>
                      <Text style={[styles.dayNumber, isSelected && styles.dayTextActive]}>{date.getDate()}</Text>
                      {isToday && <View style={[styles.todayDot, isSelected && {backgroundColor: '#fff'}]} />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {schedule.filter(item => item.dayOfWeek === selectedDate.getDay()).length > 0 ? (
              schedule.filter(item => item.dayOfWeek === selectedDate.getDay()).map(item => (
                <View key={item.id} style={styles.scheduleCard}>
                  {/* Colored bar */}
                  <View style={[styles.cardBar, { backgroundColor: barColor[item.status] || '#1565C0' }]} />
                  <View style={styles.cardBody}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.subjectName}>{item.subject}</Text>
                      <Text style={styles.subjectMeta}>🏫 {item.room}  ⏰ {item.time}</Text>
                      <Text style={styles.subjectMeta}>👨‍🏫 {item.teacher}</Text>
                    </View>
                    <View style={[styles.statusChip, { backgroundColor: scheduleStatus[item.status]?.bg || '#E3F2FD' }]}>
                      <Text style={[styles.statusChipText, { color: scheduleStatus[item.status]?.color || '#1565C0' }]}>
                        {scheduleStatus[item.status]?.label || 'Chưa rõ'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateEmoji}>🏖️</Text>
                <Text style={styles.emptyStateText}>Không có lịch học</Text>
              </View>
            )}

            {/* Leave request button */}
            <TouchableOpacity
              style={styles.leaveBtn}
              onPress={() => navigation.navigate('LeaveRequest')}
              activeOpacity={0.8}
            >
              <Text style={styles.leaveIcon}>📝</Text>
              <Text style={styles.leaveBtnText}>Gửi đơn xin nghỉ</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {history.map(item => (
              <View key={item.id} style={styles.historyCard}>
                <Text style={styles.historyIcon}>{historyStatus[item.status].icon}</Text>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.subjectName}>{item.subject}</Text>
                  <Text style={styles.subjectMeta}>📅 {item.date}</Text>
                </View>
                <View style={[styles.statusChip, { backgroundColor: historyStatus[item.status].bg }]}>
                  <Text style={[styles.statusChipText, { color: historyStatus[item.status].color }]}>
                    {historyStatus[item.status].label}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function StatItem({ value, label, color }) {
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF2FF',
  },
  header: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  greeting: {
    color: '#BBDEFB',
    fontSize: 12,
  },
  userName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    marginTop: 1,
  },
  userCode: {
    color: '#90CAF9',
    fontSize: 12,
    marginTop: 1,
  },
  logoutPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  logoutText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  statsBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: 12,
    marginTop: 0,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 4,
  },
  scanBtnWrapper: {
    margin: 16,
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#1565C0',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  scanGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
  },
  scanEmoji: {
    fontSize: 36,
    marginRight: 14,
  },
  scanTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scanSub: {
    color: '#BBDEFB',
    fontSize: 12,
    marginTop: 2,
  },
  scanArrow: {
    color: '#fff',
    fontSize: 24,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 4,
    elevation: 2,
    shadowColor: '#1565C0',
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 11,
  },
  tabItemActive: {
    backgroundColor: '#1565C0',
  },
  tabText: {
    color: '#94A3B8',
    fontWeight: '600',
    fontSize: 13,
  },
  tabTextActive: {
    color: '#fff',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  scheduleCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#1565C0',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  cardBar: {
    width: 5,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  cardBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 10,
    padding: 14,
    elevation: 3,
    shadowColor: '#1565C0',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  historyIcon: {
    fontSize: 26,
  },
  subjectName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#0A1628',
  },
  subjectMeta: {
    color: '#4A5568',
    fontSize: 12,
    marginTop: 2,
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginLeft: 8,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  leaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#1565C0',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 6,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  leaveIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  leaveBtnText: {
    color: '#1565C0',
    fontWeight: 'bold',
    fontSize: 14,
  },
  weekContainer: {
    marginBottom: 16,
  },
  weekScroll: {
    paddingRight: 16,
    gap: 10,
  },
  dayCard: {
    width: 48,
    height: 64,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#1565C0',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  dayCardActive: {
    backgroundColor: '#1565C0',
  },
  dayName: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
    color: '#0A1628',
    fontWeight: 'bold',
  },
  dayTextActive: {
    color: '#fff',
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1565C0',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 10,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyStateText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
});
