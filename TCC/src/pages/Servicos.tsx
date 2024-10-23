import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { auth, db } from "../contexts/firebase/firebaseConfig";
import "flowbite";
import { onAuthStateChanged } from "firebase/auth";
import { CustomTableUser } from "../components/Interfaces";
import { collection, getDocs, query, where } from "firebase/firestore";
import { DarkThemeToggle, Flowbite } from "flowbite-react";
import DeleteAccountBtn from "../components/DeleteAccountBtn";

const Servicos = () => {
  const [tableUser, setTableUser] = useState<CustomTableUser | null>(null);

  useEffect(() => {
    let uid: string;
    const listen = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      uid = user.uid;
      if (user) {
        const userRef = collection(db, "user");
        const q = query(userRef, where("authUid", "==", uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty && querySnapshot.docs[0]) {
          const userData = querySnapshot.docs[0].data();

        setTableUser({
          uid: userData.uid,
          name: userData.name,
          isProfessional: userData.isProfessional,
          profilePicture: userData.profilePicture,
          authUid: userData.authUid,
        });
        } else {
          console.log("No user found with the given authUid");
          setTableUser(null);
        }
      } else {
        setTableUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  const { currentUser } = useAuth();
  return (
    <>
      <Flowbite>
        <div className=" h-screen mt-8 bg bg-white dark:bg-slate-900">
          <div className="flex flex-col bg-gray-200 w-5/6 h-2/4 pl-6 mx-auto rounded-xl">
            {tableUser && (
              <p className="pt-5 text-6xl font-bold">
                Bem-Vindo, {tableUser.name}!
              </p>
            )}
            <p className="pt-5 text-2xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              convallis sit amet felis ac fringilla. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit.
            </p>
          </div>
        </div>
      </Flowbite>
    </>
  );
};

export default Servicos;
