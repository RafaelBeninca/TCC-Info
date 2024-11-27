import { addDoc, collection, getDocs, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import "flowbite";
import { Flowbite } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import blankimg from "../assets/images/blankimg.jpg";
import DisplayServices from "../components/displayServices";
import { Service, Tag } from "../components/Interfaces";
import { db, storage } from "../contexts/firebase/firebaseConfig";
import useTableUserContext from "../hooks/useTableUserContext";
import DecimalInput from "../components/DecimalInput";
import { handleInputChange } from "../utils/helpers";
import ErrorMsg from "../components/ErrorMsg";

const Servicos = () => {
  // const [users, setUsers] = useState<UserList[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [btnText, setbtnText] = useState<string>("Confirmar")
  const [error, setError] = useState<string>("")
  const [image, setImage] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false)
  const [tags, setTags] = useState<Tag[]>([]);

  const handleChangeTag = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setServiceData({
      ...serviceData,
      tag: event.target.value,
    });
    console.log(serviceData)
  };
  
  const [serviceData, setServiceData] = useState<Service>({
    ownerId: "",
    claimedId: "",
    tag: "",
    title: "",
    description: "",
    displayEmail: "",
    displayPhone: "",
    image: "",
    value: "",
    status: "",
    city: "",
    createdAt: Timestamp.now(),
    ownerName: "",
    claimedName: "",
    potentialProviderArray: [],
  })

  const { user } = useTableUserContext();
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const toggleCreateModal = () => {
    if (!user) {
      navigate("/login")
    } else if (!user.city || !user.displayEmail) {
      setError("Para requisitar um serviço, você precisa de um e-mail de display e definir a sua cidade.")
      return;
    }
    setOpenCreateModal(!openCreateModal);
    setImageURL("")
    setServiceData({
      ...serviceData,
      claimedId: "",
      title: "",
      image: "",
      description: "",
      value: "",
      displayPhone: user?.displayPhone || "",
      displayEmail: user?.displayEmail || "",
      ownerId: user?.uid || "",
      tag: "",
      status: "",
      city: user?.city || "",
      ownerName: user?.name || "",
      claimedName: "",
      potentialProviderArray: [],
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setbtnText("Criando...")

    try {
      const collectionRef = collection(db, "services");
      let url = serviceData.image || "";

      if (image) {
        const id = uuidv4();
        const storageRef = ref(storage, `serviceImages/${id}.jpg`);
        await uploadBytes(storageRef, image);
        console.log("Upload de imagem realizado com sucesso!");
        url = await getDownloadURL(storageRef);
        console.log("url: ", url);
      }

      const updatedServiceData = {
        ...serviceData,
        image: url,
        createdAt: Timestamp.now()
      };

      console.log("Sucesso ao dar upload no servço!")
      await addDoc(collectionRef, updatedServiceData)
    } catch(error) {
      console.error("Erro ao dar upload no serviço: ", error)
    } finally {
      setOpenCreateModal(!openCreateModal)
      setbtnText("Confirmar")
      setRefresh(!refresh)
    }
  }

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to calculate the new scrollHeight
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to match content
    }
  };

  return (
    <>
      <Flowbite>
        <div className="bg-white mt-7 w-full px-8">
          <div className="bg-gray-100 overflow-y-hidden flex flex-col h-screen overflow-x-auto shadow-xl w-full mx-auto rounded-xl">
            <div className="bg-primary-default rounded-t-lg w-full h-3"/>
            <div className="bg-gray-100 flex gap-3 flex-row w-full h-20 border-b-4 border-primary-default">
              <button className="flex flex-row pl-2 bg-primary-default h-12 w-1/6 my-auto rounded-xl mx-5 hover:bg-primary-dark hover:scale-105 transition-all duration-300" onClick={toggleCreateModal}>
                <svg
                  className="text-white w-6 h-6 my-auto"
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
                  d="M5 12h14m-7 7V5"
                />
                </svg>
                <p className="font-bold text-white text-xl text-center my-auto">Requisitar serviço</p>
              </button>
              <span className="my-auto"><ErrorMsg message={error}/></span>
            </div>
            <DisplayServices refresh={refresh}/>
            {openCreateModal && ( // Modal
            <form onSubmit={handleSubmit}>
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={toggleCreateModal}>
                <div className="scrollable-container bg-slate-100 w-2/3 h-3/4 m-auto rounded-lg shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="w-full h-5 bg-primary-default rounded-t-lg"/>
                  <div className="flex flex-row">
                    <div className="w-full">
                      <div className="flex flex-row justify-between">
                        <input
                        className="bg-transparent border-0 w-3/4 text-4xl font-bold focus:border-0 focus:ring-0 text-left"
                        maxLength={40}
                        type="text"
                        placeholder="Título da requisição"
                        value={serviceData.title}
                        onChange={(e) => setServiceData({ ...serviceData, title: e.target.value })}
                        required
                        >
                        </input>
                        <button className="my-auto ml-auto m-5" onClick={toggleCreateModal}>
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
                        <DecimalInput
                          type="text"
                          placeholder="00.00"
                          className="bg-transparent border-0 focus:ring-0 focus:border-0 appearence-none ml-4 mt-2 w-24 font-semibold text-xl"
                          value={serviceData.value}
                          onChange={(e) =>
                            handleInputChange<Service>(e, setServiceData, "value")
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <hr className="border-primary-default mx-2" />
                  <div className="">
                    <p className="ml-4 mt-2 font-semibold">Por: {user?.name}</p>
                    <p className="ml-4">Número: {user?.displayPhone}</p>
                    <p className="ml-4">E-Mail: {user?.displayEmail}</p>
                    <p className="ml-4">Cidade: {user?.city}</p>
                    <p className="ml-4 mt-2">Tag do serviço:</p>
                    <select className="h-13 w-1/5 ml-4 my-auto border-2 mb-3 bg-transparent border-primary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary-default focus:border-primary-default overflow-y-auto hover:shadow-lg transition-all"
                    value={serviceData.tag}
                    required
                    onChange={handleChangeTag}>
                    <option value=""> Selecione uma tag </option>
                    {tags.map((tag) => (
                      <option key={tag.tagName} value={tag.tagName}>
                        {tag.tagName}
                      </option>
                    ))}
                    </select>
                  </div>
                  <textarea
                    className={"bg-transparent border-0 focus:ring-0 focus:border-0 w-11/12 resize-none ml-1 font-semibold"}
                    required
                    maxLength={2000}
                    ref={textareaRef}
                    onInput={handleInput}
                    placeholder={"Descrição da requisição..."}
                    value={serviceData.description}
                    onChange={(e) => setServiceData({ ...serviceData, description: e.target.value })}
                  ></textarea>
                  <img
                    className="rounded-lg w-1/2 m-3 h-1/2 object-cover"
                    src={imageURL ? imageURL : blankimg}
                    alt="Insert"
                  />
                  <div className="flex flex-col">
                    <input className="ml-3 h-10"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    />
                    <button className="bg-primary-default hover:bg-primary-dark rounded-lg h-9 mx-24 mt-20 mb-3" type="submit">
                      <p className="text-white font-semibold">{btnText}</p>
                    </button>
                  </div>
                </div>
              </div>
            </form>
            )}
          </div>
        </div>
      </Flowbite>
    </>
  );
};

export default Servicos;
