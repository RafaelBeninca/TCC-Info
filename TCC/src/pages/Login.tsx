import {
  doSignInWithEmailAndPassword,
} from "../contexts/authContext/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { useContext, useState } from "react";
import "./../index.css";
import { FormUser } from "../components/Interfaces";
import ErrorMsg from "../components/ErrorMsg";
import { FirebaseAuthContext } from "../contexts/AuthenticationProvider/FirebaseAuthContext";

const Login = () => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [toggleError, setToggleError] = useState<boolean>(false);
  const navigate = useNavigate();

  const context = useContext(FirebaseAuthContext);

  if (!context) {
    throw new Error("FirebaseAuthContext must be used within a FirebaseAuthContextProvider");
  }

  const {dispatch} = context;

  const [user, setUser] = useState<Omit<FormUser, "name">>({
    email: "",
    password: "",
  })

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        const userCredential = await doSignInWithEmailAndPassword(user.email, user.password);
        dispatch({
          type: "LOGIN",
          payload: {
            ...userCredential.user,
            email: userCredential.user.email as string,
          },
        });
        console.log("Usuário logado com sucesso: "+userCredential);
        setToggleError(false);
        navigate("/");
      } catch (error) {
        console.log(error);
        setToggleError(true);
      } finally {
        setIsSigningIn(false)
      }
    }
  };

  // const onGoogleSignIn = async (e: any) => {
  //   e.preventDefault();
  //   if (!isSigningIn) {
  //     setIsSigningIn(true);
  //     doSignInWithGoogle().catch((err) => {
  //       setIsSigningIn(false);
  //     });
  //   }
  // };

  return (
    <div className="h-full">
      <div
        className="border-4 rounded-lg px-10 w-1/3 mx-auto shadow-xl mt-5"
        style={{ marginTop: "5%", paddingBottom: "5%" }}
      >
        <form className="max-w-sm mx-auto mt-20" onSubmit={handleLogin}>
          <span className="text-3xl font-semibold whitespace-nowrap dark:text-white">
            Login
          </span>
          <div className="mb-5 mt-10">
            Email:
            <input
              type="text"
              className="block mb-2 border-2 hover:border-primary-default hover:shadow-lg focus:border-primary-dark transition-all focus:ring-primary-default"
              style={{ width: "70%" }}
              placeholder="Digite seu E-mail"
              value={user.email}
              onChange={(e) => setUser({...user, email: e.target.value})}
            ></input>
          </div>
          <div className="mb-5">
            Senha:
            <input
              type="password"
              className="block mb-2 border-2 hover:border-primary-default hover:shadow-lg focus:border-primary-dark transition-all focus:ring-primary-default"
              style={{ width: "70%" }}
              placeholder="Digite sua senha"
              value={user.password}
              onChange={(e) => setUser({...user, password: e.target.value})}
            ></input>
            <a
              href="/register"
              className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 my-5 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              aria-current="page"
            >
              Não tem uma conta ainda? Registre-se
            </a>
            {toggleError && <ErrorMsg/>}
            <br />
          </div>
          <div className="flex items-start mb-5">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                value=""
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
              />
            </div>
            <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Lembrar de mim
            </label>
          </div>
          <button
            type="submit"
            className="flex flex-row text-white bg-primary-default hover:bg-primary-dark font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center hover:scale-105 transition-transform duration-300"
          >
            <p className="text-base pr-3">Logar</p>
            <svg
              className="w-[27px] h-[27px] text-white"
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
                strokeWidth="1.5"
                d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
