import { collection, getDocs } from "firebase/firestore";
import "flowbite";
import { Flowbite } from "flowbite-react";
import { useEffect, useState } from "react";
import { db } from "../contexts/firebase/firebaseConfig";

const Servicos = () => {
  const [users, setUsers] = useState<UserList[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);

  type UserList = {
    id: string;
    name: string;
    profilePicture: string;
  };

  const toggleModal = () => {
    setOpenModal(!openModal);
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
            {/* Cards */}
            <button className="w-60 h-80 m-5" onClick={toggleModal}>
              <div className="w-60 h-80 rounded-b-lg shadow-md hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <div className="bg-primary-default rounded-t-lg w-full h-4" />
                <div className="p-2 text-left">
                  <p className="font-semibold text-2xl">Ajuda com tal coisa</p>
                  <hr className="bg-primary-default my-2" />
                  <span className="font-bold">R$: 99.99</span>
                  <div className="w-full h-20">
                    <p className="whitespace-normal line-clamp-3 break-words overflow-hidden text-ellipsis">
                      Descrição do serviço requisitado pelo usuário
                    </p>
                  </div>
                  <div className="bg-orange-600 rounded-lg w-full h-32" />
                </div>
              </div>
            </button>
            {openModal && ( // Modal
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="scrollable-container bg-slate-100 w-2/3 h-3/4 m-auto rounded-lg shadow-xl overflow-y-auto">
                  <div className="w-full h-5 bg-primary-default rounded-t-lg"/>
                  <div className="flex flex-row">
                    <div>
                      <h2 className="ml-4 text-4xl font-bold">
                        Ajuda com tal coisa
                      </h2>
                      <div className="flex flex-row">
                        <p className="ml-4 mt-2 text-xl">Valor proposto: </p>
                        <p className="ml-4 mt-2 font-semibold text-xl">R$: 99.99</p>
                      </div>
                    </div>
                    <button className="my-auto ml-auto m-5" onClick={toggleModal}>
                      <svg
                        className="w-[40px] h-[40px] text-warning-default hover:text-warning-dark dark:text-white my-auto hover:scale-125 transition-all"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18 17.94 6M18 18 6.06 6"
                        />
                      </svg>
                    </button>
                  </div>
                  <hr className="border-primary-default mx-2" />
                  <div>
                    <p className="ml-4 mt-2">Por: Usuário</p>
                    <p className="ml-4">Número: 9999-9999</p>
                    <p className="ml-4">E-Mail: usuario@gmail.com</p>
                    <p className="ml-4">Cidade: Criciúma</p>
                  </div>
                    <p className="whitespace-normal w-full p-4 mt-5 *:break-words">
                      Descrição do serviço requisitado pelo usuário
                    </p>
                  <div className="bg-orange-600 rounded-lg w-1/2 m-3 h-1/2" />
                </div>
              </div>
            )}
          </div>
        </div>
      </Flowbite>
    </>
  );
};

export default Servicos;
