import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Button, Surface, Avatar, DataTable, Chip, Searchbar } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { MOCK_STATS, MOCK_STUDENTS_ADMIN, MOCK_ACTIVITIES } from '../../constants/mockData';

// MOCK_STATS, MOCK_STUDENTS_ADMIN, MOCK_ACTIVITIES được import từ constants/mockData.js


const TABS = [
  { key: 'dashboard', label: 'Tổng quan', icon: '📊' },
  { key: 'students', label: 'Sinh viên', icon: '🎓' },
  { key: 'settings', label: 'Cài đặt', icon: '⚙️' },
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Avatar.Icon size={44} icon="shield-account" style={styles.avatar} color="#fff" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.greeting}>Quản trị viên 🛡️</Text>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userCode}>Hệ thống EduCheck</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map(t => (
          <TouchableOpacity key={t.key} style={[styles.tab, activeTab === t.key && styles.tabActive]} onPress={() => setActiveTab(t.key)}>
            <Text style={styles.tabIcon}>{t.icon}</Text>
            <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }}>
        {activeTab === 'dashboard' && <DashboardTab stats={MOCK_STATS} activities={MOCK_ACTIVITIES} />}
        {activeTab === 'students' && <StudentsTab students={MOCK_STUDENTS_ADMIN} />}
        {activeTab === 'settings' && <SettingsTab />}
      </ScrollView>
    </View>
  );
}

function DashboardTab({ stats, activities }) {
  return (
    <View style={{ padding: 16 }}>
      <View style={styles.statsGrid}>
        <StatCard icon="account-group" label="Sinh viên" value={stats.totalStudents} color="#1565C0" />
        <StatCard icon="teach" label="Giảng viên" value={stats.totalTeachers} color="#2E7D32" />
        <StatCard icon="google-classroom" label="Lớp học" value={stats.totalClasses} color="#E65100" />
        <StatCard icon="calendar-check" label="Phiên hôm nay" value={stats.todaySessions} color="#6A1B9A" />
      </View>

      <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
      {activities.map((item, i) => {
        const icons = { success: '✅', warning: '⚠️', alert: '🔔' };
        const colors = { success: '#E8F5E9', warning: '#FFF3E0', alert: '#FFEBEE' };
        return (
          <Card key={i} style={[styles.activityCard, { backgroundColor: colors[item.type] }]}>
            <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 22, marginRight: 12 }}>{icons[item.type]}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: '#333' }}>{item.text}</Text>
                <Text style={{ color: '#999', fontSize: 11, marginTop: 2 }}>🕐 {item.time}</Text>
              </View>
            </Card.Content>
          </Card>
        );
      })}
    </View>
  );
}

function StudentsTab({ students }) {
  const [search, setSearch] = useState('');
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ padding: 16 }}>
      <Searchbar
        placeholder="Tìm sinh viên..."
        value={search}
        onChangeText={setSearch}
        style={{ borderRadius: 12, marginBottom: 12, elevation: 1 }}
        inputStyle={{ fontSize: 13 }}
      />
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
        <Button mode="outlined" icon="file-import" style={{ flex: 1, borderRadius: 10 }} compact
          onPress={() => Alert.alert('Import Excel', 'Chức năng import file Excel sẽ được tích hợp với backend.')}>
          Import Excel
        </Button>
        <Button mode="outlined" icon="file-export" style={{ flex: 1, borderRadius: 10 }} compact
          onPress={() => Alert.alert('Xuất báo cáo', `Danh sách ${filtered.length} sinh viên đã được xuất.`)}>
          Xuất báo cáo
        </Button>
      </View>
      <Card style={{ borderRadius: 14 }}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Mã SV</DataTable.Title>
            <DataTable.Title>Họ tên</DataTable.Title>
            <DataTable.Title numeric>Tỉ lệ</DataTable.Title>
          </DataTable.Header>
          {filtered.map(s => (
            <DataTable.Row key={s.id}>
              <DataTable.Cell><Text style={{ fontSize: 12 }}>{s.code}</Text></DataTable.Cell>
              <DataTable.Cell>
                <View>
                  <Text style={{ fontSize: 12, fontWeight: '600' }}>{s.name.split(' ').slice(-2).join(' ')}</Text>
                  {s.status === 'warning' && <Text style={{ fontSize: 10, color: '#E65100' }}>⚠️ Cần chú ý</Text>}
                </View>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={{ color: s.rate >= 80 ? '#2E7D32' : s.rate >= 65 ? '#E65100' : '#C62828', fontWeight: 'bold' }}>
                  {s.rate}%
                </Text>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </Card>
    </View>
  );
}

function SettingsTab() {
  const [gps, setGps] = useState('20m');
  const [qrTime, setQrTime] = useState('5s');

  return (
    <View style={{ padding: 16 }}>
      <Card style={styles.settingCard}>
        <Card.Content>
          <Text style={styles.settingTitle}>📍 Cấu hình GPS</Text>
          <Text style={styles.settingDesc}>Sai số GPS cho phép khi điểm danh</Text>
          <View style={styles.settingRow}>
            {['20m', '30m', '50m', '100m'].map(v => (
              <TouchableOpacity key={v} style={[styles.optionChip, gps === v && styles.optionChipActive]} onPress={() => setGps(v)}>
                <Text style={[styles.optionText, gps === v && { color: '#fff' }]}>{v}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.settingCard}>
        <Card.Content>
          <Text style={styles.settingTitle}>⏱ Thời gian QR</Text>
          <Text style={styles.settingDesc}>Mã QR tự động thay đổi sau</Text>
          <View style={styles.settingRow}>
            {['3s', '5s', '10s', '15s'].map(v => (
              <TouchableOpacity key={v} style={[styles.optionChip, qrTime === v && styles.optionChipActive]} onPress={() => setQrTime(v)}>
                <Text style={[styles.optionText, qrTime === v && { color: '#fff' }]}>{v}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.settingCard}>
        <Card.Content>
          <Text style={styles.settingTitle}>📶 Wifi Fingerprint</Text>
          <Text style={styles.settingDesc}>Chỉ cho phép điểm danh khi kết nối Wifi nội bộ trường</Text>
          <Button mode="outlined" icon="wifi" style={{ marginTop: 12, borderRadius: 10 }}>Cấu hình Wifi nội bộ</Button>
        </Card.Content>
      </Card>

      <Card style={styles.settingCard}>
        <Card.Content>
          <Text style={styles.settingTitle}>🔔 Cảnh báo tự động</Text>
          <Text style={styles.settingDesc}>Gửi cảnh báo khi sinh viên vắng quá số buổi cho phép</Text>
          <View style={styles.settingRow}>
            {['2 buổi', '3 buổi', '5 buổi'].map(v => (
              <TouchableOpacity key={v} style={styles.optionChip}
                onPress={() => Alert.alert('Đã lưu', `Cảnh báo sẽ gửi khi vắng quá ${v}`)}>
                <Text style={styles.optionText}>{v}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <Surface style={[styles.statCard, { borderTopColor: color }]} elevation={2}>
      <Avatar.Icon size={36} icon={icon} style={{ backgroundColor: color + '20' }} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  header: { backgroundColor: '#1565C0', paddingTop: 48, paddingHorizontal: 20, paddingBottom: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: { backgroundColor: '#0D47A1' },
  greeting: { color: '#BBDEFB', fontSize: 12 },
  userName: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  userCode: { color: '#90CAF9', fontSize: 12 },
  logoutBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  logoutText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  tabRow: { flexDirection: 'row', marginHorizontal: 16, marginTop: 16, backgroundColor: '#fff', borderRadius: 14, padding: 4, elevation: 2 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#1565C0' },
  tabIcon: { fontSize: 16 },
  tabText: { color: '#888', fontWeight: '600', fontSize: 11, marginTop: 2 },
  tabTextActive: { color: '#fff' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: { width: '47%', alignItems: 'center', padding: 14, borderRadius: 14, borderTopWidth: 3, backgroundColor: '#fff' },
  statValue: { fontSize: 24, fontWeight: 'bold', marginTop: 6 },
  statLabel: { color: '#888', fontSize: 12, marginTop: 2 },
  sectionTitle: { fontWeight: 'bold', color: '#333', marginBottom: 10, fontSize: 15 },
  activityCard: { borderRadius: 12, marginBottom: 8, elevation: 0 },
  settingCard: { borderRadius: 14, marginBottom: 12, elevation: 2 },
  settingTitle: { fontWeight: 'bold', fontSize: 14, color: '#1A1A2E', marginBottom: 4 },
  settingDesc: { color: '#888', fontSize: 12, marginBottom: 12 },
  settingRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  optionChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F0F4FF', borderWidth: 1.5, borderColor: '#E0E0E0' },
  optionChipActive: { backgroundColor: '#1565C0', borderColor: '#1565C0' },
  optionText: { fontSize: 13, color: '#555', fontWeight: '600' },
});
