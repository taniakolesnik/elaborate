import axios from 'axios';
import { getAPIKey } from "./getAPIKey.js";
import BigHugeLabsAPIDataParser from "./BigHugeLabsAPIDataParser"

const BigHugeLabsAPIClient = async (inputMessage, secretWord) => {
  
  const apiKey = await getAPIKey("bighugelabsapi");
  
  const getList = async (word) => {
    apiURL = `https://words.bighugelabs.com/api/2/${apiKey}/${word}`
    
    try {
      const response = await axios.get(apiURL);
      const list = BigHugeLabsAPIDataParser(response.data);
      return list; 

    } catch (error) {
      console.error('Error calling BigHugeLabs API', error);
      return 'Error: Unable to fetch response';
    }
  }

  return await getList(inputMessage)

};

export default BigHugeLabsAPIClient;
