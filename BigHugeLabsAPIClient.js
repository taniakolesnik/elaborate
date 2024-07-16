import axios from 'axios';
import { getAPIKey } from "./getAPIKey.js";

const BigHugeLabsAPIClient = async (inputMessage, secretWord) => {
  const apiURL = 'https://api.openai.com/v1/chat/completions';
  const apiKey = await getAPIKey("bighugelabsapi");

  // try {
  //   const response = await axios.post(

  //     apiURL,
  //     {
  //       model: "gpt-3.5-turbo",
  //       messages: [
  //         {role: "user", content: userContent}
  //       ],
  //       temperature: 0,  
  //       top_p: 0.36,
  //       max_tokens: 50
  //     },
  //     {
  //       headers: {
  //         'Authorization': `Bearer ${apiKey}`,
  //         'Content-Type': 'application/json'
  //       }
  //     }
  //   );
    return apiKey; 

  // } catch (error) {
  //   console.error('Error calling OpenAI API:', error);
  //   return 'Error: Unable to fetch response';
  // }
};

export default BigHugeLabsAPIClient;
