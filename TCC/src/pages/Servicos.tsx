import { collection, getDocs } from "firebase/firestore";
import "flowbite";
import { Flowbite } from "flowbite-react";
import { useEffect, useState } from "react";
import { db } from "../contexts/firebase/firebaseConfig";

const Servicos = () => {
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
        <p className="m-7 text-6xl text-primary-dark font-semibold">
          Lista de serviços
        </p>
        <div className="bg-white mt-7 w-full px-8">
          <div className="bg-gray-100 flex flex-row h-screen overflow-x-auto shadow-xl w-full mx-auto rounded-xl">
            <div className="w-60 h-80 m-5 rounded-b-lg shadow-md hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <div className="bg-primary-default rounded-t-lg w-full h-4"/>
              <div className="p-2">
                <p className="font-semibold text-2xl">Ajuda com tal coisa</p>
                <hr className="bg-primary-default my-2"/>
                <span className="font-bold">R$: 99.99</span>
                <div className="bg-orange-300 w-full h-full">
                  <p className="h-full w-full whitespace-normal line-clamp-6 break-words overflow-hidden text-ellipsis"> Descrição do serviço requisitado pelo usuário</p>
                </div>
                {/* <div className="bg-red-500 h-2 w-2 mt-auto">
                  <h2>Usuário</h2>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </Flowbite>
    </>
  );
};

export default Servicos;
