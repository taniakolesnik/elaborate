import axios from 'axios';
import GetAPIKey from "./GetAPIKey";
import BigHugeLabsAPIDataParser from "./BigHugeLabsAPIDataParser"

const getRandom = async () => {

    const apiKey = await GetAPIKey("wordsapi");
    const apiURL = "https://wordsapiv1.p.rapidapi.com/words/?random=true"


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

            console.log(res.data.word)
        } catch (err) {
            console.log(err);
        }
    };

    const reply = await getWord()
    return reply
}




export default getRandom;
