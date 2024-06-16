import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TextInput, Text, View } from 'react-native';
import Game from './Game';
import { MenuScreen } from './MenuScreen';
import { MenuProvider } from 'react-native-popup-menu';

const App = () => {

  return (

    <MenuProvider>
      <View style={styles.container}>
        <View style={styles.topView}> 
          <Text style={styles.appTitle}>Elaborate</Text>
          <MenuScreen/>
        </View>

      <Game />
      </View>
    </MenuProvider>


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: '20%',
    backgroundColor: '#fff'
  },
  appTitle: {
    fontSize: 12,
    marginBottom: 16,
    fontWeight: "200"
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default App;