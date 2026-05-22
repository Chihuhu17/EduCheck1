import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Chip, Avatar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const STATUS_CONFIG = {
  pending:  { label: 'Chờ duyệt', color: '#E65100', bg: '#FFF3E0', icon: 'clock-outline' },
  approved: { label: 'Đã duyệt',  color: '#2E7D32', bg: '#E8F5E9', icon: 'check-circle-outline' },
  rejected: { label: 'Từ chối',   color: '#C62828', bg: '#FFEBEE', icon: 'close-circle-outline' },
};

const FILTERS = [
  { key: 'all',      label: 'Tất cả' },
  { key: 'pending',  label: 'Chờ duyệt' },
  { key: 'approved', label: 'Đã duyệt' },
  { key: 'rejected', label: 'Từ chối' },
];

export default function MyLeavesScreen({ navigation }) {
  const { user, leaves } = useAuth();
  const [filter, setFilter] = useState('all');

  const myLeaves  = leaves.filter(l => l.code === user.studentCode);
  const filtered  = filter === 'all' ? myLeaves : myLeaves.filter(l => l.status === filter);
  const pending   = myLeaves.filter(l => l.status === 'pending').length;
  const approved  = myLeaves.filter(l => l.status === 'approved').length;
  const rejected  = myLeaves.filter(l => l.status === 'rejected').length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#0D47A1', '#1565C0', '#1976D2']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Đơn xin nghỉ của tôi</Text>
        <Text style={styles.headerSub}>{myLeaves.length} đơn đã gửi</Text>

        <View style={styles.statsRow}>
          <StatMini value={pending}  label="Chờ duyệt" color="#FFB74D" />
          <View style={styles.divider} />
          <StatMini value={approved} label="Đã duyệt"  color="#81C784" />
          <View style={styles.divider} />
          <StatMini value={rejected} label="Từ chối"   color="#EF9A9A" />
        </View>
      </LinearGradient>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && { color: '#fff' }]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List */}
      <ScrollView contentContainerStyle={styles.list}>
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map(leave => <LeaveCard key={leave.id} leave={leave} />)
        )}

        <TouchableOpacity
          style={styles.newBtn}
          onPress={() => navigation.navigate('LeaveRequest')}
        >
          <MaterialCommunityIcons name="plus-circle" size={20} color="#fff" />
          <Text style={styles.newBtnText}>Gửi đơn xin nghỉ mới</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function StatMini({ value, label, color }) {
  return (
    <View style={styles.statMini}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function LeaveCard({ leave }) {
  const cfg = STATUS_CONFIG[leave.status];
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardTop}>
          <Avatar.Text
            size={40}
            label={leave.subject.charAt(0)}
            style={{ backgroundColor: '#E3F2FD' }}
            color="#1565C0"
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.subjectText}>{leave.subject}</Text>
            <Text style={styles.dateText}>📅 {leave.date}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
            <MaterialCommunityIcons name={cfg.icon} size={14} color={cfg.color} />
            <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>
        <View style={styles.reasonBox}>
          <Text style={styles.reasonLabel}>Lý do:</Text>
          <Text style={styles.reasonText}>{leave.reason}</Text>
        </View>
      </Card.Content>
    </Card>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <Text style={{ fontSize: 56 }}>📋</Text>
      <Text style={styles.emptyTitle}>Chưa có đơn xin nghỉ</Text>
      <Text style={styles.emptySub}>Bạn chưa gửi đơn xin nghỉ nào</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#EEF2FF' },
  header:         { paddingTop: 52, paddingHorizontal: 20, paddingBottom: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerTitle:    { color: '#fff', fontWeight: 'bold', fontSize: 20 },
  headerSub:      { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 },
  statsRow:       { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: 14, marginTop: 16 },
  statMini:       { flex: 1, alignItems: 'center' },
  statValue:      { fontSize: 22, fontWeight: 'bold' },
  statLabel:      { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 2 },
  divider:        { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 4 },
  filterRow:      { paddingHorizontal: 16, paddingVertical: 12, gap: 8, flexDirection: 'row' },
  filterChip:     { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: '#1565C0', borderColor: '#1565C0' },
  filterText:     { fontSize: 13, color: '#555', fontWeight: '600' },
  list:           { padding: 16, paddingTop: 0, gap: 10, paddingBottom: 32 },
  card:           { borderRadius: 16, elevation: 3, shadowColor: '#1565C0', shadowOpacity: 0.1, shadowRadius: 8 },
  cardTop:        { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  subjectText:    { fontWeight: 'bold', fontSize: 14, color: '#0A1628' },
  dateText:       { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  statusBadge:    { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  statusText:     { fontSize: 11, fontWeight: '700' },
  reasonBox:      { backgroundColor: '#F8FAFF', borderRadius: 10, padding: 10, flexDirection: 'row', gap: 6 },
  reasonLabel:    { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  reasonText:     { flex: 1, color: '#4A5568', fontSize: 12 },
  newBtn:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1565C0', borderRadius: 14, padding: 16, marginTop: 8 },
  newBtnText:     { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  empty:          { alignItems: 'center', paddingVertical: 60 },
  emptyTitle:     { fontWeight: 'bold', fontSize: 17, color: '#0A1628', marginTop: 16 },
  emptySub:       { color: '#94A3B8', fontSize: 13, marginTop: 6 },
});
