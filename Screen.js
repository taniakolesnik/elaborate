import React, { useState } from 'react';
import { StyleSheet, TextInput, Text, View, Button, ScrollView } from 'react-native';
import ChatEngine from './ChatEngine';

const Screen = () => {
  const [inputText, setInputText] = useState('');
  const [responseText, setResponseText] = useState('');

  const sendRequest = async () => {
    try {
      const response = await ChatEngine(inputText);
      setResponseText(response); // Ensure response is a string
    } catch (error) {
      console.error('Error in sendRequest:', error);
      setResponseText('Error: Unable to fetch response');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ChatGPT with React Native</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your message here"
        value={inputText}
        onChangeText={setInputText}
      />
      <Button title="Send" onPress={sendRequest} />
      <ScrollView style={styles.responseContainer}>
        <Text style={styles.response}>{responseText}</Text> 
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#fff'
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
  }
});

export default Screen;
