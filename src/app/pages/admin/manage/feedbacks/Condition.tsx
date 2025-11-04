import { Input, Select } from "antd";

interface ConditionProps {
  searchProduct: string;
  setSearchProduct: (value: string) => void;
  searchRating: string;
  setSearchRating: (value: string) => void;
}

const Condition = (props: ConditionProps) => {
  const { searchProduct, searchRating, setSearchProduct, setSearchRating } =
    props;

  const handleChange = (value: string) => {
    setSearchRating(value);
  };

  return (
    <div className="flex gap-2 mb-4">
      <Input
        type="text"
        placeholder="Tìm theo tên sản phẩm"
        value={searchProduct}
        onChange={(e) => setSearchProduct(e.target.value)}
        className="w-full"
      />
      <Select
        className="w-full"
        defaultValue="Tất cả đánh giá"
        value={searchRating}
        onChange={handleChange}
        options={[
          { value: "", label: "Tất cả đánh giá" },
          { value: "1", label: "1 sao" },
          { value: "2", label: "2 sao" },
          { value: "3", label: "3 sao" },
          { value: "4", label: "4 sao" },
          { value: "5", label: "5 sao" },
        ]}
      />
    </div>
  );
};

export default Condition;
