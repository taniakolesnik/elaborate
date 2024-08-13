import { getAPIKey } from '../old/getAPIKey';
import { fetchAPIKey } from '../old/getAPIKey';

test('getAPIKey should return "testKey" when apiClient is "test"', async () => {
    const result = await getAPIKey('test');
    expect(result).toBe('testKey');
});

test.todo('right a mock test for firebase access');

test('fetchAPIKey should return "testKey" when apiClient is "test"', async () => {
    const result = await fetchAPIKey('test');
    expect(result).toBe('testKey');
});