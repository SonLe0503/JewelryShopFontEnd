import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { actionGetProductById, selectProductDetail } from "../../../../store/productSlide";
import { BASE_URL } from "../../../../utils/app";

const ProductStoryDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch<any>();
    const product = useSelector(selectProductDetail);

    useEffect(() => {
        if (id) dispatch(actionGetProductById(Number(id)));
    }, [dispatch, id]);

    if (!product) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center text-gray-500">
                Đang tải câu chuyện...
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-white py-16">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

                {/* Ảnh bên trái có overlay + animation */}
                <div className="w-full relative group rounded-3xl overflow-hidden shadow-2xl">
                    {/* Image */}
                    <img
                        src={`${BASE_URL}${product.imageUrl}`}
                        alt={product.name}
                        className="w-full h-[550px] object-cover transform transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Overlay tối nhẹ */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all"></div>

                    {/* Gradient ở đáy ảnh */}
                    <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black/40 to-transparent"></div>

                    {/* Tên sản phẩm ở góc dưới */}
                    <h2 className="absolute bottom-6 left-6 text-white text-3xl font-light drop-shadow-lg">
                        {product.name}
                    </h2>
                </div>

                {/* Câu chuyện bên phải */}
                <div className="flex flex-col space-y-6">
                    <h1 className="text-4xl font-light text-gray-900">{product.name}</h1>

                    <p className="text-gray-700 leading-relaxed text-lg font-light whitespace-pre-line">
                        {product.story || "Hiện tại sản phẩm này chưa có câu chuyện."}
                    </p>

                    {!product.story && (
                        <div className="text-gray-500 italic mt-6">
                            Câu chuyện sản phẩm sẽ được cập nhật trong thời gian tới...
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ProductStoryDetailPage;
