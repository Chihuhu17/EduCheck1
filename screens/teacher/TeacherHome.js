import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Avatar, Surface, Chip } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';

const MOCK_CLASSES = [
  { id: '1', subject: 'Lập trình Mobile', class: '522CNT', room: 'P.301', time: '07:30', students: 32 },
  { id: '2', subject: 'Cơ sở dữ liệu', class: '521CNT', room: 'P.205', time: '09:45', students: 28 },
  { id: '3', subject: 'Mạng máy tính', class: '523CNT', room: 'P.102', time: '13:00', students: 35 },
];

const INITIAL_LEAVES = [
  { id: '1', name: 'Nguyễn Đức Anh', code: '522CNT1001', subject: 'Lập trình Mobile', date: '22/05/2026', reason: 'Ốm, có giấy khám bệnh', status: 'pending' },
  { id: '2', name: 'Nhâm Tuấn Hùng', code: '522CNT1033', subject: 'Cơ sở dữ liệu', date: '22/05/2026', reason: 'Việc gia đình đột xuất', status: 'pending' },
];

const leaveStatusConfig = {
  pending: { label: 'Chờ duyệt', color: '#E65100', bg: '#FFF3E0' },
  approved: { label: 'Đã duyệt', color: '#2E7D32', bg: '#E8F5E9' },
  rejected: { label: 'Từ chối', color: '#C62828', bg: '#FFEBEE' },
};

export default function TeacherHome({ navigation }) {
  const { user, logout } = useAuth();
  const [leaves, setLeaves] = useState(INITIAL_LEAVES);

  const handleLeave = (id, action) => {
    setLeaves(prev =>
      prev.map(l => l.id === id ? { ...l, status: action } : l)
    );
  };

  const pendingCount = leaves.filter(l => l.status === 'pending').length;

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header} elevation={2}>
        <Avatar.Text size={48} label="GV" style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text variant="titleMedium" style={styles.name}>{user.name}</Text>
          <Text variant="bodySmall" style={styles.code}>Giảng viên • {user.studentCode}</Text>
        </View>
        <Button mode="text" textColor="#fff" onPress={logout}>Đăng xuất</Button>
      </Surface>

      <Text variant="titleMedium" style={styles.sectionTitle}>Lịch dạy hôm nay</Text>

      {MOCK_CLASSES.map(cls => (
        <Card key={cls.id} style={styles.classCard}>
          <Card.Content>
            <View style={styles.classRow}>
              <View style={{ flex: 1 }}>
                <Text variant="titleSmall" style={{ fontWeight: 'bold' }}>{cls.subject}</Text>
                <Text variant="bodySmall" style={{ color: '#666' }}>
                  Lớp {cls.class} • {cls.room} • {cls.time}
                </Text>
                <Text variant="bodySmall" style={{ color: '#666' }}>{cls.students} sinh viên</Text>
              </View>
              <Button
                mode="contained"
                compact
                onPress={() => navigation.navigate('CreateSession', { classInfo: cls })}
                style={{ borderRadius: 8 }}
              >
                Bắt đầu
              </Button>
            </View>
          </Card.Content>
        </Card>
      ))}

      <View style={styles.sectionHeader}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Đơn xin nghỉ</Text>
        {pendingCount > 0 && (
          <Chip style={{ backgroundColor: '#E65100', height: 28 }} textStyle={{ color: '#fff', fontSize: 12 }}>
            {pendingCount} chờ duyệt
          </Chip>
        )}
      </View>

      {leaves.map(leave => (
        <Card key={leave.id} style={styles.leaveCard}>
          <Card.Content>
            <View style={styles.leaveHeader}>
              <View style={{ flex: 1 }}>
                <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>{leave.name}</Text>
                <Text variant="bodySmall" style={{ color: '#666' }}>{leave.code}</Text>
              </View>
              <Chip
                style={{ backgroundColor: leaveStatusConfig[leave.status].bg }}
                textStyle={{ color: leaveStatusConfig[leave.status].color, fontSize: 11 }}
              >
                {leaveStatusConfig[leave.status].label}
              </Chip>
            </View>
            <Text variant="bodySmall" style={{ color: '#555', marginTop: 6 }}>
              📚 {leave.subject} • 📅 {leave.date}
            </Text>
            <Text variant="bodySmall" style={{ color: '#666', marginTop: 2 }}>
              💬 {leave.reason}
            </Text>
            {leave.status === 'pending' && (
              <View style={styles.leaveActions}>
                <Button
                  mode="contained"
                  compact
                  style={{ backgroundColor: '#2E7D32', borderRadius: 6, flex: 1 }}
                  onPress={() => handleLeave(leave.id, 'approved')}
                >
                  Duyệt
                </Button>
                <Button
                  mode="outlined"
                  compact
                  style={{ borderRadius: 6, flex: 1 }}
                  textColor="#C62828"
                  onPress={() => handleLeave(leave.id, 'rejected')}
                >
                  Từ chối
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#1565C0', padding: 20, flexDirection: 'row', alignItems: 'center' },
  avatar: { backgroundColor: '#0D47A1' },
  name: { color: '#fff', fontWeight: 'bold' },
  code: { color: '#BBDEFB' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 8, marginBottom: 8, gap: 8 },
  sectionTitle: { fontWeight: 'bold' },
  classCard: { marginHorizontal: 16, marginBottom: 10, borderRadius: 12 },
  classRow: { flexDirection: 'row', alignItems: 'center' },
  leaveCard: { marginHorizontal: 16, marginBottom: 10, borderRadius: 12 },
  leaveHeader: { flexDirection: 'row', alignItems: 'center' },
  leaveActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
});
