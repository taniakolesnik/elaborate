import axios from 'axios';
import { getAPIKey } from "./getAPIKey.js";

const ChatGPTAPIClient = async (inputMessage, secretWord) => {
  const apiURL = 'https://api.openai.com/v1/chat/completions';
  const apiKey = await getAPIKey();
  const userContent = "what is common between '" + secretWord + "' and '" + inputMessage + "'?"; 
  const systemContent = "if '" + inputMessage + "' means '" + secretWord + "', reply 'yes' and stop. otherrwise, in a few words. one thing only. no examples. starting with 'they both have...' or 'they both are made' etc"

  console.log(userContent)


  try {
    const response = await axios.post(

      apiURL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {role: "system", content: systemContent},
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
