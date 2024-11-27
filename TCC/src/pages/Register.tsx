import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../contexts/firebase/firebaseConfig";
import { FormEvent, useContext, useState } from "react";
import { FormUser } from "../components/Interfaces";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import ErrorMsg from "../components/ErrorMsg";
import { FirebaseAuthContext } from "../contexts/AuthenticationProvider/FirebaseAuthContext";
import { doSignInWithEmailAndPassword } from "../contexts/authContext/auth";

const Register = () => {
  const [error, setError] = useState<string>("");

  const [user, setUser] = useState<FormUser>({
    name: "",
    email: "",
    password: "",
  });

  const context = useContext(FirebaseAuthContext);

  if (!context) {
    throw new Error(
      "FirebaseAuthContext must be used within a FirebaseAuthContextProvider"
    );
  }

  const { dispatch } = context;

  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();

  const signUp = async (e: FormEvent) => {
    e.preventDefault();

    if (!isSigningIn) {
      setIsSigningIn(true);

      try {
        const res = await createUserWithEmailAndPassword(
          auth,
          user.email,
          user.password
        );

        const userCredential = await doSignInWithEmailAndPassword(
          user.email,
          user.password
        );

        if (!isSigningIn) {
          console.log("Usuário logado", userCredential.user)

          dispatch({
            type: "LOGIN",
            payload: {
              ...userCredential.user,
              email: userCredential.user.email as string,
            },
          });
          
          await setDoc(doc(db, "user", res.user.uid), {
            ...user,
            Timestamp: serverTimestamp(),
          });
          
          navigate("/");
        }
      } catch (err: any) {
        console.log("Erro ao Registrar usuário: " + err);
        setIsSigningIn(false)
        switch (err.code) {
          case "auth/email-already-in-use":
            setError("Este e-mail já está em uso.");
            break;
          case "auth/weak-password":
            setError("Senha precisa ser no mínimo 6 dígitos.");
            break;
          case "auth/invalid-email":
            setError("Por favor use um e-mail válido.");
            break;
          default:
            setError("Ocorreu um acidente, por favor, tente novamente.");
        }
      }
    }
  };

  return (
    <div className="h-full">
      <div
        className="border-4 rounded-lg px-10 w-1/3 mx-auto mt-5 shadow-xl"
        style={{ marginTop: "5%", paddingBottom: "5%" }}
      >
        <form className="max-w-sm mx-auto mt-20" onSubmit={signUp}>
          <span className="text-3xl font-semibold whitespace-nowrap dark:text-white">
            Registro
          </span>
          <div className="mb-5 mt-10">
            Nome:
            <input
              type="text"
              className="block mb-5 border-2 hover:border-primary-default hover:shadow-lg focus:border-primary-dark transition-all focus:ring-primary-default"
              style={{ width: "70%" }}
              placeholder="Digite seu nome"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            ></input>
            Email:
            <input
              type="text"
              className="block mb-2 border-2 hover:border-primary-default hover:shadow-lg focus:border-primary-dark transition-all focus:ring-primary-default"
              style={{ width: "70%" }}
              placeholder="Digite seu E-mail"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
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
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            ></input>
            <a
              href="/login"
              className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 my-5 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              aria-current="page"
            >
              Já possui uma senha? Entrar
            </a>
            {error && <ErrorMsg message={error}/>}
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
            className="flex flex-row text-white bg-primary-default hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg  text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            <p className="text-base pr-3">Registre-se</p>
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
                d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
