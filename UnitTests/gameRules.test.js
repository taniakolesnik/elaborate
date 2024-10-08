import { rules } from '../gameRules';

const expectedRules = "You may submit a 5-letter guess. \n\n" 
  + "After each guess, you will receive a list up to 3 of the most common words 'between' your guess word and the secret one and their similarity score to the secret word.\n\n"
  + "Think about this as you are looking for a secret direction and the game gives you 'change stations' you can use. And how close they are to the secret word.\n\n"
  + "There is no limit to the number of guesses you can make.\n\n"
  + "If you wish to give up, you can start a new game. The secret word of the current game will be revealed to you.";

test('rules should match the expected text', () => {
  expect(rules).toBe(expectedRules);
});