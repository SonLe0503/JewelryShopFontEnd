/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Modal, Form, Input, Rate, message, Select } from "antd";
import { useAppDispatch } from "../../../../store";
import { useSelector } from "react-redux";
import {
  actionGetOrderDetails,
  selectOrderDetails,
} from "../../../../store/orderDetailSlide";
import { selectInfoLogin } from "../../../../store/authSlide";
import { actionCreateReview } from "../../../../store/reviewSlide";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  orderId: number | null;
}

const FeedbackModal = ({ open, onClose, orderId }: FeedbackModalProps) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const user = useSelector(selectInfoLogin);
  const orderDetails = useSelector(selectOrderDetails);

  useEffect(() => {
    if (orderId && open) {
      dispatch(actionGetOrderDetails(orderId));
    }
  }, [orderId, open, dispatch]);

  useEffect(() => {
  if (orderDetails && orderDetails.length > 0) {
    form.setFieldsValue({
      productId: orderDetails[0].productId,
    });
  }
}, [orderDetails]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!user?.userId) {
        message.warning("Vui lòng đăng nhập trước khi gửi phản hồi!");
        return;
      }

      if (!values.productId) {
        message.warning("Vui lòng chọn sản phẩm muốn đánh giá!");
        return;
      }

      setLoading(true);

      await dispatch(
        actionCreateReview({
          userId: Number(user.userId),
          productId: values.productId,
          rating: values.rating,
          comment: values.content,
        })
      ).unwrap();

      alert("Cảm ơn bạn đã gửi phản hồi!");
      form.resetFields();
      onClose();
    } catch (err: any) {
      if (!err?.errorFields) {
        alert("Gửi phản hồi thất bại, vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Gửi phản hồi đơn hàng #${orderId}`}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Gửi phản hồi"
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        {/* 🟣 Chọn sản phẩm để feedback */}
        <Form.Item
          label="Sản phẩm muốn đánh giá"
          name="productId"
          rules={[{ required: true, message: "Vui lòng chọn sản phẩm!" }]}
        >
          <Select
            placeholder="Chọn sản phẩm trong đơn hàng"
            options={orderDetails?.map((item: any) => ({
              label: item.productName,
              value: item.productId,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Đánh giá"
          name="rating"
          rules={[{ required: true, message: "Vui lòng chọn số sao!" }]}
        >
          <Rate />
        </Form.Item>

        <Form.Item
          label="Nội dung phản hồi"
          name="content"
          rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm này..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FeedbackModal;
