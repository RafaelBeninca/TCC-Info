import { db } from "../contexts/firebase/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { FormUser } from "./Interfaces";

const userCollection = collection(db, "user")

const createUser = async (user:FormUser): Promise<void> => {
  try {
    await addDoc(userCollection, user);
  } catch (error) {
    console.error("Erro", error);
  }
}

export default(createUser)