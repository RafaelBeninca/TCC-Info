import { arrayRemove, collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../contexts/firebase/firebaseConfig";
import { Service } from "../components/Interfaces";
import blankpfp from "../assets/images/blankpfp.jpg";
import emailjs from "emailjs-com";
import useTableUserContext from "../hooks/useTableUserContext";

interface User {
  id: string,
  name: string,
  profilePicture: string,
  description: string,
  city: string,
  displayEmail: string,
}


const ManagePotentialProviders: React.FC = () => {
  const [pageService, setPageService] = useState<Service | null>(null);
  const [userIds, setUserIds] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const { serviceId } = useParams<{ serviceId: string }>();
  console.log(serviceId)
  const { user } = useTableUserContext();

  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) return;
      try {
        const pageServiceDoc = await getDoc(doc(db, "services", serviceId));

        if (pageServiceDoc.exists()) {
          const data = pageServiceDoc.data();

          setPageService({ ...data } as Service);
          console.log(pageService)
          console.log(pageService?.title)
        }
      } catch (error) {
        console.error("Serviço não encontrado: ", error);
      }
    };

    fetchService();
  }, [serviceId]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const serviceDoc = await getDoc(doc(db, "services", serviceId));

        if (serviceDoc.exists()) {
          const data = serviceDoc.data();
          if (data.potentialProviderArray && Array.isArray(data.potentialProviderArray)) {
            setUserIds(data.potentialProviderArray);
            console.log(data);
          } else {
            console.error("No valid 'userIds' array found in service document.");
          }
        } else {
          console.error("Service document not found!");
        }
      } catch (error) {
        console.error("Error fetching service document:", error);
      }
    };

    fetchService();
  }, [serviceId, refresh]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (userIds.length === 0) return;

      try {
        // Step 2: Fetch users using the userIds
        const userQuery = query(
          collection(db, "user"),
          where("__name__", "in", userIds.slice(0, 10)) // Firestore `in` can handle up to 10 items
        );

        const userDocs = await getDocs(userQuery);
        const fetchedUsers = userDocs.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];

        setUsers(fetchedUsers); // Store the fetched user data
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [userIds]);
  

  const handleAccept = async (userId: string, userName: string, userEmail: string) => {
    if (!userId) return;
    const docRef = doc(db, "services", serviceId);

    try {
      const formData = {
        sender: user?.name,
        to_name: userName,
        to_email: userEmail,
        from_name: "Workspace Team",
      };

      const result = await emailjs.send(
        "service_3tertpg",
        "template_t4wxzx8",
        formData,
        "ZgMc7h4TBYyli2pMM"
      );
      console.log(result.text)

      await setDoc(docRef, {
        status: "Prestado",
        claimedId: userId,
        potentialProviderArray: arrayRemove(userId)
      }, {merge: true});
      setRefresh(!refresh)
    } catch(error) {
      console.error("Erro ao trocar status do serviço: ", error)
    }
  }

  const handleDeny = async (userId: string) => {
    if (!userId) return;
    const docRef = doc(db, "services", serviceId);

    try {
      await setDoc(docRef, {
        potentialProviderArray: arrayRemove(userId)
      }, {merge: true});
      setRefresh(!refresh)
    } catch(error) {
      console.error("Erro ao trocar status do serviço: ", error)
    }
  }

  return (
    <div className="h-4/5">
      <div className="m-5">
        <h1 className="text-5xl">Manuseamento das requisições no serviço:</h1>
        <h1 className="text-5xl text-primary-default">"{pageService?.title}"</h1>
        <hr className="h-0.5 mt-5 mb-10 w-auto bg-primary-default" />
      </div>
      <div className="bg-gray-200 mx-5 p-x-5 h-full rounded-xl">
        <ul className="flex flex-col gap-5 w-full h-full p-3 overflow-hidden overflow-y-auto">
          {users.map(servUser => (
            <li className="bg-gray-100 flex flex-row w-full h-16 rounded-full shadow-lg" key={servUser.id}>
              <img
                className="w-12 h-12 rounded-full object-cover my-auto ml-3"
                src={servUser.profilePicture ? servUser.profilePicture : blankpfp}
                alt="Profile"
              />
              <div className="my-auto ml-5 w-full">
                <a className="text-2xl font-bold hover:text-primary-default" href={`/usuario/${servUser.id}`}>{servUser.name}</a>
                <p className="">{servUser.city}</p>
              </div>
              <div className="flex flex-row my-auto gap-5 mr-5">
                <button className="bg-primary-default text-white font-semibold w-32 h-7 rounded-full shadow-lg hover:bg-primary-dark hover:scale-105 transition-all duration-300" onClick={() => handleAccept(servUser.id, servUser.name, servUser.displayEmail)}>
                  Aceitar
                </button>
                <button className="bg-warning-default text-white font-semibold w-32 h-7 rounded-full shadow-lg hover:bg-warning-dark hover:scale-105 transition-all duration-300" onClick={() => handleDeny(servUser.id)}>
                  Recusar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManagePotentialProviders;

// Fazer com que apenas o dono acesse esta página
// Estilizar a Home
// Deletar confirmar conclusão do serviço
// Lista de conclusão na pág de usuário