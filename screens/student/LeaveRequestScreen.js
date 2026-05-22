import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, TextInput, Button, Card, Chip, HelperText } from 'react-native-paper';

const SUBJECTS = ['Lập trình Mobile', 'Cơ sở dữ liệu', 'Mạng máy tính', 'Toán rời rạc'];

export default function LeaveRequestScreen({ navigation }) {
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!subject || !date || !reason) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 56 }}>📨</Text>
        <Text variant="titleLarge" style={{ marginTop: 16, color: '#1565C0' }}>Đã gửi đơn xin nghỉ</Text>
        <Text variant="bodyMedium" style={{ color: '#666', marginTop: 8, textAlign: 'center' }}>
          Đơn của bạn đang chờ giảng viên phê duyệt
        </Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={{ marginTop: 24 }}>
          Về trang chủ
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text variant="titleMedium" style={styles.sectionTitle}>Chọn môn học</Text>
      <View style={styles.chipRow}>
        {SUBJECTS.map(s => (
          <Chip
            key={s}
            selected={subject === s}
            onPress={() => setSubject(s)}
            style={styles.chip}
          >
            {s}
          </Chip>
        ))}
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Ngày nghỉ (dd/mm/yyyy)"
            value={date}
            onChangeText={setDate}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            label="Lý do xin nghỉ"
            value={reason}
            onChangeText={setReason}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
          />
          <HelperText type="error" visible={!!error}>{error}</HelperText>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleSmall" style={{ marginBottom: 8 }}>Minh chứng (tùy chọn)</Text>
          <Button mode="outlined" icon="camera" onPress={() => {}}>
            Chụp ảnh minh chứng
          </Button>
          <Text variant="bodySmall" style={{ color: '#999', marginTop: 8 }}>
            Ví dụ: giấy khám bệnh, giấy phép của gia đình...
          </Text>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitBtn}
        contentStyle={{ paddingVertical: 6 }}
        icon="send"
      >
        Gửi đơn xin nghỉ
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { marginBottom: 4 },
  card: { borderRadius: 12, marginBottom: 16 },
  input: { marginBottom: 12 },
  submitBtn: { borderRadius: 8, marginBottom: 32 },
});
