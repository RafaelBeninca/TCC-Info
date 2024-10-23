import { Auth, User, deleteUser, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../contexts/firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { collection, deleteDoc, doc, Firestore, getDocs, query, where } from "firebase/firestore";

const DeleteAccountBtn: React.FC<{ uid: string}> = ({ uid }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);



  async function handleDeleteAccount(uid: string, auth: Auth, db: Firestore): Promise<void> {
    try {

      const userRef = collection(db, "user");
      const q = query(userRef, where("authUid", "==", uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty && querySnapshot.docs[0]) {
        const userDoc = querySnapshot.docs[0];
        const userDocRef = doc(db, "user", userDoc.id);
        await deleteDoc(userDocRef);
        console.log("Firestore document deleted successfuly.")
      } else {
        console.log("Error in deleting the Firestore document.")
      }
  
      const user = auth.currentUser;
      if (user && user.uid === uid) {
        await deleteUser(user);
        console.log(`User ${uid} deleted successfully from Firebase Authentication.`);
        navigate("/login");
      } else {
        console.error(`No authenticated user found or user ID mismatch.`);
      }
    } catch (error) {
      console.error("Error deleting user or document:", error);
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpenModal(true)}
        className="m-4 text-sm font-medium bgcol text-primary-light focus:outline-none bg-warning-default rounded-lg border-warning-light hover:bg-warning-dark hover:text-textcolor-light focus:z-10 focus:ring-4 focus:ring-gray-100"
      >
        Deletar conta
      </Button>
      <Modal
        show={openModal}
        size="sm"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-primary-dark">
              Are you sure you want to delete this product?
            </h3>
            <div className="flex justify-center gap-4">
              <Button className="bg-warning-default" onClick={() => handleDeleteAccount(uid, auth, db)}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DeleteAccountBtn;
