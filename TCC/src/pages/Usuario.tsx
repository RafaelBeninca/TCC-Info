import {
  sendEmailVerification,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import blankpfp from "../assets/images/blankpfp.jpg";
import DeleteAccountBtn from "../components/DeleteAccountBtn";
import Description from "../components/Description";
import { CustomTableUser, Data, Tag } from "../components/Interfaces";
import TagDisplay from "../components/TagDisplay";
import TagModal from "../components/TagModal";
import { auth, db, storage } from "../contexts/firebase/firebaseConfig";
import useTableUserContext from "../hooks/useTableUserContext";
import SecondaryInfo from "../components/SecondaryInfo";
import SelectCity from "../components/SelectCity";

const Usuario: React.FC = () => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [pageUser, setPageUser] = useState<CustomTableUser | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [city, setCity] = useState<string>("")
  // const [message, setMessage] = useState<string>("");
  // const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<Tag[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false)

  const { userId } = useParams<{ userId: string }>();
  const { user, setUser } = useTableUserContext();

  const [data, setData] = useState<Data>({
    name: user?.name || "",
    profilePicture: user?.profilePicture || "",
    password: user?.password || "",
    email: user?.email || "",
    description: user?.description || "",
  });

  useEffect(() => {
    const fetchTags = async () => {
      if (!user) return;
      try {
        const userTagsCollection = collection(db, "joinTagsUser");
        const q = query(userTagsCollection, where("userId", "==", userId));
        const userSnapshot = await getDocs(q);

        const tags: Tag[] = [];
        for (const docum of userSnapshot.docs) {
          const docRef = doc(db, "tags", docum.data().tagId);
          const tagDoc = await getDoc(docRef);
          if (tagDoc.exists()) {
            const tag = tagDoc.data();
            tags.push({
              id: tag.id,
              tagName: tag.tagName,
            });
          }
        }
        setTags(tags);
      } catch (error) {
        console.error("Erro ao buscar as tags.", error);
      }
    };

    fetchTags();
  }, [user, userId, refresh]);

  const handleChangeCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCity(e.target.value);
  };

  const toggleModal = () => {
    setOpenModal(!openModal);
    if (!openModal) {
      setData({
        name: user?.name || "",
        profilePicture: user?.profilePicture || "",
        password: user?.password || "",
        email: user?.email || "",
      });
      setImageURL(null);
      console.log(data);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const pageUserDoc = await getDoc(doc(db, "user", userId));

        console.log(userId);
        if (pageUserDoc.exists()) {
          const data = pageUserDoc.data();

          setPageUser({ ...data } as CustomTableUser);
        }
      } catch (error) {
        console.error("Usuário não encontrado: ", error);
      }
    };

    fetchUser();
  }, [userId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      console.log("Imagem escolhida");
      const file = e.target.files[0];
      setImage(file);
      const fileUrl = URL.createObjectURL(file);
      setImageURL(fileUrl);
    }
  };

  const handleUpdate = async (userId: string, newData: Data) => {
    try {
      const userRef = doc(db, "user", userId);
      await updateDoc(userRef, newData);
      console.log("Informações atualizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar o usuário: ", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uid = auth.currentUser?.uid;
    if (!uid) {
      return;
    }

    const authUser = auth.currentUser;

    if (authUser) {
      if (!authUser.emailVerified) {
        console.log("Verificação de email enviado.");
        await sendEmailVerification(authUser);
        console.log("Verificação enviada para " + authUser.email);
      } else {
        let url = data.profilePicture || "";
        if (image) {
          const storageRef = ref(storage, `profilePictures/${uid}.jpg`);
          await uploadBytes(storageRef, image);
          console.log("Upload de imagem realizado com sucesso!");
          url = await getDownloadURL(storageRef);
          console.log("url: ", url);
          setData({
            ...data,
            profilePicture: url,
          });
        }
        setIsVerified(true);
        handleUpdate(uid, {
          ...data,
          profilePicture: url,
        }); // Update no Firestore
        if (!pageUser) return;
        setPageUser({
          ...pageUser,
          profilePicture: url,
        });
        if (!user) return;
        setUser({
          ...user,
          profilePicture: url,
        });

        try {
          // Update no Auth
          await updateEmail(authUser, data.email);
          await updatePassword(authUser, data.password);
          console.log("Email Firebase Auth atualizado: ", authUser.email);
        } catch (error) {
          console.error("Erro ao atualizar Email no Firebase Auth: ", error);
        }
      }
      await authUser.reload();
    }
  };

  return (
    <div className="p-10 h-3/4">
      <p className="pb-5 text-4xl font-medium text-primary-default"> {user?.uid == userId ? "Meu perfil" : "Perfil de " + pageUser?.name}</p>
      <div className="w-full bg-slate-200 min-h-none max-h-none p-6 shadow-xl mx-auto rounded-xl">
        <div className="flex flex-col min-h-full text-left align-middle">
          <div className="flex flex-row h-full text-left align-middle min-h-none w-full">
            <img
              className="mt-10 h-56 w-56 rounded-full transform hover:scale-105 hover:rounded-lg transition-all duration-500 object-cover"
              src={
                pageUser?.profilePicture ? pageUser.profilePicture : blankpfp
              }
              alt="Profile"
            />
            <div className="w-4/5 h-full">
              <div className="p-7 w-full">
                <div className="flex flex-row">
                  <h1 className="text-4xl font-bold">
                    {pageUser?.name
                      ? pageUser.name
                      : "Usuário não encontrado..."}
                  </h1>
                  {user?.uid == userId && (
                    <button
                      className="hover:scale-110 transition-all"
                      onClick={toggleModal}
                    >
                      <svg
                        className="ml-2 w-[30px] h-[30px] text-gray-800 dark:text-white"
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
                  <div className="flex flex-col min-w-1 h-full">
                    <TagDisplay tags={tags} />
                    {user?.uid == userId && (
                    <TagModal tags={tags} refresh={refresh} setRefresh={setRefresh} />
                    )}
                  </div>
              </div>
              <div className="pl-7">
                <Description />
              </div>
            </div>
          </div>
          <hr className="bg-primary-dark mt-10 w-full h-0.5"></hr>
          <SelectCity/>
        </div>
      </div>
      <SecondaryInfo/>
      {openModal && ( // Modal
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-100 w-1/2 m-auto rounded-lg shadow-xl">
            <div className="w-full h-5 bg-primary-default rounded-t-lg"></div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-row">
                <h2 className="p-4 text-4xl font-bold">
                  Alterar informações pessoais
                </h2>
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
              <div className="m-4">
                Nome:
                <input
                  type="text"
                  className="block mb-2 border-2 hover:border-primary-default hover:shadow-lg focus:border-primary-dark transition-all pl-2 text-sm text-gray-900 dark:text-white py-2"
                  style={{ width: "70%" }}
                  placeholder="Digite seu novo nome"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                ></input>
              </div>
              <div className="m-4">
                Email:
                <input
                  type="email"
                  className="block mb-2 border-2 hover:border-primary-default hover:shadow-lg focus:border-primary-dark transition-all pl-2 text-sm text-gray-900 dark:text-white py-2"
                  style={{ width: "70%" }}
                  placeholder="Digite seu novo e-mail"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                ></input>
              </div>
              <div className="m-4">
                Senha:
                <input
                  type="password"
                  className="block mb-2 border-2 hover:border-primary-default hover:shadow-lg focus:border-primary-dark transition-all pl-2 text-sm text-gray-900 dark:text-white py-2"
                  style={{ width: "70%" }}
                  placeholder="Digite sua nova senha"
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                ></input>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-2"
                ></input>
                <div className="flex flex-row gap-4">
                  <img
                    className="mt-5 h-32 rounded-lg"
                    src={imageURL ? imageURL : blankpfp}
                    alt="Profile"
                  />
                  <img
                    className="mt-5 h-32 w-32 object-cover rounded-full"
                    src={imageURL ? imageURL : blankpfp}
                    alt="Profile"
                  />
                </div>
              </div>
              <div className="flex flex-row p-3 gap-3">
                <button
                  className="text-sm font-medium p-2 text-textcolor-light focus:outline-none bg-primary-default rounded-lg hover:bg-primary-dark hover:text-textcolor-light focus:z-10 focus:ring-4 focus:ring-gray-100"
                  type="submit"
                >
                  Alterar
                </button>
                {isVerified && <p>Email has been successfully updated!</p>}
                {user ? <DeleteAccountBtn /> : <p>No user logged in</p>}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuario;