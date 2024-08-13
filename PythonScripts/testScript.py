import requests
import json
import numpy as np

# # The API endpoint
# url = "https://words.bighugelabs.com/api/2/52aada7c4fabfb100099d1816e52b5a2/pernicious/json"
# url = "https://words.bighugelabs.com/api/2/52aada7c4fabfb100099d1816e52b5a2/elusive/json"

# # subtle


def get_list(word):
    url = f'https://words.bighugelabs.com/api/2/52aada7c4fabfb100099d1816e52b5a2/{word}/json'
    try:
        # A GET request to the API
        response = requests.get(url)
        # Check if the response contains JSON data
        response_json = response.json()

        synonyms = set(response_json.get("noun", {}).get("syn", []))
        similar_words = set(response_json.get("noun", {}).get("sim", []))

        # print(synonyms)
        # print(similar_words)

        list_full = list(synonyms.union(similar_words))
        # print(f'checking {word} and its list is {list_full}')
        return list_full
        
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None

def check_common(word_one_list, word_two_list):
    result = set(word_one_list) & set(word_two_list)
    if (len(result) == 0):
        return None
    return result


def run_check(list_one, list_two):

    result = check_common(list_one, list_two)

    if (len(list_one) > 100 or len(list_two) > 100):
        return None
    
    if (result != None):
        return(list(result)[0])

    for i in list_one:
        sub_list = get_list(i)
        if (len(sub_list) == 0):
            continue
        list_one = list(set(list_one + sub_list))

    for i in list_two:
        sub_list = get_list(i)
        if (len(sub_list) == 0):
            continue
        list_two = list(set(list_two + sub_list))

    run_check(list_one, list_two)

word_one = 'makeup'
word_two = 'table'
list_one = get_list(word_one)
list_two = get_list(word_two)
# print(f'initial list for {word_one} is {list_one}' )
# print(f'initial list for {word_two} is {list_two}' )
result = run_check(list_one, list_two)
print(result)