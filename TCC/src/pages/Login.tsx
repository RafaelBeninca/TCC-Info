import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../contexts/authContext/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { useState } from "react";
import "./../index.css";

const Login = () => {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      await doSignInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log("sucesso :)");
          console.log(userCredential);
          navigate("/");
        })
        .catch((error) => {
          console.log("caca");
          console.log(error);
        });
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
    <div className="">
      <div
        className="border-4 rounded-lg w-1/3 mx-auto"
        style={{ marginTop: "5%", paddingBottom: "5%" }}
      >
        <form className="max-w-sm mx-auto mt-20" onSubmit={signIn}>
          <span className="text-3xl font-semibold whitespace-nowrap dark:text-white">
            Login
          </span>
          <div className="mb-5 mt-10">
            Email:
            <input
              type="text"
              className="block mb-2 border-2 pl-2 text-sm font-medium text-gray-900 dark:text-white w- py-2"
              placeholder="Digite seu E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className="mb-5">
            Senha:
            <input
              type="text"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white w-96 h-6"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
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
              Remember me
            </label>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
