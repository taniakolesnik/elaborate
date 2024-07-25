const getCommon = async (inputMessage, secretWord) => {
  const apiURL = "http://taniakolesnik.pythonanywhere.com/common_word?word1=" + inputMessage.toLowerCase() + "&word2=" + secretWord.toLowerCase();
  console.log(apiURL)
  try {
    const response = await axios.get(apiURL);
    return response.data.top_3_words; 

  } catch (error) {
    console.error('Error calling APIClient API:', error);
    return 'Error: Unable to fetch response';
  }
};

export default getCommon;

 


