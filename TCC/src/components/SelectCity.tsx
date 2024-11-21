import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useTableUserContext from "../hooks/useTableUserContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../contexts/firebase/firebaseConfig";

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

const SelectCity: React.FC = () => {
  const [editable, setEditable] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const { userId } = useParams<{ userId: string }>();
  const { user } = useTableUserContext();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const docRef = doc(db, "user", userId);
        const userDoc = await getDoc(docRef);
        if (userDoc.exists()) {
          const selection = userDoc.data().city;
          setSelectedCity(selection);
        }
      } catch (error) {
        console.error("Erro ao encontrar o usuário da página: ", error);
      }
    };
    fetchUser();
  }, [userId]);

  const toggleEditable = async () => {
    if (editable) {
      try {
        const userRef = doc(db, "user", user?.uid);
        await updateDoc(userRef, { city: selectedCity });
        alert("E-mail de display salvo com sucesso!");
        setSelectedCity(selectedCity);
      } catch (error) {
        console.error("Erro ao atualizar descrição: ", error);
      }
    }
    setEditable(!editable);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
  };

  return (
    <div className="flex flex-row text-lg gap-4 mt-5">
      <p className="my-auto font-semibold text-xl">Município:</p>
      {userId == user?.uid && editable ? (
        <select
          className="h-10 w-60 my-auto border-2 bg-transparent border-primary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary-default focus:border-primary-default overflow-y-auto hover:shadow-lg transition-all"
          value={selectedCity}
          onChange={handleSelectChange}
        >
          <option disabled>Selecione seu município</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      ) : (
        <p className="text-primary-dark text-xl font-semibold">
          {selectedCity ? selectedCity : "- - -"}
        </p>
      )}
      {user?.uid == userId && (
        <button
          className="w-6 h-6 hover:scale-110 transition-all duration-300"
          onClick={toggleEditable}
        >
          <svg
            className="w-[25px] h-[25px] text-textcolor-dark hover:text-primary-default"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            {!editable ? (
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
  );
};

export default SelectCity;
