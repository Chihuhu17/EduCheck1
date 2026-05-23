import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../../context/AppContext';

export default function SessionHistoryScreen() {
  const { sessionHistory } = useAppContext();
  const [expanded, setExpanded] = useState(null);

  const totalSessions = sessionHistory.length;
  const avgRate = totalSessions > 0 ? Math.round(
    sessionHistory.reduce((sum, s) => sum + Math.round((s.present / s.total) * 100), 0) / totalSessions
  ) : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#0D47A1', '#1565C0', '#1976D2']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Lịch sử điểm danh</Text>
        <Text style={styles.headerSub}>{totalSessions} buổi đã thực hiện</Text>
        <View style={styles.statsRow}>
          <MiniStat value={totalSessions} label="Tổng buổi"  color="#4FC3F7" />
          <View style={styles.divider} />
          <MiniStat value={`${avgRate}%`} label="TB có mặt"  color="#81C784" />
          <View style={styles.divider} />
          <MiniStat value={new Set(sessionHistory.map(s => s.subject)).size} label="Môn học" color="#FFB74D" />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.list}>
        {sessionHistory.map(session => {
          const rate    = Math.round((session.present / session.total) * 100);
          const isOpen  = expanded === session.id;
          const rateColor = rate >= 85 ? '#2E7D32' : rate >= 70 ? '#E65100' : '#C62828';

          return (
            <Card key={session.id} style={styles.card}>
              <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => setExpanded(isOpen ? null : session.id)}
                activeOpacity={0.7}
              >
                {/* Color accent bar */}
                <View style={[styles.accentBar, { backgroundColor: rateColor }]} />

                <View style={{ flex: 1 }}>
                  <View style={styles.cardTopRow}>
                    <Text style={styles.subjectText}>{session.subject}</Text>
                    <View style={[styles.rateBadge, { backgroundColor: rateColor + '20' }]}>
                      <Text style={[styles.rateText, { color: rateColor }]}>{rate}%</Text>
                    </View>
                  </View>
                  <Text style={styles.metaText}>
                    📅 {session.date}  •  ⏰ {session.time}  •  🏫 {session.room}
                  </Text>
                  <Text style={styles.metaText}>📌 Lớp {session.class}</Text>
                </View>

                <MaterialCommunityIcons
                  name={isOpen ? 'chevron-up' : 'chevron-down'}
                  size={22} color="#94A3B8"
                />
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.detailBox}>
                  <View style={styles.detailRow}>
                    <DetailStat icon="account-check" label="Có mặt" value={session.present} color="#2E7D32" />
                    <DetailStat icon="account-off"   label="Vắng"   value={session.absent}  color="#C62828" />
                    <DetailStat icon="clock-alert"   label="Muộn"   value={session.late}    color="#E65100" />
                    <DetailStat icon="account-group" label="Tổng"   value={session.total}   color="#1565C0" />
                  </View>
                  {/* Progress bar */}
                  <View style={styles.progressBg}>
                    <View style={[styles.progressFill, { width: `${rate}%`, backgroundColor: rateColor }]} />
                  </View>
                  <Text style={[styles.progressLabel, { color: rateColor }]}>
                    Tỉ lệ có mặt: {rate}%
                  </Text>
                </View>
              )}
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}

function MiniStat({ value, label, color }) {
  return (
    <View style={styles.miniStat}>
      <Text style={[styles.miniStatVal, { color }]}>{value}</Text>
      <Text style={styles.miniStatLabel}>{label}</Text>
    </View>
  );
}

function DetailStat({ icon, label, value, color }) {
  return (
    <View style={styles.detailStat}>
      <MaterialCommunityIcons name={icon} size={22} color={color} />
      <Text style={[styles.detailVal, { color }]}>{value}</Text>
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#EEF2FF' },
  header:         { paddingTop: 52, paddingHorizontal: 20, paddingBottom: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerTitle:    { color: '#fff', fontWeight: 'bold', fontSize: 20 },
  headerSub:      { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 },
  statsRow:       { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: 14, marginTop: 16 },
  miniStat:       { flex: 1, alignItems: 'center' },
  miniStatVal:    { fontSize: 22, fontWeight: 'bold' },
  miniStatLabel:  { color: 'rgba(255,255,255,0.75)', fontSize: 11, marginTop: 2 },
  divider:        { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 4 },
  list:           { padding: 16, gap: 10, paddingBottom: 32 },
  card:           { borderRadius: 16, elevation: 3, shadowColor: '#1565C0', shadowOpacity: 0.1, shadowRadius: 8 },
  cardHeader:     { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  accentBar:      { width: 4, height: '100%', borderRadius: 2, minHeight: 50 },
  cardTopRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  subjectText:    { fontWeight: 'bold', fontSize: 14, color: '#0A1628', flex: 1 },
  rateBadge:      { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  rateText:       { fontWeight: 'bold', fontSize: 13 },
  metaText:       { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  detailBox:      { paddingHorizontal: 16, paddingBottom: 16 },
  detailRow:      { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#F8FAFF', borderRadius: 12, padding: 12, marginBottom: 12 },
  detailStat:     { alignItems: 'center', gap: 4 },
  detailVal:      { fontWeight: 'bold', fontSize: 18 },
  detailLabel:    { color: '#94A3B8', fontSize: 11 },
  progressBg:     { height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden' },
  progressFill:   { height: 8, borderRadius: 4 },
  progressLabel:  { fontSize: 12, fontWeight: '600', marginTop: 6, textAlign: 'right' },
});
