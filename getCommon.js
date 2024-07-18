import BigHugeLabsAPIClient from './BigHugeLabsAPIClient'
import getSynonyms from './getSynonyms';

const getCommon = async (wordOne, wordTwo) => {

  try { 

    const listOne = await getSynonyms(wordOne);
    const listTwo = await getSynonyms(wordTwo);

    alert(listTwo)

  } catch (error) {
    console.error('Error in getCommon:', error);
  }

    // // listOne.push(wordOne);
    // // listTwo.push(wordTwo);

    // const common = checkCommon(listOne, listTwo)

    // if (listOne.length > 100 || listTwo.length > 100 ){
    //     return null
    // }

    // if (common != null){
    //     return common[0];
    // }

    

}

const checkCommon = (listOne, listTwo) => {

    if (listOne.length == 0 || listTwo.lenght == 0){
        return null
    }

    const setOne = new Set(listOne);
    const setTwo = new Set(listTwo);
    const commonWords = [];

    setOne.forEach(word => {
    if (setTwo.has(word)) {
        commonWords.push(word);
    }
    });

    return commonWords; 
}

export default getCommon;

 


