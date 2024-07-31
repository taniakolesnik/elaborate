import axios from 'axios';
// import { fetchAPIKey } from "./getAPIKey.js";

const getRandomWord = async () => {

    // const apiURL = "https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=7&lettersMax=12&partOfSpeech=verb&frequencyMin=2.5"
    const apiURL = "http://taniakolesnik.pythonanywhere.com/random"
    let secret = null;

    const getSecret = async () => {
        
        try {
            const res = await axios.get(apiURL);
            console.log(res.data.secret_word)
            return res.data.secret_word
        } catch (error) {
            return "error"
        }
    };

    secret = await getSecret()
    return secret
}

export default getRandomWord;
