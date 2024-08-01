import axios from 'axios';

const getCommon = async (inputMessage, secretWord) => {
  
  const apiURL = "http://taniakolesnik.pythonanywhere.com/common_word?word1=" + inputMessage.toLowerCase() 
  + "&word2=" + secretWord.toLowerCase() + "&top=3";
  console.log(apiURL)
  try {
    const response = await axios.get(apiURL);
    console.log(response.data.common)
    return response.data.common; 

  } catch (error) {
    return "error";
  }
};

export default getCommon;
