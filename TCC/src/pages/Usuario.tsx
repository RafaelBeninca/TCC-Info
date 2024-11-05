import {
  sendEmailVerification,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import DeleteAccountBtn from "../components/DeleteAccountBtn";
import { Data } from "../components/Interfaces";
import { auth, db, storage } from "../contexts/firebase/firebaseConfig";
import useTableUserContext from "../hooks/useTableUserContext";

const Usuario: React.FC = () => {
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  
  const { user } = useTableUserContext();

  const [data, setData] = useState<Data>({
    name: user?.name || "",
    profilePicture: user?.profilePicture || "",
    password: "",
    email: "",
  })

  
  // const upload ={
  //   name: data.name,
  //   email: data.email,
  //   password: data.password,
  //   profilePicture: "",
  // }
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files &&  e.target.files[0]) {
      console.log("Imagem escolhida")
      setImage(e.target.files[0])
    }
  }

  const handleUpdate = async (userId: string, newData: Data) => {

    try {
      const userRef = doc(db, "user", userId)
      await updateDoc(userRef, newData)
      console.log("Informações atualizadas com sucesso!")
    } catch(error) {
      console.error("Erro ao atualizar o usuário: ", error)
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uid = auth.currentUser?.uid
    if (!uid) {
      return;
    }

    const user = auth.currentUser
    
    if (user) {
      if (!user.emailVerified) {
        console.log("Verificação de email enviado.")
        if (image) {
          const storageRef = ref(storage, `profilePictures/${uid}.jpg`);
          await uploadBytes(storageRef, image)
          console.log("Upload de imagem realizado com sucesso!")
          const url = await getDownloadURL(storageRef)
          setData({
            ...data,
            profilePicture: url
          });
        }
        await sendEmailVerification(user)
        setEmailSent(true)
        console.log("Verificação enviada para " + user.email);
      } else {
        setIsVerified(true);
        handleUpdate(uid, data) // Update no Firestore

        try { // Update no Auth
          await updateEmail(user, data.email);
          await updatePassword(user, data.password)
          console.log("Email Firebase Auth atualizado: ", user.email);
        } catch (error) {
          console.error("Erro ao atualizar Email no Firebase Auth: ", error);
        }
      }
      await user.reload()
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row">
          <h1 className="p-4 text-4xl font-bold">Usuário</h1>
        </div>
        <hr className="my-2" />
        <h2 className="p-4 text-4xl font-bold">Alterar informações da conta</h2>
        <hr className="my-2" />
        <div className="m-4">
          Nome:
          <input
            type="text"
            className="block mb-2 border-2 pl-2 text-sm text-gray-900 dark:text-white py-2"
            style={{ width: "70%" }}
            placeholder="Digite seu novo Nome"
            value={data.name}
            onChange={(e) => setData({...data, name: e.target.value})}
          ></input>
        </div>
        <div className="m-4">
          Email:
          <input
            type="email"
            className="block mb-2 border-2 pl-2 text-sm text-gray-900 dark:text-white py-2"
            style={{ width: "70%" }}
            placeholder="Digite seu novo E-mail"
            value={data.email}
            onChange={(e) => setData({...data, email: e.target.value})}
          ></input>
        </div>
        <div className="m-4">
          Senha:
          <input
            type="password"
            className="block mb-2 border-2 pl-2 text-sm text-gray-900 dark:text-white py-2"
            style={{ width: "70%" }}
            placeholder="Digite sua nova Senha"
            value={data.password}
            onChange={(e) => setData({...data, password: e.target.value})}
          ></input>
          <input type="file" accept="image/*" onChange={handleImageChange}></input>
          {data.profilePicture && <img src={data.profilePicture} alt="Profile" />}
        </div>
        <button className="m-4 mt-10 " type="submit">
          Alterar
        </button>
        {isVerified && <p>Email has been successfully updated!</p>}
        <hr className="my-2" />
        {user ? <DeleteAccountBtn uid={user.uid} /> : <p>No user logged in</p>}
      </form>
    </div>
  );
};

export default Usuario;
