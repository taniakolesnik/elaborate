import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getRandomWord, getCommon, validateInput, formatDictionary } from '../gameUtils'; 

describe('getRandomWord', () => {
    let mock;

    beforeAll(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.reset();
    });

    afterAll(() => {
        mock.restore();
    });

    it('should return the secret word when the API request is successful', async () => {
        mock.onGet('http://taniakolesnik.pythonanywhere.com/random').reply(200, {
            secret_word: 'example'
        });

        const word = await getRandomWord();
        expect(word).toBe('example');
    });

    it('should return "error" when the API request fails', async () => {
        mock.onGet('http://taniakolesnik.pythonanywhere.com/random').reply(500);
        const word = await getRandomWord();
        expect(word).toBe('error');
    });
});



describe('getCommon', () => {
    let mock;

    beforeAll(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.reset();
    });

    afterAll(() => {
        mock.restore();
    });

    it('should generate the correct API URL and return the common word when the API request is successful', async () => {
        const inputMessage = "TestInput";
        const secretWord = "SecretWord";
        const expectedUrl = "http://taniakolesnik.pythonanywhere.com/common_word?word1=testinput&word2=secretword&top=3";

        // Mock the axios response
        mock.onGet(expectedUrl).reply(200, {
            common: 'CommonWord'
        });

        const commonWord = await getCommon(inputMessage, secretWord);
        expect(commonWord).toBe('CommonWord');

        // Verify the correct URL was generated
        const requestUrl = mock.history.get[0].url;
        expect(requestUrl).toBe(expectedUrl);
    });

    it('should return "error" when the API request fails', async () => {
        const inputMessage = "TestInput";
        const secretWord = "SecretWord";
        const expectedUrl = "http://taniakolesnik.pythonanywhere.com/common_word?word1=testinput&word2=secretword&top=3";

        // Mock the axios response to simulate an error
        mock.onGet(expectedUrl).reply(500);

        const commonWord = await getCommon(inputMessage, secretWord);
        expect(commonWord).toBe('error');

        // Verify the correct URL was generated
        const requestUrl = mock.history.get[0].url;
        expect(requestUrl).toBe(expectedUrl);
    });
});


describe('validateInput', () => {
  it('should return true for a valid input of exactly 5 alphabetic characters', () => {
    expect(validateInput('abcde')).toBe(true);
  });

  it('should return false for input with less than 5 characters', () => {
    expect(validateInput('abcd')).toBe(false);
  });

  it('should return false for input with more than 5 characters', () => {
    expect(validateInput('abcdef')).toBe(false);
  });

  it('should return false for input with non-alphabetic characters', () => {
    expect(validateInput('abc1e')).toBe(false);
    expect(validateInput('abc@e')).toBe(false);
  });

  it('should return false for an empty string', () => {
    expect(validateInput('')).toBe(false);
  });

  it('should return false for input with spaces', () => {
    expect(validateInput('abc e')).toBe(false);
  });
});


describe('formatDictionary', () => {
    it('should format a dictionary with multiple key-value pairs', () => {
      const input = {
        words: [['word1', 5.1], ['word2', 0.1]]
      };
      const expectedOutput = [
        'words: word1 (5.1), word2 (0.1)'
      ];
      expect(formatDictionary(input)).toEqual(expectedOutput);
    });
  
    it('should return an empty array for an empty dictionary', () => {
      const input = {};
      const expectedOutput = [];
      expect(formatDictionary(input)).toEqual(expectedOutput);
    });
  
    it('should handle a dictionary with an empty array for a key', () => {
      const input = {
        emptyKey: [],
      };
      const expectedOutput = ['emptyKey: '];
      expect(formatDictionary(input)).toEqual(expectedOutput);
    });
  
    it('should handle a dictionary with one key and one entry', () => {
      const input = {
        singleKey: [['word', 1.9]],
      };
      const expectedOutput = ['singleKey: word (1.9)'];
      expect(formatDictionary(input)).toEqual(expectedOutput);
    });
  });