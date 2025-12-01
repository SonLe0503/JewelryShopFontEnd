/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Select, Space, Tag, Collapse, Upload } from "antd";
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
import {
  actionDeleteCollection,
  actionGetAllCollections,
  selectCollections,
} from "../../../../../store/collectionSlide";

import AddCategoryModal from "../../../../components/modals/category/AddCategoryModal";
import EditCategoryModal from "../../../../components/modals/category/EditCategoryModal";
import AddCollectionModal from "../../../../components/modals/collections/AddCollectionModal";
import EditCollectionModal from "../../../../components/modals/collections/EditCollectionModal";
import AddProductModal from "../../../../components/modals/products/AddProductModal";
import EditProductModal from "../../../../components/modals/products/EditProductModal";
import Condition from "./Condition";
import { BASE_URL } from "../../../../../utils/app";
import { actionGetImagesByProductId, actionUploadProductImage, selectProductImages } from "../../../../../store/productImageSlide";
import { UploadOutlined } from "@ant-design/icons";
import ProductImagesModal from "../../../../components/modals/products/ProductImagesModal";

const ManageProduct = () => {
  const dispatch = useAppDispatch();
  const productStatus = ["Active", "Deleted"];

  // --- CATEGORY STATES ---
  const categories = useSelector(selectCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [selectedEditCategory, setSelectedEditCategory] = useState<any>(null);

  // --- COLLECTION STATES ---
  const collections = useSelector(selectCollections);
  const [selectedCollection, setSelectedCollection] = useState<string>("");
  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  const [isEditCollectionOpen, setIsEditCollectionOpen] = useState(false);
  const [selectedEditCollection, setSelectedEditCollection] = useState<any>(null);

  // --- PRODUCT STATES ---
  const products = useSelector(selectProducts);
  const [searchProductName, setSearchProductName] = useState("");
  const [searchCategoryName, setSearchCategoryName] = useState("");
  const [searchCollection, setSearchCollection] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // --- IMAGE MODAL ---
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);
  const [currentMainImage, setCurrentMainImage] = useState<string>("");


  const productImages = useSelector(selectProductImages);


  // --- FETCH DATA ---
  useEffect(() => {
    dispatch(actionGetAllCategories());
    dispatch(actionGetAllProducts());
    dispatch(actionGetAllCollections());
  }, [dispatch]);

  // --- FILTERS ---
  const filteredData = (products || []).filter((product) => {
    const productName = (product.name || "").toLowerCase().replace(/\s+/g, "");
    const categoryName = (product.categoryName || "").toLowerCase().replace(/\s+/g, "");
    const collectionName = (product.collectionName || "").toLowerCase().replace(/\s+/g, "");

    const searchName = (searchProductName || "").toLowerCase().replace(/\s+/g, "");
    const searchCategory = (searchCategoryName || "").toLowerCase().replace(/\s+/g, "");
    const searchCollectionName = (searchCollection || "").toLowerCase().replace(/\s+/g, "");

    return (
      productName.includes(searchName) &&
      categoryName.includes(searchCategory) &&
      collectionName.includes(searchCollectionName) &&
      (searchStatus ? product.status === searchStatus : true)
    );
  });


  const uniqueCategories = Array.from(
    new Set(categories.map((p) => p.categoryName))
  );

  const uniqueCollections = Array.from(
    new Set(collections.map((p) => p.name))
  )
  // --- ACTIONS ---
  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
      try {
        await dispatch(actionDeleteProduct(id)).unwrap();
        dispatch(actionGetAllProducts());
        alert("Đã xóa sản phẩm!");
      } catch {
        alert("Không thể xóa sản phẩm!");
      }
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await dispatch(actionDeleteCategory(id)).unwrap();
      dispatch(actionGetAllCategories()); 
      alert("Xóa danh mục thành công!");
    } catch {
      alert("Không thể xóa danh mục!");
    }
  };

  const handleDeleteCollection = async (id: number) => {
    try {
      await dispatch(actionDeleteCollection(id)).unwrap();
      dispatch(actionGetAllCollections());
      alert("Xóa bộ sưu tập thành công!");
    } catch {
      alert("Không thể xóa bộ sưu tập!");
    }
  };

  const handleUploadImage = async (productId: number, file: File) => {
    const count = (productImages || []).filter((img) => img.productId === productId).length;
    if (count >= 5) {
      alert("Mỗi sản phẩm chỉ được thêm tối đa 5 ảnh!");
      return;
    }

    try {
      await dispatch(actionUploadProductImage({ productId, file })).unwrap();
      alert("Tải ảnh thành công!");
      dispatch(actionGetImagesByProductId(productId)); // reload ảnh mới
    } catch {
      alert("Lỗi khi tải ảnh lên!");
    }
  };

  return (
    <div className="p-6 space-y-8">
      <Collapse
        defaultActiveKey={["1", "2", "3"]}
        accordion={false}
        items={[
          // 🟢 QUẢN LÝ DANH MỤC
          {
            key: "1",
            label: "Quản lý danh mục",
            children: (
              <div className="flex justify-between items-center mb-4">
                <Space>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => setIsAddCategoryOpen(true)}
                  >
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
                    size="small"
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
                    size="small"
                  >
                    Xóa
                  </Button>
                </Space>

                <Select
                  placeholder="Chọn danh mục"
                  value={selectedCategory}
                  onChange={(value) => setSelectedCategory(value)}
                  className="w-1/2"
                >
                  {categories.map((c) => (
                    <Select.Option
                      key={c.categoryId}
                      value={c.categoryName}
                    >
                      {c.categoryName}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            ),
          },

          // 🟣 QUẢN LÝ BỘ SƯU TẬP
          {
            key: "2",
            label: "Quản lý bộ sưu tập",
            children: (
              <div className="flex justify-between items-center mb-4">
                <Space>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => setIsAddCollectionOpen(true)}
                  >
                    + Thêm
                  </Button>

                  <Button
                    disabled={!selectedCollection}
                    onClick={() => {
                      const col = collections.find(
                        (c) => c.name === selectedCollection
                      );
                      setSelectedEditCollection(col);
                      setIsEditCollectionOpen(true);
                    }}
                    size="small"
                  >
                    Sửa
                  </Button>

                  <Button
                    danger
                    disabled={!selectedCollection}
                    onClick={() => {
                      const col = collections.find(
                        (c) => c.name === selectedCollection
                      );
                      if (col) handleDeleteCollection(col.collectionId);
                    }}
                    size="small"
                  >
                    Xóa
                  </Button>
                </Space>

                <Select
                  placeholder="Chọn bộ sưu tập"
                  value={selectedCollection}
                  onChange={(value) => setSelectedCollection(value)}
                  className="w-1/2"
                >
                  {collections.map((c) => (
                    <Select.Option
                      key={c.collectionId}
                      value={c.name}
                    >
                      {c.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            ),
          },

          // 🟣 QUẢN LÝ SẢN PHẨM
          {
            key: "3",
            label: "Quản lý sản phẩm",
            children: (
              <>
                <Condition
                  searchProductName={searchProductName}
                  setSearchProductName={setSearchProductName}
                  searchCategoryName={searchCategoryName}
                  setSearchCategoryName={setSearchCategoryName}
                  categories={uniqueCategories}
                  searchCollection={searchCollection}
                  setSearchCollection={setSearchCollection}
                  collections={uniqueCollections}
                  searchStatus={searchStatus}
                  setSearchStatus={setSearchStatus}
                  productStatus={productStatus}               
                />

                <div className="flex justify-end mb-2">
                  <Button type="primary" onClick={() => setIsAddOpen(true)}>
                    + Thêm sản phẩm
                  </Button>
                </div>

                <div className="border border-gray-300 rounded-md overflow-hidden">
                  {/* HEADER */}
                  <div className="grid grid-cols-12 bg-gray-100 font-semibold text-sm text-center">
                    <div className="px-3 py-2 col-span-1">Mã SP</div>
                    <div className="px-3 py-2 col-span-1">Ảnh</div>
                    <div className="px-3 py-2 col-span-2">Tên sản phẩm</div>
                    <div className="px-3 py-2 col-span-1">Giá</div>
                    <div className="px-3 py-2 col-span-1">Giảm giá</div>
                    <div className="px-3 py-2 col-span-1">Số lượng</div>
                    <div className="px-3 py-2 col-span-2">Chất liệu</div>
                    <div className="px-3 py-2 col-span-1">Trạng thái</div>
                    <div className="px-3 py-2 col-span-2">Hành động</div>
                  </div>

                  {/* LIST */}
                  {filteredData.map((p) => (
                    <div
                      key={p.productId}
                      className="grid grid-cols-12 text-center text-sm border-t border-gray-200"
                    >
                      <div className="px-3 py-2 font-medium col-span-1">
                        {p.productId}
                      </div>

                      <div
                        className="px-3 py-2 flex justify-center col-span-1"
                        onClick={() => {
                          setCurrentProductId(p.productId);
                          setCurrentMainImage(p.imageUrl);
                          setIsImageModalOpen(true);
                        }}
                      >
                        <img
                          src={`${BASE_URL}${p.imageUrl}`}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </div>

                      <div className="px-3 py-2 col-span-2 truncate" title={p.name}>
                        {p.name}
                      </div>

                      <div className="px-3 py-2 col-span-1">
                        {Number(p.price || 0).toLocaleString()}đ
                      </div>

                      <div className="py-2 col-span-1">
                        {p.discount > 0 ? (
                          <Tag color="volcano">-{p.discount}%</Tag>
                        ) : (
                          <Tag color="default">0%</Tag>
                        )}
                      </div>

                      <div className="px-3 py-2 col-span-1">
                        {p.stockQuantity}
                      </div>

                      <div
                        className="px-3 py-2 col-span-2 truncate"
                        title={p.material}
                      >
                        {p.material}
                      </div>

                      <div className="py-2 flex justify-center items-start col-span-1">
                        {p.status?.toLowerCase() === "active" ? (
                          <Tag color="green">Hoạt động</Tag>
                        ) : (
                          <Tag color="red">Ngưng</Tag>
                        )}
                      </div>

                      <div className="px-3 py-2 flex gap-2 justify-center col-span-2">
                        <Upload
                          showUploadList={false}
                          beforeUpload={(file) => {
                            handleUploadImage(p.productId, file);
                            return false;
                          }}
                        >
                          <Button icon={<UploadOutlined />} size="small">
                            Thêm ảnh
                          </Button>
                        </Upload>

                        <Button
                          className="!bg-blue-500 !text-white px-3 py-1 rounded"
                          onClick={() => {
                            setSelectedProduct(p);
                            setIsEditOpen(true);
                          }}
                          size="small"
                        >
                          Sửa
                        </Button>

                        <Button
                          danger
                          onClick={() => handleDeleteProduct(p.productId)}
                          size="small"
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ),
          },
        ]}
      />


      {/* --- MODALS --- */}
      <AddCategoryModal open={isAddCategoryOpen} onClose={() => setIsAddCategoryOpen(false)} />
      <EditCategoryModal open={isEditCategoryOpen} onClose={() => setIsEditCategoryOpen(false)} category={selectedEditCategory} />

      <AddCollectionModal open={isAddCollectionOpen} onClose={() => setIsAddCollectionOpen(false)} />
      <EditCollectionModal open={isEditCollectionOpen} onClose={() => setIsEditCollectionOpen(false)} collection={selectedEditCollection} />

      <AddProductModal open={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditProductModal open={isEditOpen} onClose={() => setIsEditOpen(false)} product={selectedProduct} />

      <ProductImagesModal
        open={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        productId={currentProductId}
        mainImageUrl={currentMainImage}
      />

    </div>
  );
};

export default ManageProduct;
