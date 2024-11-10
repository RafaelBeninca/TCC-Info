import { useState } from "react";
import useTableUserContext from "../hooks/useTableUserContext";
import TagDisplay from "./TagDisplay";

const TagModal: React.FC = () => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const { user } = useTableUserContext();

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  return (
    <>
      <button className="mt-3" onClick={toggleModal}>
        <div className="flex flex-row gap-1 rounded-full h-7 w-16 bg-slate-100 hover:bg-slate-200 border-primary-default hover:border-primary-dark border-2 hover:scale-110 transition-all">
          <svg className="w-6 h-6 text-primary-default hover:text-primary-dark" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
          </svg>
          <span className="font-semibold text-primary-default hover:text-primary-dark">Tag</span>
        </div>
      </button>
      {openModal && ( // Modal
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-100 w-1/2 h-1/3 m-auto rounded-lg shadow-xl">
            <div className="w-full h-5 bg-primary-default rounded-t-lg"></div>
            <div className="flex flex-row">
              <h2 className="p-4 text-4xl font-bold"> Adicionar Tags </h2>
              <button className="my-auto ml-auto m-5" onClick={toggleModal}>
                <svg className="w-[40px] h-[40px] text-warning-default hover:text-warning-dark dark:text-white my-auto hover:scale-125 transition-all" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                </svg>
              </button>
            </div>
            <hr className="border-primary-default mx-2"/>
            <TagDisplay></TagDisplay>
          </div>
        </div>
      )}
    </>
  );
};

export default TagModal;
