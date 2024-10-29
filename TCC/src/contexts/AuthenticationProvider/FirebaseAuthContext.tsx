import { createContext, useReducer, ReactNode, useEffect } from "react";
import FirebaseAuthReducer from "./FirebaseAuthReducer";

interface User {
  uid: string;
  email: string;
}

interface AuthState {
  currentUser: User | null;
}

interface FirebaseAuthContextType {
  currentUser: User | null;
  dispatch: React.Dispatch<AuthAction>;
}

type AuthAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" };

const INITIAL_STATE: AuthState = {
  currentUser: JSON.parse(localStorage.getItem("user") || "null")
};

export const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined);

export const FirebaseAuthContextProvider: React.FC<{ children: ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(FirebaseAuthReducer, INITIAL_STATE);

  useEffect(()=>{
    localStorage.setItem("user", JSON.stringify(state.currentUser))
  },[state.currentUser]) // Stores user in LocalStorage.

  return(
    <FirebaseAuthContext.Provider value={{ currentUser: state.currentUser, dispatch}}>
      {children}
    </FirebaseAuthContext.Provider>
  )
}