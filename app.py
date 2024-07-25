import numpy as np
from nltk.stem import PorterStemmer
from nltk.stem import LancasterStemmer

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import json

import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords

import random

# Load the GloVe model
def load_glove_model(file_path):
    glove_model = {}
    with open(file_path, 'r', encoding='utf8') as f:
        for line in f:
            split_line = line.split()
            word = split_line[0]
            embedding = np.array(split_line[1:], dtype=np.float32)
            glove_model[word] = embedding
    return glove_model

def find_common_word(word1, word2):
    # Initialize the stemmer
    

    # Check if both words are in the model
    if word1 not in model or word2 not in model:
        return "One or both words not in vocabulary"

    # Stem the words
    word1_stem = stemmer.stem(word1)
    word2_stem = stemmer.stem(word2)

    # Calculate the mean vector
    mean_vector = (model[word1] + model[word2]) / 2

    # Find the most similar words to this mean vector
    similarity = {}
    for word, vector in model.items():
        if word != word1 and word != word2:
            # Avoid words with similar stems
            if stemmer.stem(word) != word1_stem and stemmer.stem(word) != word2_stem:
                similarity[word] = np.dot(mean_vector, vector) / (np.linalg.norm(mean_vector) * np.linalg.norm(vector))

    # Find the most similar word
    if similarity:
        most_similar = max(similarity, key=similarity.get)
        return most_similar
    else:
        return "No suitable word found"

def load_random():
	random_word = random.choice(words)
	return random_word

def generate_common_list(secret_word):
	common_list = {}
	for word in words:
		if (word != secret_word):
			print("looking common for " + word)
			common = find_common_word(secret_word, word)
			common_list[word] = common

	with open('/Users/tetianakolesnik/Documents/MD/elaborate/common_list.json', 'w') as common_list_file:
		json.dump(common_list, common_list_file, indent=4)


model = load_glove_model("/Users/tetianakolesnik/Downloads/glove.6B/glove.6B.100d.txt")
words = list(model.keys())
stemmer = LancasterStemmer()

# Convert stopwords list to set for faster checking
# https://stackoverflow.com/questions/62293141/clean-list-from-stopwords
# https://stackoverflow.com/questions/8109687/how-to-remove-plurals-in-a-list-of-nouns
stopwords_set = set(stopwords.words('english'))
# Use stemmer.stem(w) instead of stemmer(w)
words_fintered = [w for w in words if w.lower() not in stopwords_set and len(w) > 7  and '-' not in w and ' ' not in w]

words = words_fintered
# print(len(words))
# print(len(words_fintered))
# print(words_fintered[10:20])

# Test the function
# word1 = 'house'
# word2 = 'tree'
# common_word, similarity_to_word1 = find_common_word(word1, word2)
# print(f'The common word between "{word1}" and "{word2}" is: {common_word}')
# print(f'Similarity of "{common_word}" to "{word1}" is: {similarity_to_word1}')
random_word = load_random()
print(f'random word is "{random_word}"')
generate_common_list(random_word)




