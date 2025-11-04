/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, DatePicker, Select, message } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import BaseModal from "../BaseModal";
import { actionUpdateUser, actionGetAllUsers } from "../../../../store/authSlide";
import { useAppDispatch } from "../../../../store";

const EditAccountModal = ({
  open,
  onClose,
  userData,
}: {
  open: boolean;
  onClose: () => void;
  userData?: any;
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        ...userData,
        dob: userData.dob ? dayjs(userData.dob) : null,
      });
    }
  }, [userData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await dispatch(
        actionUpdateUser({
          userId: userData.userId,
          data: {
            ...values,
            dob: dayjs(values.dob).format("YYYY-MM-DD"),
          },
        })
      ).unwrap();
      message.success("Cập nhật thành công!");
      dispatch(actionGetAllUsers());
      onClose();
      form.resetFields();
    } catch {
      message.error("Cập nhật thất bại");
    }
  };

  return (
    <BaseModal
      title="Chỉnh sửa tài khoản"
      open={open}
      onCancel={onClose}
      onSubmit={handleSubmit}
      okText="Lưu"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Vui lòng nhập email" }, { type: "email" }]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item name="phoneNumber" label="Số điện thoại">
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item name="dob" label="Ngày sinh">
          <DatePicker className="w-full" format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item name="status" label="Trạng thái">
          <Select>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="blocked">Blocked</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </BaseModal>
  );
};

export default EditAccountModal;
