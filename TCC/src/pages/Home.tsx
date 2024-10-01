import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { auth } from "../contexts/firebase/firebaseConfig";
import "flowbite";
import { onAuthStateChanged } from "firebase/auth";

const Home = () => {
  const [authUser, setAuthUser] = useState<User | null>(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  const { currentUser } = useAuth();
  return (
    <div className=" h-screen mt-8">
      <div className="flex flex-col bg-gray-200 w-5/6 h-2/4 pl-6 mx-auto rounded-xl">
        <p className="pt-5 text-6xl font-bold">Bem-Vindo{auth.currentUser ? ', '+ auth.currentUser?.email +'!' : '!'} </p>
        <p className="pt-5 text-2xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc convallis sit amet felis ac fringilla. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
    </div>
  );
};

export default Home;
