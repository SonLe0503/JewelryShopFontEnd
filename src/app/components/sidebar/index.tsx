import {
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import URL from "../../../constrants/url";
import { useNavigate } from "react-router-dom";

const items = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: "Dashboard",
    path: "",
  },
  {
    key: "manageAccount",
    icon: <UserOutlined />,
    label: "Manage Account",
    path: URL.ManageAccount,
  },
  {
    key: "manageProduct",
    icon: <ShoppingOutlined />,
    label: "Manage Product",
    path: URL.ManageProduct,
  },
  {
    key: "manageOrder",
    icon: <ShoppingCartOutlined />,
    label: "Manage Order",
    path: URL.ManageOrder,
  },
  {
    key: "manageFeedback",
    icon: <CommentOutlined />,
    label: "Manage Feedback",
    path: URL.ManageFeedack,
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="m-5 w-64 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <div className="p-4 text-xl font-bold border-b-[0.05px] border-gray-300">
          Admin Panel
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          className="border-r-0"
          items={items}
          onClick={(info) => {
            const item = items.find((i) => i.key === info.key);
            if (item) navigate(item.path);
          }}
        />
      </div>
    </>
  );
};
export default Sidebar;
