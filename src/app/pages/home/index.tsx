import { Button } from "antd";
import { useEffect, useState } from "react";
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

const images = [
  "https://scontent.fhan18-1.fna.fbcdn.net/v/t39.30808-6/557712262_122134652078893442_8421142447824040983_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeHb2Au68d-cpoPgNjn1cPzPJ0TGDr613q0nRMYOvrXerVorIDHs63lxjY5kqU8PPhm7bnpInnbMoQhQrvTv46bO&_nc_ohc=-TYKfBV3JWMQ7kNvwGBKxyL&_nc_oc=AdlEB-_PBmdhYfSKWdVnizIyEbwIP130GWAelc6oqIdmNY3Tz6vc80wiVYNcRoyQDMc&_nc_zt=23&_nc_ht=scontent.fhan18-1.fna&_nc_gid=bseoMvKYAbqpThD2Wk_nSA&oh=00_Afjf2IYNmQoUg_Z0VaZw2ZJIa2DWSKTRb5ow7_69vP1VRg&oe=6927E9E6",
  // "https://scontent.fhan20-1.fna.fbcdn.net/v/t39.30808-6/557719957_122134819232893442_88520308609150199_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=EG_eCNqfk-YQ7kNvwH4dNEy&_nc_oc=AdlUBUXLPAJdrAiLqi2NMGPS1QRvu5oUUFvAKW6WYeV92Ajk_Hb5B9pt47Oy1MGqNaw&_nc_zt=23&_nc_ht=scontent.fhan20-1.fna&_nc_gid=tFH3poJDqGng28cgOpfrKA&oh=00_Afhb_z9Njdm7pn8b2N7iyMSlAaIDtKTwOnFyM7GsHUzFnw&oe=6919DD2E",
  // "https://scontent.fhan20-1.fna.fbcdn.net/v/t39.30808-6/565703485_122136801320893442_7253931868921607037_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=V5IabCGk_lgQ7kNvwFyVdYO&_nc_oc=AdmxZMaOjW034_xnusKx3yi7mnlLlGe8L4ZqcXxf-azc3cz6DfiZhYb7vyAJd0NY8_k&_nc_zt=23&_nc_ht=scontent.fhan20-1.fna&_nc_gid=pCklWZNG1Ub-IkERTN0MEw&oh=00_AfiZ52PbQgf9GjITfL_KTtXXw1k9XaAef_vJdkLtj4OuVA&oe=6919CF46",
  // "https://scontent.fhan2-5.fna.fbcdn.net/v/t39.30808-6/580528968_122140405982893442_3734207816748975344_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=AZMzsOOnh-AQ7kNvwGOIJzq&_nc_oc=AdnEZj1h7GjAjdBTqWMB31O9E3NCK8GTC2K-GuJdjyVcEGVz-NSYG_9YuiOIlhlnqDc&_nc_zt=23&_nc_ht=scontent.fhan2-5.fna&_nc_gid=CHuPhWZ6P9SH297nyRGWVA&oh=00_AfjEkcks00cJvT_xbtu_6b4YXm4yk2KKrlu3IN8IjxYtGQ&oe=6919D858"
];

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const categories = useSelector(selectCategories);
  const products = useSelector(selectProducts);
  const collections = useSelector(selectCollections);
  const loadingCategory = useSelector(selectCategoryLoading);
  const loadingProduct = useSelector(selectProductLoading);
  const loadingCollection = useSelector(selectCollectionLoading);

  const [current, setCurrent] = useState(0);

  const handleClickDetail = (id: number) => {
    navigate(URL.Detail.replace(":id", id.toString()));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    dispatch(actionGetAllCategories());
    dispatch(actionGetAllProducts());
    dispatch(actionGetAllCollections())
  }, [dispatch]);

  return (
    <>
      <section id="home" className="relative h-[80vh] overflow-hidden flex items-center justify-center">

        <div
          className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
          style={{
            width: `${images.length * 100}%`,
            transform: `translateX(-${current * (100 / images.length)}%)`,
          }}
        >
          {images.map((src, index) => (
            <div
              key={index}
              className="w-full h-full bg-cover bg-center flex-shrink-0"
              style={{
                backgroundImage: `url(${src})`,
                width: `${100 / images.length}%`,
              }}
            />
          ))}
        </div>

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
                            : "https://i.sstatic.net/y9DpT.jpg"
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
            <div className="relative h-[400px] bg-[url('https://scontent.fhph1-2.fna.fbcdn.net/v/t39.30808-6/571358429_122137898744893442_4494606792210732567_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHoY74N3-ckoRqTrbiYY7rqUj8goJHN83JSPyCgkc3zco_LZ3iNFKEmfl5mFoUF6e5b77xeLiUDC7fcNKR0Fumt&_nc_ohc=u-gC-Of5RagQ7kNvwFQMo0F&_nc_oc=AdkNv7Q6gKxurkrajBk4Cw0ORMt8wxHK5xyA8nxhw_yJTHZOoDHXOlOUHdnMe_jqC5hC5bD6Mt_Vxev2U1qvxHYY&_nc_zt=23&_nc_ht=scontent.fhph1-2.fna&_nc_gid=qFfWsFbXD_qVaqFSYtnwwQ&oh=00_Afg53CiXIch10QhKa2ATCMSfN3qu3W-44Ljo1jmjAK7GHA&oe=69280E15')] bg-cover bg-center rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col items-center justify-end text-white text-center p-6">
                <h2 className="text-3xl font-light mb-2">Denim Everyday</h2>
                <p className="mb-4 font-light text-[14px]">Những mẫu jean thời thượng cho cuộc sống năng động</p>
                <Button className="!bg-white !text-black hover:!bg-black hover:!text-white !border-none font-light" onClick={() => navigate(URL.Product)}>Khám phá ngay</Button>
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
                        "https://i.sstatic.net/y9DpT.jpg"
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
            {collections.map((col) => {
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
                        : "https://i.sstatic.net/y9DpT.jpg"
                    }
                    alt={col.name}
                    className="w-full h-[300px] object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center p-4">
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
