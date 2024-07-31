import { StyleSheet, Text, View, Modal, Pressable, SafeAreaView } from 'react-native';
import Game from './Game';
import React, { useState } from 'react';
import { getData } from './asyncStorage';

const App = () => {

  const [gameKey, setGameKey] = useState(0);
  // https://reactnative.dev/docs/modal
  const [rulesWindowVisible, setRulesWindowVisible] = useState(false);
  const [newGameWinwowVisible, setnewGameWinwowVisible] = useState(false);
  const [gameEndMessage, setGameEndMessage] = useState("");
  const [gameEndTitle, setGameEndTitle] = useState("");

  const objective = "Guess the secret English 5-letter word."  
  const rules =  "You must submit a guess that is a 5-letter word also. \n\n" 
  + "After each guess, you will receive feedback in the form of a list of the most common words between a guess word and a secret one.\n\n"
  + "This feedback helps you narrow down the possible secret word.\n\n"
  + "There is no limit to the number of guesses you can make.\n\n"
  + "If you wish to give up, you can start a new game. The secret word of the current game will be revealed to you."


  const startNewGame = async (message) => {
    const secretWord = await getData("secretWord")
    showEndGameMessageWithSecretWord(message, secretWord)
  }

  const showEndGameMessageWithSecretWord = (message, secretWord) =>{
    setGameEndTitle(message)
    setGameEndMessage("Secret word is '" + secretWord + "'\n New game starts now")
    setnewGameWinwowVisible(true)
  }
  
  const closeGameEndWindow = () => {
    setnewGameWinwowVisible(false)
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

  return (


    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
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

      {/* New game modal */}

      <Modal
        animationType="fade"
        transparent={true}
        visible={newGameWinwowVisible}
        onRequestClose={() => {
          closeGameEndWindow();
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTextHeaders}>{gameEndTitle} </Text>
            <Text style={styles.modalTextLarge}>{gameEndMessage}</Text>
            <Pressable
              style={styles.button}
              onPress={() => closeGameEndWindow()}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

{/* 
        <View style={styles.topView}> 
          <Text style={styles.appTitle}>Elaborate</Text>
        </View> */}
        <Game newGameStart={gameWin} onNewGameClick={giveUp} onShowRulesClick={showRules} key={gameKey}/>
      </View>
    </SafeAreaView>
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
    marginTop: 15,
  },  
  modalView: {
    marginVertical:'35%',
    marginHorizontal:'10%',
    backgroundColor: '#0c2231',
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
    color: '#0c2231',
    textAlign: 'center',
    fontSize: 14
  },
  modalText: {
    marginBottom: 15,
    fontSize: 14,
    color: '#FEFEFE',
  },
  modalTextLarge: {
    marginBottom: 15,
    fontSize: 18,
    color: '#FEFEFE',
  },
  modalTextHeaders: {
    marginBottom: 15,
    textAlign: 'left',
    fontWeight: 'bold',
    color: '#FEFEFE',
    fontSize: 20
  },
});

export default App;