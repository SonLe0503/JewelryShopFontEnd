import { Modal, Form, Input, Button } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../store";
import { selectInfoLogin, actionUpdateUser, actionGetMyProfile } from "../../../store/authSlide";

const ChangePassword = () => {
  const dispatch = useAppDispatch();
  const userInfo = useSelector(selectInfoLogin);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const handleChangePassword = async () => {
    try {
      const values = await form.validateFields();
      await dispatch(
        actionUpdateUser({
          userId: Number(userInfo.userId),
          data: { oldPassword: values.oldPassword, password: values.newPassword }
        })
      ).unwrap();

      alert("Đổi mật khẩu thành công!");
      setOpen(false);
      form.resetFields();
      dispatch(actionGetMyProfile());
    } catch (err: any) {
      alert(err?.message || "Đổi mật khẩu thất bại");
    }
  };

  return (
    <>
      <Button type="default" onClick={() => setOpen(true)} className="w-full mb-2">
        Đổi mật khẩu
      </Button>

      <Modal
        title="Đổi mật khẩu"
        open={open}
        onOk={handleChangePassword}
        onCancel={() => setOpen(false)}
        okText="Đổi mật khẩu"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 6, message: "Mật khẩu mới phải ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Nhập lại mật khẩu mới"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Mật khẩu xác nhận không khớp!");
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ChangePassword;
