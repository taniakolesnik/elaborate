import nltk
from nltk import pos_tag

nltk.download('stopwords')
from nltk.corpus import stopwords

nltk.download('averaged_perceptron_tagger')

def get_noun_embeddings(glove_embeddings):
    noun_embeddings = {}
    for word in glove_embeddings:
        word_pos = pos_tag([word])[0][1]
        if word_pos in ['NN','NNP']:
            noun_embeddings[word] = glove_embeddings[word]
    return noun_embeddings

def filter_five_letter_words(model):
    filtered_model = {word: vec for word, vec in model.items() if len(word) == 5}
    return filtered_model



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



model = load_glove_model('/Users/tetianakolesnik/Downloads/glove.6B/glove.6B.300d.txt')
filtered_model = filter_five_letter_words(model)
filtered_model_noun = get_noun_embeddings(filtered_model)
# save_glove_model(filtered_model_noun, '/Users/tetianakolesnik/Downloads/glove.6B/glove.6B.300d.5.noun.txt')
stopwords_set = set(stopwords.words('english'))
words = list(filtered_model_noun.keys())
words_fintered = [w for w in words if w.lower() not in stopwords_set and len(w) == 5  and '-' not in w and ' ' not in w]
secret_words = words_fintered[0:200]


for w in secret_words:
    print(w)
