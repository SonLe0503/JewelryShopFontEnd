/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Tag } from "antd";
import Condition from "./Condition";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../../../store";
import {
  actionGetAllTransactions,
  selectAllTransactions,
} from "../../../../../store/paymentTransactionSlide";
import EditPaymentModal from "../../../../components/modals/payments/EditPaymentModal";

const ManagePayment = () => {
  const dispatch = useAppDispatch();
  const transactions = useSelector(selectAllTransactions);

  const [searchOrderId, setSearchOrderId] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    dispatch(actionGetAllTransactions());
  }, [dispatch]);

  const handleEdit = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const filteredData = transactions.filter(
    (t) =>
      t.orderId
        ?.toString()
        .toLowerCase()
        .includes(searchOrderId.toLowerCase()) &&
      (searchStatus ? t.paymentStatus === searchStatus : true)
  );

  return (
    <>
      <div className="p-6">
        <Condition
          searchOrderId={searchOrderId}
          setSearchOrderId={setSearchOrderId}
          searchStatus={searchStatus}
          setSearchStatus={setSearchStatus}
        />

        <h2 className="text-xl font-bold mb-4">Quản lý thanh toán</h2>

        {/* MODAL */}
        <EditPaymentModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTransaction(undefined);
          }}
          transactionData={selectedTransaction}
        />

        {/* Table */}
        <div className="border-[0.05px] border-gray-300">
          <div className="grid grid-cols-6 bg-gray-100 font-semibold text-sm text-center">
            <div className="px-3 py-2">Mã giao dịch</div>
            <div className="px-3 py-2">Mã đơn hàng</div>
            <div className="px-3 py-2">Số tiền</div>
            <div className="px-3 py-2">Ngày thanh toán</div>
            <div className="px-3 py-2">Trạng thái</div>
            <div className="px-3 py-2">Hành động</div>
          </div>

          {filteredData.map((t) => (
            <div
              key={t.transactionId}
              className="grid grid-cols-6 text-center text-sm border-b-[0.05px] border-gray-300"
            >
              <div className="px-3 py-2">{t.transactionId}</div>
              <div className="px-3 py-2">{t.orderId}</div>
              <div className="px-3 py-2">{t.amount.toLocaleString()} đ</div>
              <div className="px-3 py-2">
                {dayjs(t.paymentDate).format("DD/MM/YYYY")}
              </div>
              <div className="px-3 py-2 flex justify-center items-center">
                {t.paymentStatus === "Success" ? (
                  <Tag color="green">Thành công</Tag>
                ) : t.paymentStatus === "Pending" ? (
                  <Tag color="blue">Đang xử lý</Tag>
                ) : (
                  <Tag color="red">Thất bại</Tag>
                )}
              </div>
              <div className="px-3 py-2 flex gap-2 justify-center">
                <Button
                  className="!bg-blue-500 !text-white px-3 py-1 rounded"
                  onClick={() => handleEdit(t)}
                >
                  Chi tiết
                </Button>
              </div>
            </div>
          ))}

          {filteredData.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              Không tìm thấy giao dịch phù hợp.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ManagePayment;
