import { useEffect, useState } from "react";
import DeleteAccountBtn from "../components/DeleteAccountBtn";
import {
  onAuthStateChanged,
  updateEmail,
  updatePassword,
  sendEmailVerification,
  User,
} from "firebase/auth";
import { auth, db, storage } from "../contexts/firebase/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import blankpfp from "../assets/images/blankpfp.jpg";
import { addDoc, collection } from "firebase/firestore";

const Opcoes = () => {
  const [user, setUser] = useState<User | null>(null);
  const [newName, setNewName] = useState();
  const [newEmail, setNewEmail] = useState(auth.currentUser?.email || "");
  const [emailSent, setEmailSent] = useState<boolean>(false)
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [newPassword, setNewPassword] = useState("");
  // const [file, setFile] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // useEffect(() => {
  //   const uploadFile = () => {
  //     const name = new Date().getTime() + file.name

  //     console.log(name)
  //     const storageRef = ref(storage, file.name)
  //     const uploadTask = uploadBytesResumable(storageRef, file)
  //   };
  //   file && uploadFile();
  // },[file])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpdatePofile = async (e: React.FormEvent) => { //arrumar a troca de foto de perfil
    e.preventDefault();

    if (!image) return;

    const storageRef = ref(storage, `../assets/images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Progresso: ${progress}`);
      },
      (error) => {
        console.error("Falha no upload: ", error);
      },
      async () => {
        // const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

        const ChangeImage = {
          profilePicture: image.name,
        };

        try {
          await addDoc(collection(db, "user"), ChangeImage);
          console.log("Imagem salva com sucesso!")
        } catch (error) {
          console.error("Erro ao dar upload na imagem: ", error)
        }
      }
    )
    // const updateFirestoreData = async (userId: string, newData: object) => {
    //   const userDocRef = doc(db, "user", userId);
    //   try {
    //     await updateDoc(userDocRef, newData);
    //   } catch (err) {
    //     console.error("Error", err);
    //   }  
    // };

    const user = auth.currentUser;
    if (user) {
      try {
        if (!emailSent) {
          await sendEmailVerification(user);
          setEmailSent(true);
          console.log("Verificação enviada para " + user.email);
        } else {
          await user.reload();
          if (user.emailVerified) {
            setIsVerified(true);
            console.log("Usuário já foi verificado!");

            try {
              await updateEmail(user, newEmail);
              await user.reload();
              console.log("Updated email: ", user.email);
            } catch (error) {
              console.error("Error at updating email: ", error)
            }
            
          } else {
            console.log("email ainda não verificado")
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    const listen = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  return (
    <div>
      <form onSubmit={handleUpdatePofile}>
      <div className="flex flex-row">
        <h1 className="p-4 text-4xl font-bold">Opções</h1>
        <svg
          className="w-[64px] h-[64px] text-gray-800 dark:text-white mt-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8.4 6.763c-.251.1-.383.196-.422.235L6.564 5.584l2.737-2.737c1.113-1.113 3.053-1.097 4.337.187l1.159 1.159a1 1 0 0 1 1.39.022l4.105 4.105a1 1 0 0 1 .023 1.39l1.345 1.346a1 1 0 0 1 0 1.415l-2.052 2.052a1 1 0 0 1-1.414 0l-1.346-1.346a1 1 0 0 1-1.323.039L11.29 8.983a1 1 0 0 1 .04-1.324l-.849-.848c-.18-.18-.606-.322-1.258-.25a3.271 3.271 0 0 0-.824.202Zm1.519 3.675L3.828 16.53a1 1 0 0 0 0 1.414l2.736 2.737a1 1 0 0 0 1.414 0l6.091-6.091-4.15-4.15Z" />
        </svg>
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
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        ></input>
      </div>
      <div className="m-4">
        Email:
        <input
          type="email"
          className="block mb-2 border-2 pl-2 text-sm text-gray-900 dark:text-white py-2"
          style={{ width: "70%" }}
          placeholder="Digite seu novo E-mail"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        ></input>
      </div>
      <div className="m-4">
        Senha:
        <input
          type="password"
          className="block mb-2 border-2 pl-2 text-sm text-gray-900 dark:text-white py-2"
          style={{ width: "70%" }}
          placeholder="Digite sua nova Senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        ></input>
        <input type="file" onChange={handleImageChange}></input>
      </div>
      <button className="m-4 mt-10 " type="submit">Alterar</button>
      {isVerified && <p>Email has been successfully updated!</p>}
      <hr className="my-2" />
      {user ? <DeleteAccountBtn uid={user.uid} /> : <p>No user logged in</p>}
      </form>
    </div>
  );
};

export default Opcoes;
