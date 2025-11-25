import { Button, Form, Input } from "antd";
import { useAppDispatch } from "../../../store";
import { actionForgotPassword } from "../../../store/authSlide";
import { useState } from "react";
import { setOpenLogin } from "../../../store/uiSlide";

const ForgotPassword = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string }) => {
    try {
      setLoading(true);
      await dispatch(actionForgotPassword(values.email)).unwrap();
      alert("Mật khẩu tạm đã được gửi đến email của bạn.");
    } catch (error: any) {
      alert(error?.message || "Gửi email thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="max-w-md mx-auto mt-20 p-8 mb-20 rounded-xl shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-center mb-3">Quên mật khẩu</h2>
      <p className="text-center text-gray-600 mb-6 text-sm">
        Nhập email của bạn để nhận mật khẩu tạm thời
      </p>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input placeholder="Nhập email" className="rounded-md" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            className="!bg-black hover:!bg-gray-800 border-black rounded-md"
          >
            Gửi mật khẩu tạm
          </Button>
        </Form.Item>
      </Form>

      <div className="text-center mt-4">
        <span
          className="text-sm text-gray-500 hover:text-black cursor-pointer"
          onClick={() => dispatch(setOpenLogin(true))}
        >
          Quay lại đăng nhập
        </span>
      </div>
    </div>
  );
};

export default ForgotPassword;
