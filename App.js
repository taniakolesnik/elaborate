import React, { useState } from 'react';
import { StyleSheet, Text, View} from 'react-native';
import Game from './Game';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { 
  startNewGame, 
  showEndGameMessageWithSecretWord, 
  gameRefresh, 
  giveUp, 
  gameWin, 
  onGiveUpAlert 
} from './appUtils';

const App = () => {

  const Stack = createNativeStackNavigator();

  const [gameKey, setGameKey] = useState(0);

   // Handles starting a new game by refreshing the game state.
  const startNewGameHandler = async (message) => {
    startNewGame(message, () => gameRefresh(setGameKey));
  };

  // Wraps the give-up functionality and starts a new game.
  const giveUpWrapper = () => {
    giveUp(startNewGameHandler);
  };

  // Handles the win scenario and starts a new game.
  const gameWinHandler = () => {
    gameWin(startNewGameHandler);
  };

  // Displays the alert asking if the player wants to give up.
  const onGiveUpAlertHandler = () => {
    onGiveUpAlert(giveUpWrapper);
  };

   // Renders the game screen, passing handlers for game win and give-up actions.
  function GameScreen() {
    return (
      <Game newGameStart={gameWinHandler} onNewGameClick={onGiveUpAlertHandler} key={gameKey} />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="midst" component={GameScreen}
          options={{
            headerTitleAlign: 'left',
            headerTitleStyle: {
              fontWeight: '100',
              fontSize: 30
            }, headerTitle: props => (
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 30, fontWeight: '100' }}>
                  {props.children}
                </Text>
              </View>
            ),
            headerStyle: {
              backgroundColor: '#bcaaaa',
            },

          }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 15
  },
  appTitle: {
    fontSize: 24,
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginTop: 20,
  },
});

export default App;
