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
import { MOCK_SCHEDULE, MOCK_HISTORY } from '../../constants/mockData';

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
  const [tab, setTab] = useState('schedule');

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  };

  // Tính stats từ lịch sử
  const presentCount = MOCK_HISTORY.filter(h => h.status === 'present').length;
  const absentCount = MOCK_HISTORY.filter(h => h.status === 'absent').length;
  const lateCount = MOCK_HISTORY.filter(h => h.status === 'late').length;
  const total = MOCK_HISTORY.length;
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
        onPress={() => navigation.navigate('ScanQR')}
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
            {MOCK_SCHEDULE.map(item => (
              <View key={item.id} style={styles.scheduleCard}>
                {/* Colored bar */}
                <View style={[styles.cardBar, { backgroundColor: barColor[item.status] }]} />
                <View style={styles.cardBody}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.subjectName}>{item.subject}</Text>
                    <Text style={styles.subjectMeta}>🏫 {item.room}  ⏰ {item.time}</Text>
                    <Text style={styles.subjectMeta}>👨‍🏫 {item.teacher}</Text>
                  </View>
                  <View style={[styles.statusChip, { backgroundColor: scheduleStatus[item.status].bg }]}>
                    <Text style={[styles.statusChipText, { color: scheduleStatus[item.status].color }]}>
                      {scheduleStatus[item.status].label}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

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
            {MOCK_HISTORY.map(item => (
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
});
