import { StyleSheet, Alert, Text, View, Modal, Pressable } from 'react-native';
import Game from './Game';
import React, { useState } from 'react';
import { MenuScreen } from './MenuScreen';
import { MenuProvider } from 'react-native-popup-menu';
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
  + "After each guess, you will receive feedback in the form of a list of the most common words that share letters with both your guess and the secret word.\n\n"
  + "This feedback helps you narrow down the possible secret word.\n\n"
  + "There is no limit to the number of guesses you can make.\n\n"
  + "If you wish to give up, you can start a new game.\n\n"
  + "The secret word of the current game will be revealed to you."


  const startNewGame = async (message) => {
    const secretWord = await getData("secretWord")
    showEndGameMessageWithSecretWord(message, secretWord)
  }

  const showEndGameMessageWithSecretWord = (message, secretWord) =>{
    setGameEndTitle(message)
    setGameEndMessage("Secret word was '" + secretWord + "'.\n New game starts!")
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

    <MenuProvider>
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
            <Text style={styles.modalText}>{gameEndMessage}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => closeGameEndWindow()}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>



        <View style={styles.topView}> 
          <Text style={styles.appTitle}>Elaborate</Text>
          <MenuScreen onNewGameClick={giveUp} onShowRulesClick={showRules}/>
        </View>
        <Game newGameStart={gameWin} key={gameKey}/>
        
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
  },  
  modalView: {
    marginVertical:'50%',
    marginHorizontal:'10%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4
    ,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
  },
  modalTextHeaders: {
    marginBottom: 15,
    textAlign: 'left',
    fontWeight: 'bold'
  },
});

export default App;