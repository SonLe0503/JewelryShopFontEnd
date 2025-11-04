import { Button, Carousel } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

const Detail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const product = useSelector(selectProductDetail);
  const replies = useSelector(selectReplies);

  const [currentIndex, setCurrentIndex] = useState(0);

  // 🟢 Lấy chi tiết sản phẩm
  useEffect(() => {
    if (id) {
      dispatch(actionGetProductById(Number(id)));
    }
  }, [id, dispatch]);

  // 🟢 Lấy tất cả replies 1 lần
  useEffect(() => {
    dispatch(actionGetAllReplies());
  }, [dispatch]);

  // 🟢 Reset carousel khi load sản phẩm
  useEffect(() => {
    if (product?.productImages?.length) {
      setCurrentIndex(0);
    }
  }, [product]);

  return (
    <div className="w-full min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr_2fr] gap-8">
        {/* Thumbnails + Carousel */}
        <div className="flex flex-col md:flex-row gap-6 order-2 md:order-1 md:col-span-1">
          <div className="hidden md:flex md:flex-col gap-3">
            {(product?.productImages?.length
              ? product.productImages
              : [product?.imageUrl]
            ).map((img, idx) => {
              const src = img?.startsWith("http") ? img : `${BASE_URL}${img}`;
              return (
                <img
                  key={idx}
                  src={src}
                  alt={`thumb-${idx}`}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                    currentIndex === idx ? "border-black" : "border-gray-200"
                  }`}
                />
              );
            })}
          </div>

          <div className="flex-1 md:col-span-2">
            {(() => {
              const images = product?.productImages?.length
                ? product.productImages
                : [product?.imageUrl];
              const len = images.length;
              const displayed = images
                .slice(currentIndex)
                .concat(images.slice(0, currentIndex));
              return (
                <Carousel
                  dots={false}
                  beforeChange={(_, next) =>
                    setCurrentIndex((currentIndex + next) % len)
                  }
                >
                  {displayed.map((img, idx) => {
                    const src = img?.startsWith("http")
                      ? img
                      : `${BASE_URL}${img}`;
                    return (
                      <div
                        key={idx}
                        className="flex justify-center items-center"
                      >
                        <img
                          src={src}
                          alt={`slide-${idx}`}
                          className="w-full h-[500px] object-cover rounded-lg shadow"
                        />
                      </div>
                    );
                  })}
                </Carousel>
              );
            })()}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="order-3 flex-1 flex flex-col gap-6">
          <div>
            <h3 className="text-sm text-black uppercase tracking-wide">
              {product?.categoryName}
            </h3>
            <h1 className="text-3xl font-extrabold text-black leading-tight mt-2">
              {product?.name}
            </h1>
            <p className="text-2xl font-bold mt-3 text-black">
              {product?.price.toLocaleString("vi-VN")} ₫
            </p>
            {product?.stockQuantity === 0 ? (
              <p className="text-red-500 mt-2">Hết hàng</p>
            ) : (
              <p className="text-gray-600 mt-2">
                Còn {product?.stockQuantity} sản phẩm
              </p>
            )}
          </div>

          <div className="text-black leading-relaxed">
            {product?.description}
          </div>

          <div className="flex gap-4">
            <Button
              type="primary"
              className="!bg-black !border-black !text-white"
              size="large"
            >
              THÊM VÀO GIỎ
            </Button>
            <Button size="large" className="!text-black">
              LƯU VÀO YÊU THÍCH
            </Button>
          </div>
        </div>
      </div>

      {/* Đánh giá + Reply */}
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-bold mb-6">Đánh giá & Nhận xét</h2>

        {product?.reviews && product.reviews.length > 0 ? (
          <div className="space-y-6">
            {/* Tổng quan */}
            <div className="flex items-center gap-3 border-b pb-4">
              <p className="text-lg font-semibold">
                Trung bình:{" "}
                {(
                  product.reviews.reduce((sum, r) => sum + r.rating, 0) /
                  product.reviews.length
                ).toFixed(1)}{" "}
                ⭐
              </p>
              <span className="text-gray-500">
                ({product.reviews.length} đánh giá)
              </span>
            </div>

            {/* Danh sách review */}
            {product.reviews.map((review) => {
              const reviewReplies = replies.filter(
                (r) => r.reviewId === review.reviewId
              );

              return (
                <div
                  key={review.reviewId}
                  className="border-b pb-4 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">
                      {review.userEmail}
                    </p>
                    <p className="text-yellow-500 text-sm">
                      {"⭐".repeat(review.rating)}
                    </p>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                  <p className="text-xs text-gray-400">
                    {dayjs(review.createdAt).format("DD/MM/YYYY HH:mm")}
                  </p>

                  {/* Replies */}
                  {reviewReplies.length > 0 && (
                    <div className="ml-6 mt-2 space-y-2 border-l pl-3 border-gray-200">
                      {reviewReplies.map((reply) => (
                        <div key={reply.replyId}>
                          <p className="text-sm text-gray-800">
                            <span className="font-semibold text-gray-900">
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
          <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>
        )}
      </div>
    </div>
  );
};

export default Detail;
