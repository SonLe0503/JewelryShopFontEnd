import { Form, Input, message } from "antd";
import BaseModal from "../BaseModal";
import { useAppDispatch } from "../../../../store";
import { actionCreateCategory, actionGetAllCategories } from "../../../../store/categorySlide";

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
}

const AddCategoryModal = ({ open, onClose }: AddCategoryModalProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await dispatch(actionCreateCategory(values)).unwrap();
      message.success("Thêm danh mục thành công!");
      onClose();
      dispatch(actionGetAllCategories());
    } catch {
      message.error("Thêm danh mục thất bại!");
    }
  };

  return (
    <BaseModal
      title="Thêm danh mục"
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

export default AddCategoryModal;
