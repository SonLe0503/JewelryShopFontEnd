/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Select, Table } from "antd";
import { useEffect } from "react";
import BaseModal from "../BaseModal";
import { useSelector } from "react-redux";
import { selectOrderDetails } from "../../../../store/orderDetailSlide";
import { useAppDispatch } from "../../../../store";
import { actionGetOrderDetails } from "../../../../store/orderDetailSlide";

interface OrderDetailModalProps {
  open: boolean;
  onClose: () => void;
  orderData?: any;
}

const statusOptions = ["Pending", "Paid", "Shipping", "Completed", "Cancelled"];
const paymentOptions = ["QR", "COD"];

const OrderDetailModal = ({ open, onClose, orderData }: OrderDetailModalProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const orderDetails = useSelector(selectOrderDetails);

  useEffect(() => {
    if (orderData) {
      form.setFieldsValue({
        orderId: orderData.orderId,
        email: orderData.email,
        phoneNumber: orderData.phoneNumber,
        orderDate: orderData.orderDate,
        totalPrice: orderData.totalPrice,
        status: orderData.status,
        paymentMethod: orderData.paymentMethod,
        shippingAddress: orderData.shippingAddress,
      });

      // Lấy chi tiết đơn hàng
      dispatch(actionGetOrderDetails(orderData.orderId));
    } else {
      form.resetFields();
    }
  }, [orderData, form, dispatch]);

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (v: number) => v.toLocaleString() + " ₫",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (v: number) => v.toLocaleString() + " ₫",
    },
  ];

  return (
    <BaseModal
      title={`Chi tiết đơn hàng ${orderData?.orderId ?? ""}`}
      open={open}
      onCancel={onClose}
      okText="Đóng"
      onSubmit={onClose}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="orderId" label="Mã đơn hàng">
          <Input disabled />
        </Form.Item>
        <Form.Item name="email" label="Email khách hàng">
          <Input disabled />
        </Form.Item>
        <Form.Item name="phoneNumber" label="Số điện thoại">
          <Input disabled />
        </Form.Item>
        <Form.Item name="orderDate" label="Ngày đặt">
          <Input disabled />
        </Form.Item>
        <Form.Item name="totalPrice" label="Tổng tiền">
          <Input disabled />
        </Form.Item>
        <Form.Item name="status" label="Trạng thái">
          <Select disabled options={statusOptions.map((s) => ({ value: s, label: s }))} />
        </Form.Item>
        <Form.Item name="paymentMethod" label="Phương thức thanh toán">
          <Select disabled options={paymentOptions.map((p) => ({ value: p, label: p }))} />
        </Form.Item>
        <Form.Item name="shippingAddress" label="Địa chỉ giao hàng">
          <Input.TextArea rows={2} disabled />
        </Form.Item>
      </Form>

      <h3 className="mt-4 mb-2">Chi tiết sản phẩm</h3>
      <Table
        dataSource={orderDetails}
        columns={columns}
        rowKey="orderDetailId"
        pagination={false}
        bordered
      />
    </BaseModal>
  );
};

export default OrderDetailModal;
