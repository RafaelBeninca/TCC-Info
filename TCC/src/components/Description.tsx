import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import useTableUserContext from "../hooks/useTableUserContext";
import { db } from "../contexts/firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";


const Description = () => {
  const [editable, setEditable] = useState<boolean>(false)
  const { user } = useTableUserContext();
  const [description, setDescription] = useState<string>(user?.description || "")

  const { userId } = useParams<{ userId: string }>();

  // useEffect(() => {
  //   if (user?.description) {
  //     setDescription(user.description);
  //   }
  // }, [user])

  // const toggleEditable = () => {
  //   setEditable(!editable);
  //   if (!editable) {
  //     setDescription(user?.description || "")
  //   }
  // };

  const saveEdit = async () => {
    if (user) {
      const uid = user.uid
      try {
        const userRef = doc(db, "user", uid);
        await updateDoc(userRef, {description: description})
        console.log(description)
        setDescription(description)
      } catch (error) {
        console.error("Erro ao atualizar descrição: ", error)
      }
    }
    setEditable(!editable)
  };

  return (
    <div className="flex flex-row h-full mt-5 pr-10">
      <input
        type="text"
        className="flex flex-row h-full mt-5 pr-10"
        style={{ width: "80%" }}
        disabled={!editable}
        placeholder={editable ? "Digite a descrição do seu usuário" : user?.description}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></input>
      <div className="flex flex-col gap-0" onClick={saveEdit}>
        {editable == true && (
        <div>
          <button className="flex flex-row w-10 h-10 hover:scale-110 transition-all duration-300">
            <svg className="w-[25px] h-[25px] m-auto text-textcolor-dark hover:text-primary-default" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5"/>
            </svg>
          </button>
        </div>
        )}
        {editable == false && (
        <button className="flex flex-row w-10 h-10 hover:scale-110 transition-all duration-300" onClick={() => setEditable(!editable)}>
          <svg className="w-[25px] h-[25px] m-auto text-textcolor-dark hover:text-primary-default" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"/>
          </svg>
        </button>
        )}
      </div>
    </div>
  )
}

export default Description