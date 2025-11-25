import { Input, Select } from "antd";

interface ConditionProps {
  searchUserName: string;
  setSearchUserName: (value: string) => void;
  searchStatus: string;
  setSearchStatus: (value: string) => void;
  orderStatus: string[];
}

const Condition = ({
  searchUserName,
  setSearchUserName,
  searchStatus,
  setSearchStatus,
  orderStatus,
}: ConditionProps) => {
  return (
    <div className="flex gap-2 mb-4">
      <Input
        placeholder="Tìm theo tên khách hàng"
        value={searchUserName}
        onChange={(e) => setSearchUserName(e.target.value)}
        className="w-full"
      />

      <Select
        className="w-full"
        value={searchStatus}
        onChange={(value) => setSearchStatus(value)}
        options={[
          { value: "", label: "Tất cả trạng thái" },
          ...orderStatus.map((o) => ({ value: o, label: o })),
        ]}
      />
    </div>
  );
};

export default Condition;
