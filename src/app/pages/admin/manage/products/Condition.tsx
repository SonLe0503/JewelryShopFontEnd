import { Input, Select } from "antd"

interface ConditionProps {
  searchProductName: string;
  setSearchProductName: (value: string) => void;
  searchCategoryName: string;
  setSearchCategoryName: (value: string) => void;
  categories: string[];
}

const Condition = (props: ConditionProps) => {
  const { searchProductName, searchCategoryName, setSearchProductName, setSearchCategoryName, categories } = props;
  const handleChange = (e: string) => {
    setSearchCategoryName(e);
  };
  return (
    <>
        <div className="flex gap-2 mb-4">
      <Input
        type="text"
        placeholder="Tìm theo tên sản phẩm"
        value={searchProductName}
        onChange={(e) => setSearchProductName(e.target.value)}
        className="w-full"
      />
      <Select
        className="w-full"
        defaultValue="Tất cả trạng thái"
        value={searchCategoryName}
        onChange={handleChange}
        options={[
          { value: "", label: "Tất cả danh mục" },
          ...categories.map((c) => ({ value: c, label: c })),
        ]}
      />
    </div>
    </>
  )
}
export default Condition