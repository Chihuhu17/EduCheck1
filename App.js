import React from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1565C0',
    accent: '#4FC3F7',
  },
};

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <Navigation />
      </PaperProvider>
    </AuthProvider>
  );
}
