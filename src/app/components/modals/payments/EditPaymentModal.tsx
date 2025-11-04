/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Select, Tag, Descriptions, message, Button } from "antd";
import dayjs from "dayjs";
import { useAppDispatch } from "../../../../store";
import {
  actionUpdateTransactionStatus,
} from "../../../../store/paymentTransactionSlide";
import { useState } from "react";

interface EditPaymentModalProps {
  open: boolean;
  onClose: () => void;
  transactionData: any;
}

const EditPaymentModal = ({
  open,
  onClose,
  transactionData,
}: EditPaymentModalProps) => {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState(transactionData?.paymentStatus || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!transactionData) return;
    setLoading(true);
    try {
      await dispatch(
        actionUpdateTransactionStatus({
          transactionId: transactionData.transactionId,
          status,
        })
      ).unwrap();
      message.success("Cập nhật trạng thái thành công!");
      onClose();
    } catch (err: any) {
      message.error(err || "Cập nhật trạng thái thất bại!");
    } finally {
      setLoading(false);
    }
  };

  if (!transactionData) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={`Chi tiết giao dịch #${transactionData.transactionId}`}
      width={600}
    >
      <div className="p-2">
        <Descriptions bordered size="small" column={1}>
          <Descriptions.Item label="Mã giao dịch">
            {transactionData.transactionId}
          </Descriptions.Item>
          <Descriptions.Item label="Mã đơn hàng">
            {transactionData.orderId}
          </Descriptions.Item>
          <Descriptions.Item label="Số tiền">
            {transactionData.amount.toLocaleString()} đ
          </Descriptions.Item>
          <Descriptions.Item label="Ngày thanh toán">
            {dayjs(transactionData.paymentDate).format("DD/MM/YYYY HH:mm")}
          </Descriptions.Item>
          <Descriptions.Item label="Tổng tiền đơn hàng">
            {transactionData.orderTotalPrice.toLocaleString()} đ
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái đơn hàng">
            <Tag color="blue">{transactionData.orderStatus}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái thanh toán">
            {transactionData.paymentStatus === "Success" ? (
              <Tag color="green">Thành công</Tag>
            ) : transactionData.paymentStatus === "Pending" ? (
              <Tag color="blue">Đang xử lý</Tag>
            ) : (
              <Tag color="red">Thất bại</Tag>
            )}
          </Descriptions.Item>
        </Descriptions>

        <div className="mt-5 flex items-center gap-3">
          <span className="font-medium">Cập nhật trạng thái:</span>
          <Select
            value={status}
            onChange={setStatus}
            className="w-48"
            options={[
              { value: "Success", label: "Thành công" },
              { value: "Pending", label: "Đang xử lý" },
              { value: "Failed", label: "Thất bại" },
            ]}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onClose}>Hủy</Button>
          <Button
            type="primary"
            loading={loading}
            onClick={handleUpdate}
            disabled={status === transactionData.paymentStatus}
          >
            Cập nhật
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditPaymentModal;
