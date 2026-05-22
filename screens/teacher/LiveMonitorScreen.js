import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, Card, Chip, Button, Avatar, Searchbar } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MOCK_STUDENTS_ATTENDANCE } from '../../constants/mockData';

// MOCK_STUDENTS_ATTENDANCE được import từ constants/mockData.js


const statusConfig = {
  present: { label: 'Có mặt', color: '#2E7D32', bg: '#E8F5E9', icon: '✅' },
  absent: { label: 'Vắng mặt', color: '#C62828', bg: '#FFEBEE', icon: '❌' },
  late: { label: 'Muộn', color: '#E65100', bg: '#FFF3E0', icon: '⏰' },
};

const FILTERS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'present', label: 'Có mặt' },
  { key: 'absent', label: 'Vắng' },
  { key: 'late', label: 'Muộn' },
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
        return { ...s, status: 'present', time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) };
      }
      return s;
    });
  }, [passedPresent]);

  const present = students.filter(s => s.status === 'present').length;
  const absent = students.filter(s => s.status === 'absent').length;
  const late = students.filter(s => s.status === 'late').length;
  const rate = Math.round((present / students.length) * 100);

  const filtered = students.filter(s => {
    const matchFilter = filter === 'all' || s.status === filter;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
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
      {/* Header Summary */}
      <View style={styles.header}>
        <Text style={styles.headerSubject}>{classInfo.subject}</Text>
        <Text style={styles.headerInfo}>Lớp {classInfo.class} • {classInfo.room} • {classInfo.time}</Text>

        <View style={styles.statsRow}>
          <StatBox value={present} label="Có mặt" color="#81C784" />
          <StatBox value={absent} label="Vắng" color="#EF9A9A" />
          <StatBox value={late} label="Muộn" color="#FFB74D" />
          <StatBox value={`${rate}%`} label="Tỉ lệ" color="#4FC3F7" />
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <Button mode="outlined" icon="file-export" onPress={handleExport} style={styles.exportBtn} textColor="#1565C0">
          Xuất báo cáo
        </Button>
        <Button mode="contained" icon="home" onPress={() => navigation.navigate('TeacherHome')} style={styles.homeBtn} buttonColor="#1565C0">
          Trang chủ
        </Button>
      </View>

      {/* Search */}
      <Searchbar
        placeholder="Tìm theo tên hoặc mã SV..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchBar}
        inputStyle={{ fontSize: 13 }}
      />

      {/* Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
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
      <Text style={styles.listTitle}>Danh sách sinh viên ({filtered.length})</Text>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        {filtered.map(student => (
          <Card key={student.id} style={styles.studentCard}>
            <Card.Content style={styles.studentRow}>
              <View style={[styles.statusDot, { backgroundColor: statusConfig[student.status].color }]}>
                <Text style={{ fontSize: 14 }}>{statusConfig[student.status].icon}</Text>
              </View>
              <Avatar.Text
                size={38}
                label={student.name.split(' ').pop().charAt(0)}
                style={{ backgroundColor: statusConfig[student.status].color + '33', marginRight: 10 }}
                color={statusConfig[student.status].color}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentCode}>{student.code}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Chip style={{ backgroundColor: statusConfig[student.status].bg }} textStyle={{ color: statusConfig[student.status].color, fontSize: 11 }}>
                  {statusConfig[student.status].label}
                </Chip>
                {student.time && <Text style={styles.timeText}>{student.time}</Text>}
              </View>
            </Card.Content>
          </Card>
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
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  header: { backgroundColor: '#1565C0', paddingTop: 16, paddingHorizontal: 20, paddingBottom: 20 },
  headerSubject: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  headerInfo: { color: '#BBDEFB', fontSize: 12, marginTop: 4, marginBottom: 16 },
  statsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: 12 },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: '#BBDEFB', fontSize: 11, marginTop: 2 },
  actionsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 12, gap: 10 },
  exportBtn: { flex: 1, borderRadius: 10, borderColor: '#1565C0' },
  homeBtn: { flex: 1, borderRadius: 10 },
  searchBar: { marginHorizontal: 16, marginTop: 10, borderRadius: 12, elevation: 1, backgroundColor: '#fff' },
  filterScroll: { marginTop: 10, marginBottom: 4 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E0E0E0' },
  filterChipActive: { backgroundColor: '#1565C0', borderColor: '#1565C0' },
  filterText: { fontSize: 13, color: '#555', fontWeight: '600' },
  listTitle: { marginHorizontal: 16, marginTop: 10, marginBottom: 8, fontWeight: 'bold', color: '#333', fontSize: 14 },
  studentCard: { borderRadius: 14, marginBottom: 8, elevation: 2 },
  studentRow: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 4, height: 40, borderRadius: 2, marginRight: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
  studentName: { fontWeight: 'bold', fontSize: 14, color: '#1A1A2E' },
  studentCode: { color: '#888', fontSize: 12, marginTop: 2 },
  timeText: { color: '#999', fontSize: 11, marginTop: 4 },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyText: { color: '#999', marginTop: 10, fontSize: 14 },
});
