import axios from 'axios';
import { fetchAPIKey } from "./getAPIKey.js";
import BigHugeLabsAPIDataParser from "./BigHugeLabsAPIDataParser.js"

const RandomWord = async () => {

    const apiURL = "https://wordsapiv1.p.rapidapi.com/words/?random=true"

    let apiKey = null;
    let isFound = false;
    let reply = null;

    const getAPIKey = async (apiClient) => {
       if (!apiKey) {
         apiKey = await fetchAPIKey(apiClient);
       }
       return apiKey;
     };
     
     apiKey = await getAPIKey("wordsapi");


    // code take from https://rapidapi.com/guides/use-axios-for-api-requests
    const getWordData = async () => {
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
            return res.data
        } catch (err) {
            console.log(err);
            return "error"
        }
    };


    while (!isFound) {
        const data = await getWordData();
        if (data.results && data.results.length > 0) {
            isFound = true
            reply = data.word
        } else {
            console.log(data.word + " does not have results section. continue searching")
        }
    }
    return reply
}




export default RandomWord;
