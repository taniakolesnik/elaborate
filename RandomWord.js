import axios from 'axios';
import { fetchAPIKey } from "./getAPIKey.js";
import BigHugeLabsAPIDataParser from "./BigHugeLabsAPIDataParser.js"

const RandomWord = async () => {

    const apiURL = "https://wordsapiv1.p.rapidapi.com/words/?random=true"

    let apiKey = null;

    const getAPIKey = async (apiClient) => {
       if (!apiKey) {
         apiKey = await fetchAPIKey(apiClient);
       }
       return apiKey;
     };
     
     apiKey = await getAPIKey("wordsapi");


    // code take from https://rapidapi.com/guides/use-axios-for-api-requests
    const getWord = async () => {
        try {
            const res = await axios.get(
                apiURL,
                {
                    headers: {
                        'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
                        'x-rapidapi-key': apiKey
                    }
                }
            );
            return res.data.word
        } catch (err) {
            console.log(err);
            return "error"
        }
    };

    const reply = await getWord()
    return reply
}




export default RandomWord;
