import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import StudentHome from '../screens/student/StudentHome';
import ScanQRScreen from '../screens/student/ScanQRScreen';
import LeaveRequestScreen from '../screens/student/LeaveRequestScreen';
import TeacherHome from '../screens/teacher/TeacherHome';
import CreateSessionScreen from '../screens/teacher/CreateSessionScreen';
import LiveMonitorScreen from '../screens/teacher/LiveMonitorScreen';
import AdminHome from '../screens/admin/AdminHome';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1565C0' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' } }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : user.role === 'student' ? (
          <>
            <Stack.Screen name="StudentHome" component={StudentHome} options={{ title: 'EduCheck - Sinh viên', headerShown: false }} />
            <Stack.Screen name="ScanQR" component={ScanQRScreen} options={{ title: 'Quét mã QR điểm danh' }} />
            <Stack.Screen name="LeaveRequest" component={LeaveRequestScreen} options={{ title: 'Đơn xin nghỉ' }} />
          </>
        ) : user.role === 'teacher' ? (
          <>
            <Stack.Screen name="TeacherHome" component={TeacherHome} options={{ title: 'EduCheck - Giảng viên', headerShown: false }} />
            <Stack.Screen name="CreateSession" component={CreateSessionScreen} options={{ title: 'Tạo phiên điểm danh' }} />
            <Stack.Screen name="LiveMonitor" component={LiveMonitorScreen} options={{ title: 'Kết quả điểm danh' }} />
          </>
        ) : (
          <Stack.Screen name="AdminHome" component={AdminHome} options={{ title: 'EduCheck - Quản trị', headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
