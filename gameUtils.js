import axios from 'axios';
// import { fetchAPIKey } from "./getAPIKey.js";

export const getRandomWord = async () => {

    // const apiURL = "https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=7&lettersMax=12&partOfSpeech=verb&frequencyMin=2.5"
    const apiURL = "http://taniakolesnik.pythonanywhere.com/random"
    let secret = null;

    const getSecret = async () => {
        
        try {
            const res = await axios.get(apiURL);
            console.log(res.data.secret_word)
            return res.data.secret_word
        } catch (error) {
            return "error"
        }
    };

    secret = await getSecret()
    return secret
}

export const getCommon = async (inputMessage, secretWord) => {
  
    const apiURL = "http://taniakolesnik.pythonanywhere.com/common_word?word1=" + inputMessage.toLowerCase() 
    + "&word2=" + secretWord.toLowerCase() + "&top=3";
    console.log(apiURL)
    try {
      const response = await axios.get(apiURL);
      console.log(response.data.common)
      return response.data.common; 
  
    } catch (error) {
      return "error";
    }
  };

  export const validateInput = (input) => {
    const regex = /^[A-Za-z]+$/;
    return input.length === 5 && regex.test(input);
  };

  export const formatDictionary = (dict) => {
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