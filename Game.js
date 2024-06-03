import React, { useState } from 'react';
import { FlatList, StyleSheet, TextInput, Text, View, Button, ScrollView } from 'react-native';
import ChatEngine from './ChatEngine';

const Game = () => {

  const maxAttempts = 3;
  const [attempts, setAttempts] = useState(0)
  const [guessList, setGuessList] = useState([]);
  const [inputGuess, setInputGuess] = useState('');
  const [responseText, setResponseText] = useState('');

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.text}>{item}</Text>
    </View>
  );

  const sendRequest = async () => {
    try {
      const response = await ChatEngine(inputGuess);
      setGuessList(guessList.concat(response))
      setResponseText(response); 
      if (attempts + 1 > maxAttempts){
        alert("game over");
      } else {
        setAttempts(attempts+1)
      }
    } catch (error) {
      console.error('Error in sendRequest:', error);
      setResponseText('Error: Unable to fetch response');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>Elaborate</Text>
      <Text style={styles.appTitle}>{attempts}/{maxAttempts}</Text>
      <Text style={styles.secretWord}
        adjustsFontSizeToFit={true}
        numberOfLines={1}>SecretWord</Text>
        <FlatList
        data={guessList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <TextInput
        style={styles.input}
        placeholder="Type your message here"
        value={inputGuess}
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
    paddingTop: '20%',
    backgroundColor: '#fff'
  },
  appTitle: {
    fontSize: 20,
    marginBottom: 16
  },
  secretWord: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'TrebuchetMS-Bold'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8
  },
  responseContainer: {
    marginTop: 16
  },
  response: {
    fontSize: 16,
    color: '#333'
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  text: {
    fontSize: 18,
  },
});

export default Game;
