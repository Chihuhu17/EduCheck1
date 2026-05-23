import React from 'react';
import { LogBox } from 'react-native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';

LogBox.ignoreLogs([
  "Style property 'shadowOffset' is not supported",
  'A props object containing a "key" prop',
]);

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1565C0',
    accent: '#4FC3F7',
  },
};

import { AppProvider } from './context/AppContext';

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <PaperProvider theme={theme}>
          <Navigation />
        </PaperProvider>
      </AppProvider>
    </AuthProvider>
  );
}
