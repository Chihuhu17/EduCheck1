import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, Avatar, Chip, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { MOCK_CLASSES } from '../../constants/mockData';

const leaveStatusConfig = {
  pending:  { label: 'Chờ duyệt', color: '#E65100', bg: '#FFF3E0' },
  approved: { label: 'Đã duyệt',  color: '#2E7D32', bg: '#E8F5E9' },
  rejected: { label: 'Từ chối',   color: '#C62828', bg: '#FFEBEE' },
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
      {/* ── Header ── */}
      <LinearGradient
        colors={['#0D47A1', '#1565C0', '#1976D2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {/* Top row */}
        <View style={styles.headerTop}>
          <Avatar.Text
            size={48}
            label="GV"
            style={styles.avatarStyle}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.greeting}>Giảng viên 👨‍🏫</Text>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userCode}>{user?.studentCode}</Text>
          </View>
          <TouchableOpacity style={styles.logoutPill} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={13} color="#fff" />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatItem value={MOCK_CLASSES.length} label="Lớp hôm nay" color="#4FC3F7" />
          <View style={styles.statDivider} />
          <StatItem value={MOCK_CLASSES.filter(c => c.done).length} label="Đã điểm danh" color="#81C784" />
          <View style={styles.statDivider} />
          <StatItem value={MOCK_CLASSES.filter(c => !c.done).length} label="Chưa bắt đầu" color="#FFB74D" />
          <View style={styles.statDivider} />
          <StatItem value={pendingCount} label="Đơn chờ" color="#EF9A9A" />
        </View>
      </LinearGradient>

      {/* ── Tab bar ── */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === 'classes' && styles.tabActive]}
          onPress={() => setTab('classes')}
        >
          <Text style={[styles.tabText, tab === 'classes' && styles.tabTextActive]}>
            📚 Lịch dạy
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, tab === 'leaves' && styles.tabActive]}
          onPress={() => setTab('leaves')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={[styles.tabText, tab === 'leaves' && styles.tabTextActive]}>
              📋 Đơn xin nghỉ
            </Text>
            {pendingCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* ── Content ── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingTop: 10, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {tab === 'classes' ? (
          MOCK_CLASSES.map(cls => (
            <View key={cls.id} style={[styles.card, cls.done && styles.cardDone]}>
              {/* Colored left bar */}
              <View
                style={[
                  styles.colorBar,
                  { backgroundColor: cls.done ? '#81C784' : '#1565C0' },
                ]}
              />
              <View style={{ flex: 1, padding: 14 }}>
                {/* Top: subject + chip */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={styles.subjectName} numberOfLines={1}>
                    {cls.subject}
                  </Text>
                  {cls.done ? (
                    <View style={styles.donePill}>
                      <Text style={styles.donePillText}>✓ Hoàn thành</Text>
                    </View>
                  ) : (
                    <View style={styles.classPill}>
                      <Text style={styles.classPillText}>{cls.class}</Text>
                    </View>
                  )}
                </View>

                {/* Info row */}
                <View style={styles.infoRow}>
                  <View style={styles.infoChip}>
                    <MaterialCommunityIcons name="door" size={12} color="#1565C0" />
                    <Text style={styles.infoChipText}>{cls.room}</Text>
                  </View>
                  <View style={styles.infoChip}>
                    <MaterialCommunityIcons name="clock-outline" size={12} color="#1565C0" />
                    <Text style={styles.infoChipText}>{cls.time}</Text>
                  </View>
                  <View style={styles.infoChip}>
                    <MaterialCommunityIcons name="account-group" size={12} color="#1565C0" />
                    <Text style={styles.infoChipText}>{cls.students} SV</Text>
                  </View>
                </View>

                {/* Start button */}
                {!cls.done && (
                  <TouchableOpacity
                    style={styles.startBtnWrapper}
                    onPress={() => navigation.navigate('CreateSession', { classInfo: cls })}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={['#1565C0', '#1976D2']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.startBtnGradient}
                    >
                      <MaterialCommunityIcons name="play-circle" size={16} color="#fff" />
                      <Text style={styles.startBtnText}>Bắt đầu điểm danh</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        ) : (
          leaves.map(leave => (
            <View key={leave.id} style={styles.card}>
              <View style={{ padding: 14 }}>
                {/* Leave header */}
                <View style={styles.leaveHeaderRow}>
                  <Avatar.Text
                    size={40}
                    label={leave.name.split(' ').pop().charAt(0)}
                    style={{ backgroundColor: '#1565C0' }}
                  />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.subjectName}>{leave.name}</Text>
                    <Text style={styles.infoMuted}>{leave.code}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusChip,
                      { backgroundColor: leaveStatusConfig[leave.status].bg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusChipText,
                        { color: leaveStatusConfig[leave.status].color },
                      ]}
                    >
                      {leaveStatusConfig[leave.status].label}
                    </Text>
                  </View>
                </View>

                {/* Info box */}
                <View style={styles.leaveInfoBox}>
                  <View style={styles.leaveInfoRow}>
                    <MaterialCommunityIcons name="book-open-variant" size={14} color="#1565C0" />
                    <Text style={styles.leaveInfoText}>{leave.subject}</Text>
                  </View>
                  <View style={styles.leaveInfoRow}>
                    <MaterialCommunityIcons name="calendar" size={14} color="#1565C0" />
                    <Text style={styles.leaveInfoText}>{leave.date}</Text>
                  </View>
                  <View style={styles.leaveInfoRow}>
                    <MaterialCommunityIcons name="comment-text-outline" size={14} color="#1565C0" />
                    <Text style={styles.leaveInfoText}>{leave.reason}</Text>
                  </View>
                </View>

                {/* Actions */}
                {leave.status === 'pending' && (
                  <View style={styles.leaveActions}>
                    <TouchableOpacity
                      style={styles.approveBtn}
                      onPress={() => handleLeave(leave.id, 'approved')}
                      activeOpacity={0.85}
                    >
                      <LinearGradient
                        colors={['#2E7D32', '#388E3C']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.actionBtnGradient}
                      >
                        <MaterialCommunityIcons name="check-circle" size={15} color="#fff" />
                        <Text style={styles.actionBtnText}>Duyệt</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.rejectBtn}
                      onPress={() => handleLeave(leave.id, 'rejected')}
                      activeOpacity={0.85}
                    >
                      <MaterialCommunityIcons name="close-circle-outline" size={15} color="#C62828" />
                      <Text style={styles.rejectBtnText}>Từ chối</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
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
  container: { flex: 1, backgroundColor: '#EEF2FF' },

  // Header
  header: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatarStyle: { backgroundColor: 'rgba(255,255,255,0.2)' },
  greeting: { color: 'rgba(255,255,255,0.75)', fontSize: 12 },
  userName: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
  userCode: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
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

  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 12,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 10, marginTop: 2, textAlign: 'center' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 4 },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    elevation: 3,
    shadowColor: '#1565C0',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tab: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#1565C0' },
  tabText: { color: '#888', fontWeight: '600', fontSize: 13 },
  tabTextActive: { color: '#fff' },

  badge: {
    backgroundColor: '#EF5350',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  // Class cards
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#1565C0',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardDone: { opacity: 0.78 },
  colorBar: { width: 5, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 },
  subjectName: { fontWeight: 'bold', fontSize: 15, color: '#0A1628', flex: 1 },

  donePill: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  donePillText: { color: '#2E7D32', fontSize: 11, fontWeight: '600' },
  classPill: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  classPillText: { color: '#1565C0', fontSize: 11, fontWeight: '600' },

  infoRow: { flexDirection: 'row', gap: 8, marginTop: 2 },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  infoChipText: { color: '#1565C0', fontSize: 11, fontWeight: '500' },

  startBtnWrapper: { marginTop: 12, borderRadius: 12, overflow: 'hidden' },
  startBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 11,
    borderRadius: 12,
  },
  startBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  // Leave cards
  leaveHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  infoMuted: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  statusChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusChipText: { fontSize: 11, fontWeight: '600' },

  leaveInfoBox: {
    backgroundColor: '#F8FAFF',
    borderRadius: 10,
    padding: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  leaveInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  leaveInfoText: { fontSize: 13, color: '#4A5568' },

  leaveActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  approveBtn: { flex: 1, borderRadius: 10, overflow: 'hidden' },
  actionBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  actionBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#C62828',
  },
  rejectBtnText: { color: '#C62828', fontWeight: 'bold', fontSize: 13 },
});
