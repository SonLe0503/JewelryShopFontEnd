import { Input, Select } from "antd";

interface ConditionProps {
  searchOrderId: string;
  setSearchOrderId: (value: string) => void;
  searchStatus: string;
  setSearchStatus: (value: string) => void;
}

const Condition = (props: ConditionProps) => {
  const { searchOrderId, searchStatus, setSearchOrderId, setSearchStatus } =
    props;

  return (
    <div className="flex gap-2 mb-4">
      <Input
        type="text"
        placeholder="Tìm theo mã đơn hàng"
        value={searchOrderId}
        onChange={(e) => setSearchOrderId(e.target.value)}
        className="w-full"
      />
      <Select
        className="w-full"
        defaultValue=""
        value={searchStatus}
        onChange={setSearchStatus}
        options={[
          { value: "", label: "Tất cả trạng thái" },
          { value: "Success", label: "Thành công" },
          { value: "Pending", label: "Đang xử lý" },
          { value: "Failed", label: "Thất bại" },
        ]}
      />
    </div>
  );
};

export default Condition;
