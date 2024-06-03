import axios from 'axios';
import { getAPIKey } from "./getAPIKey.js";

const ChatEngine = async (inputMessage) => {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const apiKey = await getAPIKey();
  const chatMode = "in 3 words";

  try {
    const response = await axios.post(
      apiUrl,
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: chatMode + inputMessage }]
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

export default ChatEngine;
