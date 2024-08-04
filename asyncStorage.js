import AsyncStorage from '@react-native-async-storage/async-storage';

export const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value
      } else {
        return null
      }
    } catch (error) {
      console.log(error)
    }
  };

export const setData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log(error)
    }
  };
