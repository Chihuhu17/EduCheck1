import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Text, ActivityIndicator, ProgressBar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { QR_TOKEN_PREFIX } from '../../constants/config';
import { useAppContext } from '../../context/AppContext';

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

  const { startSession: contextStartSession, endSession: contextEndSession, activeSession } = useAppContext();

  const [sessionActive, setSessionActive] = useState(false);
  const [qrToken, setQrToken] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [qrLoading, setQrLoading] = useState(false);
  const elapsedRef = useRef(null);

  // Số lượng sinh viên có mặt hiện tại dựa vào Global State
  const presentCount = activeSession 
    ? activeSession.students.filter(s => s.status === 'present').length 
    : 0;

  const startSession = () => {
    const token = getStaticQRToken(classInfo.id);
    
    // Khởi tạo phiên trong Global State
    contextStartSession(classInfo);

    setSessionActive(true);
    setQrToken(token);
    setQrLoading(true);

    elapsedRef.current = setInterval(() => {
      setElapsed(e => e + 1);
    }, 1000); // Tăng từng giây thực tế
  };

  const endSession = () => {
    clearInterval(elapsedRef.current);
    // Kết thúc phiên trong Global State
    contextEndSession();
    // Quay về màn hình chủ
    navigation.goBack();
  };

  useEffect(() => {
    return () => { clearInterval(elapsedRef.current); };
  }, []);

  const formatTime = s =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const attendanceRate =
    classInfo.students > 0 ? presentCount / classInfo.students : 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Class info card (LinearGradient) ── */}
      <LinearGradient
        colors={['#0D47A1', '#1565C0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.infoCard}
      >
        <View style={styles.infoCardBadge}>
          <MaterialCommunityIcons name="school" size={14} color="#90CAF9" />
          <Text style={styles.infoCardBadgeText}>Buổi học hôm nay</Text>
        </View>
        <Text style={styles.infoSubject}>{classInfo.subject}</Text>
        <View style={styles.infoDetailRow}>
          <MaterialCommunityIcons name="door" size={14} color="#BBDEFB" />
          <Text style={styles.infoDetail}>{classInfo.room}</Text>
          <MaterialCommunityIcons name="clock-outline" size={14} color="#BBDEFB" style={{ marginLeft: 10 }} />
          <Text style={styles.infoDetail}>{classInfo.time}</Text>
        </View>
        <View style={styles.infoDetailRow}>
          <MaterialCommunityIcons name="tag" size={14} color="#90CAF9" />
          <Text style={styles.infoDetailAlt}>Lớp {classInfo.class}</Text>
          <MaterialCommunityIcons name="account-group" size={14} color="#90CAF9" style={{ marginLeft: 10 }} />
          <Text style={styles.infoDetailAlt}>{classInfo.students} sinh viên</Text>
        </View>
      </LinearGradient>

      {!sessionActive ? (
        /* ── Pre-session state ── */
        <View style={styles.startContainer}>
          <View style={styles.startIconCircle}>
            <Text style={{ fontSize: 52 }}>📋</Text>
          </View>
          <Text style={styles.startTitle}>Sẵn sàng điểm danh</Text>
          <Text style={styles.startSub}>
            Mã QR cố định theo lớp học.{'\n'}Sinh viên quét mã này để điểm danh.
          </Text>
          <TouchableOpacity
            style={styles.startBtnWrapper}
            onPress={startSession}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#1565C0', '#1976D2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startBtnGradient}
            >
              <MaterialCommunityIcons name="play-circle" size={20} color="#fff" />
              <Text style={styles.startBtnText}>Bắt đầu điểm danh</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* ── Timer row ── */}
          <View style={styles.timerRow}>
            <View style={styles.timerBox}>
              <Text style={styles.timerLabel}>⏱ Thời gian</Text>
              <Text style={styles.timerValue}>{formatTime(elapsed)}</Text>
            </View>
            <View style={styles.timerBox}>
              <Text style={styles.timerLabel}>👥 Có mặt</Text>
              <Text style={[styles.timerValue, { color: '#2E7D32' }]}>
                {presentCount}/{classInfo.students}
              </Text>
            </View>
            <View style={styles.timerBox}>
              <Text style={styles.timerLabel}>📊 Tỉ lệ</Text>
              <Text style={[styles.timerValue, { color: '#1565C0' }]}>
                {Math.round(attendanceRate * 100)}%
              </Text>
            </View>
          </View>

          {/* ── Progress bar ── */}
          <ProgressBar
            progress={attendanceRate}
            color="#1565C0"
            style={styles.progressBar}
          />

          {/* ── QR Card ── */}
          <View style={styles.qrCard}>
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
              <MaterialCommunityIcons name="lock" size={13} color="#1565C0" />
              <Text style={styles.qrBadgeText}>Mã cố định theo lớp</Text>
            </View>

            <Text style={styles.tokenText}>{qrToken}</Text>
          </View>

          {/* ── Action buttons ── */}
          <View style={{ flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginTop: 10 }}>
            {/* View live monitor button */}
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => navigation.navigate('LiveMonitor', { classInfo })}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#1565C0', '#1976D2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.endBtnGradient}
              >
                <MaterialCommunityIcons name="format-list-bulleted" size={18} color="#fff" />
                <Text style={styles.endBtnText}>Xem danh sách</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* End session button */}
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={endSession}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#C62828', '#E53935']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.endBtnGradient}
              >
                <MaterialCommunityIcons name="stop-circle" size={18} color="#fff" />
                <Text style={styles.endBtnText}>Kết thúc phiên</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EEF2FF' },

  // Class info card
  infoCard: {
    borderRadius: 20,
    padding: 20,
    margin: 16,
  },
  infoCardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 8,
  },
  infoCardBadgeText: { color: '#90CAF9', fontSize: 12 },
  infoSubject: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
  infoDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  infoDetail: { color: '#BBDEFB', fontSize: 14 },
  infoDetailAlt: { color: '#90CAF9', fontSize: 13 },

  // Pre-session
  startContainer: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 16 },
  startIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#1565C0',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  startTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A1628',
    marginBottom: 10,
  },
  startSub: {
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    fontSize: 14,
  },
  startBtnWrapper: { borderRadius: 14, overflow: 'hidden', width: '100%' },
  startBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15,
    borderRadius: 14,
  },
  startBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // Active session
  timerRow: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginBottom: 12 },
  timerBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#1565C0',
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  timerLabel: { color: '#94A3B8', fontSize: 11, marginBottom: 4 },
  timerValue: { fontSize: 20, fontWeight: 'bold', color: '#0A1628' },

  progressBar: { height: 8, borderRadius: 4, marginHorizontal: 16, marginBottom: 16 },

  qrCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#1565C0',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  qrTitle: { fontSize: 16, fontWeight: 'bold', color: '#0A1628', marginBottom: 4 },
  qrSub: { color: '#94A3B8', fontSize: 12, marginBottom: 16 },
  qrWrapper: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  qrImage: { width: 220, height: 220 },
  qrOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    zIndex: 1,
  },
  qrBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 14,
  },
  qrBadgeText: { color: '#1565C0', fontSize: 12, fontWeight: '600' },
  tokenText: { color: '#CBD5E1', fontSize: 10, marginTop: 8, textAlign: 'center' },

  endBtnWrapper: { marginHorizontal: 16, borderRadius: 14, overflow: 'hidden' },
  endBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15,
    borderRadius: 14,
  },
  endBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
