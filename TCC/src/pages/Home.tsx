import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { auth, db } from "../contexts/firebase/firebaseConfig";
import "flowbite";
import { onAuthStateChanged } from "firebase/auth";
import { FormUser } from "../components/Interfaces";
import { collection, getDocs, query, where } from "firebase/firestore";

const Home = () => {
  const [authUser, setAuthUser] = useState<FormUser | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    let uid: string;
    const listen = onAuthStateChanged(auth, async (user) => {
      if (user) {
        uid = user.uid;
        const userRef = collection(db, "user");
        const q = query(userRef, where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        setName(querySnapshot.docs[0].data().name)
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
        <p className="pt-5 text-6xl font-bold">Bem-Vindo{auth.currentUser ? ', '+ name +'!' : '!'} </p>
        <p className="pt-5 text-2xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc convallis sit amet felis ac fringilla. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
    </div>
  );
};

export default Home;
