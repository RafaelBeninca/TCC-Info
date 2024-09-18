import { Outlet } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import DeleteAccountBtn from "../components/DeletarConta";

const Opcoes = () => {
  const { currentUser } = useAuth();
  return (
    <div>
      <p>Opções</p>
      <DeleteAccountBtn/>
    </div>
  );
};

export default Opcoes;
