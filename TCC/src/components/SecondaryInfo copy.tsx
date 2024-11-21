import { collection, doc, getDoc, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../contexts/firebase/firebaseConfig";
import useTableUserContext from "../hooks/useTableUserContext";
import { SecDisplayInfo } from "./Interfaces";


const SecondaryInfo = () => {
  const [emailEditable, setEmailEditable] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchTagId, setSearchTagId] = useState<string>("");
  const [searchCity, setSearchCity] = useState<string>("");
  const [phoneEditable, setPhoneEditable] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const { user } = useTableUserContext();
  const { userId } = useParams<{ userId: string }>();
  const [displayData, setDisplayData] = useState<SecDisplayInfo>({
    displayEmail: user?.displayEmail || "",
    displayPhone: user?.displayPhone || "",
  });

  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        const productCollection = collection(db, "services");
        let q = query(productCollection);

        if (searchTerm) {
          q = query(
            q,
            where("title", ">=", searchTerm ),
            where("title", "<=", searchTerm + "\uf8ff")
          );
        }

        if (searchCity) {
          q = query(q, where("city", "==", searchTagId))
        }

        if 
      }
    }
  })

  const toggleEditableEmail = async () => {
    if (emailEditable) {
      try {
        const userRef = doc(db, "user", user?.uid);
        await updateDoc(userRef, { displayEmail: displayData.displayEmail });
        console.log(displayData.displayEmail);
        setDisplayData({
          ...displayData,
          displayEmail: displayData.displayEmail,
        });
        setRefresh(!refresh)
        alert("E-mail de display salvo com sucesso!")
      } catch (error) {
        console.error("Erro ao atualizar descrição: ", error);
      }
    }
    setEmailEditable(!emailEditable)
  }

  const toggleEditablePhone = async () => {
    if (phoneEditable) {
      try {
        const userRef = doc(db, "user", user?.uid);
        await updateDoc(userRef, { displayPhone: displayData.displayPhone });
        console.log(displayData.displayEmail);
        setDisplayData({
          ...displayData,
          displayEmail: displayData.displayEmail,
        });
        setRefresh(!refresh)
        alert("E-mail de display salvo com sucesso!")
      } catch (error) {
        console.error("Erro ao atualizar descrição: ", error);
      }
    }
    setPhoneEditable(!phoneEditable)
  }

  return (
  <div className="mt-6 pb-7">
    <p className="text-3xl font-semibold text-primary-dark"> Informações de contato </p>
    <div className="bg-slate-300 p-2 gap-3 flex flex-row justify-center w-full h-1/6 mt-3 rounded-xl shadow-xl">
      <div className="bg-slate-200 h-full w-full rounded-lg shadow-lg mx-auto p-4 text-xl font-semibold">
        <div className="flex flex-row justify-between text-center">
          {!phoneEditable ? (
          <div className="flex flex-row text-center">
            <p> Número: </p>
            <p className="ml-2 text-primary-dark"> {displayData.displayPhone ? displayData.displayPhone : "- - -"} </p>
          </div>
          ) : (
            <input
            type="text"
            className="block border-2 h-7 hover:border-primary-default hover:shadow-lg focus:border-primary-dark transition-all pl-2 text-sm text-gray-900 dark:text-white py-2"
            style={{ width: "70%" }}
            placeholder="Digite seu novo nome"
            value={displayData.displayPhone}
            onChange={(e) => setDisplayData({ ...displayData, displayPhone: e.target.value })}
          ></input>
          )}
          {userId == user?.uid && (
          <button className="w-6 h-6 hover:scale-110 transition-all duration-300" onClick={toggleEditablePhone}>
          <svg
            className="w-[25px] h-[25px] text-textcolor-dark hover:text-primary-default"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            {!phoneEditable ? (
                <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"
              />
            ) : (
              <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 11.917 9.724 16.5 19 7.5"
            />
            )}
          </svg>
        </button>
        )}
        </div>
      </div>
      <div className="bg-slate-200 h-full w-full rounded-lg shadow-lg mx-auto p-4 text-xl font-semibold">
        <div className="flex flex-row justify-between text-center">
          {!emailEditable ? (
          <div className="flex flex-row text-center">
            <p> E-mail: </p>
            <p className="ml-2 text-primary-dark"> {displayData.displayEmail ? displayData.displayEmail : "- - -"} </p>
          </div>
          ) : (
            <input
            type="text"
            className="block border-2 h-7 hover:border-primary-default hover:shadow-lg focus:border-primary-dark transition-all pl-2 text-sm text-gray-900 dark:text-white py-2"
            style={{ width: "70%" }}
            placeholder="Digite seu novo nome"
            value={displayData.displayEmail}
            onChange={(e) => setDisplayData({ ...displayData, displayEmail: e.target.value })}
          ></input>
          )}
          {userId == user?.uid && (
          <button className="w-6 h-6 hover:scale-110 transition-all duration-300" onClick={toggleEditableEmail}>
          <svg
            className="w-[25px] h-[25px] text-textcolor-dark hover:text-primary-default"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            >
            {!emailEditable ? (
              <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"
              />
            ) : (
              <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 11.917 9.724 16.5 19 7.5"
              />
            )}
          </svg>
          </button>
          )}
        </div>
      </div>
    </div>
  </div>
  )
};

export default SecondaryInfo