import { Form, Input, Select, message } from "antd";
// import dayjs from "dayjs";
import BaseModal from "../BaseModal";
import { actionRegister, actionGetAllUsers } from "../../../../store/authSlide";
import { useAppDispatch } from "../../../../store";

const AddAccountModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        email: values.email,
        password: values.password,
        phoneNumber: values.phone,
      };
      await dispatch(actionRegister(payload)).unwrap();
      message.success("Thêm tài khoản thành công!");
      dispatch(actionGetAllUsers());
      onClose();
      form.resetFields();
    } catch {
      message.error("Thêm tài khoản thất bại");
    }
  };

  return (
    <BaseModal
      title="Thêm tài khoản mới"
      open={open}
      onCancel={onClose}
      onSubmit={handleSubmit}
      okText="Thêm"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Vui lòng nhập email" }, { type: "email" }]}
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
        <Form.Item name="phone" label="Số điện thoại">
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        {/* <Form.Item name="dob" label="Ngày sinh">
          <DatePicker className="w-full" format="DD/MM/YYYY" />
        </Form.Item> */}
        <Form.Item name="status" label="Trạng thái" initialValue="active">
          <Select>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="blocked">Blocked</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </BaseModal>
  );
};

export default AddAccountModal;
