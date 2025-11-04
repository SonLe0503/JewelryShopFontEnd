/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Select } from "antd";
import { useEffect } from "react";
import BaseModal from "../BaseModal";
import { useAppDispatch } from "../../../../store";
import { actionUpdateOrderStatus } from "../../../../store/orderSlide";

interface EditOrderModalProps {
  open: boolean;
  onClose: () => void;
  orderData?: any;
}

const statusOptions = ["Pending", "Paid", "Shipping", "Completed", "Cancelled"];
const paymentOptions = ["QR", "COD"];

const EditOrderModal = ({ open, onClose, orderData }: EditOrderModalProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (orderData) {
      form.setFieldsValue({
        status: orderData.status,
        paymentMethod: orderData.paymentMethod,
        shippingAddress: orderData.shippingAddress,
      });
    } else {
      form.resetFields();
    }
  }, [orderData, form]);

  const handleSubmit = () => {
    form.validateFields().then(async (values) => {
      if (orderData) {
        await dispatch(
          actionUpdateOrderStatus({
            id: orderData.orderId,
            status: values.status,
          })
        );
      }
      onClose();
    });
  };

  return (
    <BaseModal
      title={`Chỉnh sửa đơn hàng ${orderData?.orderId ?? ""}`}
      open={open}
      onCancel={onClose}
      onSubmit={handleSubmit}
      okText="Lưu thay đổi"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select options={statusOptions.map((s) => ({ value: s, label: s }))} />
        </Form.Item>
        <Form.Item name="paymentMethod" label="Phương thức thanh toán">
          <Select options={paymentOptions.map((p) => ({ value: p, label: p }))} />
        </Form.Item>
        <Form.Item
          name="shippingAddress"
          label="Địa chỉ giao hàng"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};

export default EditOrderModal;
