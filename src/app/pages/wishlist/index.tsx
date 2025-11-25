/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectIsLogin, selectInfoLogin } from "../../../store/authSlide";
import { actionGetOrdersByUser, selectOrder } from "../../../store/orderSlide";
import { actionGetAllProducts, selectProducts } from "../../../store/productSlide";
import Login from "../login";
import URL from "../../../constrants/url";
import { setOpenLogin } from "../../../store/uiSlide";
import { useNavigate } from "react-router-dom";
import { actionGetWishlist, selectWishlist } from "../../../store/wishlistSlide";
import { BASE_URL } from "../../../utils/app";

const WishList = () => {
  const navigate = useNavigate();
  const wishlistIds = useSelector(selectWishlist);
  const dispatch = useDispatch<any>();
  const isLogin = useSelector(selectIsLogin);
  const infoLogin = useSelector(selectInfoLogin);
  const { orders } = useSelector(selectOrder);
  const products = useSelector(selectProducts);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [suggested, setSuggested] = useState<any[]>([]);

  useEffect(() => {
    dispatch(actionGetAllProducts());
    if (isLogin && infoLogin.userId) {
      dispatch(actionGetOrdersByUser(Number(infoLogin.userId)));
      dispatch(actionGetWishlist(Number(infoLogin.userId)));
    }
  }, [dispatch, isLogin, infoLogin.userId]);

  useEffect(() => {
    if (products.length > 0) {
      const purchasedProductIds = orders.flatMap((order: any) =>
        order.orderDetails.map((od: any) => od.productId)
      );

      const allIds = Array.from(new Set([...wishlistIds, ...purchasedProductIds]));
      const selectedProducts = products.filter(p => allIds.includes(p.productId));

      setWishlist(selectedProducts);

      const categories = Array.from(new Set(selectedProducts.map(p => p.categoryId)));
      const suggestedProducts = products.filter(
        p => categories.includes(p.categoryId) && !allIds.includes(p.productId)
      );

      setSuggested(suggestedProducts.slice(0, 8));
    }
  }, [orders, products, wishlistIds]);

  const handleClickDetail = (id: number) => {
    window.location.href = `${URL.Detail.replace(":id", id.toString())}`;
  };

  return (
    <>
      <div className="w-full">
        {/* Wishlist section */}
        <div className="text-center py-10">
          <h2 className="text-xl font-light">DANH SÁCH YÊU THÍCH</h2>
          {wishlist.length === 0 ? (
            <div className="mt-4">
              <p className="text-black text-[12px]">
                Danh sách yêu thích của bạn hiện đang trống.{" "}
                {!isLogin && (
                  <a className="underline cursor-pointer" onClick={() => dispatch(setOpenLogin(true))}>
                    Đăng nhập
                  </a>
                )}{" "}
                hoặc{" "}
                <a className="underline cursor-pointer" href={URL.Register}>
                  tạo tài khoản
                </a>{" "}
                để lưu danh sách yêu thích trên tất cả các thiết bị của bạn.
              </p>
              <Button className="mt-4 hover:!bg-black hover:!text-white !border-black  rounded-md px-6 py-2" onClick={() => navigate(URL.Product)}>
                TIẾP TỤC MUA SẮM
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 px-4 mt-4">
              {wishlist.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:shadow-2xl transition overflow-hidden"
                >
                  <div className="relative cursor-pointer" onClick={() => handleClickDetail(item.productId)}>
                    <img
                      src={`${BASE_URL}${item.imageUrl}`}
                      alt={item.name}
                      className="w-full h-80 object-cover"
                    />
                    {/* Hiển thị thông báo hết hàng */}
                    {item.stockQuantity === 0 && (
                      <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center text-gray-500 text-sm">
                        Hết hàng
                      </div>
                    )}

                  </div>

                  <div className="p-4">
                    <div className="font-light text-[14px] truncate" title={item.name}>
                      {item.name}
                    </div>
                    <div className="text-[14px] font-light">
                      {item.price.toLocaleString("vi-VN")} <span>VND</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Suggested items */}
        {suggested.length > 0 && (
          <div className="px-6 md:px-20 py-10">
            <h3 className="text-center text-lg font-light mb-6">GỢI Ý CHO BẠN</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
              {suggested.map(item => (
                <div key={item.productId} className="flex flex-col items-center bg-white rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:shadow-2xl transition overflow-hidden">
                  <div className="relative w-full" onClick={() => handleClickDetail(item.productId)}>
                    <img src={`${BASE_URL}${item.imageUrl}`} alt={item.name} className="w-full object-cover rounded-md" />

                  </div>
                  <p className="mt-2 text-center text-[13px] font-sans">{item.name}</p>
                  <p className="text-center text-[13px] font-sans">
                    {item.price.toLocaleString("vi-VN")} <span>VND</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Login />
    </>
  );
};

export default WishList;
