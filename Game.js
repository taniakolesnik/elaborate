import React, { useState, useEffect, useRef } from 'react';
import { Alert, Animated, FlatList, ActivityIndicator, Modal, StyleSheet, TextInput, Text, View, Button, Pressable } from 'react-native';
import getRandomWord from './getRandomWord'
import getCommon from './getCommon';
import { getData, setData } from './asyncStorage';

const Game = ({ newGameStart, onNewGameClick }) => {

  const [attempts, setAttempts] = useState(0);
  const [guessList, setGuessList] = useState({});
  const [inputGuess, setInputGuess] = useState('');
  const [isDisabledSendButton, setIsDisabledSendButton] = useState(true);
  const [isEnabledActivityIndicator, setIsEnabledActivityIndicator] = useState(false);
  const [secretWord, setSecretWord] = useState('');
  const [bestScore, setBestScore] = useState(100);
  const [errorMessage, setErrorMessage] = useState('');
  const flatList = React.useRef(null)
  const fadeErrorAnimation = useRef(new Animated.Value(0)).current;

  const [rulesWindowVisible, setRulesWindowVisible] = useState(false);
  const objective = "Guess the secret English 5-letter word."  
  const rules =  "You may submit a 5-letter guess. Nouns only!\n\n" 
  + "After each guess you will receive a list of up to 3 of the most common words 'between' your guess word and the secret one. Their similarity scores to the secret word are also given.\n\n"
  + "Think about this as you are looking for a secret direction and the game gives you a list of 'change stations' you can use to get there. \n\n"
  + "There is no limit to the number of guesses you can make.\n\n"
  + "If you wish to give up, you can start a new game. The secret word of the current game will be revealed to you."


  useEffect(() => {
    getSecretWord();
    getBestScore();
  }, []);

  const getSecretWord = async () => {
    try {
      const response = await getRandomWord();
      if (response == "error") {
        setErrorMessage("No connection to the server. Please try later.");
        fadeIn()
        setSecretWord("NO_CONNECTION")
      } else {
        setSecretWord(response)
        await setData("secretWord", response)
      }
    } catch (error) {
      console.error('Error in setRandomWord:', error);
    }
  };

  const getBestScore = async () => {
    try {
      const response = await getData("bestScore");
      if (response !== null) {
        setBestScore(response)
      } 
    } catch (error) {
      console.error('Error in getBestScore:', error);
    }
  };

  const validateInput = (input) => {
    const regex = /^[A-Za-z]+$/;
    return input.length === 5 && regex.test(input);
  };

  const handleInputChange = (input) => {
    if (secretWord != "NO_CONNECTION"){
      fadeOut();
    } 

    const inputLowerCase = input.toLowerCase()
    setInputGuess(inputLowerCase)
    if (validateInput(inputLowerCase) && secretWord != "NO_CONNECTION") {
      setIsDisabledSendButton(false);
    } else {
      setIsDisabledSendButton(true);
    }
  };

  const checkGuessInput = async () => {
    setIsEnabledActivityIndicator(true);
    setIsDisabledSendButton(true)
    if (secretWord == inputGuess) {
      newGameStart();
      setData("bestScore", String(attempts))
    } else if (inputGuess in guessList) {
      setInputGuess("");
      setErrorMessage("This guess word was already used")
      fadeIn()
    } else {
      const response = await getCommon(inputGuess, secretWord);
      if (response == "One or both words not in vocabulary") {
        setInputGuess("");
        setErrorMessage("Cannot find this word in my vocabulary.")
        fadeIn()
      } else if (response == "error") {
          setInputGuess("");
          setErrorMessage("No connection to the server. Please try later")
          fadeIn()
      } else {
        gustListUpdated = guessList
        gustListUpdated[inputGuess] = response
        setGuessList(gustListUpdated)
        setAttempts(attempts + 1)
        setInputGuess("");
      }
    }
    setIsEnabledActivityIndicator(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.guessItemStyle}>
      <Text style={styles.guessTextStyle}>{item}</Text>
    </View>
  );

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeErrorAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeErrorAnimation, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const showRules = () => {
    setRulesWindowVisible(true)
  };

  const formatDictionary = (dict) => {
    // Initialize an empty array to hold formatted strings
    const result = [];
  
    // Iterate over each key-value pair in the dictionary
    for (const [key, entries] of Object.entries(dict)) {
      // Map the entries to the desired format and join them with a comma
      const formattedEntries = entries
        .map(([word, value]) => `${word} (${value})`)
        .join(', ');
  
      // Create the formatted string for the current key
      result.push(`${key}: ${formattedEntries}`);
    }
  
    // Join all formatted strings with a newline
    return result
  };

  return (
    <View style={styles.container}>
    <View style={styles.topView}>
      <View style={styles.topViewClicable}>
        <Pressable onPress={showRules}>
          <Text style={styles.topViewSmall}>Rules</Text>
        </Pressable>
        </View>
        <Text style={styles.topViewSmall}>best# {bestScore}</Text>
        <Text style={styles.topViewLarge}>attempts# {attempts}</Text>
        <View style={styles.topViewClicable}>
        <Pressable onPress={onNewGameClick}>
          <Text style={styles.topViewSmall}>Give Up</Text>
        </Pressable>
        </View>
      </View>


      <FlatList
        ref={flatList}
        data={formatDictionary(guessList)}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        // https://stackoverflow.com/questions/46304677/scrolltoend-after-update-data-for-flatlist
        onContentSizeChange={() => {
          flatList.current.scrollToEnd();
        }}
      />

      <Animated.View
        style={{ opacity: fadeErrorAnimation, alignItems: 'left', marginHorizontal: 1 }}>
        <Text style={styles.guessInputHelperTextErorr}>{errorMessage}</Text>
      </Animated.View>

      <View style={styles.guessInputHelperView}>
        <Text style={styles.guessInputHelperText}>Submit button is only activated when your guess input is exactly 5 characters long. No spaces or special characters are permitted.</Text>
      </View>
      <TextInput
        style={styles.inputStyle}
        placeholder="Type your guess here"
        value={inputGuess}
        autoCapitalize="none"
        onChangeText={handleInputChange}
      />

      <View style={styles.submitButtonViewStyle}>
        <Button color="#333a40" style={styles.button}
        disabled={isDisabledSendButton}
        title="Submit" 
        onPress={checkGuessInput} />
      <ActivityIndicator 
        animating={isEnabledActivityIndicator} 
        // animating='true'
        size="small" 
        color="black"/>
      </View>

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

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 18,
    marginBottom: 14,
    justifyContent: 'center',
  },
  activityIndicatorStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 10
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
    marginHorizontal: 12
  },
  topViewLarge: {
    fontWeight: '300', 
    fontSize: 16,
  },
  topViewSmall: {
    fontWeight: '300',
    fontSize: 16
  },
  topViewClicable: {
    backgroundColor: 'lightgrey', 
    paddingVertical: 4, 
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    elevation: 3,
  },
  inputStyle: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: '3%',
    borderRadius: 10,
    marginHorizontal: 12
  },
  guessItemStyle: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 12,
    marginBottom: 10,
    backgroundColor: '#c7cdd2',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    elevation: 3,
  },
  guessTextStyle: {
    fontSize: 14,
    color: 'black'
  },
  guessInputHelperView: {
    marginBottom: 8,
    marginTop: 3,
    marginHorizontal: 15
  },
  guessInputHelperText: {
    fontSize: 11,
    color: 'grey',
    fontFamily: 'serif',
  },
  guessInputHelperTextErorr: {
    fontSize: 13,
    color: 'red',
    marginHorizontal: 14
  },
  submitButtonViewStyle: {
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'center'
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
  modalView: {
    marginVertical:'35%',
    marginHorizontal:'10%',
    backgroundColor: '#c7cdd2',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
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

});


export default Game;
