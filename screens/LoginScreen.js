import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput as RNTextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Text, HelperText } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { MOCK_USERS, DEMO_ACCOUNTS } from '../constants/mockData';

export default function LoginScreen() {
  const { login } = useAuth();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    setError('');
    if (!code || !password) { setError('Vui lòng nhập đầy đủ thông tin'); return; }
    setLoading(true);
    setTimeout(() => {
      const found = MOCK_USERS.find(u => u.studentCode === code && u.password === password);
      if (found) { login(found); } else { setError('Mã đăng nhập hoặc mật khẩu không đúng'); }
      setLoading(false);
    }, 800);
  };

  const quickLogin = (acc) => { setCode(acc.code); setPassword(acc.pass); };

  return (
    <LinearGradient
      colors={['#0A2463', '#1565C0', '#1976D2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBg}
    >
      {/* Decorative circles */}
      <View style={styles.circleTopRight} />
      <View style={styles.circleBottomLeft} />

      <KeyboardAvoidingView
        style={styles.kavWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Box */}
          <View style={styles.logoBox}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>📚</Text>
            </View>
            <Text style={styles.appName}>EduCheck</Text>
            <Text style={styles.appSub}>Hệ thống điểm danh thông minh</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Đăng nhập</Text>

            {/* Mã SV / GV input */}
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>👤</Text>
              <RNTextInput
                value={code}
                onChangeText={t => { setCode(t); setError(''); }}
                autoCapitalize="characters"
                style={styles.inputField}
                placeholder="Mã sinh viên / Giảng viên"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Password input */}
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>🔒</Text>
              <RNTextInput
                value={password}
                onChangeText={t => { setPassword(t); setError(''); }}
                secureTextEntry={!showPass}
                style={[styles.inputField, { flex: 1 }]}
                placeholder="Mật khẩu"
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                <Text style={{ fontSize: 18 }}>{showPass ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            <HelperText type="error" visible={!!error} style={styles.helperText}>
              {error}
            </HelperText>

            {/* Login button */}
            <TouchableOpacity onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
              <LinearGradient
                colors={['#0D47A1', '#1976D2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginGradientBtn}
              >
                <Text style={styles.loginBtnText}>
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Forgot password */}
            <TouchableOpacity
              onPress={() => Alert.alert('Quên mật khẩu', 'Vui lòng liên hệ quản trị viên để được hỗ trợ.')}
              style={styles.forgotBtn}
            >
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          {/* Demo accounts */}
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Đăng nhập nhanh (demo)</Text>
            <View style={styles.demoRow}>
              {DEMO_ACCOUNTS.map(acc => (
                <TouchableOpacity
                  key={acc.code}
                  style={styles.demoBtn}
                  onPress={() => quickLogin(acc)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.demoIcon}>{acc.icon}</Text>
                  <Text style={styles.demoLabel}>{acc.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  circleTopRight: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  circleBottomLeft: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  kavWrapper: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  logoBox: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 28,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  logoEmoji: {
    fontSize: 64,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  appSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 6,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D47A1',
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#F8FAFF',
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  inputField: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0A1628',
  },
  eyeBtn: {
    padding: 6,
  },
  helperText: {
    marginBottom: 4,
    fontSize: 12,
  },
  loginGradientBtn: {
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  loginBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotText: {
    color: '#1565C0',
    fontSize: 12,
  },
  demoBox: {
    marginTop: 28,
    alignItems: 'center',
  },
  demoTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginBottom: 12,
  },
  demoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  demoBtn: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 12,
    width: 90,
  },
  demoIcon: {
    fontSize: 24,
  },
  demoLabel: {
    fontSize: 11,
    color: '#fff',
    marginTop: 6,
    fontWeight: '600',
  },
});
