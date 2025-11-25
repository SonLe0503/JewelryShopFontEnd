import { Dropdown } from "antd";
import {
  HomeOutlined,
  AppstoreOutlined,
  TagsOutlined,
  InfoCircleOutlined,
  BookOutlined,
} from "@ant-design/icons";
import URL from "../../../constrants/url";
import CollectionMenu from "./CollectionMenu";
import { useState } from "react";

const DesktopMenu = ({ collections }: { collections: any[] }) => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { label: "Trang chủ", href: URL.Home, icon: <HomeOutlined /> },
    { label: "Sản phẩm", href: URL.Product, icon: <AppstoreOutlined /> },
    { label: "Khuyến mãi", href: `${URL.Product}?discount=true`, icon: <TagsOutlined /> },
    { label: "Về chúng tôi", href: URL.AboutPage, icon: <InfoCircleOutlined /> },
    { label: "Câu chuyện sản phẩm", href: URL.ProductStoryPage, icon: <BookOutlined/> },
  ];

  return (
    <>
      {menuItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="uppercase !text-gray-600 hover:!text-black transition-colors duration-200 text-sm font-medium relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-black after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300"
        >
          {item.label}
        </a>
      ))}

      <Dropdown
        open={open}
        onOpenChange={setOpen}
        popupRender={() => (
          <CollectionMenu collections={collections} onClose={() => setOpen(false)} />
        )}
        trigger={["click"]}
      >
        <div className="uppercase !text-gray-600 hover:!text-black transition-colors duration-200 text-sm font-medium flex items-center gap-1 cursor-pointer relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-black after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300">
          Các bộ sưu tập
        </div>
      </Dropdown>
    </>
  );
};

export default DesktopMenu;
