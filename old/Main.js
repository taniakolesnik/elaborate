import { StyleSheet, TextInput, Text, View, TouchableOpacity} from 'react-native';
import OpenAI from 'openai';
import { useState } from "react";
import { openAiClient } from "./openAiClient.js";
import { useEffect } from "react";

const Main = () => {

    const openai = openAiClient();
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");

    const handleInput = async () => {
        try {


            const prompt = [
                {
                  role: "system",
                  content: "You are a helpful assistant."
                },
                {
                  role: "user",
                  content: `Plan a comprehensive travel itinerary. I am travelling with family. I am going to Paris for 7 days. And I want to include the following activities: sightseeing, dining.`
                }
              ];

              const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer {openai.apiKey}`
                },
                body: JSON.stringify({
                  model: "gpt-3.5-turbo",
                  messages: prompt,
                }),
              });
              

              console.log(response)

            //   setOutput(response.choices[0])


        } catch (error) {
            console.log(error)
        }

        setInput("");
    }

     return (
        <View style={styles.container}>
          <Text>Screen get API key separately chatgpt</Text>
          <View>
            <View>
                <TextInput
                    placeholder="type your message here"
                    onChangeText={ text => setInput(text)}
                    value={input}
                />
                <TouchableOpacity onPress={handleInput}>
                    <Text>Send</Text>
                </TouchableOpacity>
                <View>
                    <Text>{output}</Text>
                </View>
            </View>
          </View>

        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default Main;
