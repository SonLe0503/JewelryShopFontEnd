import { Button, Rate, Spin, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import {
  actionDeleteReview,
  actionGetAllReviews,
  selectReviews,
  selectReviewLoading,
} from "../../../../../store/reviewSlide";
import { actionGetAllReplies, selectReplies } from "../../../../../store/replySlide";
import Condition from "./Condition";
import ReplyModal from "../../../../components/modals/reply/ReplyModal";

const Feedback = () => {
  const dispatch = useAppDispatch();
  const reviews = useAppSelector(selectReviews);
  const loading = useAppSelector(selectReviewLoading);
  const replies = useAppSelector(selectReplies);

  const [searchProduct, setSearchProduct] = useState("");
  const [searchRating, setSearchRating] = useState("");
  const [openReply, setOpenReply] = useState(false);
  const [selectedReview, setSelectedReview] = useState<number | null>(null);

  useEffect(() => {
    dispatch(actionGetAllReviews());
    dispatch(actionGetAllReplies());
  }, [dispatch]);

 const handleDelete = async (reviewId: number) => {
  const isConfirmed = window.confirm("Bạn có chắc muốn xóa feedback này không?");
  if (!isConfirmed) return;

  try {
    await dispatch(actionDeleteReview(reviewId)).unwrap();
    message.success("Xóa feedback thành công!");
  } catch {
    message.error("Không thể xóa feedback!");
  }
};


  const handleReply = (reviewId: number) => {
    setSelectedReview(reviewId);
    setOpenReply(true);
  };

  const hasReply = (reviewId: number) =>
    replies.some((r) => r.reviewId === reviewId);

  const filteredReviews = reviews.filter(
    (r) =>
      r.productName.toLowerCase().replace(/\s+/g, "").includes(
        searchProduct.toLowerCase().replace(/\s+/g, "")
      ) &&
      (searchRating === "" || r.rating.toString() === searchRating)
  );

  return (
    <div className="p-6">
      <Condition
        searchProduct={searchProduct}
        setSearchProduct={setSearchProduct}
        searchRating={searchRating}
        setSearchRating={setSearchRating}
      />

      <h2 className="text-xl font-bold mb-4">Quản lý Feedback khách hàng</h2>

      <div className="border-[0.05px] border-gray-300">
        {/* Header */}
        <div className="grid grid-cols-12 bg-gray-100 font-semibold text-sm text-center">
          <div className="px-3 py-2 col-span-1">ID</div>
          <div className="px-3 py-2 col-span-2">Khách hàng</div>
          <div className="px-3 py-2 col-span-2">Sản phẩm</div>
          <div className="px-3 py-2 col-span-2">Đánh giá</div>
          <div className="px-3 py-2 col-span-2">Bình luận</div>
          <div className="px-3 py-2 col-span-1">Ngày</div>
          <div className="px-3 py-2 col-span-2">Hành động</div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="flex justify-center py-6">
            <Spin />
          </div>
        ) : filteredReviews.length > 0 ? (
          filteredReviews.map((r) => (
            <div
              key={r.reviewId}
              className="grid grid-cols-12 text-center text-sm border-b-[0.05px] border-gray-300"
            >
              <div className="px-3 py-2 font-medium col-span-1">{r.reviewId}</div>
              <div className="px-3 py-2 col-span-2 truncate" title={r.userEmail}>
                {r.userEmail}
              </div>
              <div className="px-3 py-2 col-span-2 truncate" title={r.productName}>
                {r.productName}
              </div>
              <div className="px-3 py-2 flex justify-center items-center col-span-2">
                <Rate disabled defaultValue={r.rating} />
              </div>
              <div className="px-3 py-2 text-left col-span-2 truncate" title={r.comment}>
                {r.comment}
              </div>
              <div className="px-3 py-2 col-span-1">
                {dayjs(r.createdAt).format("DD/MM/YYYY")}
              </div>
              <div className="px-3 py-2 flex gap-2 justify-center col-span-2">
                {!hasReply(r.reviewId) ? (
                  <Button color="gold" variant="outlined" size="small" onClick={() => handleReply(r.reviewId)}>
                    Phản hồi
                  </Button>
                ) : (
                  <Button
                    color="blue"
                    variant="outlined"
                    onClick={() => handleReply(r.reviewId)}
                    size="small"
                  >
                    Đã phản hồi 
                  </Button>
                )}
                <Button color="danger" variant="outlined" size="small" onClick={() => handleDelete(r.reviewId)}>
                  Xóa
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">Không có feedback nào.</div>
        )}
      </div>

      {selectedReview && (
        <ReplyModal
          open={openReply}
          setOpen={setOpenReply}
          reviewId={selectedReview}
        />
      )}
    </div>
  );
};

export default Feedback;
