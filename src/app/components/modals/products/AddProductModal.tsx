/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Form, Input, InputNumber, Select, message } from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../../store";
import { actionCreateProduct, actionGetAllProducts } from "../../../../store/productSlide";
import BaseModal from "../BaseModal";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  categories: string[];
}

const AddProductModal = ({ open, onClose, categories }: AddProductModalProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) form.resetFields();
  }, [open]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      for (const key in values) formData.append(key, values[key]);

      setLoading(true);
      const res = await dispatch(actionCreateProduct(formData)).unwrap();
      message.success(`Đã thêm sản phẩm "${res.name}" thành công!`);
      onClose();
      dispatch(actionGetAllProducts());
    } catch (error) {
      message.error("Không thể thêm sản phẩm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      title="Thêm sản phẩm mới"
      open={open}
      onCancel={onClose}
      onSubmit={handleSubmit}
      loading={loading}
    >
      <Form layout="vertical" form={form}>
        <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Danh mục" name="categoryName" rules={[{ required: true, message: "Chọn danh mục" }]}>
          <Select placeholder="Chọn danh mục">
            {categories.map((c) => (
              <Select.Option key={c} value={c}>
                {c}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Giá" name="price" rules={[{ required: true, message: "Nhập giá sản phẩm" }]}>
          <InputNumber min={0} className="w-full" />
        </Form.Item>

        <Form.Item label="Số lượng" name="stockQuantity">
          <InputNumber min={0} className="w-full" />
        </Form.Item>

        <Form.Item label="Chất liệu" name="material">
          <Input />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Ảnh sản phẩm (URL)" name="imageUrl">
          <Input />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};

export default AddProductModal;
