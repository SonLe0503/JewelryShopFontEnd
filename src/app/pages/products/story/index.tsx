import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionGetAllProducts, selectProducts } from "../../../../store/productSlide";
import { BASE_URL } from "../../../../utils/app";

const ProductStoryPage = () => {
    const dispatch = useDispatch<any>();
    const products = useSelector(selectProducts);

    useEffect(() => {
        dispatch(actionGetAllProducts());
    }, [dispatch]);

    const storyProducts = products.filter((p) => p.story && p.story.trim() !== "");

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
            <div className="max-w-6xl mx-auto px-4 space-y-24 py-10">
                {storyProducts.map((item, index) => (
                    <div
                        key={item.productId}
                        className={`flex flex-col md:flex-row items-center gap-10 
        ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                    >
                        {/* Image with overlay */}
                        <div className="flex md:w-1/2 relative group overflow-hidden rounded-3xl shadow-2xl">
                            <img
                                src={`${BASE_URL}${item.imageUrl}`}
                                alt={item.name}
                                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105 brightness-90 contrast-105"
                            />

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                            {/* Product name */}
                            <h2 className="absolute bottom-6 left-0 right-0 text-center text-white text-2xl md:text-3xl font-light drop-shadow-lg">
                                {item.name}
                            </h2>

                        </div>

                        {/* Story Content */}
                        <div className="md:w-1/2 space-y-4">
                            <p className="text-gray-700 font-light leading-relaxed text-lg">
                                {item.story}
                            </p>

                            <button className="mt-4 px-6 py-3 border-none text-black rounded-full 
    flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-300 text-sm tracking-wide">
                                Xem chi tiết sản phẩm <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                            </button>

                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ProductStoryPage;
