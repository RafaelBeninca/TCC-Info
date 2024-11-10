import { useState } from "react";
import useTableUserContext from "../hooks/useTableUserContext";

const TagDisplay: React.FC = () => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const { user } = useTableUserContext();

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  return (
    <div className="flex flex-row bg-slate-300 w-2/3 h-9 ml-2 mt-3 rounded-full">
      <div className="w-auto h-auto px-2 bg-slate-300 border-primary-default border-2 my-auto mx-1 gap-2 rounded-full overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="text-primary-dark font-semibold">Texto da tag</span>
      </div>
    </div>
  );
};

export default TagDisplay;
