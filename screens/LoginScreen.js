import React, { useState } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Surface, HelperText } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

// Mock users for demo
const MOCK_USERS = [
  { id: '1', studentCode: '522CNT1006', name: 'Trần Quang Bắc', role: 'student', password: '123456' },
  { id: '2', studentCode: '522CNT1001', name: 'Nguyễn Đức Anh', role: 'student', password: '123456' },
  { id: '3', studentCode: 'GV001', name: 'Dư Đình Viên', role: 'teacher', password: '123456' },
  { id: '4', studentCode: 'ADMIN', name: 'Quản trị viên', role: 'admin', password: '123456' },
];

export default function LoginScreen() {
  const { login } = useAuth();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    setError('');
    if (!code || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const found = MOCK_USERS.find(
        u => u.studentCode === code && u.password === password
      );
      if (found) {
        login(found);
      } else {
        setError('Mã sinh viên hoặc mật khẩu không đúng');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Image source={require('../assets/icon.png')} style={styles.logo} />
        <Text variant="headlineMedium" style={styles.title}>EduCheck</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Hệ thống điểm danh thông minh</Text>

        <Surface style={styles.card} elevation={2}>
          <TextInput
            label="Mã sinh viên / Giảng viên"
            value={code}
            onChangeText={setCode}
            mode="outlined"
            autoCapitalize="characters"
            style={styles.input}
          />
          <TextInput
            label="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPass}
            right={<TextInput.Icon icon={showPass ? 'eye-off' : 'eye'} onPress={() => setShowPass(!showPass)} />}
            style={styles.input}
          />
          <HelperText type="error" visible={!!error}>{error}</HelperText>
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            style={styles.btn}
            contentStyle={{ paddingVertical: 6 }}
          >
            Đăng nhập
          </Button>
        </Surface>

        <Text variant="bodySmall" style={styles.hint}>
          Demo: 522CNT1006 / 123456 (SV) | GV001 / 123456 (GV) | ADMIN / 123456
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#1565C0' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  logo: { width: 80, height: 80, borderRadius: 16, marginBottom: 12 },
  title: { color: '#fff', fontWeight: 'bold' },
  subtitle: { color: '#BBDEFB', marginBottom: 32 },
  card: { width: '100%', padding: 20, borderRadius: 12, backgroundColor: '#fff' },
  input: { marginBottom: 12 },
  btn: { marginTop: 4, borderRadius: 8 },
  hint: { color: '#BBDEFB', marginTop: 24, textAlign: 'center' },
});
