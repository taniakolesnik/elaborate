import React from 'react';

const parseSynonyms = (data) => {


  const synonymsSet = new Set();

  
  if (data.results && data.results.length > 0) {
    data.results.forEach(result => {
      if (result.synonyms && result.synonyms.length > 0) {
        result.synonyms.forEach(synonym => synonymsSet.add(synonym));
      }
    });
  }
  if (synonymsSet.length == 0) {
    return null
  }
  return [...synonymsSet];
};

export default parseSynonyms;
