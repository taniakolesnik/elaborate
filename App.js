import { Alert, StyleSheet, Text, View, Modal, Pressable, SafeAreaView } from 'react-native';
import Game from './Game';
import React, { useState } from 'react';
import { getData } from './asyncStorage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Confetti } from "native-confetti";


const App = () => {

  const Stack = createNativeStackNavigator();

  const [gameKey, setGameKey] = useState(0);
 

  const startNewGame = async (message) => {
    const secretWord = await getData("secretWord")
    showEndGameMessageWithSecretWord(message, secretWord)
  }

  const showEndGameMessageWithSecretWord = (message, secretWord) =>{
    Alert.alert(message, "Secret word was '" + secretWord + "'\nNew game starts now", [
      {text: 'OK', onPress: () => gameRefresh()},
    ],
    {cancelable: false},);
  }
  
  const gameRefresh = async () => {
      setGameKey(prevKey => prevKey + 1);
    }

  const giveUp = () => {
    const message = ""
    startNewGame(message)
  };

  const gameWin = () => {
    const message = "You won!"
    startNewGame(message)
  };

  // const showRules = () => {
  //   setRulesWindowVisible(true)
  // };

  const onGiveUpAlert = () =>
    Alert.alert('Give up', 'Are you sure you want to give up?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'OK', onPress: () => giveUp()},
    ]);


    function GameScreen() {
      return (
          <Game newGameStart={gameWin} onNewGameClick={onGiveUpAlert}  key={gameKey}/>
      );
    }

  return (
<NavigationContainer>
      
      <Stack.Navigator>
        <Stack.Screen name="midst" component={GameScreen} 
                            navigationOptions={{
                              headerLeft: 'test'
                            }}
                            options={{
                            headerTitleAlign: 'left',
                            headerTitleStyle: {
                                fontWeight: '100',
                                fontSize: 30
                            }, headerTitle: props => (
                              <View style={{ flex: 1}}>
                                <Text style={{fontSize: 30, fontWeight: '100'}}> 
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