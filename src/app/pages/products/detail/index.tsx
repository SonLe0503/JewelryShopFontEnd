import { Button, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../../../store";
import { useSelector } from "react-redux";
import {
  actionGetProductById,
  selectProductDetail,
} from "../../../../store/productSlide";
import { BASE_URL } from "../../../../utils/app";
import dayjs from "dayjs";
import {
  actionGetAllReplies,
  selectReplies,
} from "../../../../store/replySlide";
import URL from "../../../../constrants/url";
import { actionAddOrUpdateCart } from "../../../../store/cartSlide";
import { selectInfoLogin } from "../../../../store/authSlide";
import { setOpenLogin } from "../../../../store/uiSlide";
import { actionGetWishlist, actionToggleWishlist, selectWishlist } from "../../../../store/wishlistSlide";

const Detail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const product = useSelector(selectProductDetail);
  const replies = useSelector(selectReplies);
  const user = useSelector(selectInfoLogin)
  const userId = user?.userId

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const wishlist = useSelector(selectWishlist);

  const images = product?.productImages?.length
    ? product.productImages
    : [product?.imageUrl];

  const handleAddToCart = async () => {
    if (!userId) {
      message.warning("Vui lòng đăng nhập để thêm vào giỏ hàng");
      dispatch(setOpenLogin(true));
      return;
    }

    if (!product?.productId) {
      message.error("Không tìm thấy sản phẩm");
      return;
    }

    try {
      await dispatch(
        actionAddOrUpdateCart({
          userId: Number(userId),
          productId: product.productId,
          quantity: 1,
          stockQuantity: product.stockQuantity
        })
      ).unwrap();

      message.success("Đã thêm sản phẩm vào giỏ hàng");
      navigate(URL.Cart);

    } catch (error: any) {
      message.error(error || "Thêm vào giỏ hàng thất bại");
    }
  };


  const handleToggleWishlist = async () => {
    if (!userId) {
      message.warning("Vui lòng đăng nhập để lưu sản phẩm yêu thích");
      dispatch(setOpenLogin(true));
      return;
    }

    if (!product?.productId) {
      message.error("Không tìm thấy sản phẩm");
      return;
    }

    await dispatch(
      actionToggleWishlist({ userId: Number(userId), productId: product.productId })
    );

    if (wishlist.includes(product.productId)) {
      message.success("Đã xóa khỏi danh sách yêu thích");
    } else {
      message.success("Đã thêm vào danh sách yêu thích");
    }
  };

  useEffect(() => {
    if (userId) {
      dispatch(actionGetWishlist(Number(userId)));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (id) {
      dispatch(actionGetProductById(Number(id)));
    }
  }, [id, dispatch]);

  useEffect(() => {
    dispatch(actionGetAllReplies());
  }, [dispatch]);

  useEffect(() => {
    if (product?.productImages?.length) {
      const firstImage = product.productImages[0];
      setSelectedImage(firstImage?.startsWith("http") ? firstImage : `${BASE_URL}${firstImage}`);
    }
  }, [product]);

  return (
    <div className="w-full min-h-screen bg-white py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[100px_1fr_1fr] gap-10 px-4">
        {/* 🖼️ Cột thumbnail nhỏ bên trái */}
        <div className="flex md:flex-col gap-4 items-center justify-center">
          {images.map((img, idx) => {
            const src = img?.startsWith("http") ? img : `${BASE_URL}${img}`;
            const isSelected = selectedImage === src;

            return (
              <div
                key={idx}
                className="relative w-20 h-20 rounded-md overflow-hidden cursor-pointer group"
                onClick={() => setSelectedImage(src)}
              >
                <img
                  src={src}
                  alt={`thumb-${idx}`}
                  className={`w-full h-full object-cover transition-all duration-300 
            ${isSelected ? "scale-110" : "group-hover:scale-105"}`}
                />

                {/* Overlay */}
                <div
                  className={`absolute inset-0 transition-all duration-300 
            ${isSelected ? "bg-black/30" : "bg-black/0 group-hover:bg-black/20"}`}
                ></div>
              </div>
            );
          })}
        </div>


        {/* 📸 Ảnh chính lớn */}
        <div className="flex items-center justify-center">
          {(() => {
            const mainImage =
              selectedImage ||
              (product?.productImages?.[0]
                ? product.productImages[0].startsWith("http")
                  ? product.productImages[0]
                  : `${BASE_URL}${product.productImages[0]}`
                : product?.imageUrl
                  ? product.imageUrl.startsWith("http")
                    ? product.imageUrl
                    : `${BASE_URL}${product.imageUrl}`
                  : null);

            return mainImage ? (
              <div className="relative flex items-center justify-center rounded-xl overflow-hidden group">
                <img
                  src={mainImage}
                  alt="main"
                  className="w-full max-h-[600px] object-contain transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay hover – giống ProductStory */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500"></div>
              </div>

            ) : (
              <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center text-gray-500 rounded-lg">
                Không có hình ảnh
              </div>
            );
          })()}
        </div>

        {/* 📋 Thông tin sản phẩm */}
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-sm text-gray-500 uppercase tracking-wide font-light">
              {product?.categoryName}
            </h3>
            <h1 className="text-3xl font-light text-black mt-2">
              {product?.name}
            </h1>
            <div className="flex items-center gap-3 mt-3">
              {/* Giá sau giảm */}
              <p className="text-2xl font-light text-black">
                {(
                  (Number(product?.price ?? 0)) -
                  (Number(product?.price ?? 0) * (product?.discount ?? 0)) / 100
                ).toLocaleString("vi-VN")}{" "}
                VND
              </p>

              {/* Badge giảm giá */}
              {(product?.discount ?? 0) > 0 && (
                <span className="text-sm font-light bg-red-500 text-white px-2 py-1 rounded">
                  -{product?.discount}%
                </span>
              )}
            </div>

            {/* Giá gốc bị gạch nếu có giảm */}
            {(product?.discount ?? 0) > 0 && (
              <p className="text-sm text-gray-500 line-through mt-1">
                {product?.price?.toLocaleString("vi-VN")} VND
              </p>
            )}

            {product?.stockQuantity === 0 ? (
              <p className="text-red-500 mt-2 font-medium">Hết hàng</p>
            ) : (
              <p className="text-gray-600 mt-2">
                Còn {product?.stockQuantity} sản phẩm
              </p>
            )}
          </div>

          <div
            style={{ whiteSpace: "pre-line" }}
            className="text-gray-700 leading-relaxed font-light">
            {product?.description}
          </div>

          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <p>
              <span className="font-semibold">Chất liệu:</span>{" "}
              {product?.material || "Đang cập nhật"}
            </p>
            <p>
              <span className="font-semibold">Ngày tạo:</span>{" "}
              {dayjs(product?.createdAt).format("DD/MM/YYYY")}
            </p>
          </div>

          <div className="flex gap-4 mt-4">
            <Button
              type="primary"
              className="!bg-black !border-black !text-white w-1/2"
              size="large"
              onClick={handleAddToCart}
            >
              THÊM VÀO GIỎ
            </Button>
            <Button
              size="large"
              className={`w-1/2 flex items-center justify-center gap-2 border ${wishlist.includes(product?.productId)
                ? "!text-red-500 !border-red-500"
                : "!text-black"
                }`}
              onClick={handleToggleWishlist}
            >
              <span>{wishlist.includes(product?.productId) ? "❤️ BỎ YÊU THÍCH" : "🤍 LƯU VÀO YÊU THÍCH"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 💬 Đánh giá & phản hồi */}
      <div className="max-w-5xl mx-auto mt-20 px-4">
        <h2 className="text-2xl font-light mb-6">Đánh giá & Nhận xét</h2>

        {product?.reviews && product.reviews.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-300 pb-4">
              <p className="text-lg font-light">
                Trung bình:{" "}
                {(
                  product.reviews.reduce((sum, r) => sum + r.rating, 0) /
                  product.reviews.length
                ).toFixed(1)}{" "}
                ⭐
              </p>
              <span className="text-gray-500 font-light">
                ({product.reviews.length} đánh giá)
              </span>
            </div>

            {product.reviews.map((review) => {
              const reviewReplies = replies.filter(
                (r) => r.reviewId === review.reviewId
              );

              return (
                <div
                  key={review.reviewId}
                  className="border-b border-gray-300 pb-4 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-light text-gray-900">
                      {review.userEmail}
                    </p>
                    <p className="text-yellow-500 text-sm">
                      {"⭐".repeat(review.rating)}
                    </p>
                  </div>
                  <p className="text-gray-700 font-light">{review.comment}</p>
                  <p className="text-xs text-gray-400">
                    {dayjs(review.createdAt).format("DD/MM/YYYY HH:mm")}
                  </p>

                  {/* Replies */}
                  {reviewReplies.length > 0 && (
                    <div className="ml-6 mt-2 space-y-2 border-l pl-3 border-gray-200">
                      {reviewReplies.map((reply) => (
                        <div key={reply.replyId}>
                          <p className="text-sm text-gray-800">
                            <span className="font-light text-gray-900">
                              Phản hồi:
                            </span>{" "}
                            {reply.comment}
                          </p>
                          <p className="text-xs text-gray-400">
                            {dayjs(reply.createdAt).format("DD/MM/YYYY HH:mm")}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 font-light">Chưa có đánh giá nào cho sản phẩm này.</p>
        )}
      </div>
    </div>
  );
};

export default Detail;
