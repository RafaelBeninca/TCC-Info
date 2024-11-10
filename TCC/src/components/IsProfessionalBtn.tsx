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
import { auth, db } from "../contexts/firebase/firebaseConfig";
import useTableUserContext from "../hooks/useTableUserContext";
import { FirebaseAuthContext } from "../contexts/AuthenticationProvider/FirebaseAuthContext";

const DeleteAccountBtn: React.FC = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { user } = useTableUserContext();

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
      <Button
        onClick={() => setOpenModal(true)}
        className="text-sm font-medium text-textcolor-light focus:outline-none bg-warning-default rounded-lg hover:bg-warning-dark hover:text-textcolor-light focus:z-10 focus:ring-4 focus:ring-gray-100"
      >
        Deletar conta
      </Button>
      <Modal
        show={openModal}
        size="sm"
        onClose={() => setOpenModal(false)}
        popup
        className="fixed my-auto"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-primary-dark">
              Você tem certeza?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                className="bg-warning-default"
                onClick={() => handleDeleteAccount(user?.uid || "", auth, db)}
              >
                Sim, deletar
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                Não, cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DeleteAccountBtn;
