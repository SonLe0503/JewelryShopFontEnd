import { Form, Input, Select } from "antd";
import BaseModal from "./BaseModal";
import { useState } from "react";

const { Option } = Select;

interface CheckoutValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: "COD" | "QR";
}

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (values: CheckoutValues) => void;
  total: number; // ✅ tổng tiền từ giỏ hàng
  initialValues?: Partial<CheckoutValues>;
}

const CheckoutModal = ({
  open,
  onClose,
  onConfirm,
  total,
  initialValues,
}: CheckoutModalProps) => {
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "QR">();

  // ⚙️ Cấu hình tài khoản VietQR của bạn
  const BANK_ID = "VCB"; // Ví dụ: Vietcombank
  const ACCOUNT_NO = "0123456789"; // Thay bằng STK thật
  const ACCOUNT_NAME = "NGUYEN VAN A"; // Tên chủ tài khoản (viết hoa, không dấu)
  const DESCRIPTION = `Thanh toan don hang`; // Nội dung chuyển khoản

  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${total}&addInfo=${encodeURIComponent(
    DESCRIPTION
  )}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onConfirm(values as CheckoutValues);
      form.resetFields();
      setPaymentMethod(undefined);
    });
  };

  return (
    <BaseModal
      title="Xác nhận thông tin người nhận"
      open={open}
      onCancel={onClose}
      onSubmit={handleSubmit}
      okText="Xác nhận"
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          name="name"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
        >
          <Input placeholder="Họ và tên người nhận" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input placeholder="Email liên hệ" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại" },
            { pattern: /^[0-9]{9,12}$/, message: "Số điện thoại không hợp lệ" },
          ]}
        >
          <Input placeholder="Số điện thoại" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Địa chỉ giao hàng"
          rules={[
            { required: true, message: "Vui lòng nhập địa chỉ giao hàng" },
          ]}
        >
          <Input.TextArea rows={3} placeholder="Địa chỉ nhận hàng" />
        </Form.Item>

        <Form.Item
          name="paymentMethod"
          label="Phương thức thanh toán"
          rules={[
            { required: true, message: "Vui lòng chọn phương thức thanh toán" },
          ]}
        >
          <Select
            placeholder="Chọn phương thức thanh toán"
            onChange={(value) => setPaymentMethod(value as "COD" | "QR")}
          >
            <Option value="COD">Thanh toán khi nhận hàng (COD)</Option>
            <Option value="QR">Thanh toán qua mã QR (VietQR)</Option>
          </Select>
        </Form.Item>

        {/* Hiển thị QR khi chọn thanh toán bằng VietQR */}
        {paymentMethod === "QR" && (
          <div className="flex flex-col items-center mt-4">
            <p className="mb-3 text-gray-600 text-center">
              Quét mã QR để thanh toán <br />
              <strong>{total.toLocaleString()} đ</strong> tới tài khoản:
            </p>
            <p className="text-sm text-gray-700 mb-2 text-center">
              <strong>{ACCOUNT_NAME}</strong> <br />
              Ngân hàng: {BANK_ID} <br />
              STK: {ACCOUNT_NO}
            </p>
            <img
              src={qrUrl}
              alt="QR Code VietQR"
              className="w-60 h-60 rounded-lg shadow-md mb-3"
            />
            <p className="text-sm text-gray-500 text-center">
              Sau khi chuyển khoản thành công, vui lòng nhấn <b>“Xác nhận”</b> để hoàn tất đơn hàng.
            </p>
          </div>
        )}
      </Form>
    </BaseModal>
  );
};

export default CheckoutModal;
