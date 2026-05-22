import React, { createContext, useContext, useState } from 'react';
import { INITIAL_LEAVES } from '../constants/mockData';

const AuthContext = createContext(null);

// INITIAL_LEAVES được import từ constants/mockData.js

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [leaves, setLeaves] = useState(INITIAL_LEAVES);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  // Sinh viên gửi đơn
  const submitLeave = (leaveData) => {
    const newLeave = {
      id: Date.now().toString(),
      name: leaveData.name,
      code: leaveData.code,
      subject: leaveData.subject,
      date: leaveData.date,
      reason: leaveData.reason,
      status: 'pending',
    };
    setLeaves(prev => [newLeave, ...prev]);
  };

  // Giáo viên duyệt/từ chối
  const updateLeave = (id, status) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, leaves, submitLeave, updateLeave }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
