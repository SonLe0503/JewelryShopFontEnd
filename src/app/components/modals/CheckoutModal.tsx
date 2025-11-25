import { Form, Input, Select } from "antd";
import BaseModal from "./BaseModal";
import { useEffect, useState } from "react";
import { actionGetMyProfile, selectMyProfile } from "../../../store/authSlide";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../store";

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
  // initialValues?: Partial<CheckoutValues>;
}

const CheckoutModal = ({
  open,
  onClose,
  onConfirm,
  total,
}: CheckoutModalProps) => {
  const dispatch = useAppDispatch();
  const myProfile = useSelector(selectMyProfile);
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "QR">();

  const handleSubmit = async () => {
    form.validateFields().then(async (values) => {
      onConfirm(values as CheckoutValues);
      form.resetFields();
      setPaymentMethod(undefined);
    });
  };

  useEffect(() => {
    dispatch(actionGetMyProfile());
  }, [dispatch]);


  useEffect(() => {
  if (open && myProfile) {
    setTimeout(() => {
      form.setFieldsValue({
        email: myProfile.email,
        phone: myProfile.phoneNumber,
      });
    }, 0);
  }
}, [open, myProfile]);


  return (
    <BaseModal
      title="Xác nhận thông tin người nhận"
      open={open}
      onCancel={onClose}
      onSubmit={handleSubmit}
      okText="Xác nhận"
    >
      <Form form={form} layout="vertical">
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

        {paymentMethod === "QR" && (
          <div className="flex flex-col items-center mt-4">
            <p className="mb-3 text-gray-600 text-center">
              Quét mã QR để thanh toán <br />
              <strong>{total.toLocaleString()} đ</strong> tới tài khoản: Ha Ngo Khanh Linh
            </p>
            <img
              src={`https://img.vietqr.io/image/970415-102590306666-compact.png?amount=${total}&addInfo=Thanh+toan+don+hang&accountName=Ha+Ngo+Khanh+Linh`}
              alt="QR code"
              className="w-52 h-52 border border-gray-300 rounded-md mt-2"
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
