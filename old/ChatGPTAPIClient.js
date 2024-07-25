import axios from 'axios';
import { fetchAPIKey } from "../getAPIKey.js";

const ChatGPTAPIClient = async (inputMessage, secretWord) => {
  const apiURL = 'https://api.openai.com/v1/chat/completions';
  const userContent = "does '" + inputMessage + "' mean '" + secretWord + "' ? if yes, just reply 'yes' and stop. if not exactly, what is common between '" + secretWord + "' and '" + inputMessage + "'? just ONE WORD reply only."; 

  console.log(userContent)

  let apiKey = null;

  const getAPIKey = async (apiClient) => {
     if (!apiKey) {
       apiKey = await fetchAPIKey(apiClient);
     }
     return apiKey;
   };
   
   apiKey = await getAPIKey("openai");


  try {
    const response = await axios.post(

      apiURL,
      {
        model: "gpt-4o-mini",
        messages: [
          {role: "system", content: "you are helping user to guess a word meaning without giving meaning of '" + secretWord + "'. if user guessed the meaning or synonyms, just reply 'yes'"},
          {role: "user", content: userContent}
        ],
        temperature: 0,  
        top_p: 0.36,
        max_tokens: 50
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.choices[0].message.content; 

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return 'Error: Unable to fetch response';
  }
};

export default ChatGPTAPIClient;
