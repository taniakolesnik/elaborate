import axios from 'axios';
import { getAPIKey } from "./getAPIKey.js";

const ChatEngine = async (inputMessage, secretWord) => {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const apiKey = await getAPIKey();
  const question = "Does '" + inputMessage + "' mean '" + secretWord + " in posh English' ?";
  const wantedReply = "yes, no or almost."
  const questionDetailed = "if no or alost, without reveling words meanings, in a 4-5 max words starting as 'they are both' what is common between them";

  


  try {
    const response = await axios.post(
      apiUrl,
      {
        model: "gpt-4",
        messages: [{ role: "user", content: question + wantedReply + questionDetailed}]
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
