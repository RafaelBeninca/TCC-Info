import { useContext } from "react";
import { FirebaseAuthContext } from "../contexts/AuthenticationProvider/FirebaseAuthContext";

const useFirebaseAuthContext = () => {
  const context = useContext(FirebaseAuthContext);

  if (!context) throw Error("Can't use FirebaseAuthContext outside of provider");

  return context;
};

export default useFirebaseAuthContext;
