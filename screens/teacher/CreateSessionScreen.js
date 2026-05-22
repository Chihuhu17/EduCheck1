import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Button, Card, Surface, ActivityIndicator, ProgressBar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';

// Tạo QR token động mỗi 5 giây
function generateQRToken(classId) {
  const window = Math.floor(Date.now() / 5000);
  return `EDUCHECK-${classId}-${window}`;
}

function getQRImageUrl(token) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(token)}&bgcolor=ffffff&color=1565C0&margin=10`;
}

export default function CreateSessionScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { classInfo } = route.params;

  const [sessionActive, setSessionActive] = useState(false);
  const [qrToken, setQrToken] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [elapsed, setElapsed] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [qrLoading, setQrLoading] = useState(false);
  const intervalRef = useRef(null);
  const countTickRef = useRef(null);
  const elapsedRef = useRef(null);

  const startSession = () => {
    const token = generateQRToken(classInfo.id);
    setSessionActive(true);
    setQrToken(token);
    setCountdown(5);
    setQrLoading(true);

    intervalRef.current = setInterval(() => {
      setQrToken(generateQRToken(classInfo.id));
      setCountdown(5);
      setQrLoading(true);
      setPresentCount(p => Math.min(p + Math.floor(Math.random() * 3), classInfo.students));
    }, 5000);

    countTickRef.current = setInterval(() => {
      setCountdown(c => (c <= 1 ? 5 : c - 1));
    }, 1000);

    elapsedRef.current = setInterval(() => {
      setElapsed(e => e + 1);
    }, 1000);
  };

  const endSession = () => {
    clearInterval(intervalRef.current);
    clearInterval(countTickRef.current);
    clearInterval(elapsedRef.current);
    navigation.navigate('LiveMonitor', {
      classInfo,
      presentCount,
      totalStudents: classInfo.students,
    });
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(countTickRef.current);
      clearInterval(elapsedRef.current);
    };
  }, []);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const attendanceRate = classInfo.students > 0 ? presentCount / classInfo.students : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {/* Class Info */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <Text variant="titleLarge" style={{ fontWeight: 'bold', color: '#1565C0' }}>{classInfo.subject}</Text>
          <Text variant="bodyMedium" style={{ color: '#666', marginTop: 4 }}>
            Lớp {classInfo.class} • {classInfo.room} • {classInfo.time}
          </Text>
          <Text variant="bodyMedium" style={{ color: '#666' }}>{classInfo.students} sinh viên</Text>
        </Card.Content>
      </Card>

      {!sessionActive ? (
        <View style={styles.startContainer}>
          <Text style={styles.startIcon}>📋</Text>
          <Text variant="bodyMedium" style={{ color: '#666', textAlign: 'center', marginBottom: 24 }}>
            Nhấn bắt đầu để tạo mã QR điểm danh cho sinh viên.{'\n'}Mã QR sẽ tự động thay đổi mỗi 5 giây.
          </Text>
          <Button
            mode="contained"
            icon="play-circle"
            onPress={startSession}
            style={styles.startBtn}
            contentStyle={{ paddingVertical: 10 }}
          >
            Bắt đầu điểm danh
          </Button>
        </View>
      ) : (
        <>
          {/* Timer */}
          <Surface style={styles.timerCard} elevation={1}>
            <Text variant="bodySmall" style={{ color: '#666' }}>Thời gian đã chạy</Text>
            <Text variant="headlineMedium" style={{ color: '#1565C0', fontWeight: 'bold' }}>
              {formatTime(elapsed)}
            </Text>
          </Surface>

          {/* QR Code Display */}
          <Card style={styles.qrCard}>
            <Card.Content style={{ alignItems: 'center' }}>
              <Text variant="titleMedium" style={{ marginBottom: 12 }}>Mã QR điểm danh</Text>
              <View style={styles.qrWrapper}>
                {qrLoading && (
                  <View style={styles.qrLoadingOverlay}>
                    <ActivityIndicator color="#1565C0" />
                  </View>
                )}
                <Image
                  source={{ uri: getQRImageUrl(qrToken) }}
                  style={styles.qrImage}
                  onLoad={() => setQrLoading(false)}
                  onError={() => setQrLoading(false)}
                />
              </View>
              <View style={styles.countdownRow}>
                <Text variant="bodySmall" style={{ color: '#666' }}>Mã mới sau: </Text>
                <Text variant="bodyMedium" style={{ color: '#C62828', fontWeight: 'bold' }}>{countdown}s</Text>
              </View>
              <ProgressBar
                progress={countdown / 5}
                color="#1565C0"
                style={{ width: 200, height: 4, borderRadius: 2, marginTop: 8 }}
              />
              <Text variant="bodySmall" style={{ color: '#999', marginTop: 8, textAlign: 'center' }}>
                {qrToken}
              </Text>
            </Card.Content>
          </Card>

          {/* Live Stats */}
          <Surface style={styles.statsCard} elevation={1}>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={{ color: '#2E7D32', fontWeight: 'bold' }}>{presentCount}</Text>
              <Text variant="bodySmall" style={{ color: '#666' }}>Có mặt</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={{ color: '#C62828', fontWeight: 'bold' }}>
                {classInfo.students - presentCount}
              </Text>
              <Text variant="bodySmall" style={{ color: '#666' }}>Chưa điểm danh</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={{ color: '#1565C0', fontWeight: 'bold' }}>
                {Math.round(attendanceRate * 100)}%
              </Text>
              <Text variant="bodySmall" style={{ color: '#666' }}>Tỉ lệ</Text>
            </View>
          </Surface>

          <ProgressBar
            progress={attendanceRate}
            color="#2E7D32"
            style={{ marginBottom: 16, height: 8, borderRadius: 4 }}
          />

          <Button
            mode="contained"
            icon="stop-circle"
            onPress={endSession}
            style={[styles.startBtn, { backgroundColor: '#C62828' }]}
            contentStyle={{ paddingVertical: 10 }}
          >
            Kết thúc & Chốt sổ
          </Button>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  infoCard: { borderRadius: 12, marginBottom: 16 },
  startContainer: { alignItems: 'center', marginTop: 32, paddingHorizontal: 16 },
  startIcon: { fontSize: 64, marginBottom: 16 },
  startBtn: { borderRadius: 10, width: '100%' },
  timerCard: { borderRadius: 10, padding: 16, alignItems: 'center', marginBottom: 16, backgroundColor: '#fff' },
  qrCard: { borderRadius: 12, marginBottom: 16 },
  qrWrapper: { width: 200, height: 200, justifyContent: 'center', alignItems: 'center' },
  qrImage: { width: 200, height: 200, borderRadius: 8 },
  qrLoadingOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E3F2FD', borderRadius: 8, zIndex: 1 },
  countdownRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  statsCard: { flexDirection: 'row', borderRadius: 10, padding: 16, marginBottom: 12, backgroundColor: '#fff' },
  statItem: { flex: 1, alignItems: 'center' },
  divider: { width: 1, backgroundColor: '#E0E0E0' },
});
