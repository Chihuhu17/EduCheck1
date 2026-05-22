import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity,
  Platform, Modal, Alert, Image,
} from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useAuth } from '../../context/AuthContext';
import { LEAVE_SUBJECTS, LEAVE_REASONS } from '../../constants/mockData';

// Hàm format ngày → dd/mm/yyyy
function formatDate(date) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export default function LeaveRequestScreen({ navigation }) {
  const { user, submitLeave } = useAuth();

  const [subject, setSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);   // Date object
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  // Minh chứng
  const [attachments, setAttachments] = useState([]); // [{uri, name, type}]

  // ─── Date Picker ────────────────────────────────────────────────────────────
  const onDateChange = (event, date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      setErrors(e => ({ ...e, date: null }));
    }
  };

  const openDatePicker = () => setShowDatePicker(true);

  // ─── File / Ảnh Upload ───────────────────────────────────────────────────────
  const requestMediaPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  };

  const pickFromGallery = async () => {
    const granted = await requestMediaPermission();
    if (!granted) {
      Alert.alert('Quyền truy cập', 'Cần cấp quyền truy cập thư viện ảnh');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.IMAGE,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const newFiles = result.assets.map(a => ({
        uri: a.uri,
        name: a.fileName || `image_${Date.now()}.jpg`,
        type: 'image',
      }));
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập', 'Cần cấp quyền truy cập camera');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled) {
      setAttachments(prev => [...prev, {
        uri: result.assets[0].uri,
        name: `photo_${Date.now()}.jpg`,
        type: 'image',
      }]);
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      copyToCacheDirectory: true,
      multiple: true,
    });
    if (!result.canceled && result.assets) {
      const newFiles = result.assets.map(a => ({
        uri: a.uri,
        name: a.name,
        type: 'document',
      }));
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (idx) => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  const showAttachmentOptions = () => {
    Alert.alert('Thêm minh chứng', 'Chọn nguồn tệp', [
      { text: '📷 Chụp ảnh', onPress: pickFromCamera },
      { text: '🖼️ Thư viện ảnh', onPress: pickFromGallery },
      { text: '📄 Chọn file (PDF/Word)', onPress: pickDocument },
      { text: 'Hủy', style: 'cancel' },
    ]);
  };

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    const finalReason = reason === 'Lý do khác' ? customReason.trim() : reason;
    const newErrors = {};

    if (!subject) newErrors.subject = 'Vui lòng chọn môn học';
    if (!selectedDate) newErrors.date = 'Vui lòng chọn ngày nghỉ';
    if (!reason) newErrors.reason = 'Vui lòng chọn lý do';
    if (reason === 'Lý do khác' && !finalReason) newErrors.reason = 'Vui lòng mô tả lý do';

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setErrors({});
    submitLeave({
      name: user.name,
      code: user.studentCode,
      subject,
      date: formatDate(selectedDate),
      reason: finalReason,
    });
    setSubmitted(true);
  };

  // ─── Success Screen ───────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successCard}>
          <Text style={styles.successIcon}>📨</Text>
          <Text style={styles.successTitle}>Đã gửi đơn xin nghỉ</Text>
          <Text style={styles.successSub}>Đơn của bạn đang chờ giảng viên phê duyệt</Text>
          <View style={styles.successInfo}>
            <InfoRow label="Môn học" value={subject} />
            <InfoRow label="Ngày nghỉ" value={formatDate(selectedDate)} />
            <InfoRow label="Lý do" value={reason === 'Lý do khác' ? customReason : reason} />
            {attachments.length > 0 && (
              <InfoRow label="Minh chứng" value={`${attachments.length} tệp đã đính kèm`} />
            )}
          </View>
          <Button mode="contained" onPress={() => navigation.goBack()} style={styles.backBtn} buttonColor="#1565C0">
            Về trang chủ
          </Button>
        </View>
      </View>
    );
  }

  // ─── Main Form ────────────────────────────────────────────────────────────────
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>

      {/* Môn học */}
      <Text style={styles.sectionLabel}>Chọn môn học *</Text>
      <View style={styles.subjectGrid}>
        {LEAVE_SUBJECTS.map(s => (
          <TouchableOpacity
            key={s.name}
            style={[styles.subjectCard, subject === s.name && styles.subjectCardActive, errors.subject && !subject && styles.subjectCardError]}
            onPress={() => { setSubject(s.name); setErrors(e => ({ ...e, subject: null })); }}
          >
            <Text style={styles.subjectIcon}>{s.icon}</Text>
            <Text style={[styles.subjectName, subject === s.name && { color: '#fff' }]}>{s.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.subject && <Text style={styles.errorText}>⚠️ {errors.subject}</Text>}

      {/* Ngày nghỉ — Date Picker */}
      <Text style={styles.sectionLabel}>Ngày nghỉ *</Text>
      <TouchableOpacity
        style={[styles.datePicker, errors.date && styles.datePickerError]}
        onPress={openDatePicker}
        activeOpacity={0.75}
      >
        <Text style={styles.datePickerIcon}>📅</Text>
        <Text style={[styles.datePickerText, !selectedDate && styles.datePlaceholder]}>
          {selectedDate ? formatDate(selectedDate) : 'Chọn ngày nghỉ'}
        </Text>
        <Text style={styles.datePickerArrow}>›</Text>
      </TouchableOpacity>
      {errors.date && <Text style={styles.errorText}>⚠️ {errors.date}</Text>}

      {/* iOS: modal bọc picker */}
      {Platform.OS === 'ios' && showDatePicker && (
        <Modal transparent animationType="slide">
          <View style={styles.iosModalOverlay}>
            <View style={styles.iosModalCard}>
              <View style={styles.iosModalHeader}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={{ color: '#888', fontWeight: '600' }}>Hủy</Text>
                </TouchableOpacity>
                <Text style={{ fontWeight: 'bold', color: '#1565C0' }}>Chọn ngày nghỉ</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={{ color: '#1565C0', fontWeight: '700' }}>Xong</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="date"
                display="spinner"
                minimumDate={new Date()}
                onChange={onDateChange}
                locale="vi-VN"
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Android: hiển thị trực tiếp */}
      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="calendar"
          minimumDate={new Date()}
          onChange={onDateChange}
        />
      )}

      {/* Web fallback: input date */}
      {Platform.OS === 'web' && showDatePicker && (
        <View style={styles.webDateBox}>
          <Text style={styles.sectionLabel}>Chọn ngày:</Text>
          <TextInput
            mode="outlined"
            placeholder="dd/mm/yyyy"
            keyboardType="numeric"
            maxLength={10}
            style={[styles.input, { marginBottom: 0 }]}
            onChangeText={text => {
              // parse dd/mm/yyyy
              const parts = text.split('/');
              if (parts.length === 3) {
                const [d, m, y] = parts.map(Number);
                const parsed = new Date(y, m - 1, d);
                if (!isNaN(parsed)) {
                  setSelectedDate(parsed);
                  setErrors(e => ({ ...e, date: null }));
                  setShowDatePicker(false);
                }
              }
            }}
            outlineColor={errors.date ? '#C62828' : '#1565C0'}
            activeOutlineColor="#1565C0"
          />
        </View>
      )}

      {/* Lý do */}
      <Text style={styles.sectionLabel}>Lý do *</Text>
      <View style={styles.reasonRow}>
        {LEAVE_REASONS.map(r => (
          <TouchableOpacity
            key={r}
            style={[styles.reasonChip, reason === r && styles.reasonChipActive, errors.reason && !reason && styles.reasonChipError]}
            onPress={() => { setReason(r); setErrors(e => ({ ...e, reason: null })); }}
          >
            <Text style={[styles.reasonText, reason === r && { color: '#fff' }]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.reason && <Text style={styles.errorText}>⚠️ {errors.reason}</Text>}

      {reason === 'Lý do khác' && (
        <TextInput
          label="Mô tả lý do *"
          value={customReason}
          onChangeText={t => { setCustomReason(t); setErrors(e => ({ ...e, reason: null })); }}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
          outlineColor={errors.reason ? '#C62828' : '#E0E0E0'}
          activeOutlineColor="#1565C0"
        />
      )}

      {/* Minh chứng */}
      <Text style={styles.sectionLabel}>Minh chứng (tùy chọn)</Text>

      {/* Preview các tệp đã chọn */}
      {attachments.length > 0 && (
        <View style={styles.attachmentList}>
          {attachments.map((file, idx) => (
            <View key={idx} style={styles.attachmentItem}>
              {file.type === 'image' ? (
                <Image source={{ uri: file.uri }} style={styles.attachThumb} />
              ) : (
                <View style={styles.attachDocIcon}>
                  <Text style={{ fontSize: 26 }}>📄</Text>
                </View>
              )}
              <Text style={styles.attachName} numberOfLines={1}>{file.name}</Text>
              <TouchableOpacity onPress={() => removeAttachment(idx)} style={styles.attachRemove}>
                <Text style={{ color: '#C62828', fontWeight: 'bold', fontSize: 16 }}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Nút thêm minh chứng */}
      <TouchableOpacity style={styles.uploadBox} onPress={showAttachmentOptions}>
        <Text style={{ fontSize: 32 }}>📎</Text>
        <Text style={styles.uploadText}>
          {attachments.length === 0 ? 'Chụp ảnh hoặc tải file' : 'Thêm minh chứng khác'}
        </Text>
        <Text style={styles.uploadSub}>Giấy khám bệnh, giấy phép... (PDF, ảnh, Word)</Text>
      </TouchableOpacity>

      <HelperText type="error" visible={false} />

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitBtn}
        contentStyle={{ paddingVertical: 8 }}
        icon="send"
        buttonColor="#1565C0"
      >
        Gửi đơn xin nghỉ
      </Button>
    </ScrollView>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 6 }}>
      <Text style={{ color: '#888', width: 90, fontSize: 13 }}>{label}:</Text>
      <Text style={{ flex: 1, fontWeight: '600', fontSize: 13 }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  sectionLabel: { fontWeight: 'bold', color: '#333', marginBottom: 10, marginTop: 16, fontSize: 14 },

  // Môn học
  subjectGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  subjectCard: { width: '47%', backgroundColor: '#fff', borderRadius: 12, padding: 14, alignItems: 'center', elevation: 2, borderWidth: 2, borderColor: 'transparent' },
  subjectCardActive: { backgroundColor: '#1565C0', borderColor: '#0D47A1' },
  subjectCardError: { borderColor: '#C62828' },
  subjectIcon: { fontSize: 28, marginBottom: 6 },
  subjectName: { fontSize: 12, fontWeight: '600', color: '#333', textAlign: 'center' },

  // Date Picker
  datePicker: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 12,
    borderWidth: 1.5, borderColor: '#E0E0E0',
    paddingHorizontal: 16, paddingVertical: 14,
    elevation: 1,
  },
  datePickerError: { borderColor: '#C62828' },
  datePickerIcon: { fontSize: 20, marginRight: 12 },
  datePickerText: { flex: 1, fontSize: 15, color: '#333', fontWeight: '500' },
  datePlaceholder: { color: '#aaa', fontWeight: '400' },
  datePickerArrow: { fontSize: 20, color: '#1565C0', fontWeight: 'bold' },

  // iOS Modal
  iosModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  iosModalCard: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 32 },
  iosModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },

  // Web fallback
  webDateBox: { backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1.5, borderColor: '#1565C0' },
  input: { backgroundColor: '#fff', marginBottom: 4 },

  // Lý do
  reasonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  reasonChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E0E0E0' },
  reasonChipActive: { backgroundColor: '#1565C0', borderColor: '#1565C0' },
  reasonChipError: { borderColor: '#C62828' },
  reasonText: { fontSize: 13, color: '#555', fontWeight: '500' },

  // Attachments
  attachmentList: { marginTop: 4, marginBottom: 8, gap: 8 },
  attachmentItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 8, elevation: 1 },
  attachThumb: { width: 48, height: 48, borderRadius: 8, marginRight: 10 },
  attachDocIcon: { width: 48, height: 48, borderRadius: 8, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  attachName: { flex: 1, fontSize: 13, color: '#333', fontWeight: '500' },
  attachRemove: { padding: 6 },

  // Upload box
  uploadBox: { backgroundColor: '#fff', borderRadius: 14, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: '#E0E0E0', borderStyle: 'dashed', marginTop: 4 },
  uploadText: { fontWeight: '600', color: '#555', marginTop: 8 },
  uploadSub: { color: '#aaa', fontSize: 12, marginTop: 4, textAlign: 'center' },

  // Error
  errorText: { color: '#C62828', fontSize: 12, marginTop: 4, marginBottom: 4 },

  // Submit
  submitBtn: { borderRadius: 12, marginTop: 8, marginBottom: 32 },

  // Success
  successContainer: { flex: 1, backgroundColor: '#F0F4FF', justifyContent: 'center', padding: 24 },
  successCard: { backgroundColor: '#fff', borderRadius: 20, padding: 28, alignItems: 'center', elevation: 4 },
  successIcon: { fontSize: 64 },
  successTitle: { fontSize: 20, fontWeight: 'bold', color: '#1565C0', marginTop: 16 },
  successSub: { color: '#888', marginTop: 8, textAlign: 'center', marginBottom: 20 },
  successInfo: { width: '100%', backgroundColor: '#F5F5F5', borderRadius: 12, padding: 16, marginBottom: 20 },
  backBtn: { borderRadius: 10, width: '100%' },
});
