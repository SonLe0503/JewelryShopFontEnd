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
                        Product Stories
                    </h1>
                    <p className="text-gray-700 font-light mt-4 text-lg md:text-xl">
                        Khám phá câu chuyện đằng sau mỗi món trang sức.
                    </p>
                    <p className="mt-4 text-purple-700 italic font-light">
                        “Mỗi món trang sức đều mang một câu chuyện riêng…”
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
