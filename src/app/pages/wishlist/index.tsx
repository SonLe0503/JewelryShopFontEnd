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

const WishList = () => {
  const dispatch = useDispatch<any>();
  const isLogin = useSelector(selectIsLogin);
  const infoLogin = useSelector(selectInfoLogin);
  const { orders } = useSelector(selectOrder);
  const products = useSelector(selectProducts);

  const [wishlist, setWishlist] = useState<any[]>([]);
  const [suggested, setSuggested] = useState<any[]>([]);

  // Lấy dữ liệu sản phẩm và đơn hàng
  useEffect(() => {
    dispatch(actionGetAllProducts());
    if (isLogin && infoLogin.userId) {
      dispatch(actionGetOrdersByUser(Number(infoLogin.userId)));
    }
  }, [dispatch, isLogin, infoLogin.userId]);

  // Khi đơn hàng thay đổi, tạo wishlist từ các sản phẩm đã mua
  useEffect(() => {
    if (orders.length > 0 && products.length > 0) {
      const purchasedProductIds = orders.flatMap((order: any) =>
        order.orderDetails.map((od: any) => od.productId)
      );

      const purchasedProducts = products.filter(p =>
        purchasedProductIds.includes(p.productId)
      );

      setWishlist(purchasedProducts);

      // Suggested products: cùng category với sản phẩm đã mua
      const categories = Array.from(new Set(purchasedProducts.map(p => p.categoryId)));
      const suggestedProducts = products.filter(
        p => categories.includes(p.categoryId) && !purchasedProductIds.includes(p.productId)
      );

      setSuggested(suggestedProducts.slice(0, 8)); // lấy max 8 gợi ý
    }
  }, [orders, products]);

  return (
    <>
      <div className="w-full">
        {/* Wishlist section */}
        <div className="text-center py-10">
          <h2 className="text-xl font-bold">DANH SÁCH YÊU THÍCH</h2>
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
              <Button className="mt-4 hover:!bg-black hover:!text-white !border-black  rounded-md px-6 py-2">
                TIẾP TỤC MUA SẮM
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              {wishlist.map(item => (
                <div key={item.productId} className="border rounded-lg p-2">
                  <img src={item.imageUrl} alt={item.name} className="w-full object-cover rounded-md" />
                  <p className="mt-2 text-sm">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.price.toLocaleString("vi-VN")} VND</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Suggested items */}
        {suggested.length > 0 && (
          <div className="px-6 md:px-20 py-10">
            <h3 className="text-center text-lg font-bold mb-6">GỢI Ý CHO BẠN</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {suggested.map(item => (
                <div key={item.productId} className="flex flex-col items-center">
                  <div className="relative w-full">
                    <img src={item.imageUrl} alt={item.name} className="w-full object-cover rounded-md" />
                    <button className="absolute bottom-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow">
                      +
                    </button>
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
