/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Checkbox, Divider, Form, Input } from "antd";
import { actionGoogleLogin, actionRegister, selectIsLogin } from "../../../store/authSlide";
import { useAppDispatch } from "../../../store";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { setOpenLogin } from "../../../store/uiSlide";
import { useNavigate } from "react-router-dom";
import URL from "../../../constrants/url";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { EUserRole } from "../../../interface/app";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLogin = useSelector(selectIsLogin);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      const payload = {
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
      };

      const result = await dispatch(actionRegister(payload));

      if (actionRegister.fulfilled.match(result)) {
        alert("Đăng ký thành công!");
        navigate(URL.CheckMail);
      } else {
        alert("Đăng ký thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      alert("Đăng ký thất bại!");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const id_token = credentialResponse.credential;
      const res: any = await dispatch(actionGoogleLogin(id_token)).unwrap();

      const token = res?.data?.token;
      if (!token) {
        alert("Đăng nhập Google thất bại");
        return;
      }

      alert("Đăng nhập bằng Google thành công");
      dispatch(setOpenLogin(false));

      const decoded: any = jwtDecode(token);
      const role = decoded["role"];

      if (role === EUserRole.ADMIN) {
        navigate(URL.ManageProduct);
      } else {
        navigate(URL.Home);
      }
    } catch (error: any) {
      console.error(error);
      alert("Đăng nhập Google thất bại");
    }
  };

  const handleGoogleError = () => {
    alert("Không thể đăng nhập bằng Google");
  };

  useEffect(() => {
    if (isLogin) {
      dispatch(setOpenLogin(true));
    }
  }, [isLogin]);

  return (
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
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        // useOneTap
      />

      <Divider plain className="!text-gray-600 text-[13px] font-sans">
        hoặc tiếp tục với
      </Divider>

      {/* Form */}
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          name="email"
          label="Địa chỉ email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
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

        {/* Số điện thoại */}
        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại" },
            {
              pattern: /^(0|\+84)[0-9]{9,10}$/,
              message: "Số điện thoại không hợp lệ",
            },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
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
            của Hi Jean!.
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
  );
};

export default Register;
