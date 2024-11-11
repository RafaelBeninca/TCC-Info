import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../contexts/firebase/firebaseConfig";
import useTableUserContext from "../hooks/useTableUserContext";

const TagDisplay: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const { user } = useTableUserContext();

  type Tag = {
    id: string;
    tagName: string;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      try {
        const userTagsCollection = collection(db, "joinTagsUser");
        const q = query(userTagsCollection, where("userId", "==", user.uid));
        const userSnapshot = await getDocs(q);

        const tags: Tag[] = [];
        for (const docum of userSnapshot.docs) {
          const docRef = doc(db, "tags", docum.data().tagId);
          const tagDoc = await getDoc(docRef);
          console.log(tagDoc.data())
          if (tagDoc.exists()) {
            const tag = tagDoc.data();
            tags.push({
              id: tag.id,
              tagName: tag.tagName,
            });
          }
        }
        setTags(tags);
      } catch (error) {
        console.error("Erro ao buscar as tags.", error);
      }
    };

    fetchUsers();
  }, [user]);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const userRef = collection(db, "user");
  //       const tagsRef = collection(db, "tags");
  //       const joinTagsUserRef = collection(db, "joinTagsUser")

  //       const q = query(
  //         tagsRef,
  //         where("")
  //       )

  //       const userCollection = collection(db, "user");
  //       const userSnapshot = await getDocs(userCollection);
  //       const userList = userSnapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       })) as UserList[];
  //       setUsers(userList);
  //     } catch (error) {
  //       console.error("Erro ao buscar dados dos usuários.", error);
  //     }
  //   };

  //   fetchUsers();
  // }, []);

  // const addTags = () => {

  // }

  return (
    <div className="flex flex-wrap flex-row w-full h-24 mx-2 mt-3">
      {tags.map((tag) => (
        <div className="w-auto h-auto px-2 bg-slate-100 border-primary-default border-2 my-auto mx-1 gap-2 rounded-full">
          <span className="text-primary-dark font-semibold">{tag.tagName}</span>
        </div>
      ))}
    </div>
  );
};

export default TagDisplay;
