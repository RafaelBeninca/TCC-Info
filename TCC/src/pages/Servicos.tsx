import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { auth, db } from "../contexts/firebase/firebaseConfig";
import "flowbite";
import { onAuthStateChanged, User } from "firebase/auth";
import { CustomTableUser } from "../components/Interfaces";
import { collection, getDocs, query, where } from "firebase/firestore";
import { DarkThemeToggle, Flowbite } from "flowbite-react";
import blankpfp from "../assets/images/blankpfp.jpg";

const Servicos = () => {
  const [tableUser, setTableUser] = useState<CustomTableUser | null>(null);
  const [users, setUsers] = useState<UserList[]>([]);

  type UserList = {
    id: string;
    name: string;
    profilePicture: string;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userCollection = collection(db, "user");
        const userSnapshot = await getDocs(userCollection);
        const userList = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as UserList[];
        setUsers(userList);
      } catch (error) {
        console.error("Erro ao buscar dados dos usuários.", error);
      }
    };

    fetchUsers();
  }, []);

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

  return (
    <>
      <Flowbite>
        <p className="pt-5 m-10 text-6xl text-primary-dark font-semibold">
          Serviços de {"..."} encontrados
        </p>
        <div className="mt-7 bg bg-white dark:bg-slate-900">
          <div className="flex flex-row h-screen overflow-x-auto bg-gray-50 shadow-xl w-5/6 pl-6 mx-auto rounded-xl">
            {users.map((user) => (
              <div key={user.id} className="flex flex-col m-5 h-80 p-3 rounded w-60 bg-slate-200 justify-center align-middle">
                <img src={user?.profilePicture ? user.profilePicture : blankpfp} className="w-full bg-slate-100 rounded"></img>
                <div className="w-full h-10 mt-4 p-1 rounded bg-slate-100">
                  <p className="text-justify align-center text-2xl text-primary-dark font-semibold">{user.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Flowbite>
    </>
  );
};

export default Servicos;
