import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getRandomWord, getCommon } from '../gameUtils'; 

describe('getRandomWord tests', () => {
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



describe('getCommon tests', () => {
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