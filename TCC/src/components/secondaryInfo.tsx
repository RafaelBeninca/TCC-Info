import { useState } from "react";
import useTableUserContext from "../hooks/useTableUserContext";
import { SecDisplayInfo } from "./Interfaces";


const SecondaryInfo = () => {
  const [cityEditable, setCityEditable] = useState<boolean>(false);
  const [emailEditable, setEmailEditable] = useState<boolean>(false);
  const [phoneEditable, setPhoneEditable] = useState<boolean>(false);
  const { user } = useTableUserContext();
  const [displayData, setDisplayData] = useState<SecDisplayInfo>({
    displayCity: user?.displayCity || "",
    displayEmail: user?.displayEmail || "",
    displayPhone: user?.displayPhone || "",
  });

  return (
  <div className="bg-slate-300 p-2 gap-3 flex flex-row justify-center w-full h-1/6 mt-3 rounded-xl shadow-xl">
    <div className="flex flex-row justify-between bg-slate-200 h-full w-full rounded-lg shadow-lg mx-auto p-4 text-xl font-semibold">
      <div className="flex flex-row text-center">
        <p> Cidade: </p>
        <p className="ml-2 text-primary-dark"> Criciúma </p>
      </div>
      <button className="w-6 h-6 hover:scale-110 transition-all duration-300">
        <svg
          className="w-[25px] h-[25px] text-textcolor-dark hover:text-primary-default"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 11.917 9.724 16.5 19 7.5"
          />
        </svg>
      </button>
    </div>
    <div className="bg-slate-200 h-full w-full rounded-lg shadow-lg mx-auto p-4 text-xl font-semibold">
      <div className="flex flex-row text-center">
        <p> Número: </p>
        <p className="ml-2 text-primary-dark"> (48) 9999-9999 </p>
      </div>
    </div>
    <div className="bg-slate-200 h-full w-full rounded-lg shadow-lg mx-auto p-4 text-xl font-semibold">
      <div className="flex flex-row text-center">
        <p> E-mail: </p>
        <p className="ml-2 text-primary-dark"> Contato@gmail.com </p>
      </div>
    </div>
  </div>
  )
};

export default SecondaryInfo