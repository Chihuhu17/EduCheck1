import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Avatar, Card, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher';
  const isAdmin   = user?.role === 'admin';

  const roleLabel = isStudent ? 'Sinh viên' : isTeacher ? 'Giảng viên' : 'Quản trị viên';
  const roleIcon  = isStudent ? 'school' : isTeacher ? 'human-male-board' : 'shield-account';
  const initials  = user?.name?.split(' ').slice(-1)[0]?.charAt(0) ?? 'U';

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  };

  const handleChangePass = () => {
    Alert.alert('Đổi mật khẩu', 'Chức năng này sẽ được tích hợp với backend.\nVui lòng liên hệ quản trị viên để đổi mật khẩu.');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#0D47A1', '#1565C0', '#1976D2']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.avatarWrap}>
          <Avatar.Text
            size={80}
            label={initials}
            style={styles.avatar}
            labelStyle={{ fontSize: 32, fontWeight: 'bold' }}
          />
          <View style={styles.roleBadge}>
            <MaterialCommunityIcons name={roleIcon} size={14} color="#1565C0" />
          </View>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.code}>{user?.studentCode}</Text>
        <View style={styles.roleChip}>
          <Text style={styles.roleChipText}>{roleLabel}</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.body}>

        {/* Thông tin cá nhân */}
        <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>
        <Card style={styles.infoCard}>
          <Card.Content style={{ gap: 12 }}>
            <InfoRow icon="account" label="Họ và tên"  value={user?.name} />
            <View style={styles.hr} />
            <InfoRow icon="card-account-details" label="Mã số" value={user?.studentCode} />
            {isStudent && <><View style={styles.hr} /><InfoRow icon="google-classroom" label="Lớp" value={user?.class} /></>}
            <View style={styles.hr} />
            <InfoRow icon="shield-account" label="Vai trò" value={roleLabel} />
          </Card.Content>
        </Card>

        {/* Bảo mật */}
        <Text style={styles.sectionTitle}>Bảo mật</Text>
        <Card style={styles.infoCard}>
          <TouchableOpacity style={styles.actionRow} onPress={handleChangePass}>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name="lock-reset" size={22} color="#1565C0" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionLabel}>Đổi mật khẩu</Text>
              <Text style={styles.actionSub}>Thay đổi mật khẩu đăng nhập</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#CBD5E1" />
          </TouchableOpacity>
        </Card>

        {/* Ứng dụng */}
        <Text style={styles.sectionTitle}>Ứng dụng</Text>
        <Card style={styles.infoCard}>
          <Card.Content style={styles.appInfoBox}>
            <View style={styles.appLogoWrap}>
              <Text style={{ fontSize: 32 }}>📚</Text>
            </View>
            <View>
              <Text style={styles.appName}>EduCheck</Text>
              <Text style={styles.appVer}>Phiên bản 1.0.0  •  Hệ thống điểm danh thông minh</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color="#C62828" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        <Text style={styles.copyright}>© 2026 EduCheck – Đại học Hòa Bình</Text>
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <MaterialCommunityIcons name={icon} size={20} color="#1565C0" style={{ width: 28 }} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value ?? '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#EEF2FF' },
  header:       { paddingTop: 52, paddingBottom: 32, alignItems: 'center', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  avatarWrap:   { position: 'relative', marginBottom: 12 },
  avatar:       { backgroundColor: 'rgba(255,255,255,0.2)' },
  roleBadge:    { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#fff', borderRadius: 12, padding: 4 },
  name:         { color: '#fff', fontWeight: 'bold', fontSize: 20 },
  code:         { color: 'rgba(255,255,255,0.75)', fontSize: 14, marginTop: 4 },
  roleChip:     { marginTop: 10, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  roleChipText: { color: '#fff', fontWeight: '600', fontSize: 13 },

  body:         { padding: 16, paddingBottom: 40 },
  sectionTitle: { fontWeight: 'bold', color: '#4A5568', fontSize: 12, letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 20, marginBottom: 10, marginLeft: 4 },

  infoCard:     { borderRadius: 16, elevation: 3, shadowColor: '#1565C0', shadowOpacity: 0.08, shadowRadius: 8, marginBottom: 4 },
  hr:           { height: 1, backgroundColor: '#F1F5F9' },
  infoRow:      { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoLabel:    { color: '#94A3B8', fontSize: 13, flex: 1 },
  infoValue:    { color: '#0A1628', fontWeight: '600', fontSize: 13 },

  actionRow:    { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  actionIcon:   { width: 40, height: 40, borderRadius: 12, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  actionLabel:  { fontWeight: '600', color: '#0A1628', fontSize: 14 },
  actionSub:    { color: '#94A3B8', fontSize: 12, marginTop: 2 },

  appInfoBox:   { flexDirection: 'row', alignItems: 'center', gap: 14 },
  appLogoWrap:  { width: 52, height: 52, borderRadius: 14, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  appName:      { fontWeight: 'bold', fontSize: 16, color: '#0A1628' },
  appVer:       { color: '#94A3B8', fontSize: 11, marginTop: 3 },

  logoutBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24, backgroundColor: '#FFF5F5', borderRadius: 14, padding: 16, borderWidth: 1.5, borderColor: '#FECACA' },
  logoutText:   { color: '#C62828', fontWeight: 'bold', fontSize: 15 },
  copyright:    { textAlign: 'center', color: '#CBD5E1', fontSize: 11, marginTop: 24 },
});
