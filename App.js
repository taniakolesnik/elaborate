import { Alert, StyleSheet, Text, View, Modal, Pressable, SafeAreaView } from 'react-native';
import Game from './Game';
import React, { useState } from 'react';
import { getData } from './asyncStorage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MenuScreen } from './MenuScreen';
import { MenuProvider } from 'react-native-popup-menu';

const App = () => {

  const Stack = createNativeStackNavigator();

  const [gameKey, setGameKey] = useState(0);
  // https://reactnative.dev/docs/modal
  const [rulesWindowVisible, setRulesWindowVisible] = useState(false);
  const objective = "Guess the secret English 5-letter word."  
  const rules =  "You may submit a 5-letter guess. Nouns only!\n\n" 
  + "After each guess you will receive a list of up to 3 of the most common words 'between' your guess word and the secret one. Their similarity scores to the secret word are also given.\n\n"
  + "Think about this as you are looking for a secret direction and the game gives you a list of 'change stations' you can use to get there. \n\n"
  + "There is no limit to the number of guesses you can make.\n\n"
  + "If you wish to give up, you can start a new game. The secret word of the current game will be revealed to you."


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
  
  const closeGameEndWindow = () => {
    gameRefresh()
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

  const showRules = () => {
    setRulesWindowVisible(true)
  };

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
          <Game newGameStart={gameWin} onNewGameClick={onGiveUpAlert} onShowRulesClick={showRules} key={gameKey}/>
      );
    }

  return (
<MenuProvider>
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
      
      
              {/* Rules modal */}
              <Modal
          animationType="fade"
          transparent={true}
          visible={rulesWindowVisible}
          onRequestClose={() => {
            setRulesWindowVisible(false);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTextHeaders}>Objective: </Text>
              <Text style={styles.modalText}>{objective}</Text>
              <Text style={styles.modalTextHeaders}>Gameplay:</Text>
              <Text style={styles.modalText}>{rules}</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setRulesWindowVisible(false)}>
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
  
    </NavigationContainer>
    
    </MenuProvider>
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
  modalView: {
    marginVertical:'35%',
    marginHorizontal:'10%',
    backgroundColor: '#B0C4DE',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4
    ,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: '#FEFEFE'
  },
  textStyle: {
    color: '#1e1e1e',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold'
  },
  modalText: {
    marginBottom: 15,
    fontSize: 14,
    color: '#1e1e1e',
  },
  modalTextLarge: {
    marginBottom: 15,
    fontSize: 18,
    color: '#1e1e1e',
  },
  modalTextHeaders: {
    marginBottom: 15,
    textAlign: 'left',
    fontWeight: 'bold',
    color: '#1e1e1e',
    fontSize: 20
  },
});

export default App;