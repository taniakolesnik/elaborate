import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, Text, View } from 'react-native';
import { getAPIKey } from "./getAPIKey.js";

const Screen = () => {

  const [key, setKey] = useState("")

  const useAPIKey = async () => {
    const value = await getAPIKey();
    setKey(value)
    
  };

  useAPIKey();

  return (
      <View style={styles.container}>
        <Text>Screen get API key separately</Text>
        <Text>{key}</Text>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  
  export default Screen;