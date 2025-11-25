import { Image, message, Button, Space } from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../../store";
import { actionGetImagesByProductId, actionDeleteProductImage } from "../../../../store/productImageSlide";
import { BASE_URL } from "../../../../utils/app";
import BaseModal from "../BaseModal";

interface ProductImagesModalProps {
    open: boolean;
    onClose: () => void;
    productId: number | null;
    mainImageUrl: string;
}

const ProductImagesModal = ({ open, onClose, productId, mainImageUrl }: ProductImagesModalProps) => {
    const dispatch = useAppDispatch();
    const [images, setImages] = useState<any[]>([]);

    useEffect(() => {
        if (open) {
            setImages([]);
            if (productId) {
                (async () => {
                    try {
                        const res: any = await dispatch(actionGetImagesByProductId(productId)).unwrap();
                        const filtered = res?.filter((img: any) => img.imageUrl !== mainImageUrl) || [];
                        setImages(filtered);
                    } catch {
                        message.error("Lỗi khi tải ảnh sản phẩm!");
                    }
                })();
            }
        }
    }, [open, productId, dispatch, mainImageUrl]);

    const handleDelete = async (id: number) => {
        try {
            await dispatch(actionDeleteProductImage(id)).unwrap();
            setImages(images.filter(img => img.productImageId !== id));
            message.success("Xóa ảnh thành công");
        } catch {
            message.error("Xóa ảnh thất bại");
        }
    };

    return (
        <BaseModal
            title="Ảnh sản phẩm"
            open={open}
            onCancel={onClose}
            width={600}
            cancelText="Đóng"
        >
            <div className="flex flex-wrap gap-4">
                {images.length > 0 ? (
                    images.map((img) => (
                        <div key={img.productImageId} className="flex flex-col items-center gap-1">
                            <Image
                                src={`${BASE_URL}${img.imageUrl}`}
                                width={120}
                                height={120}
                                style={{ objectFit: "cover" }}
                            />
                            <Space>
                                <Button size="small" danger onClick={() => handleDelete(img.productImageId)}>
                                    Xóa
                                </Button>
                            </Space>
                        </div>
                    ))
                ) : (
                    <p>Không có ảnh khác.</p>
                )}
            </div>
        </BaseModal>
    );
};

export default ProductImagesModal;
