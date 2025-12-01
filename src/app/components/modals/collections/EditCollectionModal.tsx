import { Form, Input, message } from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../../store";
import {
  actionGetAllCollections,
  actionUpdateCollection,
  type ICollection,
} from "../../../../store/collectionSlide";
import BaseModal from "..//BaseModal";

interface EditCollectionModalProps {
  open: boolean;
  onClose: () => void;
  collection: ICollection | null;
}

const EditCollectionModal = ({
  open,
  onClose,
  collection,
}: EditCollectionModalProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (collection) {
      form.setFieldsValue({
        name: collection.name,
        description: collection.description,
      });
    }
  }, [collection, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!collection) return;
      setLoading(true);
      await dispatch(
        actionUpdateCollection({
          id: collection.collectionId,
          data: {
            name: values.name,
            description: values.description,
          },
        })
      ).unwrap();

      message.success("Cập nhật bộ sưu tập thành công!");
      dispatch(actionGetAllCollections());
      onClose();
    } catch (error: any) {
      message.error(error?.message || "Không thể cập nhật bộ sưu tập");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      title="Chỉnh sửa bộ sưu tập"
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

export default EditCollectionModal;
