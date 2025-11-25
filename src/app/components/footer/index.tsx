import {
  FacebookFilled,
} from "@ant-design/icons";
import { Button, Flex, Input, Tooltip } from "antd";
import URL from "../../../constrants/url";

const Footer = () => {
  return (
    <>
      <footer className="bg-white text-gray-300 shadow-[0_-2px_6px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-[2fr_2fr_2fr_4fr]  gap-8">
          {/* Cần giúp đỡ */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-lg font-light text-black">Cần giúp đỡ?</h3>
            <div className="font-sans text-[13px]">
              <a href={URL.CustomerOrder} className="text-black hover:text-blue-500">
                Kiểm tra đơn hàng
              </a>
            </div>
            <div className="font-sans text-[13px]">
              <Tooltip
                title={
                  <>
                    - Xin lưu ý rằng sản phẩm có thể chênh lệch 1–2cm do đo lường thủ công. Do đặc thù là túi tái chế, hình ảnh có thể không trùng khớp hoàn toàn với mẫu gốc, tuy nhiên chúng tôi đảm bảo chất lượng sản phẩm luôn đạt tiêu chuẩn cao nhất.<br />
                    - Do màn hình và điều kiện ánh sáng khác nhau, màu sắc thực tế của sản phẩm có thể chênh lệch khoảng 3-5%<br />
                    ❤️ Khi đã nhận hàng mà không hài lòng với sản phẩm, quý khách đừng vội đánh giá cho shop 1 sao, 2 sao. Hãy liên hệ shop để được hỗ trợ nhanh nhất. Nếu hài lòng hãy đánh giá 5 sao, shop sẽ gửi bạn mã giảm giá hấp dẫn cho lần mua hàng tiếp theo.<br />
                    ❤️ Nhà Hi!Jeans chân thành cảm ơn quý khách đã tin tưởng và ủng hộ!
                  </>
                }
                placement="topLeft"
                color="#ffffff" // nền trắng
              >
                <a href="#" className="text-black">
                  Lưu ý khi mua hàng
                </a>
              </Tooltip>
            </div>
            <div className="font-sans text-[13px]">
              <a href="#" className="text-black">
                Liên hệ
              </a>
            </div>
            <div className="font-sans text-[13px]">
              <Tooltip
                title={
                  <>
                    - Hỗ trợ đổi trả trong vòng 7 ngày kể từ ngày nhận hàng.<br />
                    - Nhận đổi trả với sản phẩm bị lỗi kỹ thuật từ nhà sản xuất như dây kéo, đường chỉ, móc khóa…<br />
                    - Bị lỗi do quá trình vận chuyển (khách hàng vui lòng cung cấp hình ảnh hoặc video lúc khui hàng để đối chiếu với bên vận chuyển).<br />
                    - Không nhận đổi trả với sản phẩm đã qua sử dụng.
                  </>
                }
                placement="topLeft"
                color="#ffffff" // nền trắng
              >
                <a href="#" className="text-black hover:text-blue-500">
                  Chính sách đổi trả
                </a>
              </Tooltip>
            </div>
            <div className="font-sans text-[13px]">
              <Tooltip
                title={
                  <>
                    - Nên giặt túi bằng tay để tăng độ bền cho sản phẩm.
                    - Không sử dụng các loại bột giặt có chất tẩy mạnh.
                    - Không để bề mặt sản phẩm cọ xát với các vật cứng, sắc nhọn có thể làm trầy xước, rách vải.
                    - Bảo quản nơi khô ráo, thoáng mát, tránh ẩm mốc và tránh nơi có nhiệt độ cao
                    - Bảo quản sản phẩm trên bề mặt sạch, trên bàn, tránh đặt nơi bẩn.
                    - Khi phơi nên tránh tiếp xúc ánh nắng trực tiếp giúp giữ độ bền màu cho túi.

                  </>
                }
                placement="topLeft"
                color="#ffffff" // nền trắng
              >
                <a href="#" className="text-black ">
                  Hướng dẫn bảo quản
                </a>
              </Tooltip>
            </div>
          </div>

          {/* Về chúng tôi */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-lg font-light text-black">Về chúng tôi</h3>
            <div className="font-sans text-[13px]">
              <a href="#" className="text-black">
                Về thương hiệu
              </a>
            </div>
            <div className="font-sans text-[13px]">
              <a href="#" className="text-black">
                Tuyển dụng
              </a>
            </div>
            <div className="font-sans text-[13px]">
              <a href="#" className="text-black">
                Phát triển bền vững
              </a>
            </div>
            <div className="font-sans text-[13px]">
              <a href="#" className="text-black">
                Tin tức
              </a>
            </div>
          </div>

          {/* Mua sắm */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-lg font-light text-black">Mua sắm</h3>
            <div className="font-sans text-[13px]">
              <a href="#" className="text-black">
                Tìm cửa hàng
              </a>
            </div>
            <div className="font-sans text-[13px]">
              <a href="#" className="text-black">
                Khuyến mãi
              </a>
            </div>
            <div className="font-sans text-[13px]">
              <a href="#" className="text-black">
                Thẻ quà tặng
              </a>
            </div>
            <div className="font-sans text-[13px]">
              <a href="#" className="text-black">
                Hướng dẫn mua sắm
              </a>
            </div>
          </div>

          {/* Kết nối */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-lg font-light text-black">
              Kết nối với chúng tôi
            </h3>
            <div className="flex space-x-4 text-xl">
              <a href="https://www.facebook.com/profile.php?id=61576803284922" className="hover:text-blue-500">
                <FacebookFilled />
              </a>
              <a href="https://www.tiktok.com/@hijeans_?_r=1&_d=secCgYIASAHKAESPgo8jsfU8Tmj%2FAS7MVe%2FlC%2Bcfu1akSkSmHJY4v6yqP7jlSTk6BY%2Ff9TKJgrhxyqltcNguVJjy5jg3ciE1puTGgA%3D&_svg=1&checksum=aac15d1be3e4441e7895f4a00035dac2519d840ca5d6a2516f600bc3f718bd59&item_author_type=1&sec_uid=MS4wLjABAAAA6DwIAnf_yCsOxZeOPcnUmXp0GoOoOLsglTjWqVO0PMQeJbvbg0vXXsj0j3W6cgKn&sec_user_id=MS4wLjABAAAA6DwIAnf_yCsOxZeOPcnUmXp0GoOoOLsglTjWqVO0PMQeJbvbg0vXXsj0j3W6cgKn&share_app_id=1180&share_author_id=6867765839454585858&share_link_id=E401FAFC-C162-4E59-A60F-753E001D5206&share_scene=1&sharer_language=vi&social_share_type=4&source=h5_t&timestamp=1762183882&tt_from=copy&u_code=de8kkh8fme0537&ug_btm=b8727%2Cb0&user_id=6867765839454585858&utm_campaign=client_share&utm_medium=ios&utm_source=copy" className="hover:text-gray-300">
                <span className="font-bold">TikTok</span>
              </a>
            </div>
            <Flex
              vertical
              gap="large"
              className="w-full !border-black"
            >
              <Flex gap={0} style={{ width: "100%" }}>
                <Input placeholder="Nhập mail của bạn" />
                <Button className="!bg-black !text-white !border-black">
                  Submit
                </Button>
              </Flex>
            </Flex>

          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-300 py-4 text-center text-sm text-gray-400">
          © 2025 HiJean. Tất cả quyền được bảo lưu.
        </div>
      </footer>
    </>
  );
};
export default Footer;
