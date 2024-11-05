import { useContext } from "react";
import TableUserContext from "../contexts/AuthenticationProvider/TableUserContext";

const useTableUserContext = () => {
  const context = useContext(TableUserContext);

  if (!context) throw Error("Can't use TableUserContext outside of provider");

  return context;
};

export default useTableUserContext;
