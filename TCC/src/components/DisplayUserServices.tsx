import { format } from "date-fns";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../contexts/firebase/firebaseConfig";
import { Service } from "./Interfaces";
import useTableUserContext from "../hooks/useTableUserContext";
import { useParams } from "react-router-dom";


const DisplayUserServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useTableUserContext();
  const { userId } = useParams<{ userId: string }>();

  const formatTimestamp = (timestamp: Timestamp): string => {
    const date = timestamp.toDate();
    return format(date, "dd/MM/yyyy HH:mm");
  };

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  useEffect(() => {
    const fetchFilteredData = async () => {
      setError(null);
      try {
        const productCollection = collection(db, "services");
        const q = query(productCollection,
          where("status", "!=", "Concluido"),
          where("ownerId", "==", userId)
        );

        const querySnapshot = await getDocs(q);
        const data: Service[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Service),
        }));

        setServices(data);
        console.log(services);
        if (querySnapshot.empty) {
          setError("Nenhuma requisição publicada");
        }
      } catch (error) {
        console.error("Erro ao filtrar as informações: ", error);
        setError("Falha ao carregar os serviços.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredData();
  }, []);

  return (
  <div className="mt-6 pb-7">
    {userId == user?.uid ? (
    <p className="text-3xl font-semibold text-primary-dark mb-3"> Meus serviços requisitados </p>
    ) : (
    <p className="text-3xl font-semibold text-primary-dark mb-3"> Serviços do usuário </p>
    )}
    <div className="bg-gray-200 h-full overflow-y-auto flex flex-wrap overflow: visible w-full shadow-xl rounded-xl">
      {isLoading && (
        <p className="font-semibold text-center">
          Buscando serviços disponíveis...
        </p>
      )}
      <p className="text-2xl">{error}</p>
      {services.map((service) => (
        <button
          className="w-64 h-96 m-5"
          key={service.image}
          onClick={() => toggleModal}
        >
          <div className="w-64 h-96 rounded-b-lg shadow-md hover:scale-105 transition-all duration-300 hover:shadow-xl">
            <div className="bg-primary-default rounded-t-lg w-full h-4" />
            <div className="h-full p-2 text-left">
              <div className="flex flex-row justify-between">
                <p className="font-semibold text-2xl max-h-16 line-clamp-2 break-words overflow-hidden text-ellipsis">{service.title}</p>
              </div>
              <hr className="bg-primary-default w-full h-1 my-2" />
              <div className="flex flex-row justify-between">
                <a
                  className="font-semibold hover:text-primary-default"
                  href={`/usuario/${service.ownerId}`}
                >
                  por: {service.ownerName}
                </a>
                <div className="w-auto h-7 px-2 bg-slate-100 border-primary-default border-2 gap-2 rounded-full">
                  <span className="text-primary-dark font-semibold">
                    {service.tag}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">R$: {service.value}</span>
                <span className="">{formatTimestamp(service.createdAt)}</span>
              </div>
              <div className="w-full h-14">
                <p className="whitespace-normal line-clamp-2 break-words overflow-hidden text-ellipsis">
                  {service.description}
                </p>
              </div>
              {service.image && (
                <img
                  className="object-cover rounded-lg w-full max-h-40"
                  src={service.image}
                  alt={service.title}
                />
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  </div>
  )
}

export default DisplayUserServices