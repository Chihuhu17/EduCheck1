import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Button, Avatar, Chip } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { MOCK_CLASSES } from '../../constants/mockData';

// MOCK_CLASSES được import từ constants/mockData.js


const leaveStatusConfig = {
  pending: { label: 'Chờ duyệt', color: '#E65100', bg: '#FFF3E0' },
  approved: { label: 'Đã duyệt', color: '#2E7D32', bg: '#E8F5E9' },
  rejected: { label: 'Từ chối', color: '#C62828', bg: '#FFEBEE' },
};

export default function TeacherHome({ navigation }) {
  const { user, logout, leaves, updateLeave } = useAuth();
  const [tab, setTab] = useState('classes');

  const handleLeave = (id, action) => updateLeave(id, action);

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  };

  const pendingCount = leaves.filter(l => l.status === 'pending').length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Avatar.Text size={44} label="GV" style={styles.avatar} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.greeting}>Giảng viên 👨‍🏫</Text>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userCode}>{user.studentCode}</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        {/* Summary */}
        <View style={styles.statsRow}>
          <StatItem value={MOCK_CLASSES.length} label="Lớp hôm nay" color="#4FC3F7" />
          <StatItem value={MOCK_CLASSES.filter(c => c.done).length} label="Đã điểm danh" color="#81C784" />
          <StatItem value={MOCK_CLASSES.filter(c => !c.done).length} label="Chưa bắt đầu" color="#FFB74D" />
          <StatItem value={pendingCount} label="Đơn chờ" color="#EF9A9A" />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, tab === 'classes' && styles.tabActive]} onPress={() => setTab('classes')}>
          <Text style={[styles.tabText, tab === 'classes' && styles.tabTextActive]}>📚 Lịch dạy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'leaves' && styles.tabActive]} onPress={() => setTab('leaves')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={[styles.tabText, tab === 'leaves' && styles.tabTextActive]}>📋 Đơn xin nghỉ</Text>
            {pendingCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingTop: 8 }}>
        {tab === 'classes' ? (
          MOCK_CLASSES.map(cls => (
            <Card key={cls.id} style={[styles.card, cls.done && styles.cardDone]}>
              <Card.Content>
                <View style={styles.cardRow}>
                  <View style={[styles.colorBar, { backgroundColor: cls.done ? '#81C784' : '#1565C0' }]} />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={styles.subjectName}>{cls.subject}</Text>
                      {cls.done && <Chip style={{ backgroundColor: '#E8F5E9', height: 24 }} textStyle={{ color: '#2E7D32', fontSize: 10 }}>Hoàn thành</Chip>}
                    </View>
                    <Text style={styles.subjectInfo}>🏫 {cls.room} • ⏰ {cls.time} • 👥 {cls.students} SV</Text>
                    <Text style={styles.subjectInfo}>📌 Lớp {cls.class}</Text>
                  </View>
                </View>
                {!cls.done && (
                  <Button
                    mode="contained"
                    onPress={() => navigation.navigate('CreateSession', { classInfo: cls })}
                    style={styles.startBtn}
                    buttonColor="#1565C0"
                    icon="play-circle"
                  >
                    Bắt đầu điểm danh
                  </Button>
                )}
              </Card.Content>
            </Card>
          ))
        ) : (
          leaves.map(leave => (
            <Card key={leave.id} style={styles.card}>
              <Card.Content>
                <View style={styles.leaveHeader}>
                  <Avatar.Text size={36} label={leave.name.split(' ').pop().charAt(0)} style={{ backgroundColor: '#1565C0' }} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.subjectName}>{leave.name}</Text>
                    <Text style={styles.subjectInfo}>{leave.code}</Text>
                  </View>
                  <Chip style={{ backgroundColor: leaveStatusConfig[leave.status].bg }} textStyle={{ color: leaveStatusConfig[leave.status].color, fontSize: 11 }}>
                    {leaveStatusConfig[leave.status].label}
                  </Chip>
                </View>
                <View style={styles.leaveInfo}>
                  <Text style={styles.leaveInfoText}>📚 {leave.subject}</Text>
                  <Text style={styles.leaveInfoText}>📅 {leave.date}</Text>
                  <Text style={styles.leaveInfoText}>💬 {leave.reason}</Text>
                </View>
                {leave.status === 'pending' && (
                  <View style={styles.leaveActions}>
                    <Button mode="contained" compact style={{ flex: 1, borderRadius: 8 }} buttonColor="#2E7D32" onPress={() => handleLeave(leave.id, 'approved')}>
                      ✓ Duyệt
                    </Button>
                    <Button mode="outlined" compact style={{ flex: 1, borderRadius: 8 }} textColor="#C62828" onPress={() => handleLeave(leave.id, 'rejected')}>
                      ✗ Từ chối
                    </Button>
                  </View>
                )}
              </Card.Content>
            </Card>
          ))
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
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  header: { backgroundColor: '#1565C0', paddingTop: 48, paddingHorizontal: 20, paddingBottom: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { backgroundColor: '#0D47A1' },
  greeting: { color: '#BBDEFB', fontSize: 12 },
  userName: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  userCode: { color: '#90CAF9', fontSize: 12 },
  logoutBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  logoutText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  statsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 12 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: '#BBDEFB', fontSize: 10, marginTop: 2, textAlign: 'center' },
  tabRow: { flexDirection: 'row', marginHorizontal: 16, marginTop: 16, backgroundColor: '#fff', borderRadius: 12, padding: 4, elevation: 2 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#1565C0' },
  tabText: { color: '#888', fontWeight: '600', fontSize: 13 },
  tabTextActive: { color: '#fff' },
  badge: { backgroundColor: '#EF5350', borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  card: { borderRadius: 14, marginBottom: 10, elevation: 2 },
  cardDone: { opacity: 0.75 },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start' },
  colorBar: { width: 4, borderRadius: 2, marginRight: 12, minHeight: 50 },
  subjectName: { fontWeight: 'bold', fontSize: 14, color: '#1A1A2E' },
  subjectInfo: { color: '#888', fontSize: 12, marginTop: 3 },
  startBtn: { borderRadius: 10, marginTop: 12 },
  leaveHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  leaveInfo: { backgroundColor: '#F5F5F5', borderRadius: 10, padding: 10, gap: 4 },
  leaveInfoText: { fontSize: 13, color: '#555' },
  leaveActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
});
