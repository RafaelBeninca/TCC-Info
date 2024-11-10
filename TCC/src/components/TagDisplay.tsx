import { Auth, deleteUser } from "firebase/auth";
import {
  deleteDoc,
  doc,
  Firestore,
  getDoc
} from "firebase/firestore";
import { Button, Modal } from "flowbite-react";
import { useContext, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../contexts/firebase/firebaseConfig";
import useTableUserContext from "../hooks/useTableUserContext";
import { FirebaseAuthContext } from "../contexts/AuthenticationProvider/FirebaseAuthContext";

const TagDisplay: React.FC = () => {
  const { user } = useTableUserContext();

  const context = useContext(FirebaseAuthContext);

  if (!context) {
    throw new Error("FirebaseAuthContext must be used within a FirebaseAuthContextProvider");
  }

  const {dispatch} = context;

  async function handleDeleteAccount(
    uid: string,
    auth: Auth,
    db: Firestore
  ): Promise<void> {
    try {
      const user = auth.currentUser;
      if (user && user.uid === uid) {
        await deleteUser(user);
        console.log(
          `User ${uid} deleted successfully from Firebase Authentication.`
        );
      } else {
        console.error(`No authenticated user found or user ID mismatch.`);
      }

      const userRef = doc(db, "user", uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        await deleteDoc(userRef);
        console.log("Documento deletado com sucesso do Firestore.");
        dispatch({
          type: "LOGOUT",
        });
        navigate("/login");
      } else {
        console.log("Erro ao deletar documento do Firestore.");
      }
    } catch (error) {
      console.error("Error deleting user or document:", error);
    }
  }

  return (
    <>
      <div>
        c
      </div>
    </>
  );
};

export default TagDisplay;
