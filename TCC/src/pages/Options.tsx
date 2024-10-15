import { useEffect, useState } from "react";
import DeleteAccountBtn from "../components/DeleteAccountBtn";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../contexts/firebase/firebaseConfig";

const Opcoes = () => {
  // const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null)

  // if (currentUser !== undefined) {
  //   setLoading(false);
  // }

  // if (loading) {
  //   return <div>Loading user information...</div>
  // }

  useEffect(() => {
    const listen = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      if (user) {
        setUser(user)
      } else {
        setUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  return (
    <div>
      <p className="">Opções</p>
      {user ?  (<DeleteAccountBtn uid={user.uid} />) : (<p>No user logged in</p>)}
    </div>
  );
};

export default Opcoes;
