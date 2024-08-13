import nltk
from nltk import pos_tag
from nltk.corpus import stopwords

nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger')

# Initialize stopwords set
stopwords_set = set(stopwords.words('english'))

def filter_five_letter_words(model):
    filtered_model = {
        word: vec for word, vec in model.items()
        if len(word) == 5 and word.lower() not in stopwords_set and '-' not in word and ' ' not in word
    }
    return filtered_model

def get_noun_embeddings(glove_embeddings):
    words = list(glove_embeddings.keys())
    word_tags = pos_tag(words)  # Tag all words at once for efficiency
    noun_embeddings = {
        word: glove_embeddings[word] for word, pos in word_tags if pos in ['NN', 'NNP']
    }
    return noun_embeddings

def load_glove_model(file_path):
    model = {}
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            split_line = line.split()
            word = split_line[0]
            embedding = [float(val) for val in split_line[1:]]
            model[word] = embedding
    return model

def save_glove_model(model, file_path):
    with open(file_path, 'w', encoding='utf-8') as f:
        for word, vector in model.items():
            vector_str = ' '.join(map(str, vector))
            f.write(f"{word} {vector_str}\n")

# Load the GloVe model
model = load_glove_model('/Users/tetianakolesnik/Downloads/glove.6B/glove.6B.300d.txt')

# Filter the model to only include five-letter words
filtered_model = filter_five_letter_words(model)

# Extract noun embeddings
filtered_model_noun = get_noun_embeddings(filtered_model)

# Save the filtered model
save_glove_model(filtered_model_noun, '/Users/tetianakolesnik/Downloads/glove.6B/glove.6B.300d.5.noun.txt')
