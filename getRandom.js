import axios from 'axios';
// import { fetchAPIKey } from "./getAPIKey.js";

const getRandom = async () => {

    const apiURL = "http://taniakolesnik.pythonanywhere.com/random"
    let secret_word = null;
    try {
        const response = await axios.get(apiURL);
        secret_word = response.data.secret_word
    } catch (error) {
        console.log(error);
    }

    return secret_word
}

export default getRandom;
