import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";

interface ErrorMsgProps {
  message: string;
};

const ErrorMsg: React.FC<ErrorMsgProps> = ({message}) => {
  if (!message) return;

  return (
    <Alert className="bg-warning-default" icon={() => <HiInformationCircle className="w-5 h-5 mr-2 text-textcolor-light" /> }>
      <span className="font-bold text-textcolor-light">Erro.</span> <span className="text-textcolor-light"> {message} </span>
    </Alert>
  );
}

export default ErrorMsg
