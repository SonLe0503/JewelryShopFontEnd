import hijean1 from "../../../assets/images/hijean1.jpg";
import hijean2 from "../../../assets/images/hijean2.jpg";
const AboutPage = () => {
    return (
        <>
            {/* Banner */}
            <section className="relative w-full h-[80px] bg-[#d6e6f2] flex items-center justify-center">
                <h1 className="text-4xl md:text-5xl font-light text-[#1c1c1e]">
                    Hi!Jeans – Thời trang tái chế bền vững
                </h1>
            </section>

            {/* Ảnh mặt tiền cửa hàng */}
            <section className="py-10 px-6 md:px-20">
                <img
                    src={hijean1} 
                    alt="Hi!Jeans Store Front"
                    className="rounded-xl shadow-lg mx-auto"
                />
            </section>

            {/* Nội dung giới thiệu */}
            <section className="w-full bg-white py-12 px-6 md:px-20">
                <div className="max-w-4xl mx-auto leading-8 text-[17px] text-gray-700 space-y-6 font-light">
                    
                    <h2 className="text-3xl font-light text-[#1c1c1e] mb-5">Giới thiệu về Hi!Jeans</h2>

                    {/* Company Description */}

                    <p><strong>Loại hình công ty:</strong> Công ty TNHH</p>
                    <p><strong>Tên công ty:</strong> Hi!Jeans Sustainable Fashion Production & Trading Company Limited</p>
                    <p><strong>Địa chỉ:</strong> 160A đường Cầu Giấy, phường Cầu Giấy, thành phố Hà Nội, Việt Nam.</p>

                    <p>
                        Hi!Jeans là thương hiệu thời trang tái chế ra đời vào năm 2025, chuyên sáng tạo và kinh doanh các phụ kiện 
                        thời trang được làm từ chất liệu jeans đã qua sử dụng. Từ những chiếc áo, quần hay váy tưởng chừng đã cũ kỹ, 
                        Hi!Jeans tái sinh chúng thành những sản phẩm độc đáo mang dấu ấn cá nhân như túi xách, ví, mũ, scrunchies, 
                        kẹp tóc và nhiều phụ kiện khác.
                    </p>

                    <p>
                        Hi!Jeans hướng đến việc tái sinh jeans cũ thành những thiết kế hiện đại, độc bản và mang tính bền vững, 
                        lan tỏa lối sống xanh đến người tiêu dùng.
                    </p>

                    {/* Ảnh bên trong cửa hàng */}
                    <div className="py-6">
                        <img
                            src={hijean2}
                            alt="Hi!Jeans Store Interior"
                            className="rounded-xl shadow-lg mx-auto"
                        />
                    </div>

                    {/* Vision */}
                    <strong>Tầm nhìn</strong>

                    <p>
                        Hi!Jeans hướng đến trở thành thương hiệu phụ kiện thời trang tái chế hàng đầu tại Việt Nam trong 5 năm tới, 
                        tiên phong thúc đẩy thời trang tuần hoàn và giảm thiểu rác thải dệt may.
                    </p>

                    <p>
                        Chúng tôi mong muốn xây dựng một hệ sinh thái thời trang xanh, nơi mọi sản phẩm denim cũ đều được tái sinh 
                        thành phụ kiện sáng tạo, chất lượng và bền vững lâu dài.
                    </p>

                    {/* Mission */}
                    <strong>Sứ mệnh</strong>

                    <p>
                        Sứ mệnh của Hi!Jeans là tái định nghĩa thời trang tái chế theo hướng hiện đại, sáng tạo và giàu tính cá nhân. 
                        Chúng tôi tạo ra những sản phẩm thẩm mỹ, mang phong cách riêng của khách hàng – đặc biệt hợp với tinh thần 
                        sống xanh của Gen Z – đồng thời góp phần giảm thiểu rác thải may mặc.
                    </p>

                    <p>
                        Chúng tôi cam kết lan tỏa thói quen tiêu dùng có trách nhiệm, nhìn nhận denim cũ như nguồn tài nguyên quý giá.
                    </p>

                    <p>
                        Trong dài hạn, Hi!Jeans hướng đến việc đưa các sản phẩm thủ công từ denim tái sinh của Việt Nam vươn ra quốc tế, 
                        trở thành đại diện cho sự sáng tạo và phát triển bền vững của thời trang Việt.
                    </p>
                </div>
            </section>
        </>
    );
};

export default AboutPage;
