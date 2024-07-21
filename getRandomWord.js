import axios from 'axios';
// import { fetchAPIKey } from "./getAPIKey.js";

const getRandomWord = async () => {

    // const apiURL = "https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=7&lettersMax=12&partOfSpeech=verb&frequencyMin=2.5"
    const apiURL = "http://taniakolesnik.pythonanywhere.com/random"
    // let apiKey = null;
    let isFound = false;
    let secret = null;

    // const getAPIKey = async (apiClient) => {
    //    if (!apiKey) {
    //      apiKey = await fetchAPIKey(apiClient);
    //    }
    //    return apiKey;
    //  };
     
    //  apiKey = await getAPIKey("wordsapi");


    // code take from https://rapidapi.com/guides/use-axios-for-api-requests
    const getSecret = async () => {
        
        try {
            const res = await axios.get(apiURL);
            console.log(res.data.secret_word)
            return res.data.secret_word
        } catch (err) {
            console.log(err);
            return "error"
        }
    };


    // while (!isFound) {
    //     const data = await getWordData();
    //     if (data.results && data.results.length > 0) {
    //         isFound = true
    //         reply = data.word
    //     } else {
    //         console.log("RandomWord: " + data.word + " does not have results section. continue searching")
    //     }
    // }
    secret = await getSecret()
    return secret
}

export default getRandomWord;
