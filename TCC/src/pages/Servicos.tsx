import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import "flowbite";
import { Flowbite } from "flowbite-react";
import { useEffect, useState } from "react";
import blankpfp from "../assets/images/blankpfp.jpg";
import { CustomTableUser } from "../components/Interfaces";
import { auth, db } from "../contexts/firebase/firebaseConfig";

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

  return (
    <>
      <Flowbite>
        <p className="pt-5 m-10 text-6xl text-primary-dark font-semibold">
          Serviços de {"..."} encontrados
        </p>
        <div className="mt-7 bg bg-white dark:bg-slate-900">
          <div className="flex flex-row h-screen overflow-x-auto bg-gray-50 shadow-xl w-5/6 pl-6 mx-auto rounded-xl">
            {users.map((user) => (
              <a href={`/usuario/${user.id}`}>
              <div key={user.id} className="flex flex-col m-5 h-80 p-3 rounded w-60 bg-slate-200 justify-center align-middle">
                <img src={user?.profilePicture ? user.profilePicture : blankpfp} className="w-full h-full object-cover bg-slate-100 rounded"></img>
                <div className="w-full h-10 mt-4 p-1 rounded bg-slate-100">
                  <p className="text-justify align-center text-2xl text-primary-dark font-semibold">{user.name}</p>
                </div>
              </div>
              </a>
            ))}
          </div>
        </div>
      </Flowbite>
    </>
  );
};

export default Servicos;
