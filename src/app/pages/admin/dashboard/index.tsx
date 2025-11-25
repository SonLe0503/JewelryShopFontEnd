import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Card, Statistic } from "antd";
import {
  actionGetAllUsers,
  selectUsers,
} from "../../../../store/authSlide";
import {
  actionGetAllOrders,
  selectOrder,
} from "../../../../store/orderSlide";
import {
  actionGetAllProducts,
  selectProducts,
} from "../../../../store/productSlide";
import {
  actionGetAllTransactions,
  selectAllTransactions,
} from "../../../../store/paymentTransactionSlide";

import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const dispatch = useDispatch<any>();
  const users = useSelector(selectUsers);
  const orders = useSelector(selectOrder).orders;
  const products = useSelector(selectProducts);
  const transactions = useSelector(selectAllTransactions);

  useEffect(() => {
    dispatch(actionGetAllUsers());
    dispatch(actionGetAllOrders());
    dispatch(actionGetAllProducts());
    dispatch(actionGetAllTransactions());
  }, [dispatch]);

  // Tổng doanh thu dựa trên transactions thành công
  const totalRevenue = transactions
    .filter((t) => t.paymentStatus === "Success")
    .reduce((sum, t) => sum + t.amount, 0);

  // Doanh thu theo tháng
  const revenueByMonth: Record<string, number> = {};
  transactions
    .filter((t) => t.paymentStatus === "Success")
    .forEach((t) => {
      const month = new Date(t.paymentDate).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      revenueByMonth[month] = (revenueByMonth[month] || 0) + t.amount;
    });

  // Top sản phẩm bán chạy
  const productSales: Record<string, number> = {};
  orders.forEach((o) => {
    o.orderDetails.forEach((d) => {
      productSales[d.productName] = (productSales[d.productName] || 0) + d.quantity;
    });
  });
  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Trạng thái đơn hàng
  const orderStatusCount: Record<string, number> = {};
  orders.forEach((o) => {
    orderStatusCount[o.status] = (orderStatusCount[o.status] || 0) + 1;
  });

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="Users" value={users.length} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Orders" value={orders.length} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Revenue"
              value={totalRevenue}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Products" value={products.length} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card title="Revenue By Month">
            <Line
              data={{
                labels: Object.keys(revenueByMonth),
                datasets: [
                  {
                    label: "Revenue",
                    data: Object.values(revenueByMonth),
                    backgroundColor: "rgba(24,144,255,0.5)",
                    borderColor: "rgba(24,144,255,1)",
                    fill: true,
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
              height={300}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Top 5 Products">
            <Bar
              data={{
                labels: topProducts.map((p) => p[0]),
                datasets: [
                  {
                    label: "Quantity Sold",
                    data: topProducts.map((p) => p[1]),
                    backgroundColor: "rgba(255,99,132,0.5)",
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
              height={300}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card title="Order Status">
            <Pie
              data={{
                labels: Object.keys(orderStatusCount),
                datasets: [
                  {
                    label: "Orders",
                    data: Object.values(orderStatusCount),
                    backgroundColor: ["#1890ff", "#52c41a", "#f5222d"],
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
              height={300}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
