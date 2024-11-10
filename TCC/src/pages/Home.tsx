import { useEffect, useState } from "react";
import { auth, db } from "../contexts/firebase/firebaseConfig";
import "flowbite";
import { onAuthStateChanged } from "firebase/auth";
import { CustomTableUser } from "../components/Interfaces";
import { doc, getDoc } from "firebase/firestore";
import { Flowbite } from "flowbite-react";
import useTableUserContext from "../hooks/useTableUserContext";

const Home = () => {
  const [tableUser, setTableUser] = useState<CustomTableUser | null>(null);
  const { user } = useTableUserContext();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        console.log(uid);
        const docRef = doc(db, "user", uid);
        const docSnap = await getDoc(docRef);
        console.log(docSnap);

        if (docSnap.exists()) {
          const userData = docSnap.data();

          setTableUser({
            uid: userData.uid,
            name: userData.name,
            isProfessional: userData.isProfessional,
            profilePicture: userData.profilePicture,
          });
        } else {
          console.log(
            "Não foi possível encontrar um usuário com este id/uid" +
              docSnap.id +
              "/" +
              uid
          );
          setTableUser(null);
        }
      } else {
        setTableUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  return (
    <>
      <Flowbite>
        <div className=" h-screen mt-8 bg px-20 bg-white dark:bg-slate-900">
          {tableUser && (
            <div className="">
              <div className="flex flex-row mt-10">
                <p className="pt-5 text-6xl font-medium">Bem-Vindo,</p>{" "}
                <p className="pt-5 ml-4 text-6xl font-bold text-primary-default">
                  {user?.name}!
                </p>
              </div>
              <div className="h-0.5 mt-3 mb-10 w-auto bg-primary-default" />
            </div>
          )}
          <div className="flex flex-col bg-gray-200 h-2/4 pl-6 mx-auto rounded-xl">
            <p className="pt-5 text-2xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              convallis sit amet felis ac fringilla. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit.
            </p>
          </div>
        </div>
      </Flowbite>
    </>
  );
};

export default Home;
