import { collection, deleteDoc, doc, getDocs, orderBy, query, Timestamp, updateDoc, where } from "firebase/firestore";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { db, storage } from "../contexts/firebase/firebaseConfig";
import { PriceRange, Service, Tag } from "./Interfaces";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import useTableUserContext from "../hooks/useTableUserContext";
import blankimg from "../assets/images/blankimg.jpg";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

interface DisplayServicesProp {
  refresh: boolean,
}

interface ModalProps {
  service: Service | null;
  children?: ReactNode;
  // onClose: () => void;
}

const DisplayServices: React.FC<DisplayServicesProp> = ({refresh}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<boolean>(true);
  const [refreshFilter, setRefreshFilter] = useState<boolean>(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchTag, setSearchTag] = useState<string>("");
  const [searchCity, setSearchCity] = useState<string>("");
  const [priceRange, setPriceRange] = useState<PriceRange>({priceMin:"", priceMax:""});
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [editMode, setEditMode] = useState<boolean>(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [image, setImage] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [btnText, setbtnText] = useState<string>("Atualizar")

  const [editServiceData, setEditServiceData] = useState<Service>({
    ownerId: "",
    claimedId: "",
    tag: "",
    title: "",
    description: "",
    image: "",
    value: "",
    displayEmail: "",
    displayPhone: "",
    status: "",
    city: "",
    createdAt: Timestamp.now(),
    ownerName: "",
    claimedName: "",
  })

  const { userId } = useParams<{ userId: string }>();
  const { user } = useTableUserContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleChangeTag = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchTag(event.target.value);
  };

  // const handleEditTag = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedService({
  //     ...selectedService,
  //     tag: (event.target.value),
  //   });
  // };

  const handleEditTag = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTag = e.target.value;
  
    // Update the selectedService state with the new tag
    setEditServiceData((prev) =>
      prev ? { ...prev, tag: selectedTag } : prev
    );
    console.log(editServiceData)
  };

  const handleChangeCity = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchCity(event.target.value);
  };
  
  const toggleModal = (service: Service) => {
    setOpenModal(true)
    setSelectedService(service)
    setImageURL(service.image)
  };

  const toggleModalThroughEdit = (service: Service) => {
    toggleModal(service)
    setEditMode(true)
  };
  
  const closeModal = () => {
    setOpenModal(false)
    setEditMode(false)
    setImageURL("")
    setImage(null)
    setEditServiceData({
      ...editServiceData,
      claimedId: "",
      title: "",
      image: "",
      description: "",
      value: "",
      displayPhone: "",
      displayEmail: "",
      ownerId: user?.uid || "",
      tag: "",
      status: "",
      city: user?.city || "",
      ownerName: user?.name || "",
      claimedName: "",
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      console.log("Imagem escolhida");
      const file = e.target.files[0];
      setImage(file);
      const fileUrl = URL.createObjectURL(file);
      setImageURL(fileUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setbtnText("Atualizando...")

    try {
      const collectionRef = doc(db, "services", selectedService?.id);
      let url = editServiceData.image || "";

      if (image) {
        const id = uuidv4();
        const storageRef = ref(storage, `serviceImages/${id}.jpg`);
        await uploadBytes(storageRef, image);
        console.log("Upload de imagem realizado com sucesso!");
        url = await getDownloadURL(storageRef);
        console.log("url: ", url);
      }

      const updatedServiceData = {
        ...editServiceData,
        image: url,
        // createdAt: Timestamp.now()
      };
      console.log(updatedServiceData)

      await updateDoc(collectionRef, updatedServiceData)
    } catch(error) {
      console.error("Erro ao dar upload no serviço: ", error)
    } finally {
      closeModal()
      setbtnText("Atualizar")
      setRefreshFilter(!refreshFilter)
    }
  }

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedService?.id) {
        return;
      }

      const collectionRef = doc(db, "services", selectedService?.id);
      await deleteDoc(collectionRef)
    } catch(error) {
      console.error("Erro ao dar upload no serviço: ", error)
    } finally {
      closeModal()
      setbtnText("Atualizar")
      setRefreshFilter(!refreshFilter)
    }
  }

  const handleClaim = async () => {
    try {
      const collectionRef = doc(db, "services", selectedService?.id);

      const updatedServiceData = {
        tag: selectedService?.tag,
        createdAt: selectedService?.createdAt,
        city: selectedService?.city,
        ownerId: selectedService?.ownerId,
        ownerName: selectedService?.ownerName,
        displayPhone: selectedService?.displayPhone,
        displayEmail: selectedService?.displayEmail,
        image: selectedService?.image,
        title: selectedService?.title,
        description: selectedService?.description,
        value: selectedService?.value,
        claimedId: user?.uid,
        claimedName: user?.name,
        status: "Assinado"
      };

      await updateDoc(collectionRef, updatedServiceData)
    } catch(error) {
      console.error("Erro ao dar claim no serviço: ", error)
    } finally {
      closeModal()
      setRefreshFilter(!refreshFilter)
    }
  }

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to calculate the new scrollHeight
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to match content
    }
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
        let q = query(productCollection, where("status", "==", ""))

        if (order) { // Ordem decrescente / crescente
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

        if (searchTag) { //Filtro de Tag ID
          q = query(q, where("tag", "==", searchTag))
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
        console.log(services)
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
          <option value=""> Selecione uma cidade </option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
          </select>

          <p className="font-semibold text-primary-default">Filtro de Tags:</p>
          <select className="h-13 w-full my-auto border-2 mb-3 bg-transparent border-primary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary-default focus:border-primary-default overflow-y-auto hover:shadow-lg transition-all"
          value={searchTag}
          onChange={handleChangeTag}>
          <option value=""> Selecione uma tag </option>
          {tags.map((tag) => (
            <option key={tag.tagName} value={tag.tagName}>
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
      <button className="w-64 h-96 m-5" key={service.image} onClick={() => toggleModal(service)}>
        <div className="w-64 h-96 rounded-b-lg shadow-md hover:scale-105 transition-all duration-300 hover:shadow-xl">
          <div className="bg-primary-default rounded-t-lg w-full h-4" />
          <div className="p-2 text-left">
            <div className="flex flex-row justify-between">
              <p className="font-semibold text-2xl">{service.title}</p>
              {user?.uid == service.ownerId && (
                <button
                  className="w-6 h-7 hover:scale-110 transition-all"
                  onClick={() => toggleModalThroughEdit(service)}>
                  <svg
                    className="w-[30px] h-[30px] hover:text-primary-default text-gray-800 dark:text-white"
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
                      d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                    />
                  </svg>
                </button>
              )}
            </div>
            <hr className="bg-primary-default w-full h-1 my-2" />
            <div className="flex flex-row justify-between">
              <a className="font-semibold hover:text-primary-default" href={`/usuario/${selectedService?.ownerId}`}>por: {service.ownerName}</a>
              <div className="w-auto h-7 px-2 bg-slate-100 border-primary-default border-2 gap-2 rounded-full">
                <span className="text-primary-dark font-semibold">{service.tag}</span>
              </div>
            </div>
            <div className="flex justify-between">
            <span className="font-bold">R$: {service.value}</span>
            {formatTimestamp(service.createdAt)}
            </div>
            <div className="w-full h-20">
              <p className="whitespace-normal line-clamp-3 break-words overflow-hidden text-ellipsis">{service.description}</p>
            </div>
            {service.image && (
              <img className="bg-transparent object-cover rounded-lg w-full h-44" src={service.image} alt={service.title}/>
            )}
          </div>
        </div>
      </button>
      ))}
      </div>

      {openModal && ( // Modal
        <form onSubmit={handleSubmit}>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
            <div className="scrollable-container bg-slate-100 w-2/3 h-3/4 m-auto rounded-lg shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="w-full h-5 bg-primary-default rounded-t-lg"/>
              <div className="flex flex-row">
                <div className="w-full">
                  <div className="flex flex-row justify-between">
                    {editMode ? (
                      <input
                      className="bg-transparent border-0 w-3/4 text-4xl font-bold focus:border-0 focus:ring-0 text-left"
                      type="text"
                      placeholder={selectedService?.title}
                      value={editServiceData.title}
                      onChange={(e) => setEditServiceData({ ...editServiceData, title: e.target.value })}
                      >
                      </input>
                    ) : (
                      <p className="bg-transparent ml-3 my-2 border-0 w-3/4 text-4xl font-bold focus:border-0 focus:ring-0 text-left"> {selectedService?.title} </p>
                    )}
                    <button className="my-auto ml-auto m-5" onClick={closeModal}>
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
                  <div className="flex flex-row">
                    <p className="ml-4 mt-4 text-xl">Valor proposto:</p>
                      {editMode ? (
                      <input
                      className="bg-transparent border-0 focus:ring-0 focus:border-0 appearence-none mt-2 w-24 font-semibold text-xl"
                      type="text"
                      placeholder={selectedService?.value}
                      value={editServiceData.value}
                      onChange={(e) => setEditServiceData({ ...editServiceData, value: e.target.value })}
                      >
                      </input>
                    ) : (
                      <p className="bg-transparent border-0 focus:ring-0 focus:border-0 appearence-none ml-3 mt-4 mb-2 w-24 font-semibold text-xl">{selectedService?.value}</p>
                    )}
                  </div>
                </div>
              </div>
              <hr className="border-primary-default mx-2" />
              <div className="">
                <a className="ml-4 mt-3 hover:text-primary-default font-semibold" href={`/usuario/${selectedService?.ownerId}`}>Por: {selectedService?.ownerName}</a>
                <p className="ml-4">Número: {selectedService?.displayPhone}</p>
                <p className="ml-4">E-Mail: {selectedService?.displayEmail}</p>
                <p className="ml-4">Cidade: {selectedService?.city}</p>
              </div>
              <div className="flex flex-wrap flex-row min-w-0 w-1/2 mt-2 ml-4 h-7 gap-2">
                {editMode ? (
                  <select className="h-13 w-3/5 my-auto border-2 bg-transparent border-primary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary-default focus:border-primary-default overflow-y-auto hover:shadow-lg transition-all"
                    value={editServiceData?.tag}
                    onChange={handleEditTag}>
                    <option value=""> Selecione uma tag </option>
                    {tags.map((tag) => (  
                      <option key={tag.tagName} value={tag.tagName}>
                        {tag.tagName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="w-auto h-7 px-2 bg-slate-100 border-primary-default border-2 gap-2 rounded-full">
                    <span className="text-primary-dark font-semibold">{selectedService?.tag}</span>
                  </div>
                )}
              </div>
              {editMode ? (
                <textarea
                  className={"bg-transparent border-0 mt-4 focus:ring-0 focus:border-0 w-11/12 resize-none ml-1 font-semibold"}
                  required
                  ref={textareaRef}
                  onInput={handleInput}
                  placeholder={selectedService?.description}
                  value={editServiceData.description}
                  onChange={(e) => setEditServiceData({ ...editServiceData, description: e.target.value })}
                ></textarea>
              ) : (
                <p className={"bg-transparent border-0 mb-12 focus:ring-0 focus:border-0 w-11/12 resize-none ml-4 mt-6 font-semibold"}>{selectedService?.description}</p>
              )}
              {editMode ? (
              <>
                <img
                className="rounded-lg w-1/2 m-3 h-1/2 object-cover"
                  src={imageURL ? imageURL : blankimg}
                />
                <input className="ml-3 h-10"
                type="file"
                accept="image/*"
                value={editServiceData.image}
                onChange={handleImageChange}
                />
              </>
              ) : (
              <img
                className="rounded-lg w-1/2 m-3 h-1/2 object-cover"
                src={selectedService?.image ? selectedService.image : blankimg}
              />
              )}
              {selectedService?.ownerId == user?.uid && (
              <div className="flex flex-row justify-between gap-10">
                <button className="bg-warning-default hover:bg-warning-dark rounded-lg h-9 w-2/3 ml-10 mt-20 mb-3" type="button" onClick={handleDelete}>
                  <p className="text-white font-semibold">Deletar serviço</p>
                </button>
                {editMode ? (
                  <button className="bg-primary-default hover:bg-primary-dark rounded-lg h-9 w-2/3 mr-10 mt-20 mb-3" type="submit">
                    <p className="text-white font-semibold">{btnText}</p>
                  </button>
                ) : (
                  <button className="bg-orange-500 hover:bg-orange-700 rounded-lg h-9 w-2/3 mr-10 mt-20 mb-3" type="button" onClick={() => setEditMode(!editMode)}>
                    <p className="text-white font-semibold">Editar</p>
                  </button>
                )}
              </div>
              )}
              {selectedService?.ownerId !== user?.uid && (
                <div className="flex align-middle justify-center w-full">
                  <button className="bg-orange-500 hover:bg-orange-700 rounded-lg h-9 w-2/3 mr-10 mt-20 mb-3" type="button" onClick={handleClaim}>
                    <p className="text-white font-semibold">Assinar Serviço</p>
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
        )}
    </div>
  )
};

export default DisplayServices;
