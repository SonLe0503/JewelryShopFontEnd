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
import { BASE_URL } from "../../../utils/app";
import { actionGetAllCollections, selectCollectionLoading, selectCollections } from "../../../store/collectionSlide";
import { useNavigate } from "react-router-dom";
import URL from "../../../constrants/url";
import bannerhome1 from "../../../assets/images/bannerhome1.jpg";
import bannerhome2 from "../../../assets/images/bannerhome2.jpg";
import noImage from "../../../assets/images/noImage.jpg";

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const categories = useSelector(selectCategories);
  const products = useSelector(selectProducts);
  const collections = useSelector(selectCollections);
  const loadingCategory = useSelector(selectCategoryLoading);
  const loadingProduct = useSelector(selectProductLoading);
  const loadingCollection = useSelector(selectCollectionLoading);



  const handleClickDetail = (id: number) => {
    navigate(URL.Detail.replace(":id", id.toString()));
  };

  useEffect(() => {
    dispatch(actionGetAllCategories());
    dispatch(actionGetAllProducts());
    dispatch(actionGetAllCollections())
  }, [dispatch]);

  return (
    <>
      <section
        id="home"
        className="relative h-[80vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${bannerhome1})`,
        }}
      >
        <div className="relative z-10 bg-black/40 backdrop-blur-sm border border-white/20 p-6 rounded-2xl text-center text-white max-w-2xl shadow-lg">
          <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-wide">
            BỘ SƯU TẬP JEAN 2025
          </h1>
          <p className="mb-6 font-light text-[14px] opacity-90">
            Khám phá phong cách denim hiện đại, năng động và tự do cho mọi giới tính.
          </p>
          <Button
            className="!bg-white !text-black !border-black hover:!bg-black hover:!text-white transition-all duration-300 font-light"
            href="#products"
          >
            Mua ngay
          </Button>
        </div>
      </section>


      <section id="products" className="py-12 px-6">
        <h2 className="text-2xl font-light text-center mb-8">
          Danh mục nổi bật
        </h2>

        {loadingCategory ? (
          <p className="text-center text-gray-500">Đang tải danh mục...</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-400">Chưa có danh mục nào.</p>
        ) : (
          <div className="relative overflow-hidden w-full">
            <div className="flex gap-4 animate-scrollX">
              {/* Nhân đôi danh sách để scroll liền mạch */}
              {[...categories, ...categories]
                .filter((cat) => cat.products?.some(p => p.status === "Active"))
                .map((cat, index) => {
                  const firstActiveProduct = cat.products?.find(
                    (p) => p.imageUrl && p.status === "Active"
                  );
                  return (
                    <div
                      key={`${cat.categoryId}-${index}`} // key khác nhau cho phần nhân đôi
                      className="relative w-[250px] h-[350px] rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform flex-shrink-0"
                      onClick={() =>
                        navigate(`${URL.Product}?category=${encodeURIComponent(cat.categoryName)}`)
                      }
                    >
                      <img
                        src={
                          firstActiveProduct
                            ? `${BASE_URL}${firstActiveProduct.imageUrl}`
                            : `${noImage}`
                        }
                        alt={cat.categoryName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-4">
                        <div className="text-white text-lg font-light">{cat.categoryName}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>


        )}
      </section>


      <section id="collection" className="py-12 px-6 bg-gray-100">
        <h2 className="text-2xl font-light text-center mb-8">
          Sản phẩm nổi bật
        </h2>

        {loadingProduct ? (
          <p className="text-center text-gray-500">Đang tải sản phẩm...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-400">Chưa có sản phẩm nào.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Banner bên trái */}
            <div className="relative h-[400px] rounded-lg overflow-hidden group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${bannerhome2})` }}
              ></div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col items-center justify-end text-white text-center p-6">
                <h2 className="text-3xl font-light mb-2">Denim Everyday</h2>
                <p className="mb-4 font-light text-[14px]">
                  Những mẫu jean thời thượng cho cuộc sống năng động
                </p>
                <Button
                  className="!bg-white !text-black hover:!bg-black hover:!text-white !border-none font-light"
                  onClick={() => navigate(URL.Product)}
                >
                  Khám phá ngay
                </Button>
              </div>
            </div>


            {/* Sản phẩm bên phải */}
            <div className="grid grid-cols-2 gap-4">
              {products
                .filter((p) => p.status === "Active")
                .slice(0, 2).map((prod) => (
                  <div
                    key={prod.productId}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300 cursor-pointer"
                    onClick={() => handleClickDetail(prod.productId)}
                  >
                    <img
                      src={
                        `${BASE_URL}${prod.imageUrl}` ||
                        prod.productImages?.[0] ||
                        `${noImage}`
                      }
                      alt={prod.name}
                      className="w-full h-80 object-cover"
                    />
                    <div className="p-4 text-center">
                      <div className="font-light text-[14px]">{prod.name}</div>
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


      <section className="py-12 px-6">
        <h2 className="text-2xl font-light text-center mb-8">
          Bộ sưu tập nổi bật
        </h2>

        {loadingCollection ? (
          <p className="text-center text-gray-500">Đang tải bộ sưu tập...</p>
        ) : collections.length === 0 ? (
          <p className="text-center text-gray-400">Chưa có bộ sưu tập nào.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections
            .filter((col) => col.status === "Active")
            .map((col) => {
              // Lấy sản phẩm có ảnh đầu tiên trong mỗi bộ sưu tập
              const firstProduct = col.products?.find(
                (p) => p.imageUrl && p.status === "Active"
              );

              return (
                <div
                  key={col.collectionId}
                  onClick={() =>
                    navigate(`${URL.Product}?collectionId=${col.collectionId}`)
                  }
                  className="relative rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform"
                >
                  <img
                    src={
                      firstProduct
                        ? `${BASE_URL}${firstProduct.imageUrl}`
                        : `${noImage}`
                    }
                    alt={col.name}
                    className="w-full h-[300px] object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center text-white text-center p-4">
                    <h3 className="text-lg font-light mb-2">{col.name}</h3>
                    <p className="text-sm font-light opacity-90">{col.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
};

export default Home;
