/* eslint-disable @typescript-eslint/no-explicit-any */
import { Route, Routes } from "react-router-dom";
import { ADMIN_LAYOUT, DEFAULT_LAYOUT } from "../constrants/layout";
import { lazy, Suspense } from "react";
import DefaultLayout from "./DefaultLayout";
import URL from "../constrants/url";
import Adminlayout from "./Adminlayout";
import PrivateRoute from "./PrivateRoute";
import { EUserRole } from "../interface/app";


const Home = lazy(() => import("../app/pages/home"))
const Cart = lazy(() => import("../app/pages/cart"))
const Product = lazy(() => import("../app/pages/products"))
const Detail = lazy(() => import("../app/pages/products/detail"))
const Register = lazy(() => import("../app/pages/register"))
const WishList = lazy(() => import("../app/pages/wishlist"))
const ManageAccount = lazy(() => import("../app/pages/admin/manage/accounts"))
const ManageProduct = lazy(() => import("../app/pages/admin/manage/products"))
const ManageOrder = lazy(() => import("../app/pages/admin/manage/orders"))
const ManageFeedback = lazy(() => import("../app/pages/admin/manage/feedbacks"))
const ManagePayment = lazy(() => import("../app/pages/admin/manage/paymentTransactions"))
const CustomerOrder = lazy(() => import("../app/pages/orders"))
const VerifyEmailPage = lazy(() => import("../app/pages/register/VerifyEmailPage"))
const CheckMail = lazy(() => import("../app/pages/register/CheckMailPage"))
const ForgotPassword = lazy(() => import("../app/pages/login/ForgotPassword"))
const Dashboard = lazy(() => import("../app/pages/admin/dashboard"))
const AboutPage = lazy(() => import("../app/pages/about"))
const ProductStoryPage = lazy(() => import("../app/pages/products/story"))
const shareResourceItem = [
  {
    key: URL.Register,
    element: <Register/>,
    layout: DEFAULT_LAYOUT,
    private: false,
  },
  {
    key: URL.Home,
    element: <Home />,
    layout: DEFAULT_LAYOUT,
    private: false,
  },
  {
    key: URL.Cart,
    element: <Cart/>,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: URL.Product,
    element: <Product/>,
    layout: DEFAULT_LAYOUT,
    private: false,
  },
  {
    key: URL.Detail,
    element: <Detail/>,
    layout: DEFAULT_LAYOUT,
    private: false,
  },
  {
    key: URL.WishList,
    element: <WishList/>,
    layout: DEFAULT_LAYOUT,
    private: false,
  },
  {
    key: URL.CustomerOrder,
    element: <CustomerOrder/>,
    layout: DEFAULT_LAYOUT,
    private: true,
  },
  {
    key: URL.VerifiEmail,
    element: <VerifyEmailPage />,
    layout: DEFAULT_LAYOUT,
    private: false, 
  },
  {
    key: URL.CheckMail,
    element: <CheckMail/>,
    layout: DEFAULT_LAYOUT,
    private: false,
  },
  {
    key: URL.ForgotPassword,
    element: <ForgotPassword/>,
    layout: DEFAULT_LAYOUT,
    private: false,
  },
  {
    key: URL.AboutPage,
    element: <AboutPage/>,
    layout: DEFAULT_LAYOUT,
    private: false,
  },
  {
    key: URL.ProductStoryPage,
    element: <ProductStoryPage/>,
    layout: DEFAULT_LAYOUT,
    private: false,
  }
];
const privateResourceItem = [
  {
    key: URL.Dashboard,
    element: <Dashboard/>,
    layout: ADMIN_LAYOUT,
    private: true,
  },
  {
    key:URL.ManageAccount,
    element: <ManageAccount/>,
    layout: ADMIN_LAYOUT,
    private: true,
  },
  {
    key: URL.ManageProduct,
    element: <ManageProduct/>,
    layout: ADMIN_LAYOUT,
    private: true,
  },
  {
    key: URL.ManageOrder,
    element: <ManageOrder/>,
    layout: ADMIN_LAYOUT,
    private: true,
  },
  {
    key: URL.ManageFeedack,
    element: <ManageFeedback/>,
    layout: ADMIN_LAYOUT,
    private: true,
  },
  {
    key: URL.ManagePayment,
    element: <ManagePayment/>,
    layout: ADMIN_LAYOUT,
    private: true,
  }
]

const menus = [...shareResourceItem, ...privateResourceItem];


const Routers = () => {
  return (
    <Routes>
    {menus.map((menu: any) => {
      let element = menu.element;
      element = <Suspense fallback={null}>{element}</Suspense>;
      if(menu.private){
        if (menu.layout === ADMIN_LAYOUT) {
          element = (
            <PrivateRoute role={EUserRole.ADMIN}>
              {element}
            </PrivateRoute>
          );
        } else {
          element = (
            <PrivateRoute>
              {element}
            </PrivateRoute>
          );
        }
      }
      if (menu.layout === ADMIN_LAYOUT) {
        element = <Adminlayout>{element}</Adminlayout>
      }
      if (menu.layout === DEFAULT_LAYOUT) {
        element = <DefaultLayout>{element}</DefaultLayout>;
      }
      return <Route key={menu.key} path={menu.key} element={element} />
    })}
  </Routes>
  )
}
export default Routers;