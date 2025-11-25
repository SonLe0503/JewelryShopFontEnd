/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Form, Input, InputNumber, Select, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../../store";
import { actionCreateProduct, actionGetAllProducts } from "../../../../store/productSlide";
import BaseModal from "../BaseModal";
import { useSelector } from "react-redux";
import { selectCategories } from "../../../../store/categorySlide";
import { selectCollections } from "../../../../store/collectionSlide";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  // categories: string[];
  // collections: string[];
}

const AddProductModal = ({ open, onClose }: AddProductModalProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const categories = useSelector(selectCategories);
  const collections = useSelector(selectCollections);

  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        form.resetFields();
      }, 0);
      setFileList([]);
    } else {
      form.setFieldsValue({ discount: 0 });
    }
  }, [open]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      // Thêm các field text
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Nếu có file ảnh
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("imageFile", fileList[0].originFileObj);
      }

      setLoading(true);
      const res = await dispatch(actionCreateProduct(formData)).unwrap();
      message.success(`Đã thêm sản phẩm "${res.name}" thành công!`);
      onClose();
      dispatch(actionGetAllProducts());
    } catch (error) {
      console.error(error);
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
      <Form layout="vertical" form={form} preserve={false}>
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Danh mục"
          name="categoryId"
          rules={[{ required: false, message: "Chọn danh mục" }]}
        >
          <Select placeholder="Chọn danh mục">
            {categories.map((c) => (
              <Select.Option key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="BST"
          name="collectionId"
          rules={[{ required: false, message: "Chọn BST" }]}
        >
          <Select placeholder="Chọn BST">
            {collections.map((c) => (
              <Select.Option key={c.collectionId} value={c.collectionId}>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>


        <Form.Item
          label="Giá"
          name="price"
          rules={[{ required: true, message: "Nhập giá sản phẩm" }]}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>

        <Form.Item
          label="Giảm giá (%)"
          name="discount"
          rules={[
            { required: false },
            { type: "number", min: 0, max: 100, message: "Discount phải từ 0 - 100" },
          ]}
        >
          <InputNumber
            min={0}
            max={100}
            step={1}
            className="w-full"
            formatter={(value) => `${value}%`}
            parser={(value) => Number(value?.replace("%", "") ?? 0) as any}
          />
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

        <Form.Item label="Màu sắc" name="color">
          <Input placeholder="VD: Gold, Silver, Black..." />
        </Form.Item>

        <Form.Item label="Câu chuyện sản phẩm (Story)" name="story">
          <Input.TextArea rows={3} placeholder="Nhập câu chuyện sản phẩm..." />
        </Form.Item>


        {/* Thay ô nhập URL bằng Upload ảnh */}
        <Form.Item label="Ảnh sản phẩm" name="imageFile">
          <Upload
            beforeUpload={() => false} // Ngăn upload tự động
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            listType="picture"
            maxCount={1}
          >
            <button type="button" className="ant-btn ant-btn-default">
              <UploadOutlined /> Chọn ảnh
            </button>
          </Upload>
        </Form.Item>
      </Form>
    </BaseModal>
  );
};

export default AddProductModal;
