import { Button, message, Select } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import URL from "../../../constrants/url";
import { useAppDispatch } from "../../../store";
import { actionGetAllProducts, selectProducts } from "../../../store/productSlide";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../../utils/app";
import { selectInfoLogin } from "../../../store/authSlide";
import { setOpenLogin } from "../../../store/uiSlide";
import { actionAddOrUpdateCart } from "../../../store/cartSlide";

const { Option } = Select;

const Product = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const discountQuery = params.get("discount");
  const collectionId = params.get("collectionId");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const categoryQuery = params.get("category");


  const [sort, setSort] = useState("featured");
  const [filter, setFilter] = useState(categoryQuery || "Tất cả");
  const [visibleCount, setVisibleCount] = useState(8);

  const user = useSelector(selectInfoLogin);
  const userId = user?.userId;
  const products = useSelector(selectProducts);

  const types = ["Tất cả", ...new Set(products.map((w) => w.categoryName))];

  const filteredProducts = products
    .filter((p) => {
      const byStatus = p.status === "Active";
      const byCategory = filter === "Tất cả" || p.categoryName === filter;
      const byCollection = !collectionId || p.collectionId === Number(collectionId);
      const byDiscount = discountQuery === "true" ? p.discount > 0 : true;
      return byStatus && byCategory && byCollection && byDiscount;
    })
    .sort((a, b) => {
      if (sort === "price_low") return a.price - b.price;
      if (sort === "price_high") return b.price - a.price;
      return 0;
    });

  const handleAddToCart = async (productId: number, stockQuantity: number) => {
    if (!userId) {
      message.warning("Vui lòng đăng nhập để thêm vào giỏ hàng");
      dispatch(setOpenLogin(true));
      return;
    }

    if (!productId) {
      message.error("Không tìm thấy sản phẩm");
      return;
    }

    try {
      await dispatch(
        actionAddOrUpdateCart({
          userId: Number(userId),
          productId,
          quantity: 1,
          stockQuantity,
        })
      ).unwrap();

      message.success("Đã thêm sản phẩm vào giỏ hàng");
      navigate(URL.Cart);

    } catch (error: any) {
      message.error(error || "Thêm vào giỏ hàng thất bại");
      alert("Số lượng phẩm đã đạt giới hạn")
    }
  };

  const handleClickDetail = (id: number) => {
    navigate(URL.Detail.replace(":id", id.toString()));
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  useEffect(() => {
    dispatch(actionGetAllProducts());
  }, [dispatch]);

  useEffect(() => {
    if (collectionId) {
      setFilter("All");
    }
    if (categoryQuery) {
      setFilter(categoryQuery);
    }
    setVisibleCount(8);
  }, [collectionId, categoryQuery]);


  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Bộ lọc & sắp xếp */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4">
        <Select value={filter} onChange={setFilter} style={{ width: 160 }}>
          {types.map((t) => (
            <Option key={t} value={t}>
              {t}
            </Option>
          ))}
        </Select>
        <Select value={sort} onChange={setSort} style={{ width: 180 }}>
          <Option value="featured">Nổi bật</Option>
          <Option value="price_low">Giá thấp → cao</Option>
          <Option value="price_high">Giá cao → thấp</Option>
        </Select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {visibleProducts.map((item) => (
          <div
            key={item.productId}
            className="bg-white rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform"
          >
            <div
              className="relative cursor-pointer"
              onClick={() => handleClickDetail(item.productId)}
            >
              <img
                src={`${BASE_URL}${item.imageUrl}`}
                alt={item.name}
                className="w-full h-60 object-cover"
              />
              
              {item.stockQuantity === 0 && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center text-gray-500 text-sm">
                  Hết hàng
                </div>
              )}
            </div>
            <div className="p-4 text-center">
              <div
                className="font-light text-[14px] truncate"
                title={item.name}
              >
                {item.name}
              </div>
              <div className="text-[14px] font-light">
                {item.price.toLocaleString("vi-VN")} <span>VND</span>
              </div>
            </div>
            <div className="px-4 pb-4">
              <Button
                block
                disabled={item.stockQuantity === 0}
                onClick={() => handleAddToCart(item.productId, item.stockQuantity)}
              >
                {item.stockQuantity === 0 ? "Không khả dụng" : "Thêm vào giỏ"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button type="link" onClick={handleLoadMore}>Xem thêm</Button>
      </div>
    </section>
  );
};

export default Product;
