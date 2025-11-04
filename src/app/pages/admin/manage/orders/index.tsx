/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Tag, message, Modal, Spin } from "antd";
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

const ManageOrder = () => {
  const dispatch = useAppDispatch();
  const { orders, loading } = useSelector(selectOrder);

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    dispatch(actionGetAllOrders());
  }, [dispatch]);

  const handleCancelOrder = (orderId: number) => {
    Modal.confirm({
      title: "Hủy đơn hàng",
      content: "Bạn có chắc chắn muốn hủy đơn hàng này?",
      okText: "Xác nhận",
      cancelText: "Đóng",
      okType: "danger",
      async onOk() {
        await dispatch(actionUpdateOrderStatus({ id: orderId, status: "Cancelled" }));
        message.success("Đã hủy đơn hàng");
      },
    });
  };

  const handleDeleteOrder = (orderId: number) => {
    Modal.confirm({
      title: "Xóa đơn hàng",
      content: "Bạn có chắc chắn muốn xóa đơn hàng này?",
      okText: "Xóa",
      cancelText: "Đóng",
      okType: "danger",
      async onOk() {
        await dispatch(actionDeleteOrder(orderId));
        message.success("Xóa đơn hàng thành công");
      },
    });
  };

  if (loading) return <Spin className="flex justify-center mt-20" size="large" />;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📦 Quản lý đơn hàng</h2>

      <div className="border border-gray-300 rounded-md overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 bg-gray-100 font-semibold text-center text-sm">
          <div className="py-2 col-span-1">Mã</div>
          <div className="py-2 col-span-2">Khách hàng</div>
          <div className="py-2 col-span-2">Ngày đặt</div>
          <div className="py-2 col-span-1">Tổng tiền</div>
          <div className="py-2 col-span-2">Trạng thái</div>
          <div className="py-2 col-span-1">Thanh toán</div>
          <div className="py-2 col-span-3">Hành động</div>
        </div>

        {/* Body */}
        {orders.map((o) => (
          <div
            key={o.orderId}
            className="grid grid-cols-12 text-center text-sm border-t border-gray-200"
          >
            <div className="py-2 col-span-1">{o.orderId}</div>
            <div className="py-2 col-span-2">{o.userId}</div>
            <div className="py-2 col-span-2">{dayjs(o.orderDate).format("DD/MM/YYYY HH:mm")}</div>
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

            <div className="py-2 flex gap-2 justify-center col-span-3">
              <Button
                className="!bg-blue-500 !text-white"
                onClick={() => {
                  setSelectedOrder(o);
                  setIsViewModalOpen(true);
                }}
              >
                Xem
              </Button>
              <Button
                className="!bg-yellow-500 !text-white"
                onClick={() => {
                  setSelectedOrder(o);
                  setIsEditModalOpen(true);
                }}
              >
                Sửa
              </Button>
              <Button danger onClick={() => handleCancelOrder(o.orderId)}>
                Hủy
              </Button>
              <Button danger type="primary" onClick={() => handleDeleteOrder(o.orderId)}>
                Xóa
              </Button>
            </div>
          </div>
        ))}
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
