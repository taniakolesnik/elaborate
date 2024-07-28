import React, { useState, useEffect, useRef } from 'react';
import { Animated, FlatList, ActivityIndicator, StyleSheet, TextInput, Text, View, Button } from 'react-native';
import getRandomWord from './getRandomWord'
import getCommon from './getCommon';
import { getData, setData } from './asyncStorage';

const Game = ({ newGameStart }) => {

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
      if (response[0].length == 0) {
        alert(`no random word catches`);
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
    fadeOut()
    const inputLowerCase = input.toLowerCase()
    setInputGuess(inputLowerCase)
    if (validateInput(inputLowerCase)) {
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
      if (response == "One or both words not in vocabulary"){
        setInputGuess("");
        setErrorMessage("Cannot find this word in my vocabulary. \nPlease check spelling")
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

  const dictionaryToArray = (dict) => {
    let result = [];
    for (let key in dict) {
      if (dict.hasOwnProperty(key)) {
        // Join the array values into a single string separated by commas
        let values = dict[key].join(", ");
        // Construct the string representation and push it into the result array
        result.push(`${key} > ${values}`);
      }
    }
    return result;
  };


  return (
    <View style={styles.container}>

      <View style={styles.activityIndicatorStyle}>
        <ActivityIndicator animating={isEnabledActivityIndicator} size="small" />
      </View>

      <View style={styles.attemptsCountStyle}>
        <Text style={styles.attemptsCountStyle}>attempts # {attempts}</Text>
      </View>


      <FlatList
        ref={flatList}
        data={dictionaryToArray(guessList)}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        // https://stackoverflow.com/questions/46304677/scrolltoend-after-update-data-for-flatlist
        onContentSizeChange={() => {
          flatList.current.scrollToEnd();
      }}
      />

      <Animated.View
        style={{opacity: fadeErrorAnimation, alignItems:'left', marginHorizontal: 1}}>
        <Text style={styles.guessInputHelperTextErorr}>{errorMessage}</Text>
      </Animated.View>

      <View style={styles.guessInputHelperView}>
        <Text style={styles.guessInputHelperText}>Submit button is activated when the guess input is 5 exactly characters long. No spaces or special characters are permitted.</Text>
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
    paddingHorizontal: 8,
    marginBottom: '5%',
    justifyContent: 'center'
  },
  attemptsCountStyle: {
    alignItems: 'center',
    fontSize: 20,
    marginBottom: 5
  },
  inputStyle: {
    height: "10%",
    borderColor: '#143952',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: '3%',
    borderRadius: 10
  }, 
  guessItemStyle: {
    padding: 8,
    marginTop: 10,
    borderBottomWidth: 1,
    backgroundColor: '#143952',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 10,
    }, 
    elevation: 2,
  },
  guessTextStyle: {
    fontSize: 14,
    color:'white'
  },
  activityIndicatorStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
