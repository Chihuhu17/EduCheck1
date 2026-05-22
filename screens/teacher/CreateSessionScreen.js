import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Button, Card, ActivityIndicator, ProgressBar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { QR_TOKEN_PREFIX } from '../../constants/config';

// QR token cố định theo classId — sử dụng QR_TOKEN_PREFIX từ constants/config.js
function getStaticQRToken(classId) {
  return `${QR_TOKEN_PREFIX}${classId}`;
}

function getQRImageUrl(token) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(token)}&bgcolor=ffffff&color=1565C0&margin=12`;
}

export default function CreateSessionScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { classInfo } = route.params;

  const [sessionActive, setSessionActive] = useState(false);
  const [qrToken, setQrToken] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [qrLoading, setQrLoading] = useState(false);
  const elapsedRef = useRef(null);

  const startSession = () => {
    const token = getStaticQRToken(classInfo.id);
    setSessionActive(true);
    setQrToken(token);
    setQrLoading(true);

    // Chỉ đếm thời gian và simulate sinh viên điểm danh
    elapsedRef.current = setInterval(() => {
      setElapsed(e => e + 1);
      setPresentCount(p => Math.min(p + Math.floor(Math.random() * 2), classInfo.students));
    }, 3000);
  };

  const endSession = () => {
    clearInterval(elapsedRef.current);
    navigation.navigate('LiveMonitor', { classInfo, presentCount, totalStudents: classInfo.students });
  };

  useEffect(() => {
    return () => { clearInterval(elapsedRef.current); };
  }, []);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const attendanceRate = classInfo.students > 0 ? presentCount / classInfo.students : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {/* Class Info */}
      <View style={styles.infoCard}>
        <View style={styles.infoLeft}>
          <Text style={styles.infoSubject}>{classInfo.subject}</Text>
          <Text style={styles.infoDetail}>🏫 {classInfo.room} • ⏰ {classInfo.time}</Text>
          <Text style={styles.infoDetail}>📌 Lớp {classInfo.class} • 👥 {classInfo.students} sinh viên</Text>
        </View>
      </View>

      {!sessionActive ? (
        <View style={styles.startContainer}>
          <View style={styles.startIconBox}>
            <Text style={{ fontSize: 64 }}>📋</Text>
          </View>
          <Text style={styles.startTitle}>Sẵn sàng điểm danh</Text>
          <Text style={styles.startSub}>
            Mã QR cố định theo lớp học. Sinh viên quét mã này để điểm danh.
          </Text>
          <Button
            mode="contained"
            icon="play-circle"
            onPress={startSession}
            style={styles.startBtn}
            contentStyle={{ paddingVertical: 12 }}
            buttonColor="#1565C0"
          >
            Bắt đầu điểm danh
          </Button>
        </View>
      ) : (
        <>
          {/* Timer */}
          <View style={styles.timerRow}>
            <View style={styles.timerBox}>
              <Text style={styles.timerLabel}>⏱ Thời gian</Text>
              <Text style={styles.timerValue}>{formatTime(elapsed)}</Text>
            </View>
            <View style={styles.timerBox}>
              <Text style={styles.timerLabel}>👥 Có mặt</Text>
              <Text style={[styles.timerValue, { color: '#2E7D32' }]}>{presentCount}/{classInfo.students}</Text>
            </View>
            <View style={styles.timerBox}>
              <Text style={styles.timerLabel}>📊 Tỉ lệ</Text>
              <Text style={[styles.timerValue, { color: '#1565C0' }]}>{Math.round(attendanceRate * 100)}%</Text>
            </View>
          </View>

          {/* Progress */}
          <ProgressBar progress={attendanceRate} color="#2E7D32" style={styles.progressBar} />

          {/* QR Code */}
          <Card style={styles.qrCard}>
            <Card.Content style={{ alignItems: 'center' }}>
              <Text style={styles.qrTitle}>Mã QR điểm danh</Text>
              <Text style={styles.qrSub}>Sinh viên quét mã này để điểm danh</Text>
              <View style={styles.qrWrapper}>
                {qrLoading && (
                  <View style={styles.qrOverlay}>
                    <ActivityIndicator color="#1565C0" size="large" />
                  </View>
                )}
                <Image
                  source={{ uri: getQRImageUrl(qrToken) }}
                  style={styles.qrImage}
                  onLoad={() => setQrLoading(false)}
                  onError={() => setQrLoading(false)}
                />
              </View>
              <View style={styles.qrBadge}>
                <Text style={styles.qrBadgeText}>🔒 Mã cố định theo lớp</Text>
              </View>
              <Text style={styles.tokenText}>{qrToken}</Text>
            </Card.Content>
          </Card>

          <Button
            mode="contained"
            icon="stop-circle"
            onPress={endSession}
            style={styles.endBtn}
            contentStyle={{ paddingVertical: 12 }}
            buttonColor="#C62828"
          >
            Kết thúc & Chốt sổ
          </Button>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  infoCard: { backgroundColor: '#1565C0', borderRadius: 16, padding: 16, marginBottom: 16 },
  infoLeft: {},
  infoSubject: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 6 },
  infoDetail: { color: '#BBDEFB', fontSize: 13, marginTop: 3 },
  startContainer: { alignItems: 'center', marginTop: 24, paddingHorizontal: 16 },
  startIconBox: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  startTitle: { fontSize: 20, fontWeight: 'bold', color: '#1565C0', marginBottom: 10 },
  startSub: { color: '#888', textAlign: 'center', lineHeight: 20, marginBottom: 28 },
  startBtn: { borderRadius: 14, width: '100%' },
  timerRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  timerBox: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14, alignItems: 'center', elevation: 2 },
  timerLabel: { color: '#888', fontSize: 11, marginBottom: 4 },
  timerValue: { fontSize: 20, fontWeight: 'bold', color: '#1A1A2E' },
  progressBar: { height: 8, borderRadius: 4, marginBottom: 16 },
  qrCard: { borderRadius: 20, marginBottom: 16, elevation: 4 },
  qrTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 4 },
  qrSub: { color: '#888', fontSize: 12, marginBottom: 16 },
  qrWrapper: { width: 220, height: 220, justifyContent: 'center', alignItems: 'center', borderRadius: 16, overflow: 'hidden', backgroundColor: '#F5F5F5' },
  qrImage: { width: 220, height: 220 },
  qrOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E3F2FD', zIndex: 1 },
  qrBadge: { backgroundColor: '#E3F2FD', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginTop: 14 },
  qrBadgeText: { color: '#1565C0', fontSize: 12, fontWeight: '600' },
  tokenText: { color: '#bbb', fontSize: 10, marginTop: 8, textAlign: 'center' },
  endBtn: { borderRadius: 14, marginBottom: 32 },
});
