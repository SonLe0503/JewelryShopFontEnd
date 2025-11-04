/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleOutlined } from "@ant-design/icons";
import { Button, Checkbox, Divider, Form, Input, message, Select } from "antd";
import { actionRegister, selectIsLogin } from "../../../store/authSlide";
import { useAppDispatch } from "../../../store";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { setOpenLogin } from "../../../store/uiSlide";


const {Option} = Select;
const Register = () => {
  const dispatch = useAppDispatch();
  const isLogin = useSelector(selectIsLogin);
  const [form] = Form.useForm();
  useEffect(() => {
    if (isLogin) {
      dispatch(setOpenLogin(true));
    }
  }, [isLogin]);

  const onFinish = async (values: any) => {
    try {
      const payload = {
        email: values.email,
        password: values.password,
        year: values.year,
        month: values.month,
        day: values.day,
      };

      const result = await dispatch(actionRegister(payload));

      if (actionRegister.fulfilled.match(result)) {
        message.success("Đăng ký thành công!");
        dispatch(setOpenLogin(true));
      } else {
        message.error("Đăng ký thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      message.error("Đăng ký thất bại!");
    }
  };
  return (
    <>
        <div className="max-w-md mx-auto py-10 px-5">
      {/* Tiêu đề */}
      <h2 className="text-center text-xl font-bold mb-3">TẠO TÀI KHOẢN</h2>
      <p className="text-[12px] text-gray-600 text-center mb-2">
        Lưu ý: Chỉ những đơn hàng được đặt sau khi tạo tài khoản mới được lưu
        trong tài khoản Hi Jean! của bạn.
      </p>
      <p className="text-[12px] text-gray-600 text-center mb-5">
        Lưu thông tin của bạn để thanh toán nhanh hơn, lưu trữ các sản phẩm vào
        danh sách yêu thích và xem lịch sử đơn hàng & hoàn trả của bạn.
      </p>

      {/* Nút Google */}
      <Button
        block
        icon={<GoogleOutlined />}
        className="!border-black text-black mb-5"
      >
        Google
      </Button>

      <Divider plain className="!text-gray-600 text-[13px] font-sans">
        hoặc tiếp tục với
      </Divider>

      {/* Form */}
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          name="email"
          label="Địa chỉ email"
          rules={[{ required: true, message: "Vui lòng nhập email" }]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu" },
            { min: 8, message: "Mật khẩu phải ít nhất 8 ký tự" },
          ]}
        >
          <Input.Password placeholder="Mật khẩu (ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số)" />
        </Form.Item>

        {/* Ngày sinh */}
        <Form.Item label="Ngày sinh*">
          <div className="flex gap-2">
            <Form.Item name="year" noStyle rules={[{ required: true, message: "" }]}>
              <Select placeholder="Năm" className="w-1/3">
                {[...Array(70)].map((_, i) => {
                  const year = 2025 - i;
                  return (
                    <Option key={year} value={year}>
                      {year}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item name="month" noStyle rules={[{ required: true, message: "" }]}>
              <Select placeholder="MM" className="w-1/3">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <Option key={m} value={m}>
                    {m}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="day" noStyle rules={[{ required: true, message: "" }]}>
              <Select placeholder="DD" className="w-1/3">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <Option key={d} value={d}>
                    {d}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Form.Item>

        <Form.Item
          name="agree"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject("Bạn phải đồng ý điều khoản"),
            },
          ]}
        >
          <Checkbox className="!text-[12px]">
            Tôi đồng ý với{" "}
            <a href="#" className="underline">
              Điều khoản & Điều kiện
            </a>{" "}
            và{" "}
            <a href="#" className="underline">
              Chính sách Quyền riêng tư
            </a>{" "}
            của CHARLES & KEITH.
          </Checkbox>
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          className="!bg-black !border-black !hover:bg-gray-800"
        >
          TẠO TÀI KHOẢN
        </Button>
      </Form>
    </div>
    </>
  )
}
export default Register;