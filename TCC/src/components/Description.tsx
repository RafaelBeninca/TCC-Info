import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useTableUserContext from "../hooks/useTableUserContext";
import { db } from "../contexts/firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Description = () => {
  const [editable, setEditable] = useState<boolean>(false);
  const { user } = useTableUserContext();
  const [description, setDescription] = useState<string>(
    user?.description || ""
  );

  const { userId } = useParams<{ userId: string }>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const docRef = doc(db, "user", userId);
        const userDoc = await getDoc(docRef);
        if (userDoc.exists()) {
          const description = userDoc.data().description;
          setDescription(description);
        }
      } catch (error) {
        console.error("Erro ao encontrar o usuário da página: ", error);
      }
    };
    fetchUser();
  }, [userId]);

  const saveEdit = async () => {
    if (user) {
      const uid = user.uid;
      try {
        const userRef = doc(db, "user", uid);
        await updateDoc(userRef, { description: description });
        console.log(description);
        setDescription(description);
        alert("Descrição salva com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar descrição: ", error);
      }
    }
    setEditable(!editable);
  };

  return (
    <>
      {user?.uid == userId && editable == true && (
        <div className="flex flex-row min-h-36 w-full">
          <textarea
            className={
              editable
                ? "flex flex-row bg-slate-200 rounded-md resize-none focus:ring-primary-default"
                : "bg-transparent rounded-md resize-none"
            }
            style={{ width: "100%" }}
            disabled={!editable}
            placeholder={
              editable ? "Digite a descrição do seu usuário" : user?.description
            }
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <div className="flex flex-col gap-0">
            {editable == true && (
              <div>
                <button
                  className="flex flex-row w-10 h-10 hover:scale-110 transition-all duration-300"
                  onClick={saveEdit}
                >
                  <svg
                    className="w-[25px] h-[25px] m-auto text-textcolor-dark hover:text-primary-default"
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
                      strokeWidth="2"
                      d="M5 11.917 9.724 16.5 19 7.5"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {(user?.uid !== userId || editable == false) && (
        <div className="flex flex-row h-full">
            <p className="h-full w-full whitespace-normal line-clamp-6 break-words overflow-hidden text-ellipsis"> {description} </p>
          {user?.uid == userId ? (
            <button
              className="flex flex-row w-8 h-8 hover:scale-110 transition-all duration-300"
              onClick={() => setEditable(!editable)}
            >
              <svg
                className="w-[25px] h-[25px] m-auto text-textcolor-dark hover:text-primary-default"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"
                />
              </svg>
            </button>
          ) : null}
        </div>
      )}
    </>
  );
};

export default Description;
