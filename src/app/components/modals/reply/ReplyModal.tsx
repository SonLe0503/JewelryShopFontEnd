import { Modal, Input, Button, message } from "antd";
import { useState } from "react";
import { useAppDispatch } from "../../../../store";
import { actionCreateReply } from "../../../../store/replySlide";
import { useSelector } from "react-redux";
import { selectMyProfile } from "../../../../store/authSlide";

interface ReplyModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  reviewId: number;
}

const ReplyModal = ({ open, setOpen, reviewId }: ReplyModalProps) => {
  const dispatch = useAppDispatch();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const infoLogin = useSelector(selectMyProfile);

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
          userId: Number(infoLogin?.userId), // ✅ user admin hoặc hệ thống, bạn có thể thay theo user login
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
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            Gửi phản hồi
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReplyModal;
