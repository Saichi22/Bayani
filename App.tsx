/**
 * Bayani - Discover your heroic legacy
 * React Native App
 */

import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './src/navigation/RootNavigator';
import AuthScreen from './src/screens/auth/AuthScreen';

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        {/* <RootNavigator */}
        <AuthScreen />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
