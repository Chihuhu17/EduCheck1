import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Vibration } from 'react-native';
import { Text, Button, Surface, ActivityIndicator } from 'react-native-paper';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { useAuth } from '../../context/AuthContext';

// Mock: tọa độ phòng học (Đại học Hòa Bình)
const ROOM_LAT = 21.0285;
const ROOM_LON = 105.8542;
const MAX_DISTANCE_M = 500; // nới rộng cho demo

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
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null); // 'success' | 'error'
  const [message, setMessage] = useState('');
  const scannedRef = useRef(false);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

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

      // 2. Kiểm tra QR hợp lệ (mock: QR phải chứa "EDUCHECK-")
      if (!data.startsWith('EDUCHECK-')) {
        setResult('error');
        setMessage('Mã QR không hợp lệ hoặc đã hết hạn');
        setProcessing(false);
        return;
      }

      // 3. Kiểm tra khoảng cách
      if (dist > MAX_DISTANCE_M) {
        setResult('error');
        setMessage(`Bạn đang ở ngoài phạm vi phòng học (${Math.round(dist)}m)`);
        setProcessing(false);
        return;
      }

      // 4. Thành công
      setResult('success');
      setMessage(`Điểm danh thành công!\nMôn: Lập trình Mobile\nThời gian: ${new Date().toLocaleTimeString('vi-VN')}`);
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

  if (!permission) return <View style={styles.center}><ActivityIndicator /></View>;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 16, textAlign: 'center' }}>Cần quyền truy cập camera</Text>
        <Button mode="contained" onPress={requestPermission}>Cấp quyền</Button>
      </View>
    );
  }

  if (result) {
    return (
      <View style={[styles.center, { backgroundColor: result === 'success' ? '#E8F5E9' : '#FFEBEE' }]}>
        <Text style={{ fontSize: 64 }}>{result === 'success' ? '✅' : '❌'}</Text>
        <Text variant="titleLarge" style={{ marginTop: 16, color: result === 'success' ? '#2E7D32' : '#C62828', textAlign: 'center' }}>
          {result === 'success' ? 'Điểm danh thành công' : 'Điểm danh thất bại'}
        </Text>
        <Text variant="bodyMedium" style={{ marginTop: 8, textAlign: 'center', color: '#555' }}>{message}</Text>
        <Button mode="contained" onPress={result === 'success' ? () => navigation.goBack() : reset} style={{ marginTop: 24 }}>
          {result === 'success' ? 'Về trang chủ' : 'Thử lại'}
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        <View style={styles.topOverlay}>
          <Text style={styles.overlayText}>Đưa mã QR vào khung để điểm danh</Text>
        </View>
        <View style={styles.middleRow}>
          <View style={styles.sideOverlay} />
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            {processing && <ActivityIndicator size="large" color="#fff" style={{ flex: 1 }} />}
          </View>
          <View style={styles.sideOverlay} />
        </View>
        <View style={styles.bottomOverlay}>
          <Surface style={styles.infoCard} elevation={2}>
            <Text variant="bodySmall" style={{ color: '#666' }}>Sinh viên: {user.name}</Text>
            <Text variant="bodySmall" style={{ color: '#666' }}>Mã SV: {user.studentCode}</Text>
          </Surface>
          <Button mode="outlined" onPress={() => navigation.goBack()} style={{ marginTop: 12 }} textColor="#fff">
            Hủy
          </Button>
        </View>
      </View>
    </View>
  );
}

const FRAME = 240;
const CORNER = 24;
const BORDER = 4;

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  overlay: { flex: 1 },
  topOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 16 },
  overlayText: { color: '#fff', fontSize: 14 },
  middleRow: { flexDirection: 'row', height: FRAME },
  sideOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  scanFrame: { width: FRAME, height: FRAME },
  bottomOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', paddingTop: 24 },
  infoCard: { padding: 12, borderRadius: 8, backgroundColor: '#fff', width: 220, alignItems: 'center' },
  corner: { position: 'absolute', width: CORNER, height: CORNER },
  topLeft: { top: 0, left: 0, borderTopWidth: BORDER, borderLeftWidth: BORDER, borderColor: '#4FC3F7' },
  topRight: { top: 0, right: 0, borderTopWidth: BORDER, borderRightWidth: BORDER, borderColor: '#4FC3F7' },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: BORDER, borderLeftWidth: BORDER, borderColor: '#4FC3F7' },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: BORDER, borderRightWidth: BORDER, borderColor: '#4FC3F7' },
});
