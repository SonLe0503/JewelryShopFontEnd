/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Tag } from "antd";
import Condition from "./Condition";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import {
  actionDeleteUser,
  actionGetAllUsers,
  selectUsers,
} from "../../../../../store/authSlide";
import AddAccountModal from "../../../../components/modals/accounts/AddAccountModal";
import EditAccountModal from "../../../../components/modals/accounts/EditAccountModal";
import { useAppDispatch } from "../../../../../store";

const ManageAccount = () => {
  const dispatch = useAppDispatch();
  const users = useSelector(selectUsers);

  const [searchEmail, setSearchEmail] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>();

  useEffect(() => {
    dispatch(actionGetAllUsers());
  }, [dispatch]);

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (userId: number) => {
  // Bạn có thể thêm confirm trước khi xóa
  if (window.confirm("Bạn có chắc muốn xóa tài khoản này?")) {
    dispatch(actionDeleteUser(userId))
      .unwrap()
      .then(() => {
        alert("Xóa tài khoản thành công!");
        dispatch(actionGetAllUsers());
      })
      .catch(() => {
        alert("Xóa thất bại, thử lại sau!");
      });
  }
};


  const filteredData = users.filter(
    (user) =>
      user.email
        ?.toLowerCase()
        .replace(/\s+/g, "")
        .includes(searchEmail.toLowerCase().replace(/\s+/g, "")) &&
      (searchStatus ? user.status === searchStatus : true)
  );

  return (
    <>
      <div className="p-6">
        <Condition
          searchEmail={searchEmail}
          setSearchEmail={setSearchEmail}
          searchStatus={searchStatus}
          setSearchStatus={setSearchStatus}
        />

        <h2 className="text-xl font-bold mb-4">Quản lý tài khoản</h2>
        <div className="mb-4 flex justify-end">
          <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
            + Thêm mới
          </Button>
        </div>

        {/* MODALS */}
        <AddAccountModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />

        <EditAccountModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(undefined);
          }}
          userData={selectedUser}
        />

        {/* Table */}
        <div className="border-[0.05px] border-gray-300">
          <div className="grid grid-cols-5 bg-gray-100 font-semibold text-sm text-center">
            <div className="px-3 py-2">Email</div>
            <div className="px-3 py-2">Ngày tạo</div>
            <div className="px-3 py-2">Số điện thoại</div>
            <div className="px-3 py-2">Trạng thái</div>
            <div className="px-3 py-2">Hành động</div>
          </div>

          {filteredData.map((u) => (
            <div
              key={u.userId}
              className="grid grid-cols-5 text-center text-sm border-b-[0.05px] border-gray-300"
            >
              <div className="px-3 py-2 truncate">{u.email}</div>
              <div className="px-3 py-2">
                {dayjs(u.createdAt).format("DD/MM/YYYY")}
              </div>
              <div className="px-3 py-2">{u.phoneNumber ?? "—"}</div>
              <div className="px-3 py-2 flex justify-center items-center">
                {u.status === "Active" ? (
                  <Tag color="green">Active</Tag>
                ) : (
                  <Tag color="red">Blocked</Tag>
                )}
              </div>
              <div className="px-3 py-2 flex gap-2 justify-center">
                <Button
                  className="!bg-blue-500 !text-white px-3 py-1 rounded"
                  onClick={() => handleEdit(u)}
                >
                  Edit
                </Button>
                <Button
                  className="!bg-red-500 !text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(u.userId)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ManageAccount;
