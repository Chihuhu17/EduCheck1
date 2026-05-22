import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Chip, Button, Surface, Avatar, Searchbar } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';

const MOCK_STUDENTS = [
  { id: '1', name: 'Trần Quang Bắc', code: '522CNT1006', status: 'present', time: '07:32' },
  { id: '2', name: 'Nguyễn Đức Anh', code: '522CNT1001', status: 'absent', time: null },
  { id: '3', name: 'Nguyễn Quang Duy', code: '522CNT1024', status: 'present', time: '07:35' },
  { id: '4', name: 'Nhâm Tuấn Hùng', code: '522CNT1033', status: 'late', time: '07:48' },
  { id: '5', name: 'Phạm Văn An', code: '522CNT1010', status: 'present', time: '07:31' },
  { id: '6', name: 'Lê Thị Bích', code: '522CNT1015', status: 'absent', time: null },
  { id: '7', name: 'Hoàng Minh Cường', code: '522CNT1018', status: 'present', time: '07:33' },
  { id: '8', name: 'Vũ Thị Dung', code: '522CNT1022', status: 'late', time: '07:52' },
];

const statusConfig = {
  present: { label: 'Có mặt', color: '#2E7D32', bg: '#E8F5E9' },
  absent: { label: 'Vắng mặt', color: '#C62828', bg: '#FFEBEE' },
  late: { label: 'Muộn', color: '#E65100', bg: '#FFF3E0' },
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
  const { classInfo } = route.params;
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const present = MOCK_STUDENTS.filter(s => s.status === 'present').length;
  const absent = MOCK_STUDENTS.filter(s => s.status === 'absent').length;
  const late = MOCK_STUDENTS.filter(s => s.status === 'late').length;

  const filtered = MOCK_STUDENTS.filter(s => {
    const matchFilter = filter === 'all' || s.status === filter;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleExport = () => {
    Alert.alert(
      'Xuất báo cáo',
      `Báo cáo điểm danh\n${classInfo.subject} - Lớp ${classInfo.class}\n\nCó mặt: ${present}\nVắng: ${absent}\nMuộn: ${late}\nTổng: ${MOCK_STUDENTS.length}`,
      [{ text: 'Đóng' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Summary */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text variant="titleLarge" style={{ fontWeight: 'bold', color: '#1565C0' }}>{classInfo.subject}</Text>
          <Text variant="bodySmall" style={{ color: '#666', marginBottom: 16 }}>
            Lớp {classInfo.class} • {classInfo.room} • {classInfo.time}
          </Text>
          <View style={styles.statsRow}>
            <StatBadge label="Có mặt" value={present} color="#2E7D32" />
            <StatBadge label="Vắng" value={absent} color="#C62828" />
            <StatBadge label="Muộn" value={late} color="#E65100" />
            <StatBadge label="Tổng" value={MOCK_STUDENTS.length} color="#1565C0" />
          </View>
        </Card.Content>
      </Card>

      {/* Export Button */}
      <Button
        mode="outlined"
        icon="file-export"
        onPress={handleExport}
        style={styles.exportBtn}
      >
        Xuất báo cáo
      </Button>

      {/* Search */}
      <Searchbar
        placeholder="Tìm theo tên hoặc mã SV..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchBar}
        inputStyle={{ fontSize: 14 }}
      />

      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {FILTERS.map(f => (
          <Chip
            key={f.key}
            selected={filter === f.key}
            onPress={() => setFilter(f.key)}
            style={filter === f.key ? styles.chipActive : styles.chip}
            textStyle={filter === f.key ? { color: '#fff' } : {}}
          >
            {f.label}
          </Chip>
        ))}
      </ScrollView>

      {/* Student List */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Danh sách sinh viên ({filtered.length})
      </Text>
      {filtered.map(student => (
        <Card key={student.id} style={styles.studentCard}>
          <Card.Content style={styles.studentRow}>
            <Avatar.Text
              size={36}
              label={student.name.split(' ').pop().charAt(0)}
              style={{ backgroundColor: statusConfig[student.status].color }}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>{student.name}</Text>
              <Text variant="bodySmall" style={{ color: '#666' }}>{student.code}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Chip
                style={{ backgroundColor: statusConfig[student.status].bg }}
                textStyle={{ color: statusConfig[student.status].color, fontSize: 11 }}
              >
                {statusConfig[student.status].label}
              </Chip>
              {student.time && (
                <Text variant="bodySmall" style={{ color: '#999', marginTop: 4 }}>{student.time}</Text>
              )}
            </View>
          </Card.Content>
        </Card>
      ))}

      {filtered.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 40 }}>🔍</Text>
          <Text variant="bodyMedium" style={{ color: '#999', marginTop: 8 }}>Không tìm thấy kết quả</Text>
        </View>
      )}

      <Button
        mode="contained"
        icon="home"
        onPress={() => navigation.navigate('TeacherHome')}
        style={styles.homeBtn}
        contentStyle={{ paddingVertical: 6 }}
      >
        Về trang chủ
      </Button>
    </ScrollView>
  );
}

function StatBadge({ label, value, color }) {
  return (
    <View style={styles.badge}>
      <Text variant="headlineSmall" style={{ color, fontWeight: 'bold' }}>{value}</Text>
      <Text variant="bodySmall" style={{ color: '#666' }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  summaryCard: { margin: 16, borderRadius: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  badge: { alignItems: 'center' },
  exportBtn: { marginHorizontal: 16, marginBottom: 12, borderRadius: 8 },
  searchBar: { marginHorizontal: 16, marginBottom: 12, borderRadius: 10, elevation: 1 },
  filterRow: { marginBottom: 12 },
  chip: { backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#1565C0' },
  sectionTitle: { marginHorizontal: 16, marginBottom: 8, fontWeight: 'bold' },
  studentCard: { marginHorizontal: 16, marginBottom: 8, borderRadius: 10 },
  studentRow: { flexDirection: 'row', alignItems: 'center' },
  emptyState: { alignItems: 'center', padding: 32 },
  homeBtn: { margin: 16, borderRadius: 8 },
});
