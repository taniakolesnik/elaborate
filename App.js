import { StyleSheet, TextInput, Text, View } from 'react-native';
import Game from './Game';
import React, { useState } from 'react';
import { MenuScreen } from './MenuScreen';
import { MenuProvider } from 'react-native-popup-menu';

const App = () => {

  const [gameKey, setGameKey] = useState(0);

  const refreshGame = () => {
    alert("New game will start now!")
    setGameKey(prevKey => prevKey + 1);
  };

  return (

    <MenuProvider>
      <View style={styles.container}>
        <View style={styles.topView}> 
          <Text style={styles.appTitle}>Elaborate</Text>
          <MenuScreen onNewGameClick={refreshGame}/>
        </View>
        <Game key={gameKey}/>
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