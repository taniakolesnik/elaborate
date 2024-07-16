import axios from 'axios';
import { getAPIKey } from "./getAPIKey.js";

const ChatGPTAPIClient = async (inputMessage, secretWord) => {
  const apiURL = 'https://api.openai.com/v1/chat/completions';
  const apiKey = await getAPIKey("openai");
  const userContent = "does '" + secretWord + "' mean '" + inputMessage + "'? reply first \"yes\" or \"no\". then, if \"yes\" - just stop. if \"no\", say what one they both have in common semantically. briefly."; 

  console.log(userContent)


  try {
    const response = await axios.post(

      apiURL,
      {
        model: "gpt-3.5-turbo",
        messages: [
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
