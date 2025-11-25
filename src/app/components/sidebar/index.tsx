import {
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  CommentOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import URL from "../../../constrants/url";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { actionGetMyProfile, selectMyProfile } from "../../../store/authSlide";
import Profile from "../../pages/accounts";
import { setOpenProfile } from "../../../store/uiSlide";
import { useAppDispatch } from "../../../store";
import { BASE_URL } from "../../../utils/app";

const items = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: "Dashboard",
    path: URL.Dashboard,
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
  {
    key: "managePayment",
    icon: <CreditCardOutlined />,
    label: "Payment Transaction",
    path: URL.ManagePayment,
  },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const myProfile = useSelector(selectMyProfile);
  const handleOpenProfile = (val: boolean) => dispatch(setOpenProfile(val));

  const getSelectedKey = () => {
  const item = items.find((i) => i.path === location.pathname);
  return item ? item.key : "dashboard";
};

  useEffect(() => {
    if (!myProfile) {
      dispatch(actionGetMyProfile());
    }
  }, [dispatch, myProfile]);

  return (
    <>
      <motion.div
        animate={{ width: collapsed ? 80 : 250 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 150 }}
        className="h-screen bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] flex flex-col justify-between"
      >
        <div className="flex flex-col flex-1">
          <div
            className="flex justify-center items-center py-6 cursor-pointer"
            onClick={() => handleOpenProfile(true)}
          >
            <motion.div
              animate={{ width: collapsed ? 40 : 60, height: collapsed ? 40 : 60 }}
              transition={{ duration: 0.3 }}
              className="rounded-full overflow-hidden border border-gray-300 bg-gray-200 flex items-center justify-center"
            >
              {myProfile?.avatar ? (
                <img
                  src={`${BASE_URL}${myProfile?.avatar}`}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserOutlined className="text-gray-500 text-xl" />
              )}
            </motion.div>
          </div>

          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            className="border-r-0 flex-1"
            items={items.map((item) => ({
              ...item,
              label: collapsed ? null : item.label,
            }))}
            onClick={(info) => {
              const item = items.find((i) => i.key === info.key);
              if (item) navigate(item.path);
            }}
          />
        </div>

        <div className="flex justify-center items-center p-4 border-t border-gray-200">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </div>
      </motion.div>
      <Profile />
    </>
  );
};

export default Sidebar;
