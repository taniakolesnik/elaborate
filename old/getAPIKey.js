import { db } from "../firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";
  
  export const fetchAPIKey = async (apiClient) => {
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

