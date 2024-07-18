import BigHugeLabsAPIClient from './BigHugeLabsAPIClient'
import getSynonyms from './getSynonyms';

const getCommon = async (wordOne, wordTwo) => {

  console.log("getCommon called..." + wordOne )
  try { 

    const listOne = await getSynonyms(wordOne);
    const listTwo = await getSynonyms(wordTwo);

    listOne.push(wordOne);
    listTwo.push(wordTwo);

    const commonWords = runListsCheckChatGPT(listOne, listTwo, 0, 0)
    return commonWords

  } catch (error) {
    console.error('Error in getCommon:', error);
  }
}

const runListsCheck = async (listToCheckOne, listToCheckTwo, indexOne, indexTwo) => {

  if (listToCheckOne.length == indexOne || listToCheckTwo.length == indexTwo ){
    console.log("no new words added to either of lists. stop running runListsCheck")
    return null;
  }

  // remove dublicates

  console.log("runListsCheck called..." + listToCheckOne )
  console.log("listToCheckOne length " + listToCheckOne.length)

  console.log("runListsCheck called..." + listToCheckTwo )
  console.log("listToCheckTwo length " + listToCheckTwo.length)

  const setListOne = new Set(listToCheckOne);
  const listOne = Array.from(setListOne);

  const setListTwo = new Set(listToCheckTwo);
  const listTwo = Array.from(setListTwo);

  console.log("listOne after set clean: " + listOne)
  console.log("listTwo after set clean: " + listTwo)

  const indexOneForNew = listOne.length
  const indexTwoForNew = listTwo.length

  console.log("indexOneForNew " + indexOneForNew)
  console.log("indexTwoForNew " + indexTwoForNew)


  if (listOne.length > 50 || listTwo.length > 50){
    console.log("any of check lists is too long")
    return null
  } else {
    console.log("none of lists length not more that 50")
  }

  const commonWords = checkForCommonSyns(listOne, listTwo)

  if (commonWords > 0){
    return commonWords
  } else {
    console.log("no common words found ")
  }

  const synsForSynsListOne = []
  const synsForSynsListTwo = []
  
  for (let index = indexOne; index < listOne.length; index++) {
    console.log("================= " + index + "================= ")
    console.log("listOne.length is " + listOne.length)
    const synsForSyns = await getSynonyms(listOne[index])
    console.log("synsForSyns for " + listOne[index])
    if (synsForSyns.length == 0){
      continue
    }
    console.log("listOne updated with syns from " + listOne[index])
    console.log("listOne updated with synsForSyns " + synsForSyns)
    
    synsForSynsListOne.push(...synsForSyns)
  }

  for (let index = indexTwo; index < listTwo.length; index++) {
    console.log("================= " + index + "================= ")
    console.log("listOne.length is " + listOne.length)
    const synsForSyns = await getSynonyms(listTwo[index])
    console.log("synsForSyns for " + listOne[index])
    if (synsForSyns.length == 0){
      continue
    }
    console.log("listOne updated with syns from " + listOne[index])
    console.log("listOne updated with synsForSyns " + synsForSyns)
    synsForSynsListTwo.push(...synsForSyns)
  }



  console.log("listOne after all sub check " + listOne.length)
  console.log("listTwo after all sub checks " + listTwo.length)

  runListsCheck(listOne, listTwo, indexOneForNew, indexTwoForNew)

}

const runListsCheckChatGPT = async (listToCheckOne, listToCheckTwo, indexOne = 0, indexTwo = 0) => {

  // Exit if no new words are added
  if (listToCheckOne.length === indexOne && listToCheckTwo.length === indexTwo) {
    console.log("No new words added to either of lists. Stopping runListsCheck.");
    return null;
  }

  // Remove duplicates
  console.log("runListsCheck called...");
  console.log("listToCheckOne: " + listToCheckOne);
  console.log("listToCheckOne length: " + listToCheckOne.length);
  console.log("listToCheckTwo: " + listToCheckTwo);
  console.log("listToCheckTwo length: " + listToCheckTwo.length);

  const setListOne = new Set(listToCheckOne);
  const listOne = Array.from(setListOne);

  const setListTwo = new Set(listToCheckTwo);
  const listTwo = Array.from(setListTwo);

  console.log("listOne after set clean: " + listOne);
  console.log("listTwo after set clean: " + listTwo);

  const indexOneForNew = listOne.length;
  const indexTwoForNew = listTwo.length;

  console.log("indexOneForNew: " + indexOneForNew);
  console.log("indexTwoForNew: " + indexTwoForNew);

  if (listOne.length > 50 || listTwo.length > 50) {
    console.log("One or both lists are too long.");
    return null;
  } else {
    console.log("Neither list is longer than 50.");
  }

  let commonWords = checkForCommonSyns(listOne, listTwo);

  if (commonWords.length > 0) {
    console.log("Common words found: " + commonWords);
    return commonWords;
  } else {
    console.log("No common words found.");
  }

  const synsForSynsListOne = [];
  const synsForSynsListTwo = [];
  
  // Process listOne
  for (let index = indexOne; index < listOne.length; index++) {
    console.log("================= Processing index: " + index + " =================");
    console.log("listOne.length: " + listOne.length);
    
    const synsForSyns = await getSynonyms(listOne[index]);
    console.log("Synonyms for " + listOne[index] + ": " + synsForSyns);

    if (synsForSyns.length === 0) {
      continue;
    }

    commonWords = checkForCommonSyns(synsForSyns, listTwo)

    if (commonWords > 0){
      return commonWords
    } 

    console.log("Updating listOne with synonyms from " + listOne[index]);
    synsForSynsListOne.push(...synsForSyns);
  }

  // Process listTwo
  for (let index = indexTwo; index < listTwo.length; index++) {
    console.log("================= Processing index: " + index + " =================");
    console.log("listTwo.length: " + listTwo.length);
    
    const synsForSyns = await getSynonyms(listTwo[index]);
    console.log("Synonyms for " + listTwo[index] + ": " + synsForSyns);

    if (synsForSyns.length === 0) {
      continue;
    }

    commonWords = checkForCommonSyns(listOne, synsForSyns)

    if (commonWords > 0){
      return commonWords
    } 

    console.log("Updating listTwo with synonyms from " + listTwo[index]);
    synsForSynsListTwo.push(...synsForSyns);
  }

  // Add new synonyms to the original lists
  listOne.push(...synsForSynsListOne);
  listTwo.push(...synsForSynsListTwo);

  console.log("listOne after all sub-checks: " + listOne);
  console.log("listTwo after all sub-checks: " + listTwo);

  // Recursive call with updated lists and indices
  return runListsCheckChatGPT(listOne, listTwo, indexOneForNew, indexTwoForNew);
};


const checkForCommonSyns = (listOne, listTwo) => {

  // console.log("checkForCommonSyns called..." + listOne )

    if (listOne.length == 0 || listTwo.lenght == 0){
        return "no common syns"
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

 


