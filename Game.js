import React, { useState, useEffect, useRef } from 'react';
import { Animated, FlatList, ActivityIndicator, Modal, StyleSheet, TextInput, Text, View, Button, Pressable } from 'react-native';
import {getRandomWord, getCommon, validateInput, formatDictionary} from './gameUtils'
import { getData, setData } from './asyncStorage';
import { rules, objective } from './gameRules';

const Game = ({ newGameStart, onNewGameClick }) => {

  const [attempts, setAttempts] = useState(0); // Tracks the number of guesses attempts.
  const [guessList, setGuessList] = useState({}); // Stores users guesses words and feedback on them.
  const [inputGuess, setInputGuess] = useState(''); // Tracks current user input.
  const [isDisabledSendButton, setIsDisabledSendButton] = useState(true); // Manages submit button state.
  const [isEnabledActivityIndicator, setIsEnabledActivityIndicator] = useState(false); // Shows loading indicator during API call.
  const [secretWord, setSecretWord] = useState(''); // Stores the secret word.
  const [bestScore, setBestScore] = useState(100); // Tracks the best score (fewest attempts).
  const [errorMessage, setErrorMessage] = useState(''); // Error message for invalid input or connection issues.
  const flatList = React.useRef(null) // Reference to the FlatList for scrolling.
  const fadeErrorAnimation = useRef(new Animated.Value(0)).current; // Animation for error messages.

  const [rulesWindowVisible, setRulesWindowVisible] = useState(false); // State to control rules modal visibility.

  // initialize secret word and best score when component mounts.
  useEffect(() => {
    getSecretWord(); // Fetch a new secret word on load.
    getBestScore(); // Load the best score from async storage.
  }, []);

  // Fetches a random word from the backend and handles connection issues.
  const getSecretWord = async () => {
    try {
      const response = await getRandomWord();
      if (response == "error") {
        setErrorMessage("No connection to the server. Please try later."); // Show error if connection fails.
        fadeIn() // Trigger fade-in animation for error message.
        setSecretWord("NO_CONNECTION") // Set a placeholder secret word when there's no connection.
      } else {
        setSecretWord(response) // Set secret word from backend.
        await setData("secretWord", response) // Store secret word in async storage.
      }
    } catch (error) {
      console.error('Error in setRandomWord:', error);
    }
  };

  // Retrieves the best score from async storage and sets it in state.
  const getBestScore = async () => {
    try {
      const response = await getData("bestScore");
      if (response !== null) {
        setBestScore(response) // Set best score if it exists in storage.
      } 
    } catch (error) {
      console.error('Error in getBestScore:', error);
    }
  };

  // Handles user input and disables the submit button if the input is invalid.
  const handleInputChange = (input) => {
    if (secretWord != "NO_CONNECTION"){
      fadeOut(); // Hide error message when input changes.
    } 
    const inputLowerCase = input.toLowerCase() // Convert input to lowercase for consistency.
    setInputGuess(inputLowerCase) // Update state with the input.

    // Validate the input and enable/disable the submit button accordingly.
    if (validateInput(inputLowerCase) && secretWord != "NO_CONNECTION") {
      setIsDisabledSendButton(false);  // Enable button if input is valid.
    } else {
      setIsDisabledSendButton(true); // Disable button if input is invalid.
    }
  };


  // Handles the submission of the player's guess and checks the result.
  const checkGuessInput = async () => {
    setIsEnabledActivityIndicator(true); // Show loading indicator during API call.
    setIsDisabledSendButton(true) // Disable submit button to prevent duplicate submissions.
    if (secretWord == inputGuess) {
      newGameStart(); // Start a new game if the guess is correct.
      if ((attempts + 1) < bestScore){
        setData("bestScore", String(attempts+1))  // Update the best score 
      }
    } else if (inputGuess in guessList) {
      setInputGuess(""); // Clear input if the guess was already used.
      setErrorMessage("This guess word was already used") // Show error message.
      fadeIn() // Trigger fade-in animation for error message.
    } else {
      const response = await getCommon(inputGuess, secretWord); // Compare guess with secret word via backend API.
      if (response == "One or both words not in vocabulary") {
        setInputGuess(""); // Clear input if word is not in vocabulary.
        setErrorMessage("Cannot find this word in my vocabulary.") // Show error message.
        fadeIn() // Trigger fade-in animation.
      } else if (response == "error") {
          setInputGuess(""); // Clear input on connection error.
          setErrorMessage("No connection to the server. Please try later") // Show connection error.
          fadeIn() // Trigger fade-in animation.
      } else {
        gustListUpdated = guessList // Update guess list with the new guess.
        gustListUpdated[inputGuess] = response // Add response from backend.
        setGuessList(gustListUpdated) // Set updated guess list in state.
        setAttempts(attempts+1) // Increment attempts.
        setInputGuess("");  // Clear input for the next guess.
      }
    }
    setIsEnabledActivityIndicator(false); // Hide loading indicator.
  };

  // Renders each guessed word in the FlatList.
  const renderItem = ({ item }) => (
    <View style={styles.guessItemStyle}>
      <Text style={styles.guessTextStyle}>{item}</Text>
    </View>
  );

  // Triggers the fade-in animation for error messages.
  // code is taken from https://reactnative.dev/docs/animations
  const fadeIn = () => {
    Animated.timing(fadeErrorAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  // Triggers the fade-out animation for error messages.
  // code is taken from https://reactnative.dev/docs/animations
  const fadeOut = () => {
    Animated.timing(fadeErrorAnimation, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  // Opens the rules modal when the "Rules" button is pressed.
  const showRules = () => {
    setRulesWindowVisible(true)
  };

  return (
    <View style={styles.container}>
    <View style={styles.topView}>
      {/* rules button*/}
      <View style={styles.topViewClicable}>
        <Pressable onPress={showRules}>
          <Text style={styles.topViewSmall}>Rules</Text>
        </Pressable>
        </View>
        {/* the best score */}
        <Text style={styles.topViewSmall}>best# {bestScore}</Text>
        {/* number of attempts */}
        <Text style={styles.topViewLarge}>attempts# {attempts}</Text>
        {/* give up button */}
        <View style={styles.topViewClicable}>
        <Pressable onPress={onNewGameClick}>
          <Text style={styles.topViewSmall}>Give Up</Text>
        </Pressable>
        </View>
      </View>


      {/* List of guessed words */}
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

      {/* Animated error message */}
      <Animated.View
        style={{ opacity: fadeErrorAnimation, alignItems: 'left', marginHorizontal: 1 }}>
        <Text style={styles.guessInputHelperTextErorr}>{errorMessage}</Text>
      </Animated.View>

      {/* Input helper text */}
      <View style={styles.guessInputHelperView}>
        <Text style={styles.guessInputHelperText}>Submit button is only activated when your guess input is exactly 5 characters long. No spaces or special characters are permitted.</Text>
      </View>

      {/* User input field for guessing */}
      <TextInput
        style={styles.inputStyle}
        placeholder="Type your guess here"
        value={inputGuess}
        autoCapitalize="none"
        onChangeText={handleInputChange}
      />

      {/* Submit button and activity indicator */}
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
