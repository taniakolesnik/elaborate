import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TextInput, Text, View } from 'react-native';
import Screen from './Screen';

const App = () => {

  return (
    <Screen/>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;