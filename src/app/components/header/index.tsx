import {
  HeartOutlined,
  MenuOutlined,
  SearchOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Input } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import URL from "../../../constrants/url";
import Login from "../../pages/login";
import { useSelector, useDispatch } from "react-redux";
import { selectInfoLogin, selectIsLogin } from "../../../store/authSlide";
import { selectProducts } from "../../../store/productSlide";
import { setOpenLogin, setOpenProfile } from "../../../store/uiSlide";
import type { IProduct } from "../../../store/productSlide";
import Profile from "../../pages/accounts";

const { Search } = Input;

const Header = () => {
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLogin = useSelector(selectIsLogin);
  const userInfo = useSelector(selectInfoLogin);

  const handleOpenLogin = (val: boolean) => dispatch(setOpenLogin(val));
  const handleOpenProfile = (val: boolean) => dispatch(setOpenProfile(val));

  const products = useSelector(selectProducts);
  const suggestions = searchTerm
    ? products
        .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 6)
    : [];

  const handleSearch = (value: string) => {
    const q = value?.trim();
    if (!q) return;
    setOpenSearch(false);
    navigate(`${URL.Product}?q=${encodeURIComponent(q)}`);
  };

  const handleUserClick = () => {
    if (isLogin) {
      handleOpenProfile(true);
    } else {
      handleOpenLogin(true);
    }
  };

  return (
    <>
      <div className="sticky top-0 z-50 shadow-md">
        <div className="flex w-full bg-white p-2">
          <div className="flex w-full justify-between">
            {/* Mobile menu */}
            <div className="flex items-center lg:hidden">
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setOpen(true)}
              />
              <a href="#" className="">
                FASHION
              </a>
            </div>

            {/* Menu desktop */}
            <div className="hidden lg:flex gap-8 items-center">
              {[
                { label: "Trang chủ", href: URL.Home },
                { label: "Sản phẩm", href: URL.Product },
                { label: "Khuyến mãi", href: `${URL.Product}?discount=true` },
                { label: "Về chúng tôi", href: "#about" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="uppercase text-gray-700 hover:text-black text-sm font-medium"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Icons */}
            <div className="flex gap-4 text-lg">
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

          <Drawer
            title="Menu"
            placement="left"
            onClose={() => setOpen(false)}
            open={open}
          >
            <div className="flex flex-col gap-4">
              {[
                { label: "Trang chủ", href: URL.Home },
                { label: "Sản phẩm", href: URL.Product },
                { label: "Khuyến mãi", href: `${URL.Product}?discount=true` },
                { label: "Về chúng tôi", href: "#about" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-black"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </Drawer>
        </div>
      </div>

      {/* ✅ Dùng Redux state */}
      <Login />
      <Profile />

      {/* Drawer Search */}
      <Drawer
        placement="top"
        closable={false}
        onClose={() => setOpenSearch(false)}
        open={openSearch}
        bodyStyle={{ padding: 0 }}
        contentWrapperStyle={{
          height: "auto",
          maxHeight: "90vh",
        }}
      >
        <div className="w-full px-4 py-4 flex justify-center border-b border-gray-200 border-0.2">
          <div className="w-1/2">
            <Search
              placeholder="Tìm theo tên sản phẩm..."
              allowClear
              enterButton
              size="large"
              onSearch={handleSearch}
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              className="[&>.ant-input-group>.ant-input-affix-wrapper]:rounded-none [&>.ant-input-group>.ant-input-affix-wrapper]:border-black [&>.ant-input-group>.ant-input-affix-wrapper]:focus-within:border-black [&>.ant-input-group>.ant-input-group-addon>.ant-btn]:!bg-black [&>.ant-input-group>.ant-input-group-addon>.ant-btn]:!text-white"
            />

            {suggestions.length > 0 && (
              <div className="mt-2 max-h-60 overflow-auto bg-white border rounded shadow p-2">
                {suggestions.map((p: IProduct) => (
                  <div
                    key={p.productId}
                    className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => navigate(URL.Detail.replace(":id", p.productId.toString()))}
                  >
                    <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <div className="text-sm font-medium truncate">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.price?.toLocaleString?.()} đ</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Header;
