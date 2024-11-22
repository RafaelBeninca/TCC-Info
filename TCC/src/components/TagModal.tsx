import { useState } from "react";
import { JoinTagsUser, Tag } from "./Interfaces";
import SelectTag from "./SelectTag";
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../contexts/firebase/firebaseConfig";
import useTableUserContext from "../hooks/useTableUserContext";
import TagDisplay from "./TagDisplay";

interface TagModalProps {
  tags: Tag[];
  refresh: boolean
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
}

const TagModal: React.FC<TagModalProps> = ({ tags, refresh, setRefresh }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [visibleError, setVisibleError] = useState<boolean>(false)
  const [error, setError] = useState<string>("");
  const [tagUser, setTagUser] = useState<JoinTagsUser>({
    userId: "",
    tagId: "",
  });

  const { user } = useTableUserContext();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTagUser({ ...tagUser, tagId: e.target.value });
  };

  const closeError = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setVisibleError(false)
  };

  const toggleModal = () => {
    setVisibleError(false)
    setOpenModal(!openModal);
  };

  const addTag = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!tagUser.tagId || !user) return;
      console.log(tagUser.tagId);
      const docRef = collection(db, "joinTagsUser");
      const idUserQuery = query(docRef, where("userId", "==", user.uid));
      const queryUserSnapshot = await getDocs(idUserQuery);

      const idTagQuery = query(docRef, where("tagId", "==", tagUser.tagId));
      const queryTagSnapshot = await getDocs(idTagQuery);
      console.log(queryTagSnapshot);

      if (!queryTagSnapshot.empty) {
        setError("Você já possui esta tag!");
        setVisibleError(true)
        return;
      } else if (queryUserSnapshot.size >= 3) {
        setError("Limite de tags excedido!");
        setVisibleError(true)
        return;
      }

      const joinRef = await addDoc(docRef, {
        ...tagUser,
        userId: user.uid,
      });
      alert("Tag adicionada com sucesso.")

      setTagUser({
        ...tagUser,
      })
      console.log("Tag adicionada ao usuário com sucesso: ", joinRef.id);
      // }
    } catch (error) {
      console.error("Erro ao adicionar tag ao usuário: ", error);
    }
    setRefresh(!refresh)
  };

  const deleteTag = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    console.log("DeleteTag")
    try {
      if (!tagUser.tagId || !user) return;
      const docRef = collection(db, "joinTagsUser");

      const idTagQuery = query(docRef, 
        where("tagId", "==", tagUser.tagId), 
        where("userId", "==", tagUser.userId));
      const queryTagSnapshot = await getDocs(idTagQuery);

      if (queryTagSnapshot.empty) {
        setError("Não é possível excluir essa tag!");
        setVisibleError(true)
        return;
      }

      for (const docSnapshot of queryTagSnapshot.docs) {
        await deleteDoc(doc(db, "joinTagsUser", docSnapshot.id));
        console.log(`Deleted document with ID: ${docSnapshot.id}`);
      }
      alert("Tag deletada com sucesso.")

      setTagUser({
        ...tagUser,
      })
      // }
    } catch (error) {
      console.error("Erro ao adicionar tag ao usuário: ", error);
    }
    setRefresh(!refresh)
  };

  return (
    <>
      <button className="w-fit mt-2" onClick={toggleModal}>
        <div className="bg-primary-default flex flex-row gap-1 rounded-lg h-7 w-16 hover:bg-primary-light border-2 hover:scale-110 transition-all">
          <svg
            className="text-textcolor-light w-6 h-6"
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
              d="M5 12h14m-7 7V5"
            />
          </svg>
          <span className="font-semibold text-textcolor-light">Tag</span>
        </div>
      </button>
      {openModal && ( // Modal
        <form onSubmit={addTag}>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-100 w-1/2 max-h-90 min-h-90 pb-5 m-auto rounded-lg shadow-xl">
              <div className="bg-primary-default w-full h-5 rounded-t-lg"></div>
              <div className="flex flex-row">
                <h2 className="p-4 text-4xl font-bold"> Adicionar Tags </h2>
                <button className="my-auto ml-auto m-5" onClick={toggleModal}>
                  <svg
                    className="w-[40px] h-[40px] text-warning-default hover:text-warning-dark dark:text-white my-auto hover:scale-125 transition-all"
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
                      d="M6 18 17.94 6M18 18 6.06 6"
                    />
                  </svg>
                </button>
              </div>
              <hr className="border-primary-default mx-2" />
              <p className="text-gray-500 pl-2">
                Um usuário pode ter até 3 tags profissionalizantes diferentes.
              </p>
              <div className="flex flex-row p-3 align-middle gap-3">
                <SelectTag
                  selectedOptionId={tagUser.tagId}
                  onChange={handleChange}
                />
                <div className="flex flex-row gap-1">
                  <button
                    className="bg-primary-default hover:bg-primary-dark rounded-md w-20 h-8 my-auto text-textcolor-light font-semibold"
                    type="submit"
                  >
                    <p>Adicionar</p>
                  </button>
                  <button
                  type="button"
                  onClick={deleteTag}
                    className="bg-warning-default hover:bg-warning-dark rounded-md w-20 h-8 my-auto text-textcolor-light font-semibold"
                  >
                    <p>Deletar</p>
                  </button>
                </div>
                {visibleError === true && (
                <div className="flex flex-row my-auto gap-2">
                  <p className="text-warning-default font-semibold">
                    {" "}
                    {error}{" "}
                  </p>
                  <button className="my-auto ml-auto m-5" onClick={closeError}>
                    <svg
                      className="w-[20px] h-[20px] text-warning-default hover:text-warning-dark"
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
                        d="M6 18 17.94 6M18 18 6.06 6"
                      />
                    </svg>
                  </button>
                </div>
                )}
              </div>
              <h1 className="font-semibold ml-4 mb-5">Tags do usuário: </h1>
              <div className="ml-4">
                <TagDisplay tags={tags} />
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default TagModal;
