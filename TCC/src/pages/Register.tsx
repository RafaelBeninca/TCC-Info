import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { auth } from "../contexts/firebase/firebaseConfig";
import { useState } from "react";

const Register = () => {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const signUp = async (e: any) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential: any) => {
          console.log("sucesso :)");
          console.log(userCredential);
          navigate("/");
        })
        .catch((error: any) => {
          console.log("caca");
          console.log(error);
        });
    }
  };

  return (
    <div className="">
      <div
        className="border-4 rounded-lg w-1/4 mx-auto"
        style={{ marginTop: "5%", paddingBottom: "5%" }}
      >
        <form className="max-w-sm mx-auto mt-20" onSubmit={signUp}>
          <span className="text-3xl font-semibold whitespace-nowrap dark:text-white">
            Registro
          </span>
          <div className="mb-5 mt-10">
            Email:
            <input
              type="text"
              className="block mb-2 border-2 pl-2 text-sm font-medium text-gray-900 dark:text-white py-2"
              style={{ width: "70%" }}
              placeholder="Digite seu E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className="mb-5">
            Senha:
            <input
              type="text"
              className="block mb-2 border-2 pl-2 text-sm font-medium text-gray-900 dark:text-white py-2"
              style={{ width: "70%" }}
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <a
              href="/login"
              className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 my-5 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              aria-current="page"
            >
              Já possui uma senha? Entrar
            </a>
            <br />
          </div>
          <div className="flex items-start mb-5">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                value=""
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                required
              />
            </div>
            <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Lembrar de mim
            </label>
          </div>
          <button
            type="submit"
            className="flex flex-row text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
