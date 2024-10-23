import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";


const ErrorMsg: React.FC = () => {

  return (
    <Alert className="bg-warning-default" icon={() => <HiInformationCircle className="w-5 h-5 mr-2 text-textcolor-light" /> }>
      <span className="font-bold text-textcolor-light">Erro.</span> <span className="text-textcolor-light"> Por favor, verifique novamente os campos.</span>
    </Alert>
  );
}

export default ErrorMsg
