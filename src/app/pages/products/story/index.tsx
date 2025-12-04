import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionGetAllProducts, selectProducts } from "../../../../store/productSlide";
import { BASE_URL } from "../../../../utils/app";
import { useNavigate } from "react-router-dom";
import URL from "../../../../constrants/url";
const ProductStoryPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const products = useSelector(selectProducts);

    useEffect(() => {
        dispatch(actionGetAllProducts());
    }, [dispatch]);

    // const storyProducts = products.filter((p) => p.story && p.story.trim() !== "");

    return (
        <div className="w-full bg-white">
            {/* Header */}
            <div className="relative w-full py-24 text-center bg-gradient-to-b from-purple-200 via-pink-100 to-white overflow-hidden">
                {/* Decorative circles / shapes */}
                <div className="absolute top-[-50px] left-[-50px] w-72 h-72 bg-purple-300 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute bottom-[-60px] right-[-40px] w-96 h-96 bg-pink-300 rounded-full opacity-20 animate-pulse"></div>

                <div className="relative z-10 max-w-3xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-extralight tracking-wide text-gray-900">
                        Hi!Jeans Product Stories
                    </h1>
                    <p className="text-gray-700 font-light mt-4 text-lg md:text-xl">
                        Khám phá câu chuyện đằng sau mỗi sản phẩm của Hi!Jeans.
                    </p>
                    <p className="mt-4 text-purple-700 italic font-light text-left">
                        “Hi!Jeans tin rằng ẩn sau mỗi chiếc ví, mũ, túi của mình là một linh hồn đang chờ được kể chuyện. Từ những mảnh vải jean cũ kỹ tưởng chừng vô tri, các nghệ nhân đã “thổi hồn” để biến chúng thành phụ kiện thời trang độc đáo. Đặc biệt, mỗi sản phẩm đều đi kèm một thẻ câu chuyện hoặc mã QR độc quyền – như cuốn nhật ký số lưu giữ toàn bộ hành trình tái sinh. Chỉ bằng một lần quét mã, khách hàng có thể tìm hiểu nguồn gốc chiếc jean ban đầu, từng đường kim mũi chỉ trong công đoạn tái chế, ý tưởng thiết kế sáng tạo, thậm chí đọc cả lời nhắn nhủ riêng mà Hi!Jeans gửi gắm đến chủ nhân mới. Cách làm này không chỉ tạo dấu ấn khác biệt cho thương hiệu, mà còn dẫn đầu xu hướng thời trang bền vững: ứng dụng công nghệ để bồi đắp kết nối cảm xúc giữa con người và sản phẩm”
                    </p>
                </div>
            </div>



            {/* Story Sections */}
            {/* Product Grid */}
            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {products.map((item) => (
                        <div
                            key={item.productId}
                            className="relative rounded-3xl overflow-hidden shadow-2xl group"
                        >
                            {/* Ảnh sản phẩm */}
                            <img
                                src={`${BASE_URL}${item.imageUrl}`}
                                alt={item.name}
                                className="w-full h-80 object-cover transform transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Overlay tối nhẹ */}
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all"></div>

                            {/* Tên sản phẩm */}
                            <h2 className="absolute bottom-4 left-0 w-full text-center text-white text-xl font-light drop-shadow-lg">
                                {item.name}
                            </h2>

                            {/* Nút trong ảnh */}
                            {item.story && item.story.trim() !== "" ? (
                                <button className="absolute top-4 right-4 bg-white/90 text-black px-4 py-2 rounded-full text-xs font-medium hover:bg-white transition-all shadow-md"
                                onClick={() => navigate(`${URL.ProductStoryDetailPage.replace(":id", String(item.productId))}`)}
                                >
                                    View Story
                                </button>
                            ) : (
                                <span className="absolute top-4 right-4 bg-gray-300/80 text-gray-700 px-4 py-2 rounded-full text-xs font-medium shadow-md">
                                    Coming Soon…
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>




        </div>
    );
};

export default ProductStoryPage;
