import { DeleteOutlined } from "@ant-design/icons";
import { Button, InputNumber, message } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CheckoutModal from "../../components/modals/CheckoutModal";
import {
  actionGetCartByUser,
  actionUpdateCartQuantity,
  actionRemoveFromCart,
  selectCart,
  actionClearCart,
} from "../../../store/cartSlide";
import { selectInfoLogin } from "../../../store/authSlide";
import { useAppDispatch } from "../../../store";
import { actionCreateOrder } from "../../../store/orderSlide";
import { BASE_URL } from "../../../utils/app";
import { actionCreateTransaction } from "../../../store/paymentTransactionSlide";
import { actionGetProductById, actionUpdateProductStock } from "../../../store/productSlide";

const Cart = () => {
  const dispatch = useAppDispatch();
  const { carts } = useSelector(selectCart);
  const { userId } = useSelector(selectInfoLogin);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const total = carts.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleQuantityChange = (cartId: number, value: number) => {
    if (value < 1) return;
    dispatch(actionUpdateCartQuantity({ cartId, quantity: value }))
      .unwrap()
      .then(() => {
        message.success("Cập nhật số lượng thành công");
      })
      .catch(() => {
        message.error("Cập nhật số lượng thất bại");
      });
  };

  const handleRemove = (cartId: number) => {
    dispatch(actionRemoveFromCart(cartId))
      .unwrap()
      .then(() => message.success("Xóa sản phẩm thành công"))
      .catch(() => message.error("Xóa sản phẩm thất bại"));
  };

  useEffect(() => {
    if (userId) {
      dispatch(actionGetCartByUser(Number(userId)));
    }
  }, [dispatch, userId]);

  return (
    <>
      <section className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-8">
        {/* Left: Cart Items */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-light mb-4">Giỏ hàng của bạn</h2>
          {carts.length === 0 && <p className="font-light">Giỏ hàng trống</p>}
          {carts.map((item) => (
            <div
              key={item.cartId}
              className="flex gap-4 bg-white rounded-lg shadow-sm p-4 items-center"
            >
              <img
                src={`${BASE_URL}${item.imgUrl}`}
                alt={item.productName}
                className="w-28 h-28 object-cover rounded-md"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.productName}</h3>
                <p className="text-sm text-gray-500">
                  {item.categoryName ?? ""}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <InputNumber
                    min={1}
                    value={item.quantity}
                    onChange={(value) =>
                      handleQuantityChange(item.cartId, Number(value))
                    }
                  />
                  <span className="font-bold text-gray-800">
                    {item.totalPrice.toLocaleString()} đ
                  </span>
                </div>
              </div>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                className="text-red-500"
                onClick={() => handleRemove(item.cartId)}
              />
            </div>
          ))}
        </div>

        {/* Right: Summary */}
        <div className="bg-gray-50 rounded-lg shadow-md p-6 h-fit">
          <h3 className="text-lg font-bold mb-4">Tóm tắt đơn hàng</h3>
          <div className="flex justify-between text-gray-600 mb-2">
            <span>Tạm tính</span>
            <span>{total.toLocaleString()} đ</span>
          </div>
          <div className="flex justify-between text-gray-600 mb-2">
            <span>Phí vận chuyển</span>
            <span>Miễn phí</span>
          </div>
          <div className="border-t my-4"></div>
          <div className="flex justify-between font-bold text-lg">
            <span>Tổng cộng</span>
            <span>{total.toLocaleString()} đ</span>
          </div>
          <Button
            size="large"
            block
            className="mt-6 !bg-gray-300 hover:!bg-black !text-white border-gray-300 hover:!border-black"
            onClick={() => setIsCheckoutOpen(true)}
            disabled={carts.length === 0}
          >
            Đặt hàng
          </Button>
          <Button
            size="large"
            block
            className="mt-3 !border-gray-300 !text-gray-300 hover:!border-black hover:!text-black"
            href="/"
          >
            Tiếp tục mua sắm
          </Button>
        </div>
      </section>
      <CheckoutModal
        open={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={total}
        onConfirm={async (values) => {
          if (!userId) return;

          const orderData = {
            userId: Number(userId),
            totalPrice: total,
            status: "Pending",
            shippingAddress: values.address,
            paymentMethod: values.paymentMethod,
            orderDetails: carts.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.totalPrice / item.quantity,
            })),
          };

          try {

            const createdOrder = await dispatch(actionCreateOrder(orderData)).unwrap();
            message.success("Đặt hàng thành công");

            // 🔹 Cập nhật stock cho từng sản phẩm
            for (const item of carts) {
              // Lấy thông tin sản phẩm hiện tại từ DB
              const product = await dispatch(
                actionGetProductById(item.productId)
              ).unwrap();

              // Tính stock mới
              const newStock = product.stockQuantity - item.quantity;

              // Gọi API update stock
              await dispatch(
                actionUpdateProductStock({
                  productId: item.productId,
                  stockQuantity: newStock,
                })
              ).unwrap();
            }
            // if (values.paymentMethod === "QR") {
            const transactionData = {
              orderId: createdOrder.orderId,
              amount: total,
              paymentStatus: "Pending",
            };

            await dispatch(
              actionCreateTransaction(transactionData)
            ).unwrap();
            message.info("Đơn hàng đang chờ thanh toán QR");
            // }

            await dispatch(actionClearCart(Number(userId))).unwrap();
            setIsCheckoutOpen(false);
            dispatch(actionGetCartByUser(Number(userId)));
          } catch (err) {
            console.error(err);
            message.error("Đặt hàng thất bại");
          }
        }}
      />

    </>
  );
};

export default Cart;
