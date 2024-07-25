def load_glove_model(file_path):
    model = {}
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            split_line = line.split()
            word = split_line[0]
            embedding = [float(val) for val in split_line[1:]]
            model[word] = embedding
    return model

def filter_five_letter_words(model):
    filtered_model = {word: vec for word, vec in model.items() if len(word) == 5}
    return filtered_model

def save_glove_model(model, file_path):
    with open(file_path, 'w', encoding='utf-8') as f:
        for word, vec in model.items():
            vec_str = ' '.join(map(str, vec))
            f.write(f"{word} {vec_str}\n")

def main():
    glove_file_path = "/Users/tetianakolesnik/Downloads/glove.6B/glove.6B.100d.txt"
    filtered_glove_file_path = "/Users/tetianakolesnik/Downloads/glove.6B/glove.6B.100d.filtered.txt"
    
    # Load the original GloVe model
    model = load_glove_model(glove_file_path)
    
    # Filter the model to contain only 5-letter words
    filtered_model = filter_five_letter_words(model)
    
    # Save the filtered model to a new file
    save_glove_model(filtered_model, filtered_glove_file_path)
    print(f"Filtered GloVe model saved to {filtered_glove_file_path}")

if __name__ == "__main__":
    main()
