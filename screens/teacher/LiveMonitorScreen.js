import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Text, Avatar, Chip, Searchbar } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MOCK_STUDENTS_ATTENDANCE } from '../../constants/mockData';

// MOCK_STUDENTS_ATTENDANCE được import từ constants/mockData.js

const statusConfig = {
  present: { label: 'Có mặt',  color: '#2E7D32', bg: '#E8F5E9', icon: 'check-circle',      barColor: '#2E7D32' },
  absent:  { label: 'Vắng mặt',color: '#C62828', bg: '#FFEBEE', icon: 'close-circle',       barColor: '#C62828' },
  late:    { label: 'Muộn',    color: '#E65100', bg: '#FFF3E0', icon: 'clock-alert-outline', barColor: '#E65100' },
};

const FILTERS = [
  { key: 'all',     label: 'Tất cả' },
  { key: 'present', label: '✅ Có mặt' },
  { key: 'absent',  label: '❌ Vắng' },
  { key: 'late',    label: '⏰ Muộn' },
];

export default function LiveMonitorScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { classInfo, presentCount: passedPresent } = route.params;
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Nếu có presentCount từ CreateSession, cập nhật trạng thái SV
  const students = React.useMemo(() => {
    if (!passedPresent) return MOCK_STUDENTS_ATTENDANCE;
    const shuffled = [...MOCK_STUDENTS_ATTENDANCE];
    let presentSet = 0;
    return shuffled.map(s => {
      if (presentSet < passedPresent && s.status !== 'late') {
        presentSet++;
        return {
          ...s,
          status: 'present',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        };
      }
      return s;
    });
  }, [passedPresent]);

  const present = students.filter(s => s.status === 'present').length;
  const absent  = students.filter(s => s.status === 'absent').length;
  const late    = students.filter(s => s.status === 'late').length;
  const rate    = Math.round((present / students.length) * 100);

  const filtered = students.filter(s => {
    const matchFilter = filter === 'all' || s.status === filter;
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleExport = () => {
    Alert.alert(
      '📊 Xuất báo cáo',
      `${classInfo.subject} - Lớp ${classInfo.class}\n\n✅ Có mặt: ${present}\n❌ Vắng: ${absent}\n⏰ Muộn: ${late}\n📊 Tỉ lệ: ${rate}%`,
      [{ text: 'Đóng' }]
    );
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
        <Text style={styles.headerSubject}>{classInfo.subject}</Text>
        <Text style={styles.headerInfo}>
          Lớp {classInfo.class} • {classInfo.room} • {classInfo.time}
        </Text>

        <View style={styles.statsRow}>
          <StatBox value={present}    label="Có mặt" color="#81C784" />
          <View style={styles.statDivider} />
          <StatBox value={absent}     label="Vắng"   color="#EF9A9A" />
          <View style={styles.statDivider} />
          <StatBox value={late}       label="Muộn"   color="#FFB74D" />
          <View style={styles.statDivider} />
          <StatBox value={`${rate}%`} label="Tỉ lệ"  color="#4FC3F7" />
        </View>
      </LinearGradient>

      {/* ── Action row ── */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.exportBtn} onPress={handleExport} activeOpacity={0.85}>
          <MaterialCommunityIcons name="file-export" size={15} color="#1565C0" />
          <Text style={styles.exportBtnText}>Xuất báo cáo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('TeacherTabs')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#1565C0', '#1976D2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.homeBtnGradient}
          >
            <MaterialCommunityIcons name="home" size={15} color="#fff" />
            <Text style={styles.homeBtnText}>Trang chủ</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* ── Searchbar ── */}
      <Searchbar
        placeholder="Tìm theo tên hoặc mã SV..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchBar}
        inputStyle={{ fontSize: 13 }}
      />

      {/* ── Filter chips ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingVertical: 4 }}
      >
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && { color: '#fff' }]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Student list ── */}
      <Text style={styles.listTitle}>
        Danh sách sinh viên ({filtered.length})
      </Text>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map(student => (
          <View key={student.id} style={styles.studentCard}>
            {/* Colored left bar */}
            <View
              style={[
                styles.studentColorBar,
                { backgroundColor: statusConfig[student.status].barColor },
              ]}
            />

            {/* Avatar */}
            <Avatar.Text
              size={40}
              label={student.name.split(' ').pop().charAt(0)}
              style={{
                backgroundColor: statusConfig[student.status].bg,
                marginRight: 10,
              }}
              color={statusConfig[student.status].color}
            />

            {/* Name + code */}
            <View style={{ flex: 1 }}>
              <Text style={styles.studentName}>{student.name}</Text>
              <Text style={styles.studentCode}>{student.code}</Text>
            </View>

            {/* Status chip + time */}
            <View style={{ alignItems: 'flex-end' }}>
              <View
                style={[
                  styles.statusChip,
                  { backgroundColor: statusConfig[student.status].bg },
                ]}
              >
                <MaterialCommunityIcons
                  name={statusConfig[student.status].icon}
                  size={11}
                  color={statusConfig[student.status].color}
                />
                <Text
                  style={[
                    styles.statusChipText,
                    { color: statusConfig[student.status].color },
                  ]}
                >
                  {statusConfig[student.status].label}
                </Text>
              </View>
              {student.time && (
                <Text style={styles.timeText}>{student.time}</Text>
              )}
            </View>
          </View>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 48 }}>🔍</Text>
            <Text style={styles.emptyText}>Không tìm thấy kết quả</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function StatBox({ value, label, color }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EEF2FF' },

  // Header (no rounded bottom)
  header: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerSubject: { color: '#fff', fontWeight: 'bold', fontSize: 20, marginBottom: 4 },
  headerInfo: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 16 },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    padding: 12,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 4 },

  // Actions row
  actionsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 12, gap: 10 },
  exportBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#1565C0',
    backgroundColor: '#fff',
  },
  exportBtnText: { color: '#1565C0', fontWeight: '600', fontSize: 13 },
  homeBtn: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  homeBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  homeBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },

  // Searchbar
  searchBar: {
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 12,
    elevation: 1,
    backgroundColor: '#fff',
  },

  // Filter
  filterScroll: { marginTop: 8, marginBottom: 0 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  filterChipActive: { backgroundColor: '#1565C0', borderColor: '#1565C0' },
  filterText: { fontSize: 13, color: '#4A5568', fontWeight: '600' },

  // List header
  listTitle: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#0A1628',
    fontSize: 14,
  },

  // Student card
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#1565C0',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    paddingRight: 14,
    paddingVertical: 10,
  },
  studentColorBar: { width: 4, alignSelf: 'stretch', borderTopLeftRadius: 16, borderBottomLeftRadius: 16, marginRight: 10 },
  studentName: { fontWeight: 'bold', fontSize: 14, color: '#0A1628' },
  studentCode: { color: '#94A3B8', fontSize: 12, marginTop: 2 },

  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusChipText: { fontSize: 11, fontWeight: '600' },
  timeText: { color: '#94A3B8', fontSize: 11, marginTop: 4 },

  // Empty
  emptyState: { alignItems: 'center', padding: 48 },
  emptyText: { color: '#94A3B8', marginTop: 12, fontSize: 14 },
});
