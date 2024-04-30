import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, Text, View } from 'react-native';
import { db} from "./firebaseConfig.js";
import { doc, getDoc, collection } from "firebase/firestore";

const Screen = () => {

    const [apiKey, setApiKey] = useState("");
    const [keys, setKeys] = useState([]);
    
    const [text, onChangeText] = useState('some text');

    useEffect(() => {
      async function getData(){
        const docRef = doc(db, "keys", "openai"); 
        const docSnapshot = await getDoc(docRef);
        const data = docSnapshot.data()
        const singleValue = data.key; 
        setApiKey(singleValue)
      }
      getData();
    }, []); 

    

    return (
      <View style={styles.container}>
        <Text>Screen</Text>
        <Text>{apiKey}</Text>

        <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
      />

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