import { collection, getDocs, orderBy, query, Timestamp, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../contexts/firebase/firebaseConfig";
import { PriceRange, Service, Tag } from "./Interfaces";
import { format } from "date-fns";

interface DisplayServicesProp {
  refresh: boolean,
}

const DisplayServices: React.FC<DisplayServicesProp> = ({refresh}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<boolean>(true);
  const [refreshFilter, setRefreshFilter] = useState<boolean>(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchTagId, setSearchTagId] = useState<string>("");
  const [searchCity, setSearchCity] = useState<string>("");
  const [priceRange, setPriceRange] = useState<PriceRange>({priceMin:"", priceMax:""});

  const cities = [
    "Criciúma",
    "Içara",
    "Nova Veneza",
    "Forquilhinha",
    "Siderópolis",
    "Cocal do Sul",
    "Morro da Fumaça",
    "São Bento Baixo",
    "Treviso",
    "Urussanga",
    "Balneário Rincão",
    "Torneiro",
    "Maracajá",
  ];

  const handleRefreshFilter = () => {
    setRefreshFilter(!refreshFilter)
  }

  const handleChangeOrder = () => {
    setOrder(!order)
  }

  const handleChangeTag = (event: React.ChangeEvent<HTMLSelectElement>) => { // Arrumar: função pegando o nome e não o id da Tag.
    setSearchTagId(event.target.value);
  };

  const handleChangeCity = (event: React.ChangeEvent<HTMLSelectElement>) => { // Arrumar: função pegando o nome e não o id da Tag.
    setSearchCity(event.target.value);
  };

  const formatTimestamp = (timestamp: Timestamp): string => {
    const date = timestamp.toDate();
    return format(date, "dd/MM/yyyy HH:mm");
  }

  useEffect(() => {
    const fetchTags = async () => {
      const tagsCollection = collection(db, "tags");
      const snapshot = await getDocs(tagsCollection);
      const tagsList: Tag[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Tag)
      }));

      setTags(tagsList)
    }

    fetchTags();
  }, []);

  useEffect(() => {
    const fetchFilteredData = async () => {
      setError(null)
      try {
        const productCollection = collection(db, "services");
        let q = query(productCollection);

        if (order) { // Ordem decrescente / crescente // arrumar erro aqui
          q = query(
            q,
            orderBy("createdAt", "desc")
          );
        } else {
          q = query(
            q,
            orderBy("createdAt", "asc")
          );
        }

        if (searchTerm) { //Filtro de Pesquisa por título
          q = query(
            q,
            where("title", ">=", searchTerm ),
            where("title", "<=", searchTerm + "\uf8ff")
          );
        }

        if (searchTagId) { //Filtro de Tag ID
          q = query(q, where("tagId", "==", searchTagId))
        }

        if (searchCity) { //Filtro de Cidade
          q = query(q, where("city", "==", searchCity))
        }


        if (priceRange.priceMin && priceRange.priceMax) { //Filtro de Valor
          const min = priceRange.priceMin
          const max = priceRange.priceMax
          q = query(
            q,
            where("value", ">=", min),
            where("value", "<=", max)
          );
        }

        const querySnapshot = await getDocs(q);
        const data: Service[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Service),
        }));

        setServices(data)
        console.log("Data:", data)
        if (querySnapshot.empty) {
          setError("Nenhum serviço encontrado...")
        }
      } catch (error) {
        console.error("Erro ao filtrar as informações: ", error)
        setError("Falha ao carregar os serviços.");
      } finally {
        setIsLoading(false)
      }
    };

    fetchFilteredData();
  }, [refreshFilter, refresh]);

  return (
    <div className="flex flex-row h-full overflow-hidden">
      <div className="bg-gray-200 flex flex-col items-center justify-center border-r-4 border-primary-default h-full w-2/6">
        <p className="font-bold my-5 text-4xl text-center">Filtros de pesquisa:</p>

        <div className="w-full mb-5">
          <p className="ml-3 font-semibold text-primary-default">Filtro por Título:</p>
          <input
              className="block mx-auto border-2 h-10 w-11/12 my-auto rounded-lg bg-transparent hover:border-primary-default hover:shadow-lg focus:border-primary-dark focus:ring-primary-default transition-all"
              type="text"
              placeholder="Pesquisar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            >
          </input>
        </div>

        <div className="w-full px-24 mb-3">
          <p className="font-semibold"> Ordem (data): </p>
          <button className={`w-full h-10 rounded-lg hover:scale-105 transition-all duration-300 ${order? "bg-primary-default hover:bg-primary-dark" : "bg-primary-dark hover:bg-primary-default"}`} onClick={handleChangeOrder}>
            <p className="font-semibold text-lg text-white"> {order? "Decrescente" : "Crescente"} </p>
          </button>
        </div>

        <hr className="bg-primary-default h-1 w-full mb-5"></hr>

        <div className="bg-transparent w-auto mx-6 flex flex-col">
          <p className="font-semibold text-primary-default">Filtro de Municípios:</p>
          <select className="h-13 w-full mb-3 my-auto border-2 bg-transparent border-primary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary-default focus:border-primary-default overflow-y-auto hover:shadow-lg transition-all"
          value={searchCity}
          onChange={handleChangeCity}>
          <option value="" disabled> Selecione uma cidade </option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
          </select>

          <p className="font-semibold text-primary-default">Filtro de Tags:</p>
          <select className="h-13 w-full my-auto border-2 mb-3 bg-transparent border-primary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary-default focus:border-primary-default overflow-y-auto hover:shadow-lg transition-all"
          value={searchTagId}
          onChange={handleChangeTag}>
          <option value="" disabled> Selecione uma tag </option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.tagName}
            </option>
          ))}
          </select>


          <p className="font-semibold text-primary-default">Filtro de Valor:</p>
          <div className="flex flex-row">
            <input type="text"
            placeholder="Min"
            className="bg-transparent border-2 border-primary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary-default focus:border-primary-default overflow-y-auto hover:shadow-lg transition-all w-full"
            value={priceRange.priceMin}
            onChange={(e) => setPriceRange({ ...priceRange, priceMin: e.target.value })}>
            </input>

            <p className="text-2xl text-primary-default">{"<"}</p>
            <input type="text"
            placeholder="Max"
            className="bg-transparent border-2 border-primary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary-default focus:border-primary-default overflow-y-auto hover:shadow-lg transition-all w-full"
            value={priceRange.priceMax}
            onChange={(e) => setPriceRange({ ...priceRange, priceMax: e.target.value })}>
            </input>
          </div>

        </div>
        <button className="bg-primary-default hover:bg-primary-dark hover:scale-105 transition-all duration-300 w-1/2 h-12 rounded-lg mt-5" onClick={handleRefreshFilter}>
            <p className="font-semibold text-lg text-white"> Pesquisar </p>
        </button>
      </div>
      <div className="bg-gray-200 h-full overflow-y-auto flex flex-wrap overflow: visible w-full">
      {isLoading && <p className="font-semibold text-center">Buscando serviços disponíveis...</p>}
      <p className="text-2xl">{error}</p>
      {services.map((service) => (
      <button className="w-64 h-96 m-5" key={service.image}>
        <div className="w-64 h-96 rounded-b-lg shadow-md hover:scale-105 transition-all duration-300 hover:shadow-xl">
          <div className="bg-primary-default rounded-t-lg w-full h-4" />
          <div className="p-2 text-left">
            <p className="font-semibold text-2xl">{service.title}</p>
            <hr className="bg-primary-default my-2" />
            <div className="flex justify-between">
            <span className="font-bold">R$: {service.value}</span>
            {formatTimestamp(service.createdAt)}
            </div>
            <div className="w-full h-20">
              <p className="whitespace-normal line-clamp-3 break-words overflow-hidden text-ellipsis">{service.description}</p>
            </div>
            {service.image && (
              <img className="bg-transparent object-cover rounded-lg w-full h-48" src={service.image} alt={service.title}/>
            )}
          </div>
        </div>
      </button>
      ))}
      </div>
    </div>
  )
};

export default DisplayServices;
