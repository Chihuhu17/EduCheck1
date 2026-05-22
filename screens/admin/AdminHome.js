import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Surface, Avatar, DataTable, Chip } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';

const MOCK_STATS = { totalStudents: 320, totalTeachers: 24, totalClasses: 18, todaySessions: 12 };

const MOCK_STUDENTS = [
  { id: '1', code: '522CNT1006', name: 'Trần Quang Bắc', class: '522CNT', rate: '90%' },
  { id: '2', code: '522CNT1001', name: 'Nguyễn Đức Anh', class: '522CNT', rate: '85%' },
  { id: '3', code: '522CNT1024', name: 'Nguyễn Quang Duy', class: '522CNT', rate: '95%' },
  { id: '4', code: '522CNT1033', name: 'Nhâm Tuấn Hùng', class: '522CNT', rate: '78%' },
];

export default function AdminHome() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Surface style={styles.header} elevation={2}>
        <Avatar.Icon size={48} icon="shield-account" style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text variant="titleMedium" style={styles.name}>{user.name}</Text>
          <Text variant="bodySmall" style={styles.code}>Quản trị viên hệ thống</Text>
        </View>
        <Button mode="text" textColor="#fff" onPress={logout}>Đăng xuất</Button>
      </Surface>

      {/* Tab Selector */}
      <View style={styles.tabRow}>
        {['dashboard', 'students', 'settings'].map(tab => (
          <Button
            key={tab}
            mode={activeTab === tab ? 'contained' : 'outlined'}
            onPress={() => setActiveTab(tab)}
            compact
            style={styles.tabBtn}
          >
            {tab === 'dashboard' ? 'Tổng quan' : tab === 'students' ? 'Sinh viên' : 'Cài đặt'}
          </Button>
        ))}
      </View>

      {activeTab === 'dashboard' && <DashboardTab stats={MOCK_STATS} />}
      {activeTab === 'students' && <StudentsTab students={MOCK_STUDENTS} />}
      {activeTab === 'settings' && <SettingsTab />}
    </ScrollView>
  );
}

function DashboardTab({ stats }) {
  return (
    <View style={{ padding: 16 }}>
      <View style={styles.statsGrid}>
        <StatCard icon="account-group" label="Sinh viên" value={stats.totalStudents} color="#1565C0" />
        <StatCard icon="teach" label="Giảng viên" value={stats.totalTeachers} color="#2E7D32" />
        <StatCard icon="google-classroom" label="Lớp học" value={stats.totalClasses} color="#E65100" />
        <StatCard icon="calendar-check" label="Phiên hôm nay" value={stats.todaySessions} color="#6A1B9A" />
      </View>

      <Text variant="titleMedium" style={styles.sectionTitle}>Hoạt động gần đây</Text>
      {[
        { text: 'Lập trình Mobile - 522CNT - 32/32 có mặt', time: '07:30', ok: true },
        { text: 'Cơ sở dữ liệu - 521CNT - 25/28 có mặt', time: '09:45', ok: true },
        { text: 'Phát hiện gian lận: 1 thiết bị lạ', time: '10:02', ok: false },
      ].map((item, i) => (
        <Card key={i} style={styles.activityCard}>
          <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, marginRight: 12 }}>{item.ok ? '✅' : '⚠️'}</Text>
            <View style={{ flex: 1 }}>
              <Text variant="bodyMedium">{item.text}</Text>
              <Text variant="bodySmall" style={{ color: '#999' }}>{item.time}</Text>
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
}

function StudentsTab({ students }) {
  return (
    <View style={{ padding: 16 }}>
      <Button mode="outlined" icon="file-import" style={{ marginBottom: 16, borderRadius: 8 }}>
        Import từ Excel
      </Button>
      <Card style={{ borderRadius: 12 }}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Mã SV</DataTable.Title>
            <DataTable.Title>Họ tên</DataTable.Title>
            <DataTable.Title numeric>Tỉ lệ</DataTable.Title>
          </DataTable.Header>
          {students.map(s => (
            <DataTable.Row key={s.id}>
              <DataTable.Cell>{s.code}</DataTable.Cell>
              <DataTable.Cell>{s.name.split(' ').slice(-2).join(' ')}</DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={{ color: parseInt(s.rate) >= 80 ? '#2E7D32' : '#C62828' }}>{s.rate}</Text>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </Card>
    </View>
  );
}

function SettingsTab() {
  return (
    <View style={{ padding: 16 }}>
      <Card style={styles.settingCard}>
        <Card.Content>
          <Text variant="titleSmall" style={{ fontWeight: 'bold', marginBottom: 12 }}>Cấu hình GPS</Text>
          <Text variant="bodySmall" style={{ color: '#666' }}>Sai số GPS cho phép</Text>
          <View style={styles.settingRow}>
            <Chip selected>20m</Chip>
            <Chip>30m</Chip>
            <Chip>50m</Chip>
            <Chip>100m</Chip>
          </View>
        </Card.Content>
      </Card>
      <Card style={styles.settingCard}>
        <Card.Content>
          <Text variant="titleSmall" style={{ fontWeight: 'bold', marginBottom: 12 }}>Cấu hình mã QR</Text>
          <Text variant="bodySmall" style={{ color: '#666' }}>Thời gian hiệu lực mã QR</Text>
          <View style={styles.settingRow}>
            <Chip>3s</Chip>
            <Chip selected>5s</Chip>
            <Chip>10s</Chip>
          </View>
        </Card.Content>
      </Card>
      <Card style={styles.settingCard}>
        <Card.Content>
          <Text variant="titleSmall" style={{ fontWeight: 'bold', marginBottom: 8 }}>Wifi Fingerprint</Text>
          <Text variant="bodySmall" style={{ color: '#666', marginBottom: 12 }}>
            Chỉ cho phép điểm danh khi kết nối Wifi nội bộ trường
          </Text>
          <Button mode="outlined" icon="wifi">Cấu hình Wifi nội bộ</Button>
        </Card.Content>
      </Card>
    </View>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <Surface style={[styles.statCard, { borderTopColor: color }]} elevation={1}>
      <Avatar.Icon size={32} icon={icon} style={{ backgroundColor: color + '20' }} color={color} />
      <Text variant="headlineSmall" style={{ color, fontWeight: 'bold', marginTop: 4 }}>{value}</Text>
      <Text variant="bodySmall" style={{ color: '#666' }}>{label}</Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#1565C0', padding: 20, flexDirection: 'row', alignItems: 'center' },
  avatar: { backgroundColor: '#0D47A1' },
  name: { color: '#fff', fontWeight: 'bold' },
  code: { color: '#BBDEFB' },
  tabRow: { flexDirection: 'row', padding: 16, gap: 8 },
  tabBtn: { flex: 1, borderRadius: 8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  statCard: { width: '47%', alignItems: 'center', padding: 12, borderRadius: 10, borderTopWidth: 3, backgroundColor: '#fff' },
  sectionTitle: { fontWeight: 'bold', marginBottom: 8 },
  activityCard: { borderRadius: 10, marginBottom: 8 },
  settingCard: { borderRadius: 12, marginBottom: 12 },
  settingRow: { flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' },
});
