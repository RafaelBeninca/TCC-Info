import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../contexts/firebase/firebaseConfig";
import { PriceRange, Service, Tag } from "./Interfaces";

interface DisplayServicesProp {
  refresh: boolean,
}

const DisplayServices: React.FC<DisplayServicesProp> = ({refresh}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshFilter, setRefreshFilter] = useState<boolean>(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchTagId, setSearchTagId] = useState<string>("");
  const [searchCity, setSearchCity] = useState<string>("");
  const [priceRange, setPriceRange] = useState<PriceRange>({priceMin:"", priceMax:""});

  const handleRefreshFilter = () => {
    setRefreshFilter(!refreshFilter)
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => { // Arrumar: função pegando o nome e não o id da Tag.
    setSelectedTag(event.target.value);
    console.log(selectedTag)
  };

  useEffect(() => {
    const fetchTags = async () => {
      const tagsCollection = collection(db, "tags");
      const snapshot = await getDocs(tagsCollection);
      const tagsList: Tag[] = snapshot.docs.map((doc) => ({
        ...(doc.data() as Tag)
      }));

      setTags(tagsList)
      console.log(tagsList)
    }

    fetchTags();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      setError(null)
      try {
        setIsLoading(true)
        const servicesCollection = collection(db, "services");
        const snapshot = await getDocs(servicesCollection);
        const servicesList: Service[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Service),
        }));

        setServices(servicesList);
        if (services.length < 0) {
          setError("Nenhum serviço encontrado.")
        }
      } catch (error) {
        console.log("Erro ao carregar os serviços: ", error)
        setError("Falha ao carregar os serviços.");
      } finally {
        setIsLoading(false)
      }
    };
    fetchServices();
  }, [refresh]);

  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        const productCollection = collection(db, "services");
        let q = query(productCollection);

        if (searchTerm) { //Filtro de Pesquisa por título
          q = query(
            q,
            where("title", ">=", searchTerm ),
            where("title", "<=", searchTerm + "\uf8ff")
          );
        }

        if (searchTagId) { //Filtro de Tag ID
          q = query(q, where("city", "==", searchTagId))
        }

        if (searchCity) { //Filtro de Cidade
          q = query(q, where("city", "==", searchCity))
        }

        if (priceRange) { //Filtro de Valor
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
      } catch (error) {
        console.error("Erro ao filtrar as informações: ", error)
      }
    };

    fetchFilteredData();
  }, [refreshFilter]);

  return (
    <div className="flex flex-row overflow-hidden">
      <div className="bg-gray-200 flex flex-col items-center justify-center border-r-4 border-primary-default h-full w-5/6">
        <p className="font-bold my-5 text-4xl text-center">Filtros de pesquisa:</p>
        <div className="bg-transparent w-auto mx-6 flex flex-col">
          <p className="font-semibold text-primary-default">Filtro de Municípios:</p>
          <select className="h-13 w-full mb-5 my-auto border-2 bg-transparent border-primary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary-default focus:border-primary-default overflow-y-auto hover:shadow-lg transition-all"
          value={searchCity}> 

          </select>

          <p className="font-semibold text-primary-default">Filtro de Tags:</p>
          <select className="h-13 w-full my-auto border-2 mb-5 bg-transparent border-primary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary-default focus:border-primary-default overflow-y-auto hover:shadow-lg transition-all"
          value={selectedTag}
          onChange={handleChange}>
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
          value={priceRange.priceMin}>
          </input>

          <p className="text-2xl text-primary-default">{"<"}</p>
          <input type="text"
          placeholder="Max"
          className="bg-transparent border-2 border-primary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary-default focus:border-primary-default overflow-y-auto hover:shadow-lg transition-all w-full"
          value={priceRange.priceMax}>
          </input>
          </div>
          {/* <select className="h-10 w-full my-auto border-2 bg-transparent border-primary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary-default focus:border-primary-default overflow-y-auto hover:shadow-lg transition-all"> 
          </select> */}
        </div>
        <button className="bg-primary-default hover:bg-primary-dark hover:scale-105 transition-all duration-300 w-1/2 h-12 rounded-lg mt-10" onClick={handleRefreshFilter}>
            <p className="font-semibold text-lg text-white"> Pesquisar </p>
        </button>
      </div>
      <div className="bg-gray-200 h-full overflow-y-auto flex flex-wrap overflow: visible">
      {isLoading && <p className="font-semibold text-center">Buscando serviços disponíveis...</p>}
      {error}
      {services.map((service) => (
      <button className="w-64 h-96 m-5" key={service.image}>
        <div className="w-64 h-96 rounded-b-lg shadow-md hover:scale-105 transition-all duration-300 hover:shadow-xl">
          <div className="bg-primary-default rounded-t-lg w-full h-4" />
          <div className="p-2 text-left">
            <p className="font-semibold text-2xl">{service.title}</p>
            <hr className="bg-primary-default my-2" />
            <span className="font-bold">R$: {service.value}</span>
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
