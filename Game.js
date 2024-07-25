import React, { useState, useEffect } from 'react';
import { FlatList, ActivityIndicator, StyleSheet, TextInput, Text, View, Button } from 'react-native';
import getRandomWord from './getRandomWord'
import getCommon from './getCommon';

const Game = () => {

  const [attempts, setAttempts] = useState(0);
  const [guessList, setGuessList] = useState([]);
  const [inputGuess, setInputGuess] = useState('');
  const [isDisabledSendButton, setIsDisabledSendButton] = useState(true);
  const [isEnabledActivityIndicator, setIsEnabledActivityIndicator] = useState(false);
  const [secretWord, setSecretWord] = useState('');

  useEffect(() => {
    setRandomWord();
  }, []);

  const setRandomWord = async () => {
    try {
      const response = await getRandomWord();
      if (response[0].length == 0) {
        alert(`no random word catches`);
      } else {
        setSecretWord(response)
      }

    } catch (error) {
      console.error('Error in setRandomWord:', error);
    }
  };

  const validateInput = async (input) => {
    setInputGuess(input)
    if (input.length == 5){
      setIsDisabledSendButton(false)
    } else {
      setIsDisabledSendButton(true)
    }

  };

  const checkGuessInput = async () => {
    setIsEnabledActivityIndicator(true);
    setIsDisabledSendButton(true)
    if (secretWord == inputGuess){
      alert(`You won! Secret word is ${secretWord}`);
      setIsEnabledActivityIndicator(false)
    } else {
      const response = await getCommon(inputGuess, secretWord);
      setGuessList(guessList.concat(inputGuess + " : " + response))
      setAttempts(attempts+1)
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


  return (
    <View style={styles.container}>
      <Text style={styles.attemptsCountStyle}>Attempts: {attempts}</Text>
      {/* <Text style={styles.secretWordStyle}>{secretWord}</Text> */}
      <View style={styles.activityIndicatorStyle}>
        <ActivityIndicator animating={isEnabledActivityIndicator} size="large" />
      </View>
        <FlatList
        data={guessList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <TextInput
        style={styles.inputStyle}
        placeholder="Type your message here"
        value={inputGuess}
        autoCapitalize="none"
        onChangeText={validateInput}
      />
      <Button disabled={isDisabledSendButton} title="Send" onPress={checkGuessInput} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: '5%',
    paddingBottom:'10%',
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  attemptsCountStyle: {
    fontSize: 16,
    marginBottom: 16,
    fontWeight: "300"
  },
  inputStyle: {
    height: "10%",
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8
  },
  guessItemStyle: {
    padding: 20,
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
});

export default Game;
