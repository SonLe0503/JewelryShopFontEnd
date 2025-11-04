/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Select, Space, message, Tag } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../../../store";
import {
  actionGetAllCategories,
  actionDeleteCategory,
  selectCategories,
} from "../../../../../store/categorySlide";
import {
  actionGetAllProducts,
  actionDeleteProduct,
  selectProducts,
} from "../../../../../store/productSlide";

import AddCategoryModal from "../../../../components/modals/category/AddCategoryModal";
import EditCategoryModal from "../../../../components/modals/category/EditCategoryModal";
import AddProductModal from "../../../../components/modals/products/AddProductModal";
import EditProductModal from "../../../../components/modals/products/EditProductModal";
import Condition from "./Condition";

const ManageProduct = () => {
  const dispatch = useAppDispatch();

  // --- CATEGORY STATES ---
  const categories = useSelector(selectCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [selectedEditCategory, setSelectedEditCategory] = useState<any>(null);

  // --- PRODUCT STATES ---
  const products = useSelector(selectProducts);
  const [searchProductName, setSearchProductName] = useState("");
  const [searchCategoryName, setSearchCategoryName] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // --- FETCH DATA ---
  useEffect(() => {
    dispatch(actionGetAllCategories());
    dispatch(actionGetAllProducts());
  }, [dispatch]);

  // --- CATEGORY ACTIONS ---
  const handleDeleteCategory = async (id: number) => {
    try {
      await dispatch(actionDeleteCategory(id)).unwrap();
      message.success("Xóa danh mục thành công!");
    } catch {
      message.error("Không thể xóa danh mục!");
    }
  };

  // --- PRODUCT FILTER ---
  const filteredData = products.filter(
    (product) =>
      product.name
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(searchProductName.toLowerCase().replace(/\s+/g, "")) &&
      product.categoryName
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(searchCategoryName.toLowerCase().replace(/\s+/g, ""))
  );

  const uniqueCategories = Array.from(
    new Set(products.map((p) => p.categoryName))
  );

  // --- PRODUCT ACTIONS ---
  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
      try {
        await dispatch(actionDeleteProduct(id)).unwrap();
        message.success("Đã xóa sản phẩm!");
      } catch {
        message.error("Không thể xóa sản phẩm!");
      }
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* 🟢 QUẢN LÝ DANH MỤC */}
      <div className="space-y-4 border-b pb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Quản lý danh mục</h2>
          <Space>
            <Button type="primary" onClick={() => setIsAddCategoryOpen(true)}>
              + Thêm
            </Button>
            <Button
              disabled={!selectedCategory}
              onClick={() => {
                const cat = categories.find(
                  (c) => c.categoryName === selectedCategory
                );
                setSelectedEditCategory(cat);
                setIsEditCategoryOpen(true);
              }}
            >
              Sửa
            </Button>
            <Button
              danger
              disabled={!selectedCategory}
              onClick={() => {
                const cat = categories.find(
                  (c) => c.categoryName === selectedCategory
                );
                if (cat) handleDeleteCategory(cat.categoryId);
              }}
            >
              Xóa
            </Button>
          </Space>
        </div>

        <Select
          placeholder="Chọn danh mục để hiển thị sản phẩm"
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value)}
          className="w-1/2"
        >
          {categories.map((c) => (
            <Select.Option key={c.categoryId} value={c.categoryName}>
              {c.categoryName}
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* 🟣 QUẢN LÝ SẢN PHẨM */}
      <div>
        <Condition
          searchProductName={searchProductName}
          setSearchProductName={setSearchProductName}
          searchCategoryName={searchCategoryName}
          setSearchCategoryName={setSearchCategoryName}
          categories={uniqueCategories}
        />

        <h2 className="text-xl font-bold mb-2">Quản lý sản phẩm</h2>
        <div className="flex justify-end mb-2">
          <Button type="primary" onClick={() => setIsAddOpen(true)}>
            + Thêm sản phẩm
          </Button>
        </div>

        <div className="border border-gray-300 rounded-md overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 bg-gray-100 font-semibold text-sm text-center">
            <div className="px-3 py-2 col-span-1">Mã SP</div>
            <div className="px-3 py-2 col-span-2">Ảnh</div>
            <div className="px-3 py-2 col-span-2">Tên sản phẩm</div>
            <div className="px-3 py-2 col-span-1">Danh mục</div>
            <div className="px-3 py-2 col-span-1">Giá</div>
            <div className="px-3 py-2 col-span-1">Giảm giá</div>
            <div className="px-3 py-2 col-span-1">Số lượng</div>
            <div className="px-3 py-2 col-span-1">Chất liệu</div>
            <div className="px-3 py-2 col-span-1">Trạng thái</div>
            <div className="px-3 py-2 col-span-1">Hành động</div>
          </div>

          {filteredData.map((p) => (
            <div
              key={p.productId}
              className="grid grid-cols-12 text-center text-sm border-t border-gray-200"
            >
              <div className="px-3 py-2 font-medium col-span-1">
                {p.productId}
              </div>
              <div className="px-3 py-2 flex justify-center col-span-2">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-12 h-12 object-cover rounded"
                />
              </div>
              <div className="px-3 py-2 col-span-2 truncate" title={p.name}>
                {p.name}
              </div>
              <div className="px-3 py-2 col-span-1">{p.categoryName}</div>
              <div className="px-3 py-2 col-span-1">
                {p.price.toLocaleString()} đ
              </div>
              <div className="py-2 col-span-1">
                {p.discount > 0 ? (
                  <Tag color="volcano">-{p.discount}%</Tag>
                ) : (
                  <Tag color="default">0%</Tag>
                )}
              </div>
              <div className="px-3 py-2 col-span-1">{p.stockQuantity}</div>
              <div className="px-3 py-2 col-span-1">{p.material}</div>
              <div className="py-2 flex justify-center items-center col-span-1">
                {p.status?.toLowerCase() === "active" ? (
                  <Tag color="green">Hoạt động</Tag>
                ) : (
                  <Tag color="red">Ngưng</Tag>
                )}
              </div>
              <div className="px-3 py-2 flex gap-2 justify-center col-span-1">
                <Button
                  className="!bg-blue-500 !text-white px-3 py-1 rounded"
                  onClick={() => {
                    setSelectedProduct(p);
                    setIsEditOpen(true);
                  }}
                >
                  Sửa
                </Button>
                <Button danger onClick={() => handleDeleteProduct(p.productId)}>
                  Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- CATEGORY MODALS --- */}
      <AddCategoryModal
        open={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
      />
      <EditCategoryModal
        open={isEditCategoryOpen}
        onClose={() => setIsEditCategoryOpen(false)}
        category={selectedEditCategory}
      />

      {/* --- PRODUCT MODALS --- */}
      <AddProductModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        categories={uniqueCategories}
      />
      <EditProductModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        product={selectedProduct}
        categories={uniqueCategories}
      />
    </div>
  );
};

export default ManageProduct;
