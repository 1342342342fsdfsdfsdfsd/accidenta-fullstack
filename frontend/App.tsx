import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { UserProvider } from './src/context/UserContext';
import RootNavigator from './src/navigation/RootNavigator';
import React from 'react';

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <RootNavigator />
      </UserProvider>
    </SafeAreaProvider>
  );
}
