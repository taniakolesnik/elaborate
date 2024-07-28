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
    setInputGuess(input)
    if (validateInput(input)) {
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
      setIsEnabledActivityIndicator(false)
    } else if (inputGuess in guessList) {
      console.log("already used")
      setInputGuess("");
      setIsEnabledActivityIndicator(false);
      setIsEnabledActivityIndicator(false)
      fadeIn()
    } else {
      const response = await getCommon(inputGuess, secretWord);
      gustListUpdated = guessList
      gustListUpdated[inputGuess] = response
      setGuessList(gustListUpdated)
      setAttempts(attempts + 1)
      setInputGuess("");
      setIsEnabledActivityIndicator(false);
      setIsEnabledActivityIndicator(false)
    }
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
        result.push(`${key}: ${values}`);
      }
    }
    return result;
  };


  return (
    <View style={styles.container}>


      <View style={styles.attemptsCountStyle}>
        <Text style={styles.attemptsCountStyle}>Attempts: {attempts}</Text>
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
     <View style={styles.activityIndicatorStyle}>
        <ActivityIndicator animating={isEnabledActivityIndicator} size="large" />
      </View>

      <Animated.View
        style={{opacity: fadeErrorAnimation, alignItems:'center'}}>
        <Text style={styles.guessInputHelperTextErorr}>Guess already used!</Text>
      </Animated.View>

      <View style={styles.guessInputHelperView}>
        <Text style={styles.guessInputHelperText}>Submit will be activated when the guess input is 5 characters long. </Text>
        <Text style={styles.guessInputHelperText}>No spaces or special characters are permitted.</Text>
      </View>
      <TextInput
        style={styles.inputStyle}
        placeholder="Type your guess here"
        value={inputGuess}
        autoCapitalize="none"
        onChangeText={handleInputChange}
      />
      <Button disabled={isDisabledSendButton} title="Submit" onPress={checkGuessInput} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: '5%',
    paddingBottom: '10%',
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  attemptsCountStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "300"
  },
  inputStyle: {
    height: "10%",
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10
  },
  guessItemStyle: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  guessTextStyle: {
    fontSize: 14,
  },
  activityIndicatorStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  guessInputHelperView: {
    margin: 10
  },
  guessInputHelperText: {
    fontSize: 13,
    color: 'grey'
  },
  guessInputHelperTextErorr: {
    fontSize: 13,
    color: 'red'
  },


});

export default Game;
