import { Button } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../store"; 
import {
  actionGetAllCategories,
  selectCategories,
  selectCategoryLoading,
} from "../../../store/categorySlide";
import {
  actionGetAllProducts,
  selectProducts,
  selectProductLoading,
} from "../../../store/productSlide";

const Home = () => {
  const dispatch = useAppDispatch();

  const categories = useSelector(selectCategories);
  const products = useSelector(selectProducts);
  const loadingCategory = useSelector(selectCategoryLoading);
  const loadingProduct = useSelector(selectProductLoading);

  useEffect(() => {
    dispatch(actionGetAllCategories());
    dispatch(actionGetAllProducts());
  }, [dispatch]);

  const spotlights = [
    {
      name: "Phong cách Streetwear",
      img: "https://images.unsplash.com/photo-1593032410708-5f1d3f7b8f54?w=400&h=400&fit=crop",
    },
    {
      name: "Denim Trẻ Trung",
      img: "https://images.unsplash.com/photo-1601342632320-0a4cda1e8d43?w=400&h=400&fit=crop",
    },
    {
      name: "BST Xuân Hè 2025",
      img: "https://images.unsplash.com/photo-1603791452906-b8b7b6caa967?w=400&h=400&fit=crop",
    },
  ];

  return (
    <>
      {/* HERO */}
      <section
        id="home"
        className="relative bg-[url('https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1600&h=900&fit=crop')] bg-cover bg-center h-[80vh] flex items-center justify-center"
      >
        <div className="bg-black bg-opacity-50 p-6 rounded-lg text-center text-white max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            BỘ SƯU TẬP JEAN 2025
          </h1>
          <p className="mb-6 text-[14px]">
            Khám phá phong cách denim hiện đại, năng động và tự do cho mọi giới
            tính.
          </p>
          <Button
            className="!bg-blue-600 !text-white !border-none"
            href="#products"
          >
            Mua ngay
          </Button>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="products" className="py-12 px-6">
        <h2 className="text-2xl font-bold text-center mb-8">
          Danh mục nổi bật
        </h2>

        {loadingCategory ? (
          <p className="text-center text-gray-500">Đang tải danh mục...</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-400">Chưa có danh mục nào.</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto">
            {categories.map((cat) => (
              <div
                key={cat.categoryId}
                className="relative w-[250px] h-[350px] rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform"
              >
                <img
                  src={
                    cat.products?.[0]?.imageUrl ||
                    "https://via.placeholder.com/250x350?text=No+Image"
                  }
                  alt={cat.categoryName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-white text-lg font-semibold">
                    {cat.categoryName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FEATURED PRODUCTS */}
      <section id="collection" className="py-12 px-6 bg-gray-100">
        <h2 className="text-2xl font-bold text-center mb-8">
          Sản phẩm nổi bật
        </h2>

        {loadingProduct ? (
          <p className="text-center text-gray-500">Đang tải sản phẩm...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-400">Chưa có sản phẩm nào.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Banner bên trái */}
            <div className="relative h-[400px] bg-[url('https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&h=600&fit=crop')] bg-cover bg-center rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center p-6">
                <h2 className="text-3xl font-bold mb-2">Denim Everyday</h2>
                <p className="mb-4 text-[14px]">
                  Những mẫu jean thời thượng cho cuộc sống năng động
                </p>
                <Button className="!bg-blue-600 !text-white !border-none">
                  Khám phá ngay
                </Button>
              </div>
            </div>

            {/* Sản phẩm bên phải */}
            <div className="grid grid-cols-2 gap-4">
              {products.slice(0, 4).map((prod) => (
                <div
                  key={prod.productId}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <img
                    src={
                      prod.imageUrl ||
                      prod.productImages?.[0] ||
                      "https://via.placeholder.com/300x250?text=No+Image"
                    }
                    alt={prod.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <div className="font-semibold text-[14px]">{prod.name}</div>
                    <div className="text-[14px] font-light text-gray-600">
                      {prod.price.toLocaleString("vi-VN")} <span>VND</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* SPOTLIGHTS */}
      <section className="py-12 px-6">
        <h2 className="text-2xl font-bold text-center mb-8">
          Xu hướng nổi bật
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {spotlights.map((spot, idx) => (
            <div
              key={idx}
              className="relative rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform"
            >
              <img
                src={spot.img}
                alt={spot.name}
                className="w-full h-[300px] object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white font-semibold text-lg">
                {spot.name}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
