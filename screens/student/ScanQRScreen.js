import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Vibration,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { ROOM_LAT, ROOM_LON, MAX_DISTANCE_M, QR_TOKEN_PREFIX } from '../../constants/config';
import { CLASS_NAMES } from '../../constants/mockData';

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = d => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

export default function ScanQRScreen({ navigation }) {
  const { user } = useAuth();
  const { markAttendance } = useAppContext();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null); // 'success' | 'error'
  const [message, setMessage] = useState('');
  const scannedRef = useRef(false);

  // Animated pulse for scan frame
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  useEffect(() => {
    // Start pulse animation loop
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const handleBarCodeScanned = async ({ data }) => {
    if (scannedRef.current) return;
    scannedRef.current = true;
    setScanned(true);
    setProcessing(true);
    Vibration.vibrate(100);

    try {
      // 1. Kiểm tra GPS
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setResult('error');
        setMessage('Cần cấp quyền GPS để điểm danh');
        setProcessing(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const dist = haversineDistance(
        loc.coords.latitude, loc.coords.longitude,
        ROOM_LAT, ROOM_LON
      );

      // 2. Kiểm tra QR hợp lệ — token cố định dạng EDUCHECK-CLASS-{classId}
      if (!data.startsWith(QR_TOKEN_PREFIX)) {
        setResult('error');
        setMessage('Mã QR không hợp lệ hoặc không phải mã EduCheck');
        setProcessing(false);
        return;
      }

      const classId = data.replace(QR_TOKEN_PREFIX, '');
      const className = CLASS_NAMES[classId] || `Lớp ${classId}`;

      // 3. Kiểm tra khoảng cách
      if (dist > MAX_DISTANCE_M) {
        setResult('error');
        setMessage(`Bạn đang ở ngoài phạm vi phòng học (${Math.round(dist)}m)`);
        setProcessing(false);
        return;
      }

      // 4. Thành công
      markAttendance(classId, user.studentCode);
      setResult('success');
      setMessage(`Môn: ${className}\nThời gian: ${new Date().toLocaleTimeString('vi-VN')}`);
    } catch (e) {
      setResult('error');
      setMessage('Có lỗi xảy ra, vui lòng thử lại');
    }
    setProcessing(false);
  };

  const reset = () => {
    scannedRef.current = false;
    setScanned(false);
    setResult(null);
    setMessage('');
  };

  // --- Permission loading ---
  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1565C0" />
      </View>
    );
  }

  // --- Permission denied ---
  if (!permission.granted) {
    return (
      <LinearGradient
        colors={['#0D47A1', '#1565C0', '#1976D2']}
        style={styles.center}
      >
        <Text style={styles.permissionIcon}>📷</Text>
        <Text style={styles.permissionTitle}>Cần quyền Camera</Text>
        <Text style={styles.permissionSub}>
          Vui lòng cấp quyền truy cập camera để quét mã QR điểm danh
        </Text>
        <TouchableOpacity style={styles.grantBtn} onPress={requestPermission}>
          <Text style={styles.grantBtnText}>Cấp quyền</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  // --- Result screen ---
  if (result) {
    const isSuccess = result === 'success';
    return (
      <LinearGradient
        colors={isSuccess ? ['#1B5E20', '#2E7D32', '#388E3C'] : ['#7F0000', '#C62828', '#D32F2F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.resultScreen}
      >
        {/* Big icon */}
        <View style={styles.resultIconCircle}>
          <Text style={styles.resultIcon}>{isSuccess ? '✅' : '❌'}</Text>
        </View>

        <Text style={styles.resultTitle}>
          {isSuccess ? 'Điểm danh thành công!' : 'Điểm danh thất bại'}
        </Text>

        {isSuccess ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultCardLabel}>🎓 Sinh viên</Text>
            <Text style={styles.resultCardValue}>{user.name}</Text>
            <View style={styles.resultDivider} />
            {message.split('\n').map((line, i) => (
              <Text key={i} style={styles.resultCardValue}>{line}</Text>
            ))}
          </View>
        ) : (
          <View style={styles.resultCard}>
            <Text style={styles.resultErrorMsg}>{message}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.resultBtn}
          onPress={isSuccess ? () => navigation.navigate('HomeTab') : reset}
          activeOpacity={0.85}
        >
          <Text style={[styles.resultBtnText, { color: isSuccess ? '#2E7D32' : '#C62828' }]}>
            {isSuccess ? '🏠 Về trang chủ' : '🔄 Thử lại'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  // --- Camera / Scan screen ---
  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Top overlay */}
        <View style={styles.topOverlay}>
          <Text style={styles.overlayHint}>📷 Đưa mã QR vào khung để điểm danh</Text>
          <Text style={styles.overlayUser}>{user.name} • {user.studentCode}</Text>
        </View>

        {/* Middle: side overlays + scan frame */}
        <View style={styles.middleRow}>
          <View style={styles.sideOverlay} />
          <Animated.View style={[styles.scanFrame, { transform: [{ scale: pulseAnim }] }]}>
            {/* Corners */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            {processing && (
              <View style={styles.processingOverlay}>
                <ActivityIndicator size="large" color="#42A5F5" />
                <Text style={styles.processingText}>Đang xử lý...</Text>
              </View>
            )}
          </Animated.View>
          <View style={styles.sideOverlay} />
        </View>

        {/* Bottom overlay */}
        <View style={styles.bottomOverlay}>
          {/* Info card */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🎓 Sinh viên</Text>
              <Text style={styles.infoValue}>{user.name}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🪪 Mã SV</Text>
              <Text style={styles.infoValue}>{user.studentCode}</Text>
            </View>
          </View>

          {/* Cancel button - resets state (tab-based navigation) */}
          <TouchableOpacity style={styles.cancelBtn} onPress={reset} activeOpacity={0.8}>
            <Text style={styles.cancelBtnText}>✕ Hủy quét</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const FRAME = 240;
const CORNER = 28;
const BORDER = 4;

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },

  // Permission screen
  permissionIcon: { fontSize: 72, marginBottom: 16 },
  permissionTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  permissionSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: 28, lineHeight: 20 },
  grantBtn: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  grantBtnText: { color: '#1565C0', fontWeight: 'bold', fontSize: 15 },

  // Result screen
  resultScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  resultIconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultIcon: { fontSize: 60 },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 28,
  },
  resultCardLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 },
  resultCardValue: { color: '#fff', fontSize: 15, fontWeight: '600', marginBottom: 4 },
  resultDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 10 },
  resultErrorMsg: { color: '#fff', fontSize: 15, textAlign: 'center', lineHeight: 22 },
  resultBtn: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 36,
  },
  resultBtnText: { fontWeight: 'bold', fontSize: 15 },

  // Camera / scan screen
  overlay: { flex: 1 },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  overlayHint: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  overlayUser: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    textAlign: 'center',
  },
  middleRow: { flexDirection: 'row', height: FRAME },
  sideOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)' },
  scanFrame: {
    width: FRAME,
    height: FRAME,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  processingText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    width: '100%',
    maxWidth: 280,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  infoLabel: { color: '#4A5568', fontSize: 12, fontWeight: '600' },
  infoValue: { color: '#0A1628', fontSize: 13, fontWeight: '700' },
  infoDivider: { height: 1, backgroundColor: '#EEF2FF', marginVertical: 4 },
  cancelBtn: {
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  cancelBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  // Corners
  corner: { position: 'absolute', width: CORNER, height: CORNER },
  topLeft: { top: 0, left: 0, borderTopWidth: BORDER, borderLeftWidth: BORDER, borderColor: '#42A5F5', borderTopLeftRadius: 4 },
  topRight: { top: 0, right: 0, borderTopWidth: BORDER, borderRightWidth: BORDER, borderColor: '#42A5F5', borderTopRightRadius: 4 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: BORDER, borderLeftWidth: BORDER, borderColor: '#42A5F5', borderBottomLeftRadius: 4 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: BORDER, borderRightWidth: BORDER, borderColor: '#42A5F5', borderBottomRightRadius: 4 },
});
