import AsyncStorage from '@react-native-async-storage/async-storage';

// retrieve data from AsyncStorage by a given key.
export const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key); // Fetches value for the specified key from storage.
      if (value !== null) {
        return value // Return the value if it exists.
      } else {
        return null // Return null if no value is found.
      }
    } catch (error) {
      console.log(error) // Log any errors that occur during retrieval.
    }
  };

// save data to AsyncStorage with a given key and value.
export const setData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value); // Stores the key-value pair in AsyncStorage.
    } catch (error) {
      console.log(error) // Log any errors that occur during saving.
    }
  };
