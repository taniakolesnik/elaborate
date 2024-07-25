import axios from 'axios';
import { fetchAPIKey } from "../getAPIKey.js";
import parseSynonyms from './parseSynonyms.js';

const getSynonyms = async (word) => {

    let apiKey = null;
    
    const getAPIKey = async (apiClient) => {
        if (!apiKey) {
            apiKey = await fetchAPIKey(apiClient);
        }
        return apiKey;
    };

    apiKey = await getAPIKey("wordsapi");

    // code take from https://rapidapi.com/guides/use-axios-for-api-requests
    const getList = async (word) => {

        const apiURL = `https://wordsapiv1.p.rapidapi.com/words/${word}`

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

    const data = await getList(word);
    const synonyms = parseSynonyms(data)
    return synonyms;

};

export default getSynonyms;
