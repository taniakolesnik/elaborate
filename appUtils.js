
import { Alert } from 'react-native';
import { getData } from './asyncStorage';

export const startNewGame = async (message, gameRefresh) => {
  const secretWord = await getData("secretWord");
  showEndGameMessageWithSecretWord(message, secretWord, gameRefresh);
};

export const showEndGameMessageWithSecretWord = (message, secretWord, gameRefresh) => {
  Alert.alert(
    message,
    "Secret word was '" + secretWord + "'\nNew game starts now",
    [{ text: 'OK', onPress: () => gameRefresh() }],
    { cancelable: false }
  );
};

export const gameRefresh = (setGameKey) => {
  setGameKey(prevKey => prevKey + 1);
};

export const giveUp = (startNewGame) => {
  const message = "";
  startNewGame(message);
};

export const gameWin = (startNewGame) => {
  const message = "You won!";
  startNewGame(message);
};

export const onGiveUpAlert = (giveUp) =>
  Alert.alert('Give up', 'Are you sure you want to give up?', [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    { text: 'OK', onPress: () => giveUp() },
  ]);
