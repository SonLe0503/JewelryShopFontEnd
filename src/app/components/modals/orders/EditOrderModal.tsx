/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Select } from "antd";
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

const EditOrderModal = ({ open, onClose, orderData }: EditOrderModalProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (orderData) {
      form.setFieldsValue({
        status: orderData.status,
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
      title={`Cập nhật trạng thái đơn hàng ${orderData?.orderId ?? ""}`}
      open={open}
      onCancel={onClose}
      onSubmit={handleSubmit}
      okText="Lưu thay đổi"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="status"
          label="Trạng thái đơn hàng"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select
            options={statusOptions.map((s) => ({ value: s, label: s }))}
            placeholder="Chọn trạng thái đơn hàng"
          />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};

export default EditOrderModal;
