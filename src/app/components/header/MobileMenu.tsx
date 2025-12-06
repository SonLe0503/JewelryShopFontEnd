import { Drawer, Collapse } from "antd";
import {
  AppstoreOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  TagsOutlined,
  StarOutlined,
  BookOutlined,
  DownOutlined,
} from "@ant-design/icons";
import URL from "../../../constrants/url";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface MobileMenuProps {
  collections: any[];
  open: boolean;
  onClose: () => void;
}

const MobileMenu = ({ collections, open, onClose }: MobileMenuProps) => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState<string[]>([]);

  const menuItems = [
    { label: "Trang chủ", href: URL.Home, icon: <HomeOutlined /> },
    { label: "Sản phẩm", href: URL.Product, icon: <AppstoreOutlined /> },
    { label: "Khuyến mãi", href: `${URL.Product}?discount=true`, icon: <TagsOutlined /> },
    { label: "Về chúng tôi", href: URL.AboutPage, icon: <InfoCircleOutlined /> },
    { label: "Câu chuyện sản phẩm", href: URL.ProductStoryPage, icon: <BookOutlined /> },
  ];

  return (
    <Drawer
      title={<div className="font-bold text-black uppercase">Menu</div>}
      placement="left"
      onClose={onClose}
      open={open}
      styles={{
        header: {
          fontWeight: "bold",
          borderBottom: "1px solid #f0f0f0",
          color: "#000",
          fontFamily: "inherit",
        },
        body: {
          padding: "20px",
          color: "#000",
          fontFamily: "inherit",
        },
      }}
    >
      <div className="flex flex-col text-black font-sans">
        {/* Menu chính */}
        {menuItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex gap-3 px-4 py-3 text-gray-700 !text-gray-700 uppercase text-sm font-medium transition-colors hover:text-black hover:bg-gray-50 rounded"
            onClick={onClose}
          >
            {item.icon}
            {item.label}
          </a>
        ))}

        {/* Collapse Collections */}
        <Collapse
          ghost
          activeKey={activeKey}
          onChange={(key) => setActiveKey(key as string[])}
          expandIcon={() => null}
          styles={{
            header: {
              justifyContent: "space-between",
            },
          }}

          items={[
            {
              key: "collections",
              label: (
                <div className="flex items-center gap-3 text-gray-700 uppercase text-sm font-medium">
                  <StarOutlined />
                  Các bộ sưu tập
                  <DownOutlined
                    className={`transition-transform duration-200 ${activeKey.includes("collections") ? "rotate-180" : ""
                      }`}
                  />
                </div>
              ),
              children: (
                <div>
                  {collections
                  .filter((c) => c.status === "Active")
                  .map((c, index) => (
                    <div
                      key={c.id ?? index}
                      onClick={() => {
                        navigate(`${URL.Product}?collectionId=${c.id}`);
                        onClose();
                      }}
                      className="block px-2 py-2 text-gray-700 !text-gray-700 text-sm font-normal rounded cursor-pointer hover:bg-gray-50 hover:text-black transition-colors"
                    >
                      {c.name}
                    </div>

                  ))}
                </div>
              ),
            },
          ]}
        />

      </div>
    </Drawer>
  );
};

export default MobileMenu;
