import { Modal, Input, Button, message } from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { actionCreateReply, selectReplies } from "../../../../store/replySlide";
import { selectMyProfile } from "../../../../store/authSlide";

interface ReplyModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  reviewId: number;
}

const ReplyModal = ({ open, setOpen, reviewId }: ReplyModalProps) => {
  const dispatch = useAppDispatch();
  const replies = useAppSelector(selectReplies);
  const infoLogin = useAppSelector(selectMyProfile);

  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingReply, setExistingReply] = useState<string | null>(null);

  // 🟢 Kiểm tra xem review đã có reply chưa
  useEffect(() => {
    const reply = replies.find((r) => r.reviewId === reviewId);
    if (reply) setExistingReply(reply.comment);
    else setExistingReply(null);
  }, [reviewId, replies]);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      message.warning("Vui lòng nhập nội dung phản hồi.");
      return;
    }

    try {
      setLoading(true);
      await dispatch(
        actionCreateReply({
          reviewId,
          userId: Number(infoLogin?.userId),
          comment,
        })
      ).unwrap();
      message.success("Gửi phản hồi thành công!");
      setComment("");
      setOpen(false);
    } catch {
      message.error("Không thể gửi phản hồi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      title="Phản hồi khách hàng"
      footer={null}
      centered
    >
      <div className="flex flex-col gap-4">
        <Input.TextArea
          rows={4}
          placeholder="Nhập nội dung phản hồi..."
          value={existingReply ?? comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={!!existingReply} // nếu đã có reply thì disabled
        />

        <div className="flex justify-end gap-2">
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          {!existingReply && (
            <Button type="primary" loading={loading} onClick={handleSubmit}>
              Gửi phản hồi
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ReplyModal;
