import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react"
import { db } from "../contexts/firebase/firebaseConfig";

interface TagData {
  id: string,
  tagName: string,
}

interface SelectTagProps {
  selectedOptionId: string,
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const SelectTag: React.FC<SelectTagProps> = ({selectedOptionId, onChange}) => {
  const [options, setOptions] = useState<TagData[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagCollection = collection(db, "tags");
        const tagSnapshot = await getDocs(tagCollection);
        const tagList = tagSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as TagData[];
        setOptions(tagList);
        console.log(tagList)
      } catch (error) {
        console.error("Erro ao buscar dados das tags.", error);
      }
    };

    fetchTags();
  }, []);

  return (
    <select className=" h-10" value={selectedOptionId} onChange={onChange}>
      <option value="" disabled>Selecione uma tag </option>
        {options.map(option => (
          <option key={option.id} value={option.id}>
            {option.tagName}
          </option>
        ))}
    </select>
  )



}

export default SelectTag