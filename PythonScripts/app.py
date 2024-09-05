from flask import Flask, request, jsonify
import random
import numpy as np
import nltk
nltk.download('stopwords')  # Download NLTK stopwords, if needed

app = Flask(__name__)
app.config['DEBUG'] = True  # Enable debug mode

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

# Load GloVe model
model = load_glove_model("/home/taniakolesnik/elaborate/glove.6B.300d.5.noun-2.txt")

@app.route('/')
def hello_world():
    return 'Hello from Flask!'


@app.route('/common_word', methods=['GET'])
def get_common_word():
    try:
        # Get words from query parameters
        word1 = request.args.get('word1')
        word2 = request.args.get('word2')
        number = request.args.get('top', 3)

        # Check if both words are provided
        if not word1 or not word2:
            return jsonify({'error': 'Both word1 and word2 parameters are required'}), 400

        # Check if both words are in the model
        if word1 not in model or word2 not in model:
            return jsonify({'common': 'One or both words not in vocabulary'})

        try:
            # Load stop words from a file
            with open('/home/taniakolesnik/elaborate/stop_words.txt', 'r') as file:
                stop_words = [line.strip() for line in file]
        except Exception as e:
            return jsonify({'error': 'canont load stop words'}), 500

        # Compute the mean vector
        word1_vector = model[word1]
        word2_vector = model[word2]

        mean_vector = (word1_vector + word2_vector) / 2

        norm_word2_vector = np.linalg.norm(word2_vector)

        similarity = {}
        for word, vector in model.items():
            if word != word1 and word != word2:
                if word1 not in word and word2 not in word:
                    norm_mean_vector = np.linalg.norm(mean_vector)
                    norm_vector = np.linalg.norm(vector)
                    if norm_mean_vector > 0 and norm_vector > 0 and norm_word2_vector > 0:
                        similarity_mean = np.dot(mean_vector, vector) / (norm_mean_vector * norm_vector)
                        similarity_secret = np.dot(word2_vector, vector) / (norm_word2_vector * norm_vector)

                        if similarity_mean > 0 and similarity_secret > 0:
                            similarity[word] = [similarity_mean, similarity_secret]


        # Sort by similarity and get the top number words
        if similarity:
            sorted_words = sorted(similarity.items(), key=lambda item: (item[1][0]), reverse=True)
            top_words = [(word, '%.2f' % score[1]) for word, score in sorted_words[:int(number)] if word.lower() not in stop_words]
            sorted_top_words = sorted(top_words, key=lambda item: float(item[1]), reverse=True)
            return jsonify({'common': sorted_top_words})
        else:
            return jsonify({'error': 'No similar words found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/random', methods=['GET'])
def get_random():
    try:
        with open('/home/taniakolesnik/elaborate/secret_words_5.txt', 'r') as file:
            secret_words = [line.strip() for line in file]
        random_word = random.choice(secret_words)
        return jsonify({'secret_word': random_word})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run()
