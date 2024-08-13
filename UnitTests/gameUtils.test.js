import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getRandomWord } from '../gameUtils'; 

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
