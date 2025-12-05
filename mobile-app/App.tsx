/**
 * MotorOctane Mobile App - Main Entry Point
 * Expo app with navigation and theming
 */

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Navigation from './src/navigation';

export default function App() {
  return (
    <View style={styles.container}>
      <Navigation />
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
