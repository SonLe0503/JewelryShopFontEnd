import { Form, Input, message } from "antd";
import { useAppDispatch } from "../../../../store";
import { actionCreateCollection } from "../../../../store/collectionSlide";
import BaseModal from "../BaseModal";
import React from "react";

interface AddCollectionModalProps {
  open: boolean;
  onClose: () => void;
}

const AddCollectionModal = ({ open, onClose }: AddCollectionModalProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
       await dispatch(
        actionCreateCollection({
          name: values.name,
          description: values.description,
        })
      ).unwrap();

      message.success("Tạo bộ sưu tập thành công!");
      form.resetFields();
      onClose();
    } catch (error: any) {
      message.error(error?.message || "Không thể tạo bộ sưu tập");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      title="Thêm bộ sưu tập mới"
      open={open}
      onCancel={onClose}
      onSubmit={handleSubmit}
      loading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên bộ sưu tập"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên bộ sưu tập" }]}
        >
          <Input placeholder="Nhập tên bộ sưu tập" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả chi tiết" />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};

export default AddCollectionModal;
