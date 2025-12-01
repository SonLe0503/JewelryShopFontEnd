import { Input, Select } from "antd"

interface ConditionProps {
  searchProductName: string;
  setSearchProductName: (value: string) => void;
  searchCategoryName: string;
  setSearchCategoryName: (value: string) => void;
  categories: string[];
  searchCollection: string;
  setSearchCollection: (value: string) => void;
  collections: string[];
  searchStatus: string;
  setSearchStatus: (value: string) => void;
  productStatus: string[];
}

const Condition = (props: ConditionProps) => {
  const { searchProductName, searchCategoryName, setSearchProductName, setSearchCategoryName, categories, searchCollection, setSearchCollection, collections, productStatus, searchStatus, setSearchStatus } = props;
  const handleCategoryChange = (e: string) => {
    setSearchCategoryName(e);
  };
  const handleCollectionChange = (e: string) => {
    setSearchCollection(e);
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
          onChange={handleCategoryChange}
          options={[
            { value: "", label: "Tất cả danh mục" },
            ...categories.map((c) => ({ value: c, label: c })),
          ]}
        />
        <Select
          className="w-full"
          defaultValue="Tất cả trạng thái"
          value={searchCollection}
          onChange={handleCollectionChange}
          options={[
            { value: "", label: "Tất cả BST" },
            ...collections.map((c) => ({ value: c, label: c })),
          ]}
        />
        <Select
          className="w-full"
          value={searchStatus}
          onChange={(value) => setSearchStatus(value)}
          options={[
            { value: "", label: "Tất cả trạng thái" },
            ...productStatus.map((o) => ({ value: o, label: o })),
          ]}
        />
      </div>
    </>
  )
}
export default Condition