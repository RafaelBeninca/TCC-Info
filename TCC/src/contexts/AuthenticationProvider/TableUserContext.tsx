import { doc, getDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { CustomTableUser } from "../../components/Interfaces";
import useFirebaseAuthContext from "../../hooks/useFirebaseAuthContext";
import { db } from "../firebase/firebaseConfig";

interface ITableUserContext {
  user: CustomTableUser | null;
  setUser: React.Dispatch<React.SetStateAction<CustomTableUser | null>>
}

const TableUserContext = createContext<ITableUserContext | null>(null);

interface TableUserContextProviderProps {
  children: React.ReactNode;
}

const TableUserContextProvider = ({
  children,
}: TableUserContextProviderProps) => {
  const [user, setUser] = useState<CustomTableUser | null>(null);
  const { currentUser } = useFirebaseAuthContext();

  console.log("Outside useEffect: " + currentUser);

  useEffect(() => {
    const getTableUser = async () => {
      if (currentUser) {
        console.log("Getting table user: " + currentUser);

        const uid = currentUser.uid;
        const docRef = doc(db, "user", uid);
        const docSnap = await getDoc(docRef);
        console.log(docSnap);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          console.log(userData);

          setUser({
            uid: uid,
            name: userData.name,
            isProfessional: userData.isProfessional,
            profilePicture: userData.profilePicture,
            email: userData.email,
            password: userData.password,
            description: userData.description,
            displayCity: userData.displayCity,
            displayEmail: userData.displayEmail,
            displayPhone: userData.displayPhone,
          });
        } else {
          console.log(
            "Não foi possível encontrar um usuário com este id/uid" +
              docSnap.id +
              "/" +
              uid
          );
          setUser(null);
        }
      } else {
        console.log("Setting user to null: " + currentUser);

        setUser(null);
      }
    };

    setTimeout(() => getTableUser(), 5);
  }, [currentUser]);

  return (
    <TableUserContext.Provider value={{ user, setUser }}>
      {children}
    </TableUserContext.Provider>
  );
};

export default TableUserContext;
export { TableUserContextProvider };

