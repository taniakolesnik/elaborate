from flask import Flask, request, jsonify
import random
import numpy as np
import nltk
nltk.download('stopwords')  # Download NLTK stopwords, if needed


def load_glove_model(file_path):
    model = {}
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            split_line = line.split()
            word = split_line[0]
            embedding = np.array([float(val) for val in split_line[1:]])
            model[word] = embedding
    return model

def get_common_word(word1, word2, number):
    try:

        # Check if both words are in the model
        if word1 not in model or word2 not in model:
            return "One or both words not in vocabulary"

        try:
            # Load stop words from a file
            with open('/Users/tetianakolesnik/Documents/MD/elaborate/stop_words.txt', 'r') as file:
                stop_words = [line.strip() for line in file]
        except Exception as e:
            return "canont load stop words"

        # Compute the mean vector
        # mean_vector = model[word1] + model[word2] 

        word1_vector = model[word1]
        word2_vector = model[word2]

        mean_vector = (word1_vector + word2_vector) / 2

        norm_word1_vector = np.linalg.norm(word1_vector)
        norm_word2_vector = np.linalg.norm(word2_vector)

        # # Calculate similarity
        similarity = {}
        for word, vector in model.items():
            if word != word1 and word != word2:
                if word1 not in word and word2 not in word:
                    norm_mean_vector = np.linalg.norm(mean_vector)
                    norm_vector = np.linalg.norm(vector)
                    if norm_mean_vector > 0 and norm_vector > 0:
                        similarity_mean = np.dot(mean_vector, vector) / (norm_mean_vector * norm_vector)
                        similarity_word1 = np.dot(word1_vector, vector) / (norm_word1_vector * norm_vector)
                        similarity_word2 = np.dot(word2_vector, vector) / (norm_word2_vector * norm_vector)

                        if similarity_mean > 0 and similarity_word1 > 0 and similarity_word2 > 0:
                            similarity[word] = [similarity_mean, similarity_word1, similarity_word2]



        # Sort by similarity and get the top number words
        if similarity:
            sorted_words = sorted(similarity.items(), key=lambda item: item[1], reverse=True)
            # print(sorted_words)
            top_words = [(word, '%.2f' % score[0], '%.2f' % score[1], '%.2f' % score[2]) for word, score in sorted_words[:int(number)] if word.lower() not in stop_words]
            return top_words
        else:
            return "No similar words found"

    except Exception as e:
        return e


model = load_glove_model('/Users/tetianakolesnik/Downloads/glove.6B/glove.6B.300d.5.noun.txt')
result = get_common_word("tasty", "april", 1)
print(result)