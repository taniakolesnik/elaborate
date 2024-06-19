import React, { useState } from 'react';
import { FlatList, StyleSheet, TextInput, Text, View, Button, ScrollView } from 'react-native';
import ChatGPTAPIClient from './ChatGPTAPIClient';

const Game = () => {

  const maxAttempts = 2;

  const [attempts, setAttempts] = useState(0);
  const [points, setPoints] = useState(0);
  const [guessList, setGuessList] = useState([]);
  const [inputGuess, setInputGuess] = useState('');
  const [responseText, setResponseText] = useState('');
  const secretWord = "tree"
  const secretWordPOS = "noun"

 const sendRequest = async () => {
    try {
      const response = await ChatGPTAPIClient(inputGuess, secretWord );
      if (response == "Yes") {
        setPoints(10);
        alert(`Game over. You won. Points:10`);
      } else {
        setGuessList(guessList.concat(inputGuess + " : " + response))
        setResponseText(response); 
        if (attempts + 1 > maxAttempts){
          alert("Game over. You lost");
        } else {
          setAttempts(attempts+1)
        }
      }

    } catch (error) {
      console.error('Error in sendRequest:', error);
      setResponseText('Error: Unable to fetch response');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.guessItemStyle}>
      <Text style={styles.guessTextStyle}>{item}</Text>
    </View>
  );


  return (
    <View style={styles.container}>
      <Text style={styles.attemptsCountStyle}>Attempts: {attempts}/{maxAttempts}</Text>
      <Text style={styles.pointsCountStyle}>Points: {points}</Text>
      <Text style={styles.secretWordStyle}
        adjustsFontSizeToFit={true}
        numberOfLines={1}>{secretWord}</Text>
        <Text style={styles.secretWordPOSStyle}>{secretWordPOS}</Text>
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
        onChangeText={setInputGuess}
      />
      <Button title="Send" onPress={sendRequest} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: '5%',
    backgroundColor: '#fff'
  },
  attemptsCountStyle: {
    fontSize: 16,
    marginBottom: 16,
    fontWeight: "300"
  },
  pointsCountStyle: {
    fontSize: 16,
    marginBottom: 16,
    fontWeight: "300"
  },
  secretWordStyle: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center'
  },
  secretWordPOSStyle: {
    fontSize: 12,
    marginBottom: 5,
    marginTop: 5,
    textAlign: 'center'
  },
  inputStyle: {
    height: "10%",
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8
  },
  response: {
    fontSize: 16,
    color: '#333'
  },
  guessItemStyle: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  guessTextStyle: {
    fontSize: 14,
  },
});

export default Game;
