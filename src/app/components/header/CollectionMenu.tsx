import { useNavigate } from "react-router-dom";
import URL from "../../../constrants/url";

const CollectionMenu = ({
  collections,
  onClose,
}: {
  collections: any[];
  onClose: () => void;
}) => {
  const navigate = useNavigate();

  const handleClick = (id: number) => {
    navigate(`${URL.Product}?collectionId=${id}`);
    onClose(); 
  };

  return (
    <div className="bg-white border-t border-gray-200 shadow-md mt-[-1px] rounded-b-lg w-60">
      {collections
      .filter((c) => c.status === "Active")
      .map((c) => (
        <div
          key={c.collectionId}
          onClick={() => handleClick(c.collectionId)}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
        >
          {c.name}
        </div>
      ))}
    </div>
  );
};

export default CollectionMenu;
