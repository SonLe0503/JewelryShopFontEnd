/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, message } from "antd";
import { useEffect } from "react";
import BaseModal from "../BaseModal";
import { useAppDispatch } from "../../../../store";
import { actionEditCategory, actionGetAllCategories } from "../../../../store/categorySlide";

interface EditCategoryModalProps {
  open: boolean;
  onClose: () => void;
  category: any;
}

const EditCategoryModal = ({ open, onClose, category }: EditCategoryModalProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (category) form.setFieldsValue(category);
  }, [category]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await dispatch(actionEditCategory({ id: category.categoryId, data: values })).unwrap();
      message.success("Cập nhật danh mục thành công!");
      onClose();
      dispatch(actionGetAllCategories());
    } catch {
      message.error("Cập nhật danh mục thất bại!");
    }
  };

  return (
    <BaseModal
      title="Chỉnh sửa danh mục"
      open={open}
      onCancel={onClose}
      onSubmit={handleSubmit}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Tên danh mục"
          name="categoryName"
          rules={[{ required: true, message: "Nhập tên danh mục" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};

export default EditCategoryModal;
