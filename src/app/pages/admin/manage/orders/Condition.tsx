import { Input, Select } from "antd";

interface ConditionProps {
  searchUserName: string;
  setSearchUserName: (value: string) => void;
  searchStatus: string;
  setSearchStatus: (value: string) => void;
  orderStatus: string[];
}

const Condition = (props: ConditionProps) => {
  const {
    searchUserName,
    searchStatus,
    setSearchStatus,
    setSearchUserName,
    orderStatus,
  } = props;
  const handleChange = (e: string) => {
    setSearchStatus(e);
  };
  return (
    <>
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Tìm theo tên khách hàng"
          value={searchUserName}
          onChange={(e) => setSearchUserName(e.target.value)}
          className="w-full"
        />
        <Select
          className="w-full"
          defaultValue="Tất cả trạng thái"
          value={searchStatus}
          onChange={handleChange}
          options={[
            { value: "", label: "Tất cả trạng thái" },
            ...orderStatus.map((o) => ({ value: o, label: o })),
          ]}
        />
      </div>
    </>
  );
};
export default Condition;
