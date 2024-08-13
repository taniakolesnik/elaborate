import { getData, setData } from '../asyncStorage.js'; // Adjust the path to your module
import AsyncStorage from '@react-native-async-storage/async-storage';

// Manual mock of AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

describe('AsyncStorage functions', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should store data using setData', async () => {
        const key = 'testKey';
        const value = 'testValue';
        await setData(key, value);
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(key, value);
    });

    it('should retrieve data using getData', async () => {
        const key = 'testKey';
        const value = 'testValue';

        // Mocking AsyncStorage.getItem to return value
        AsyncStorage.getItem.mockResolvedValueOnce(value);

        const result = await getData(key);

        expect(AsyncStorage.getItem).toHaveBeenCalledWith(key);
        expect(result).toBe(value);
    });

    it('should return null if key does not exist in getData', async () => {
        const key = 'nonExistentKey';

        // Mocking AsyncStorage.getItem to return null
        AsyncStorage.getItem.mockResolvedValueOnce(null);

        const result = await getData(key);

        expect(AsyncStorage.getItem).toHaveBeenCalledWith(key);
        expect(result).toBeNull();
    });

    it('should handle error in setData gracefully', async () => {
        const key = 'testKey';
        const value = 'testValue';

        // Mocking AsyncStorage.setItem to throw an error
        AsyncStorage.setItem.mockImplementationOnce(() => {
            throw new Error('Storage Error');
        });

        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        await setData(key, value);

        expect(consoleSpy).toHaveBeenCalledWith(new Error('Storage Error'));

        consoleSpy.mockRestore();
    });

    it('should handle error in getData gracefully', async () => {
        const key = 'testKey';

        // Mocking AsyncStorage.getItem to throw an error
        AsyncStorage.getItem.mockImplementationOnce(() => {
            throw new Error('Storage Error');
        });

        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        await getData(key);

        expect(consoleSpy).toHaveBeenCalledWith(new Error('Storage Error'));

        consoleSpy.mockRestore();
    });
});
