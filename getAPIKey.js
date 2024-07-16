import { db } from "./firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";

  let apiKey = null

  export const getAPIKey = async (apiClient) => {
    if (!apiKey) {
      apiKey = await fetchAPIKey(apiClient);
    }
    return apiKey;
  };
  
  const fetchAPIKey = async (apiClient) => {
    const docRef = doc(db, "keys", apiClient);
    try {
      const docSnapshot = await getDoc(docRef); 
      const value = docSnapshot.data().key;
      return value;
    } catch (error) {
      console.error("Error fetching API key:", error);
      return null; 
    }
  };

