/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HeartOutlined,
  MenuOutlined,
  SearchOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import URL from "../../../constrants/url";
import { useSelector, useDispatch } from "react-redux";
import {
  selectInfoLogin,
  selectIsLogin,
} from "../../../store/authSlide";
import { selectProducts } from "../../../store/productSlide";
import {
  selectCollections,
  actionGetAllCollections,
} from "../../../store/collectionSlide";
import { setOpenLogin, setOpenProfile } from "../../../store/uiSlide";
import Login from "../../pages/login";
import Profile from "../../pages/accounts";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import SearchOverlay from "./SearchOverlay";

const Header = () => {
  const [openSearch, setOpenSearch] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLogin = useSelector(selectIsLogin);
  const userInfo = useSelector(selectInfoLogin);
  const products = useSelector(selectProducts);
  const collections = useSelector(selectCollections);

  useEffect(() => {
    dispatch(actionGetAllCollections() as any);
  }, [dispatch]);

  const handleOpenLogin = (val: boolean) => dispatch(setOpenLogin(val));
  const handleOpenProfile = (val: boolean) => dispatch(setOpenProfile(val));

  const handleUserClick = () => {
    if (isLogin) handleOpenProfile(true);
    else handleOpenLogin(true);
  };

  const suggestions = searchTerm
    ? products
      .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 6)
    : [];

  return (
    <>
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* 🔹 Mobile menu */}
          <div className="flex items-center lg:hidden">
            <Button type="text" icon={<MenuOutlined />} onClick={() => setOpenMenu(true)} />
            <a className="ml-2 text-2xl italic font-bold tracking-wider bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 text-transparent bg-clip-text drop-shadow-lg font-[Pacifico]">
              Hi Jean
            </a>


          </div>

          {/* 🔹 Desktop menu */}
          <div className="hidden lg:flex items-center gap-10">
            <DesktopMenu collections={collections} />
          </div>

          {/* 🔹 Icons */}
          <div className="flex items-center gap-4">
            <Button type="text" icon={<SearchOutlined />} onClick={() => setOpenSearch(true)} />
            <Button type="text" icon={<HeartOutlined />} onClick={() => navigate(URL.WishList)} />
            <Button type="text" icon={<ShoppingOutlined />} onClick={() => navigate(URL.Cart)} />
            <Button
              type="text"
              icon={<UserOutlined />}
              onClick={handleUserClick}
              title={isLogin ? userInfo.email : "Đăng nhập"}
            />
          </div>
        </div>
      </div>
      <MobileMenu collections={collections} open={openMenu} onClose={() => setOpenMenu(false)} />

      {/* ✅ Modals */}
      <Login />
      <Profile />

      {/* 🔍 Search Overlay */}
      <SearchOverlay
        openSearch={openSearch}
        setOpenSearch={setOpenSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        suggestions={suggestions}
      />
    </>
  );
};

export default Header;
