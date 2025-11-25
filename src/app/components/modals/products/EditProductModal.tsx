import { useEffect, useState } from "react";
import { Form, InputNumber, Input, Select, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import BaseModal from "../BaseModal";
import { useAppDispatch } from "../../../../store";
import {
  actionEditProduct,
  actionGetAllProducts,
  selectProductLoading,
} from "../../../../store/productSlide";
import { useSelector } from "react-redux";
import type { IProduct } from "../../../../store/productSlide";
import { BASE_URL } from "../../../../utils/app";
import { selectCategories } from "../../../../store/categorySlide";
import { selectCollections } from "../../../../store/collectionSlide";

interface EditProductModalProps {
  open: boolean;
  onClose: () => void;
  // categories: string[];
  // collections: string[];
  product: IProduct | null;
}

const EditProductModal = ({
  open,
  onClose,
  // categories,
  // collections,
  product,
}: EditProductModalProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const loading = useSelector(selectProductLoading);
  const categories = useSelector(selectCategories);
  const collections = useSelector(selectCollections);

  // State để lưu file ảnh được chọn
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    if (open && product) {
      form.setFieldsValue(product);
      setFileList([]); // reset danh sách file khi mở modal
    } else {
      setTimeout(() => {
        form.resetFields();
      }, 0);
      setFileList([]);
    }
  }, [open, product, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log("Validated values:", values);
      if (!product) return;

      const formData = new FormData();

      // Thêm các field text
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Nếu có ảnh mới
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("imageFile", fileList[0].originFileObj);
      }

      await dispatch(
        actionEditProduct({ id: product.productId, formData })
      ).unwrap();

      message.success("Cập nhật sản phẩm thành công!");
      onClose();
      dispatch(actionGetAllProducts());
    } catch (err) {
      console.error(err);
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


        {/* Upload ảnh */}
        <Form.Item label="Ảnh sản phẩm" name="imageFile">
          <Upload
            beforeUpload={() => false} // Ngăn antd upload tự động
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            listType="picture"
            maxCount={1}
          >
            <button type="button" className="ant-btn ant-btn-default">
              <UploadOutlined /> Chọn ảnh
            </button>
          </Upload>
          {product?.imageUrl && (
            <div className="mt-2">
              <p className="text-gray-500 text-sm mb-1">Ảnh hiện tại:</p>
              <img
                src={`${BASE_URL}${product.imageUrl}`}
                alt="current"
                style={{ width: "100px", borderRadius: 4 }}
              />
            </div>
          )}
        </Form.Item>
      </Form>
    </BaseModal>
  );
};

export default EditProductModal;
