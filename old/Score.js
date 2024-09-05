import { getData, setData } from '../asyncStorage';

export const getScore = async () => {
    try {
      const score = await getData("bestScore")
      return score
    } catch (error) {
      return "error on setting score";
    }
  };
  
export const updateScore = async (score) => {
  try {
    await setData("bestScore", score)
  } catch (error) {
    return "error on setting best score";
  }
}




