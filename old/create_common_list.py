import numpy as np
from nltk.stem import PorterStemmer
from nltk.stem import LancasterStemmer
from datetime import date
import json
import random

import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords

# Load the GloVe model
def load_glove_model(file_path):
    glove_model = {}
    with open(file_path, 'r', encoding='utf8') as f:
        for line in f:
            split_line = line.split()
            word = split_line[0]
            embedding = np.array(split_line[1:], dtype=np.float32)
            glove_model[word] = embedding
    print("loaded model....")
    return glove_model

def get_common_word(word1, word2):
    # Initialize the stemmer
	stemmer = PorterStemmer()

        # Check if both words are provided
	if not word1 or not word2:
		return "Both word1 and word2 parameters are required"

        # Check if both words are in the model
	if word1 not in model or word2 not in model:
		return "One or both words not in vocabulary"

        # Stem the words
	word1_stem = stemmer.stem(word1)
	word2_stem = stemmer.stem(word2)

	print(word1_stem)
	print(word2_stem)

	mean_vector = (model[word1] + model[word2]) / 2

        # Find the most similar words to this mean vector
	similarity = {}
	for word, vector in model.items():
		if word != word1 and word != word2:
			if word1 not in word and word2 not in word:
				similarity[word] = np.dot(mean_vector, vector) / (np.linalg.norm(mean_vector) * np.linalg.norm(vector))

	# Find the most similar word
	if similarity:
		most_similar = max(similarity, key=similarity.get)
	print(similarity)
	return most_similar

def load_random():
	random_word = random.choice(countries_listed)
	return random_word

def get_list_from_file():
	with open('/Users/tetianakolesnik/Documents/MD/elaborate/complex.txt', 'r') as file:
	    # Initialize an empty list to store the rows
	    list_from_file = []
	    
	    # Iterate over each line in the file
	    for line in file:
	        # Strip leading/trailing whitespace and add to the list
	        list_from_file.append(line.strip())

	# Print the resulting list
	return list_from_file


def generate_common_list(secret_word):
	print(f"generating list for {secret_word}")
	common_list = {}
	for word in words:
		if (word != secret_word):
			common = find_common_word(secret_word, word)
			common_list[word] = common

	today = date.today()
	with open(f'/Users/tetianakolesnik/Documents/MD/elaborate/data/common_list_{today}_{secret_word}.json', 'w') as common_list_file:
		json.dump(common_list, common_list_file, indent=4)


model = load_glove_model("/Users/tetianakolesnik/Downloads/glove.6B/glove.6B.100d.txt")
words = list(model.keys())
print("words")
print(len(words))


# stemmer = LancasterStemmer()

# # Convert stopwords list to set for faster checking
# # https://stackoverflow.com/questions/62293141/clean-list-from-stopwords
# # https://stackoverflow.com/questions/8109687/how-to-remove-plurals-in-a-list-of-nouns
stopwords_set = set(stopwords.words('english'))
# words_fintered = [w for w in words if w.lower() not in stopwords_set and len(w) > 7  and '-' not in w and ' ' not in w]
words_fintered = [w for w in words if w.lower() not in stopwords_set and len(w) == 5  and '-' not in w and ' ' not in w]
print("words_fintered")
print(words_fintered[0:100])
print(len(words_fintered))

# # words = words_fintered
# complex_words = get_list_from_file()

# complex_words_listed_in_model = []
# for complex_word in complex_words:
# 	for word in words:
# 		if word == complex_word.lower():
# 			complex_words_listed_in_model.append(word)
# 			print(word)


# # random_word = load_random()
# # print(f'random word is "{random_word}"')


# # common_word = get_common_word("flag", "eritrea")
# # print(common_word)

	

# # Test the function
# # word1 = 'house'
# # word2 = 'tree'
# # common_word, similarity_to_word1 = find_common_word(word1, word2)
# # print(f'The common word between "{word1}" and "{word2}" is: {common_word}')
# # print(f'Similarity of "{common_word}" to "{word1}" is: {similarity_to_word1}')
# # print(f'random word is "{random_word}"')
# # generate_common_list(random_word)




