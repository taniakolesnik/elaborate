# Load the text8 model
from flask import Flask, request, jsonify

import numpy as np
from nltk.stem import PorterStemmer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

import nltk
nltk.download('punkt')
nltk.download('stopwords')

app = Flask(__name__)
app.config['DEBUG'] = True  # Enable debug mode

# Load the GloVe model
# https://stackoverflow.com/questions/37793118/load-pretrained-glove-vectors-in-python
def load_glove_model(file_path):
    glove_model = {}
    with open(file_path, 'r', encoding='utf8') as f:
        for line in f:
            split_line = line.split()
            word = split_line[0]
            embedding = np.array(split_line[1:], dtype=np.float32)
            glove_model[word] = embedding
    return glove_model

# Adjust the path as per your environment
model = load_glove_model("/home/taniakolesnik/elaborate/glove.6B.50d.txt")

@app.route('/')
def hello_world():
    return 'Hello from Flask!'

@app.route('/common_word', methods=['GET'])
def get_common_word():
    try:
        # Initialize the stemmer
        stemmer = PorterStemmer()

        # Load GloVe model
        model = load_glove_model("/home/taniakolesnik/elaborate/glove.6B.50d.txt")

        # Get words from query parameters
        word1 = request.args.get('word1')
        word2 = request.args.get('word2')

        # Check if both words are provided
        if not word1 or not word2:
            return jsonify({'error': 'Both word1 and word2 parameters are required'}), 400

        # Check if both words are in the model
        if word1 not in model or word2 not in model:
            return jsonify({'error': 'One or both words not in vocabulary'}), 400

        # Stem the words
        word1_stem = stemmer.stem(word1)
        word2_stem = stemmer.stem(word2)

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
            # similarity_to_word1 = float(np.dot(model[most_similar], model[word1]) / (np.linalg.norm(model[most_similar]) * np.linalg.norm(model[word1])))

            # return jsonify({'common_word': most_similar, 'similarity_to_word1': similarity_to_word1})
            return jsonify({'common_word': most_similar})
        else:
            return jsonify({'error': 'No similar words found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run()
