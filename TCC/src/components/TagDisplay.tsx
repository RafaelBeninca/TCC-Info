import { Tag } from "./Interfaces";

interface TagDisplayProps {
  tags: Tag[];
}

const TagDisplay: React.FC<TagDisplayProps> = ({ tags }) => {
  return (
    <div className="flex flex-wrap flex-row min-w-0 w-full mt-2 h-7 gap-2">
      {tags.slice(0, 3).map((tag) => (
        <div className="w-auto h-7 px-2 bg-slate-100 border-primary-default border-2 gap-2 rounded-full">
          <span className="text-primary-dark font-semibold">{tag.tagName}</span>
        </div>
      ))}
    </div>
  );
};

export default TagDisplay;
