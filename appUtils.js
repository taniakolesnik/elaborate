import { Alert } from 'react-native';
import { getData } from './asyncStorage';

// Asynchronously starts a new game by retrieving the previous secret word from async storage
// and displaying it in an alert before refreshing the game state.
export const startNewGame = async (message, gameRefresh) => {
  const secretWord = await getData("secretWord");
  showEndGameMessageWithSecretWord(message, secretWord, gameRefresh);
};

// Displays an alert message to the user with the previous secret word and indicates that a new game is starting.
// Once the user acknowledges the alert, the game refreshes.
export const showEndGameMessageWithSecretWord = (message, secretWord, gameRefresh) => {
  Alert.alert(
    message, // Custom message to show (e.g., win or give up).
    "Secret word was '" + secretWord + "'\nNew game starts now", // Shows the previous secret word.
    [{ text: 'OK', onPress: () => gameRefresh() }], // Upon pressing OK, the game state is refreshed.
    { cancelable: false }  // Disables the ability to dismiss the alert without acknowledging it.
  );
};

// Updates the game state by incrementing the game key, which triggers a full refresh of the game screen.
export const gameRefresh = (setGameKey) => {
  setGameKey(prevKey => prevKey + 1);
};

// Handles the give-up action by starting a new game without displaying a win or loss message.
export const giveUp = (startNewGame) => {
  const message = ""; // No message for the give-up scenario.
  startNewGame(message); // Triggers the start of a new game.
};

// Resets the game with a “You won!” message after the player wins.
export const gameWin = (startNewGame) => {
  const message = "You won!"; // Custom message for the win scenario.
  startNewGame(message); // Triggers the start of a new game.
};

// Displays a confirmation alert to the player when they attempt to give up.
// Provides options to cancel or confirm giving up, and if confirmed, triggers the give-up logic.
export const onGiveUpAlert = (giveUp) =>
  Alert.alert('Give up', 'Are you sure you want to give up?', [
    {
      text: 'Cancel', // Option to cancel and return to the game.
      style: 'cancel', // Marks this option as a cancel action.
    },
    { text: 'OK', onPress: () => giveUp() }, // Proceeds with giving up if OK is pressed.
  ]);
