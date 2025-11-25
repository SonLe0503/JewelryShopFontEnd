/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Tag, Spin } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../../../store";
import { useSelector } from "react-redux";
import {
  actionGetAllOrders,
  actionUpdateOrderStatus,
  actionDeleteOrder,
  selectOrder,
} from "../../../../../store/orderSlide";
import EditOrderModal from "../../../../components/modals/orders/EditOrderModal";
import OrderDetailModal from "../../../../components/modals/orders";
import { actionGetOrderDetails } from "../../../../../store/orderDetailSlide";
import { actionGetAllUsers, selectUsers } from "../../../../../store/authSlide";
import Condition from "./Condition";

const ManageOrder = () => {
  const dispatch = useAppDispatch();
  const users = useSelector(selectUsers);
  const { orders, loading } = useSelector(selectOrder);

  const [searchUserName, setSearchUserName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const orderStatus = ["Pending", "Paid", "Shipping", "Completed", "Cancelled"];

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const getUserInfo = (userId: number) => {
    const user = users.find(u => u.userId === userId);
    return {
      email: user?.email || "Unknown",
      phone: user?.phoneNumber || "Unknown"
    };
  };

  const filterOrders = orders.filter((o) => {
    const userInfo = getUserInfo(o.userId);

    const matchName =
      searchUserName.trim() === "" ||
      userInfo.email.toLowerCase().includes(searchUserName.toLowerCase());

    const matchStatus =
      searchStatus === "" || o.status === searchStatus;

    return matchName && matchStatus;
  });


  useEffect(() => {
    dispatch(actionGetAllOrders());
    dispatch(actionGetAllUsers());
  }, [dispatch]);

  const handleViewOrder = async (order: any) => {
    const userInfo = getUserInfo(order.userId);
    const orderWithUser = { ...order, email: userInfo.email, phoneNumber: userInfo.phone };
    setSelectedOrder(orderWithUser);
    await dispatch(actionGetOrderDetails(order.orderId));
    setIsViewModalOpen(true);
  };

  const handleCancelOrder = async (orderId: number) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn huỷ đơn hàng này?");
    if (confirmed) {
      await dispatch(actionUpdateOrderStatus({ id: orderId, status: "Cancelled" }));
      alert("Đã hủy đơn hàng");
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?");
    if (confirmed) {
      await dispatch(actionDeleteOrder(orderId));
      alert("Xóa đơn hàng thành công");
    }
  };

  if (loading) return <Spin className="flex justify-center mt-20" size="large" />;

  return (
    <div className="p-6">
      <Condition
        searchUserName={searchUserName}
        setSearchUserName={setSearchUserName}
        searchStatus={searchStatus}
        setSearchStatus={setSearchStatus}
        orderStatus={orderStatus}
      />
      <h2 className="text-xl font-bold mb-4">📦 Quản lý đơn hàng</h2>

      <div className="border border-gray-300 rounded-md overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 bg-gray-100 font-semibold text-center text-sm">
          <div className="py-2 col-span-1">Mã</div>
          <div className="py-2 col-span-2">Khách hàng</div>
          <div className="py-2 col-span-2">Ngày đặt</div>
          <div className="py-2 col-span-1">Tổng tiền</div>
          <div className="py-2 col-span-2">Trạng thái</div>
          <div className="py-2 col-span-2">Thanh toán</div>
          <div className="py-2 col-span-2">Hành động</div>
        </div>

        {/* Body */}
        {filterOrders.map((o) => {
          const userInfo = getUserInfo(o.userId);
          return (
            <div
              key={o.orderId}
              className="grid grid-cols-12 text-center text-sm border-t border-gray-200"
            >
              <div className="py-2 col-span-1">{o.orderId}</div>
              <div className="py-2 col-span-2 truncate" title={userInfo.email}>{userInfo.email}</div>
              <div className="py-2 col-span-2 truncate" title={dayjs(o.orderDate).format("DD/MM/YYYY HH:mm")}>{dayjs(o.orderDate).format("DD/MM/YYYY HH:mm")}</div>
              <div className="py-2 col-span-1">{o.totalPrice.toLocaleString()} ₫</div>

              <div className="py-2 col-span-2 flex justify-center items-center">
                <Tag
                  color={
                    o.status === "Pending"
                      ? "orange"
                      : o.status === "Paid"
                        ? "blue"
                        : o.status === "Shipping"
                          ? "purple"
                          : o.status === "Completed"
                            ? "green"
                            : "red"
                  }
                >
                  {o.status}
                </Tag>
              </div>

              <div className="py-2 flex gap-2 justify-center col-span-2">
                <Button
                  className="!bg-blue-500 !text-white"
                  onClick={() => handleViewOrder(o)}
                  size="small"
                >
                  Xem
                </Button>
                <Button
                  className="!bg-yellow-500 !text-white"
                  onClick={() => {
                    setSelectedOrder(o);
                    setIsEditModalOpen(true);
                  }}
                  size="small"
                >
                  Sửa
                </Button>
              </div>
              <div className="py-2 flex gap-2 justify-center col-span-2">
                <Button danger onClick={() => handleCancelOrder(o.orderId)} size="small">
                  Hủy
                </Button>
                <Button danger type="primary" onClick={() => handleDeleteOrder(o.orderId)} size="small">
                  Xóa
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal xem chi tiết */}
      <OrderDetailModal
        open={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        orderData={selectedOrder}
      />

      {/* Modal chỉnh sửa */}
      <EditOrderModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        orderData={selectedOrder}
      />
    </div>
  );
};

export default ManageOrder;
