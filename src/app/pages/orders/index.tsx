/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Table, Tag, Button, message } from "antd";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../store";
import {
    selectOrder,
    actionGetOrdersByUser,
    type IOrder,
} from "../../../store/orderSlide";
import {
    selectInfoLogin,
    selectMyProfile,
    actionGetMyProfile,
} from "../../../store/authSlide";
import dayjs from "dayjs";
import OrderDetailModal from "../../components/modals/orders";
import FeedbackModal from "../../components/modals/feedbacks/FeedbackModal";
import type { IReview } from "../../../store/productSlide";
import { actionGetReviewsByUser, selectReviews } from "../../../store/reviewSlide";

export const hasUserReviewedOrder = (order: IOrder, reviews: IReview[]): boolean => {
    if (!order.orderDetails || order.orderDetails.length === 0) return false;
    const productIdsInOrder = order.orderDetails.map((od) => od.productId);
    const reviewedProductIds = reviews.map((r) => r.productId);
    return productIdsInOrder.every((pid) => reviewedProductIds.includes(pid));
};


const OrderTracking = () => {
    const dispatch = useAppDispatch();
    const { orders, loading } = useSelector(selectOrder);
    const users = useSelector(selectInfoLogin);
    const profile = useSelector(selectMyProfile);
    const reviews = useSelector(selectReviews);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

    const handleOpenModal = (order: IOrder) => {
        const orderWithUserInfo = {
            ...order,
            email: profile?.email,
            phoneNumber: profile?.phoneNumber,
        };
        setSelectedOrder(orderWithUserInfo);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const handleOpenFeedback = (orderId: number) => {
        setSelectedOrderId(orderId);
        setIsFeedbackOpen(true);
    };

    const handleCloseFeedback = () => {
        setIsFeedbackOpen(false);
        setSelectedOrderId(null);
    };

    useEffect(() => {
        if (users?.accessToken) {
            dispatch(actionGetMyProfile());
            dispatch(actionGetReviewsByUser(Number(users.userId)));
        }
    }, [users, dispatch]);

    useEffect(() => {
        if (users?.userId) {
            dispatch(actionGetOrdersByUser(Number(users.userId)));
        } else {
            message.warning("Vui lòng đăng nhập để xem đơn hàng của bạn");
        }
    }, [users, dispatch]);


    const columns = [
        {
            title: "Mã đơn hàng",
            dataIndex: "orderId",
            key: "orderId",
            render: (id: number) => <span className="font-medium">#{id}</span>,
        },
        {
            title: "Ngày đặt",
            dataIndex: "orderDate",
            key: "orderDate",
            render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (price: number) => price.toLocaleString() + " ₫",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                let color = "default";
                if (status === "Pending") color = "orange";
                if (status === "Paid") color = "blue";
                if (status === "Shipping") color = "purple"
                if (status === "Cancelled") color = "red";
                if (status === "Completed") color = "green";
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: "Phương thức thanh toán",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
            render: (method: string) => (
                <span>
                    {method === "COD" ? "Thanh toán khi nhận hàng" : "Chuyển khoản QR"}
                </span>
            ),
        },
        {
            title: "Chi tiết",
            key: "details",
            render: (_: any, record: IOrder) => {
                const hasReviewed = hasUserReviewedOrder(record, reviews);
                return (
                    <div className="flex gap-2">
                        <Button type="primary" onClick={() => handleOpenModal(record)}>
                            Xem chi tiết
                        </Button>
                        {record.status === "Completed" && !hasReviewed && (
                            <Button
                                type="default"
                                danger
                                onClick={() => handleOpenFeedback(record.orderId)}
                            >
                                Feedback
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <div className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-semibold mb-6">Theo dõi đơn hàng của bạn</h1>

                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="orderId"
                    loading={loading}
                    pagination={{ pageSize: 5 }}
                    bordered
                />
                <OrderDetailModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    orderData={selectedOrder}
                />
            </div>
            <FeedbackModal
                open={isFeedbackOpen}
                onClose={handleCloseFeedback}
                orderId={selectedOrderId}
            />

        </>

    );
};

export default OrderTracking;
