import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, TAB_BAR_STYLE } from '../constants/theme';

import LoginScreen           from '../screens/LoginScreen';
import StudentHome           from '../screens/student/StudentHome';
import ScanQRScreen          from '../screens/student/ScanQRScreen';
import LeaveRequestScreen    from '../screens/student/LeaveRequestScreen';
import MyLeavesScreen        from '../screens/student/MyLeavesScreen';
import ProfileScreen         from '../screens/shared/ProfileScreen';
import TeacherHome           from '../screens/teacher/TeacherHome';
import CreateSessionScreen   from '../screens/teacher/CreateSessionScreen';
import LiveMonitorScreen     from '../screens/teacher/LiveMonitorScreen';
import SessionHistoryScreen  from '../screens/teacher/SessionHistoryScreen';
import AdminHome             from '../screens/admin/AdminHome';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

const HEADER_OPT = {
  headerStyle: { backgroundColor: COLORS.primaryDark },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold' },
};

// ─── Student Bottom Tabs ────────────────────────────────────────────────────
function StudentTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:   COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle:  TAB_BAR_STYLE,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={StudentHome}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ScanTab"
        component={ScanQRScreen}
        options={{
          tabBarLabel: 'Điểm danh',
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons name="qrcode-scan" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyLeavesTab"
        component={MyLeavesScreen}
        options={{
          tabBarLabel: 'Đơn của tôi',
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? 'file-document' : 'file-document-outline'}
              size={24} color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Hồ sơ',
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? 'account-circle' : 'account-circle-outline'}
              size={24} color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ─── Teacher Bottom Tabs ────────────────────────────────────────────────────
function TeacherTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:   COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle:  TAB_BAR_STYLE,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
      }}
    >
      <Tab.Screen
        name="ClassesTab"
        component={TeacherHome}
        options={{
          tabBarLabel: 'Lịch dạy',
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? 'calendar-check' : 'calendar-check-outline'}
              size={24} color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={SessionHistoryScreen}
        options={{
          tabBarLabel: 'Lịch sử',
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons name="history" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Hồ sơ',
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? 'account-circle' : 'account-circle-outline'}
              size={24} color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ─── Root Navigator ──────────────────────────────────────────────────────────
export default function Navigation() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : user.role === 'student' ? (
          <>
            <Stack.Screen name="StudentTabs"   component={StudentTabs} />
            <Stack.Screen name="LeaveRequest"  component={LeaveRequestScreen}
              options={{ headerShown: true, title: 'Đơn xin nghỉ', ...HEADER_OPT }} />
          </>
        ) : user.role === 'teacher' ? (
          <>
            <Stack.Screen name="TeacherTabs"   component={TeacherTabs} />
            <Stack.Screen name="CreateSession" component={CreateSessionScreen}
              options={{ headerShown: true, title: 'Tạo phiên điểm danh', ...HEADER_OPT }} />
            <Stack.Screen name="LiveMonitor"   component={LiveMonitorScreen}
              options={{ headerShown: true, title: 'Kết quả điểm danh', ...HEADER_OPT }} />
          </>
        ) : (
          <Stack.Screen name="AdminHome" component={AdminHome} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
