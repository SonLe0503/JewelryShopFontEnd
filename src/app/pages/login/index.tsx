/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input, message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import URL from "../../../constrants/url";
import { useAppDispatch } from "../../../store";
import { actionLogin } from "../../../store/authSlide";
import { useEffect } from "react";
import { EUserRole } from "../../../interface/app";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { selectOpenLogin, setOpenLogin } from "../../../store/uiSlide";

const Login = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const openLogin = useSelector(selectOpenLogin);

  const onFinish = async (values: any) => {
    try {
      const res: any = await dispatch(actionLogin(values)).unwrap();
      const token = res?.data?.token;

      if (token) {
        message.success("Đăng nhập thành công");
        dispatch(setOpenLogin(false));

        const decoded: any = jwtDecode(token);
        const role = decoded["role"];

        if (role === EUserRole.ADMIN) {
          navigate(URL.ManageProduct);
        } else if (role === EUserRole.CUSTOMER) {
          navigate(URL.Home);
        } else {
          navigate(URL.Home);
        }
      } else {
        message.error("Đăng nhập thất bại");
      }
    } catch (error: any) {
      message.error(error?.message || "Đăng nhập thất bại");
    }
  };

  useEffect(() => {
    if (!openLogin) {
      form.resetFields();
    }
  }, [openLogin, form]);

  return (
    <>
      <Modal
        open={openLogin}
        onCancel={() => dispatch(setOpenLogin(false))}
        footer={null}
        width={400}
        closable
        className="right-modal"
      >
        {/* --- LOGIN FORM --- */}
        <h2 className="font-bold text-lg mb-2 text-center">ĐĂNG NHẬP</h2>
        <p className="text-gray-900 text-center font-sans text-[13px] mb-5">
          Mật khẩu phân biệt chữ hoa và chữ thường.
        </p>

        <Form form={form} layout="vertical" onFinish={onFinish}>
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
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            className="!bg-black hover:bg-gray-800 border-black"
          >
            ĐĂNG NHẬP
          </Button>
        </Form>

        <div className="mt-3 mb-5">
          <div className="text-sm text-gray-400 text-center">
            Quên mật khẩu?
          </div>
        </div>

        <Divider plain className="!text-gray-600 text-[13px] font-sans">
          hoặc tiếp tục với
        </Divider>

        <Button
          block
          icon={<GoogleOutlined />}
          className="mb-5 !border-black text-black"
        >
          Google
        </Button>

        {/* --- SIGNUP SECTION --- */}
        <div className="border-t border-gray-200 pt-5">
          <h3 className="font-bold text-base mb-2 text-center">TẠO TÀI KHOẢN</h3>
          <p className="text-[13px] text-gray-600 mb-3 text-center">
            Lưu thông tin của bạn để thanh toán nhanh hơn, lưu trữ các sản phẩm
            vào danh sách yêu thích và xem lịch sử đơn hàng & hoàn trả của bạn.
          </p>
          <Button
            block
            className="!border-black text-black"
            onClick={() => {
              navigate(URL.Register);
              dispatch(setOpenLogin(false));
            }}
          >
            TẠO TÀI KHOẢN
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Login;
