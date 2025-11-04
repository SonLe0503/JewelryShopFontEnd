import { useEffect } from "react";
import { Form, InputNumber, Input, Select, message } from "antd";
import BaseModal from "../BaseModal";
import { useAppDispatch } from "../../../../store";
import {
  actionEditProduct,
  actionGetAllProducts,
  selectProductLoading,
} from "../../../../store/productSlide";
import { useSelector } from "react-redux";
import type { IProduct } from "../../../../store/productSlide";

interface EditProductModalProps {
  open: boolean;
  onClose: () => void;
  categories: string[];
  product: IProduct | null;
}

const EditProductModal = ({ open, onClose, categories, product }: EditProductModalProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const loading = useSelector(selectProductLoading);

  useEffect(() => {
    if (open && product) form.setFieldsValue(product);
    else form.resetFields();
  }, [open, product, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!product) return;

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null)
          formData.append(key, String(value));
      });

      await dispatch(
        actionEditProduct({ id: product.productId, formData })
      ).unwrap();
      message.success("Cập nhật sản phẩm thành công!");
      onClose();
      dispatch(actionGetAllProducts());
    } catch {
      message.error("Không thể cập nhật sản phẩm!");
    }
  };

  return (
    <BaseModal
      title="Chỉnh sửa sản phẩm"
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

export default EditProductModal;
