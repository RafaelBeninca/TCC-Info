import { User, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../contexts/firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { Button, Flowbite, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import customTheme from "./Theme";

const DeleteAccountBtn = () => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(true);
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();

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

  const handleDeleteAccount = () => {
    const user = auth.currentUser;
    if (user) {
      user
        .delete()
        .then(() => {
          console.log("Conta deletada com sucesso.");
          navigate("/login");
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  };

  return (
    <Flowbite theme={customTheme}>
      <Button
        onClick={() => setOpenModal(true)}
        className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        Teste
      </Button>
      <Modal show={openModal} size="sm" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-primary-dark">
              Are you sure you want to delete this product?
            </h3>
            <div className="flex justify-center gap-4">
              <Button className="bg-warning" onClick={() => setOpenModal(false)}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Flowbite>
  );
};

export default DeleteAccountBtn;
