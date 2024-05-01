import { db } from "./firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";

  let apiKey = null

  export const getAPIKey = async () => {
    if (!apiKey) {
      apiKey = await fetchAPIKey();
    }
    return apiKey;
  };
  
  const fetchAPIKey = async () => {
    const docRef = doc(db, "keys", "openai");
    try {
      const docSnapshot = await getDoc(docRef); 
      const value = docSnapshot.data().key;
      return value;
    } catch (error) {
      console.error("Error fetching API key:", error);
      return null; 
    }
  };

