import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Text,
  Avatar,
  DataTable,
  Searchbar,
  Button,
  Surface,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import {
  MOCK_STATS,
  MOCK_STUDENTS_ADMIN,
  MOCK_ACTIVITIES,
  MOCK_TEACHERS,
} from '../../constants/mockData';

// MOCK_STATS, MOCK_STUDENTS_ADMIN, MOCK_ACTIVITIES, MOCK_TEACHERS
// được import từ constants/mockData.js

const TABS = [
  { key: 'dashboard', label: 'Tổng quan',  icon: '📊' },
  { key: 'students',  label: 'Sinh viên',  icon: '🎓' },
  { key: 'teachers',  label: 'Giảng viên', icon: '👨‍🏫' },
  { key: 'settings',  label: 'Cài đặt',    icon: '⚙️' },
];

export default function AdminHome() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <LinearGradient
        colors={['#0D47A1', '#1565C0', '#1976D2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <Avatar.Icon
            size={48}
            icon="shield-account"
            style={styles.avatarStyle}
            color="#fff"
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.greeting}>Quản trị viên 🛡️</Text>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userSub}>Hệ thống EduCheck</Text>
          </View>
          <TouchableOpacity style={styles.logoutPill} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={13} color="#fff" />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* ── Tab bar ── */}
      <View style={styles.tabRow}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
            onPress={() => setActiveTab(t.key)}
          >
            <Text style={styles.tabIcon}>{t.icon}</Text>
            <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Content ── */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {activeTab === 'dashboard' && (
          <DashboardTab stats={MOCK_STATS} activities={MOCK_ACTIVITIES} />
        )}
        {activeTab === 'students' && (
          <StudentsTab students={MOCK_STUDENTS_ADMIN} />
        )}
        {activeTab === 'teachers' && (
          <TeachersTab teachers={MOCK_TEACHERS} />
        )}
        {activeTab === 'settings' && <SettingsTab />}
      </ScrollView>
    </View>
  );
}

// ── Dashboard Tab ──
function DashboardTab({ stats, activities }) {
  return (
    <View style={{ padding: 16 }}>
      <View style={styles.statsGrid}>
        <StatCard icon="account-group"   label="Sinh viên"    value={stats.totalStudents}  color="#1565C0" />
        <StatCard icon="teach"           label="Giảng viên"   value={stats.totalTeachers}  color="#2E7D32" />
        <StatCard icon="google-classroom" label="Lớp học"     value={stats.totalClasses}   color="#E65100" />
        <StatCard icon="calendar-check"  label="Phiên hôm nay" value={stats.todaySessions} color="#6A1B9A" />
      </View>

      <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
      {activities.map((item, i) => {
        const icons  = { success: '✅', warning: '⚠️', alert: '🔔' };
        const colors = { success: '#E8F5E9', warning: '#FFF3E0', alert: '#FFEBEE' };
        const borders = { success: '#2E7D32', warning: '#E65100', alert: '#C62828' };
        return (
          <View key={i} style={[styles.activityCard, { backgroundColor: colors[item.type], borderLeftColor: borders[item.type] }]}>
            <Text style={{ fontSize: 22, marginRight: 12 }}>{icons[item.type]}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, color: '#0A1628', fontWeight: '500' }}>{item.text}</Text>
              <Text style={{ color: '#94A3B8', fontSize: 11, marginTop: 3 }}>🕐 {item.time}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <Avatar.Icon
        size={38}
        icon={icon}
        style={{ backgroundColor: color + '20' }}
        color={color}
      />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ── Students Tab ──
function StudentsTab({ students }) {
  const [search, setSearch] = useState('');
  const filtered = students.filter(
    s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase())
  );

  const rateColor = r => (r >= 80 ? '#2E7D32' : r >= 65 ? '#E65100' : '#C62828');

  return (
    <View style={{ padding: 16 }}>
      <Searchbar
        placeholder="Tìm sinh viên..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchBar}
        inputStyle={{ fontSize: 13 }}
      />
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
        <Button
          mode="outlined"
          icon="file-import"
          style={{ flex: 1, borderRadius: 10 }}
          compact
          onPress={() =>
            Alert.alert('Import Excel', 'Chức năng import file Excel sẽ được tích hợp với backend.')
          }
        >
          Import Excel
        </Button>
        <Button
          mode="outlined"
          icon="file-export"
          style={{ flex: 1, borderRadius: 10 }}
          compact
          onPress={() =>
            Alert.alert('Xuất báo cáo', `Danh sách ${filtered.length} sinh viên đã được xuất.`)
          }
        >
          Xuất báo cáo
        </Button>
      </View>

      <View style={styles.tableCard}>
        <DataTable>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title textStyle={styles.tableHeaderText}>Mã SV</DataTable.Title>
            <DataTable.Title textStyle={styles.tableHeaderText}>Họ tên</DataTable.Title>
            <DataTable.Title numeric textStyle={styles.tableHeaderText}>Tỉ lệ</DataTable.Title>
          </DataTable.Header>
          {filtered.map(s => (
            <DataTable.Row key={s.id} style={styles.tableRow}>
              <DataTable.Cell>
                <Text style={styles.tableCell}>{s.code}</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <View>
                  <Text style={[styles.tableCell, { fontWeight: '600' }]}>
                    {s.name.split(' ').slice(-2).join(' ')}
                  </Text>
                  {s.status === 'warning' && (
                    <Text style={{ fontSize: 10, color: '#E65100' }}>⚠️ Cần chú ý</Text>
                  )}
                </View>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <View style={[styles.ratePill, { backgroundColor: rateColor(s.rate) + '18' }]}>
                  <Text style={{ color: rateColor(s.rate), fontWeight: 'bold', fontSize: 12 }}>
                    {s.rate}%
                  </Text>
                </View>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </View>
    </View>
  );
}

// ── Teachers Tab (MỚI) ──
function TeachersTab({ teachers }) {
  const [search, setSearch] = useState('');
  const filtered = teachers.filter(
    t =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase())
  );

  const rateColor = r => (r >= 90 ? '#2E7D32' : r >= 80 ? '#E65100' : '#C62828');
  const rateBg    = r => (r >= 90 ? '#E8F5E9' : r >= 80 ? '#FFF3E0' : '#FFEBEE');

  return (
    <View style={{ padding: 16 }}>
      <Searchbar
        placeholder="Tìm giảng viên..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchBar}
        inputStyle={{ fontSize: 13 }}
      />

      {filtered.map(teacher => {
        const initials = teacher.name
          .split(' ')
          .slice(-2)
          .map(w => w[0])
          .join('');
        return (
          <View key={teacher.id} style={styles.teacherCard}>
            {/* Left: avatar */}
            <Avatar.Text
              size={48}
              label={initials}
              style={{ backgroundColor: '#E3F2FD', marginRight: 12 }}
              color="#1565C0"
            />

            {/* Middle: info */}
            <View style={{ flex: 1 }}>
              <Text style={styles.teacherName}>{teacher.name}</Text>
              <Text style={styles.teacherCode}>{teacher.code}</Text>

              {/* Subject chips */}
              <View style={styles.subjectChipsRow}>
                {teacher.subjects.map((subj, idx) => (
                  <View key={idx} style={styles.subjectChip}>
                    <Text style={styles.subjectChipText} numberOfLines={1}>
                      {subj}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.teacherMetaRow}>
                <MaterialCommunityIcons name="google-classroom" size={12} color="#94A3B8" />
                <Text style={styles.teacherMeta}>{teacher.classCount} lớp</Text>
              </View>
            </View>

            {/* Right: rate */}
            <View
              style={[
                styles.teacherRatePill,
                {
                  backgroundColor: rateBg(teacher.attendanceRate),
                  borderColor: rateColor(teacher.attendanceRate) + '40',
                },
              ]}
            >
              <Text
                style={[
                  styles.teacherRateText,
                  { color: rateColor(teacher.attendanceRate) },
                ]}
              >
                {teacher.attendanceRate}%
              </Text>
              <Text style={[styles.teacherRateLabel, { color: rateColor(teacher.attendanceRate) }]}>
                Tỉ lệ
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

// ── Settings Tab ──
function SettingsTab() {
  const [gps, setGps] = useState('20m');
  const [qrTime, setQrTime] = useState('5s');

  return (
    <View style={{ padding: 16 }}>
      {/* GPS */}
      <View style={styles.settingCard}>
        <View style={styles.settingIconRow}>
          <View style={[styles.settingIcon, { backgroundColor: '#E3F2FD' }]}>
            <MaterialCommunityIcons name="map-marker-radius" size={20} color="#1565C0" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Cấu hình GPS</Text>
            <Text style={styles.settingDesc}>Sai số GPS cho phép khi điểm danh</Text>
          </View>
        </View>
        <View style={styles.optionRow}>
          {['20m', '30m', '50m', '100m'].map(v => (
            <TouchableOpacity
              key={v}
              style={[styles.optionChip, gps === v && styles.optionChipActive]}
              onPress={() => setGps(v)}
            >
              <Text style={[styles.optionText, gps === v && { color: '#fff' }]}>{v}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* QR */}
      <View style={styles.settingCard}>
        <View style={styles.settingIconRow}>
          <View style={[styles.settingIcon, { backgroundColor: '#E8F5E9' }]}>
            <MaterialCommunityIcons name="qrcode-scan" size={20} color="#2E7D32" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Thời gian QR</Text>
            <Text style={styles.settingDesc}>Mã QR tự động thay đổi sau</Text>
          </View>
        </View>
        <View style={styles.optionRow}>
          {['3s', '5s', '10s', '15s'].map(v => (
            <TouchableOpacity
              key={v}
              style={[styles.optionChip, qrTime === v && styles.optionChipActive]}
              onPress={() => setQrTime(v)}
            >
              <Text style={[styles.optionText, qrTime === v && { color: '#fff' }]}>{v}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Wifi */}
      <View style={styles.settingCard}>
        <View style={styles.settingIconRow}>
          <View style={[styles.settingIcon, { backgroundColor: '#FFF3E0' }]}>
            <MaterialCommunityIcons name="wifi" size={20} color="#E65100" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Wifi Fingerprint</Text>
            <Text style={styles.settingDesc}>
              Chỉ cho phép điểm danh khi kết nối Wifi nội bộ trường
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.settingBtn}
          onPress={() => Alert.alert('Wifi', 'Chức năng cấu hình Wifi nội bộ.')}
        >
          <MaterialCommunityIcons name="wifi-settings" size={15} color="#1565C0" />
          <Text style={styles.settingBtnText}>Cấu hình Wifi nội bộ</Text>
        </TouchableOpacity>
      </View>

      {/* Alert */}
      <View style={styles.settingCard}>
        <View style={styles.settingIconRow}>
          <View style={[styles.settingIcon, { backgroundColor: '#FFEBEE' }]}>
            <MaterialCommunityIcons name="bell-alert" size={20} color="#C62828" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Cảnh báo tự động</Text>
            <Text style={styles.settingDesc}>
              Gửi cảnh báo khi sinh viên vắng quá số buổi cho phép
            </Text>
          </View>
        </View>
        <View style={styles.optionRow}>
          {['2 buổi', '3 buổi', '5 buổi'].map(v => (
            <TouchableOpacity
              key={v}
              style={styles.optionChip}
              onPress={() => Alert.alert('Đã lưu', `Cảnh báo sẽ gửi khi vắng quá ${v}`)}
            >
              <Text style={styles.optionText}>{v}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EEF2FF' },

  // Header
  header: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center' },
  avatarStyle: { backgroundColor: 'rgba(255,255,255,0.2)' },
  greeting: { color: 'rgba(255,255,255,0.75)', fontSize: 12 },
  userName: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
  userSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  logoutPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  logoutText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 4,
    elevation: 3,
    shadowColor: '#1565C0',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#1565C0' },
  tabIcon: { fontSize: 15 },
  tabText: { color: '#94A3B8', fontWeight: '600', fontSize: 10, marginTop: 2 },
  tabTextActive: { color: '#fff' },

  // Dashboard
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: {
    width: '47%',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderTopWidth: 3,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#1565C0',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statValue: { fontSize: 24, fontWeight: 'bold', marginTop: 6 },
  statLabel: { color: '#94A3B8', fontSize: 12, marginTop: 2 },

  sectionTitle: { fontWeight: 'bold', color: '#0A1628', marginBottom: 10, fontSize: 15 },
  activityCard: {
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderLeftWidth: 4,
  },

  // Students
  searchBar: { borderRadius: 12, marginBottom: 12, elevation: 1, backgroundColor: '#fff' },
  tableCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#1565C0',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: { backgroundColor: '#EEF2FF' },
  tableHeaderText: { fontWeight: 'bold', color: '#0A1628', fontSize: 12 },
  tableRow: { borderBottomColor: '#F0F4FF' },
  tableCell: { fontSize: 12, color: '#0A1628' },
  ratePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    alignItems: 'center',
  },

  // Teachers
  teacherCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#1565C0',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  teacherName: { fontWeight: 'bold', fontSize: 15, color: '#0A1628' },
  teacherCode: { color: '#94A3B8', fontSize: 12, marginTop: 1, marginBottom: 6 },
  subjectChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 6 },
  subjectChip: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    maxWidth: 120,
  },
  subjectChipText: { color: '#1565C0', fontSize: 10, fontWeight: '600' },
  teacherMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  teacherMeta: { color: '#94A3B8', fontSize: 12 },
  teacherRatePill: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    minWidth: 56,
  },
  teacherRateText: { fontSize: 16, fontWeight: 'bold' },
  teacherRateLabel: { fontSize: 10, marginTop: 1 },

  // Settings
  settingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#1565C0',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  settingIconRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  settingIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  settingTitle: { fontWeight: 'bold', fontSize: 14, color: '#0A1628' },
  settingDesc: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  optionRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  optionChipActive: { backgroundColor: '#1565C0', borderColor: '#1565C0' },
  optionText: { fontSize: 13, color: '#4A5568', fontWeight: '600' },
  settingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#1565C0',
    alignSelf: 'flex-start',
  },
  settingBtnText: { color: '#1565C0', fontWeight: '600', fontSize: 13 },
});
