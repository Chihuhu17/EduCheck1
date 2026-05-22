import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Avatar, Chip, Surface } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';

const MOCK_SCHEDULE = [
  { id: '1', subject: 'Lập trình Mobile', room: 'P.301', time: '07:30 - 09:30', status: 'upcoming' },
  { id: '2', subject: 'Cơ sở dữ liệu', room: 'P.205', time: '09:45 - 11:45', status: 'done' },
  { id: '3', subject: 'Mạng máy tính', room: 'P.102', time: '13:00 - 15:00', status: 'absent' },
];

const statusConfig = {
  upcoming: { label: 'Sắp học', color: '#1565C0' },
  done: { label: 'Đã điểm danh', color: '#2E7D32' },
  absent: { label: 'Vắng mặt', color: '#C62828' },
};

export default function StudentHome({ navigation }) {
  const { user, logout } = useAuth();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Surface style={styles.header} elevation={2}>
        <Avatar.Text size={48} label={user.name.charAt(0)} style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text variant="titleMedium" style={styles.name}>{user.name}</Text>
          <Text variant="bodySmall" style={styles.code}>{user.studentCode}</Text>
        </View>
        <Button mode="text" textColor="#fff" onPress={logout}>Đăng xuất</Button>
      </Surface>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatCard label="Có mặt" value="18" color="#2E7D32" />
        <StatCard label="Vắng mặt" value="2" color="#C62828" />
        <StatCard label="Tỉ lệ" value="90%" color="#1565C0" />
      </View>

      {/* Scan Button */}
      <Card style={styles.scanCard}>
        <Card.Content style={{ alignItems: 'center' }}>
          <Text variant="titleMedium" style={{ marginBottom: 8 }}>Điểm danh ngay</Text>
          <Text variant="bodySmall" style={{ color: '#666', marginBottom: 16, textAlign: 'center' }}>
            Quét mã QR từ giảng viên để điểm danh
          </Text>
          <Button
            mode="contained"
            icon="qrcode-scan"
            onPress={() => navigation.navigate('ScanQR')}
            style={{ borderRadius: 8 }}
            contentStyle={{ paddingHorizontal: 24, paddingVertical: 6 }}
          >
            Quét mã QR
          </Button>
        </Card.Content>
      </Card>

      {/* Schedule */}
      <Text variant="titleMedium" style={styles.sectionTitle}>Lịch học hôm nay</Text>
      {MOCK_SCHEDULE.map(item => (
        <Card key={item.id} style={styles.scheduleCard}>
          <Card.Content>
            <View style={styles.scheduleRow}>
              <View style={{ flex: 1 }}>
                <Text variant="titleSmall">{item.subject}</Text>
                <Text variant="bodySmall" style={{ color: '#666' }}>{item.room} • {item.time}</Text>
              </View>
              <Chip
                style={{ backgroundColor: statusConfig[item.status].color + '20' }}
                textStyle={{ color: statusConfig[item.status].color, fontSize: 11 }}
              >
                {statusConfig[item.status].label}
              </Chip>
            </View>
          </Card.Content>
        </Card>
      ))}

      {/* Leave Request */}
      <Button
        mode="outlined"
        icon="file-document-edit"
        onPress={() => navigation.navigate('LeaveRequest')}
        style={styles.leaveBtn}
      >
        Gửi đơn xin nghỉ
      </Button>
    </ScrollView>
  );
}

function StatCard({ label, value, color }) {
  return (
    <Surface style={[styles.statCard, { borderTopColor: color }]} elevation={1}>
      <Text variant="headlineSmall" style={{ color, fontWeight: 'bold' }}>{value}</Text>
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
  statsRow: { flexDirection: 'row', padding: 16, gap: 8 },
  statCard: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 8, borderTopWidth: 3, backgroundColor: '#fff' },
  scanCard: { marginHorizontal: 16, marginBottom: 16, borderRadius: 12 },
  sectionTitle: { marginHorizontal: 16, marginBottom: 8, fontWeight: 'bold' },
  scheduleCard: { marginHorizontal: 16, marginBottom: 8, borderRadius: 10 },
  scheduleRow: { flexDirection: 'row', alignItems: 'center' },
  leaveBtn: { margin: 16, borderRadius: 8 },
});
