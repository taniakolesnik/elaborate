import React, { useState, useEffect, useRef } from 'react';
import { Alert, Animated, FlatList, ActivityIndicator, StyleSheet, TextInput, Text, View, Button, Pressable } from 'react-native';
import getRandomWord from './getRandomWord'
import getCommon from './getCommon';
import { getData, setData } from './asyncStorage';
import getPosition from './getPosition';

const Game = ({ newGameStart, onNewGameClick, onShowRulesClick }) => {

  const [attempts, setAttempts] = useState(0);
  const [guessList, setGuessList] = useState({});
  const [inputGuess, setInputGuess] = useState('');
  const [isDisabledSendButton, setIsDisabledSendButton] = useState(true);
  const [isEnabledActivityIndicator, setIsEnabledActivityIndicator] = useState(false);
  const [secretWord, setSecretWord] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const flatList = React.useRef(null)
  const fadeErrorAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getSecretWord();
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
    } else if (inputGuess in guessList) {
      setInputGuess("");
      setErrorMessage("This guess word was already used")
      fadeIn()
    } else {
      const response = await getCommon(inputGuess, secretWord);
      if (response == "One or both words not in vocabulary") {
        setInputGuess("");
        setErrorMessage("Cannot find this word in my vocabulary\nPlease check spelling")
        fadeIn()
      } else if (response == "error") {
          setInputGuess("");
          setErrorMessage("No connection to the server\nPlease try later")
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


      <View style={styles.activityIndicatorStyle}>
        <ActivityIndicator animating={isEnabledActivityIndicator} 
        size="large" 
        color="black"/>
      </View>

      <View style={styles.topView}>
        <Pressable onPress={onShowRulesClick}>
          <Text style={styles.topViewSmall}>Rules</Text>
        </Pressable>
        <Text style={styles.topViewSmall}>best# {attempts}</Text>
        <Text style={styles.topViewSmall}>attempts# {attempts}</Text>
        <Pressable onPress={onNewGameClick}>
          <Text style={styles.topViewSmall}>Give Up</Text>
        </Pressable>
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
        <Button elevation="2" color="#0c2231" disabled={isDisabledSendButton} title="Submit" onPress={checkGuessInput} />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 18,
    justifyContent: 'center',
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20
  },
  topViewLarge: {
    fontSize: 18,
  },
  topViewSmall: {
    fontSize: 16
  },
  inputStyle: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: '3%',
    borderRadius: 10
  },
  guessItemStyle: {
    padding: 8,
    marginTop: 10,
    backgroundColor: '#B0C4DE',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 10,
    },
    elevation: 3,
  },
  guessTextStyle: {
    fontSize: 14,
    color: '#1e1e1e'
  },
  activityIndicatorStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  guessInputHelperView: {
    marginVertical: 10,
    marginHorizontal: 1,
  },
  guessInputHelperText: {
    fontSize: 11,
    color: 'grey',
    fontFamily: 'serif'
  },
  guessInputHelperTextErorr: {
    fontSize: 13,
    color: 'red'
  },
  submitButtonViewStyle: {
    borderRadius: 10,
    overflow: 'hidden'
  },

});


export default Game;
