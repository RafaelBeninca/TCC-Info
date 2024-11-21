import React, { useEffect, useState } from "react";
import { Service } from "./Interfaces";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../contexts/firebase/firebaseConfig";

const DisplayServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const serviceCollection = collection(db, "services");
        const docSnapshot = await getDocs(serviceCollection);
        const serviceList: Service[] = docSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Service),
        }));

        setServices(serviceList)
      } catch(error) {
        console.error("Erro ao buscar serviços: ", error)
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => { //parou em: descobrir o pq as imagens do banco esão sendo substituidas ao invez de adicionadas
      try {
        setIsLoading(true)
        const servicesCollection = collection(db, "services");
        const snapshot = await getDocs(servicesCollection);
        const servicesList: Service[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Service),
        }));

        setServices(servicesList);
        if (services.length > 0) {
          setError("Nenhum serviço encontrado.")
        }
      } catch (error) {
        console.log("Erro ao carregar os serviços: ", error)
        setError("Falha ao carregar os serviços.");
      } finally {
        setIsLoading(false)
      }
    };
    fetchUsers();
  }, []);

  return (
    <>
    {isLoading && <p className="font-semibold text-center">Buscando serviços disponíveis...</p>}
    {error && <p className="text-warning-default font-semibold m-3 text-xl">Falha ao buscar serviços disponíveis.</p>}
    <div className="bg-gray-100 flex flex-row">
      {services.map((service) => (
      <button className="w-60 h-80 m-5">
        <div className="w-60 h-80 rounded-b-lg shadow-md hover:scale-105 transition-all duration-300 hover:shadow-xl">
          <div className="bg-primary-default rounded-t-lg w-full h-4" />
          <div className="p-2 text-left">
            <p className="font-semibold text-2xl">{service.title}</p>
            <hr className="bg-primary-default my-2" />
            <span className="font-bold">R$: {service.value}</span>
            <div className="w-full h-20">
              <p className="whitespace-normal line-clamp-3 break-words overflow-hidden text-ellipsis">{service.description}</p>
            </div>
            {service.image && (
              <img className="bg-orange-600 rounded-lg w-full h-32" src={service.image} alt={service.title}/>
            )}
          </div>
        </div>
      </button>
      ))}
      </div>
    </>
  )
};

export default DisplayServices;
