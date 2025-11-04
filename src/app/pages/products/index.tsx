import { Button, Select } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import URL from "../../../constrants/url";
import { useAppDispatch } from "../../../store";
import { actionGetAllProducts, selectProducts } from "../../../store/productSlide";
import { useSelector } from "react-redux";


const {Option} = Select;

const Product = () => {
  const navigate = useNavigate();
  const [sort, setSort] = useState("featured");
  const [filter, setFilter] = useState("All");
  const dispatch = useAppDispatch();
  const products = useSelector(selectProducts);

  useEffect(() => {
    dispatch(actionGetAllProducts());
  }, [dispatch]);

  const types = ["All", ...new Set(products.map((w) => w.categoryName))];

  const product = products
    .filter((p) => filter === "All" || p.categoryName === filter)
    .sort((a, b) => {
      if (sort === "price_low") return a.price - b.price;
      if (sort === "price_high") return b.price - a.price;
      return 0;
    });

  const handleClickDetail = (id: number) => {
    navigate(URL.Detail.replace(":id", id.toString()));
  } 

  return (  
    <>
    <section className="max-w-7xl mx-auto px-4 py-8">

      {/* Filter + Sort */}
      <div className="flex flex-col sm:flex-row  items-start sm:items-center mb-6 gap-4">
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

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {product.map((item) => (
          <div
            key={item.productId}
            className="bg-white rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:shadow-2xl transition overflow-hidden"
          >
            <div className="relative" onClick={() => handleClickDetail(item.productId)}>
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-60 object-cover"
              />
              {item.stockQuantity === 0 && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center text-gray-500 text-sm">
                  Hết hàng
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="font-semibold text-[14px] truncate relative cursor-pointer group" title={item.name}>{item.name}</div>
              <div className="text-[14px] font-light">
                {item.price.toLocaleString("vi-VN")}{" "} <span>VND</span>
              </div>
            </div>
            <div className="px-4 pb-4">
              <Button
                block
                disabled={item.stockQuantity === 0}
                onClick={() => navigate(URL.Cart)}
              >
                {item.stockQuantity === 0 ? "Không khả dụng" : "Thêm vào giỏ"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center mt-8">
        <Button type="link">Xem thêm</Button>
      </div>
    </section>
    </>
  )
}
export default Product;