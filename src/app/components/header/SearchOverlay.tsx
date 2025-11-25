import { Drawer, Input } from "antd";
import { useNavigate } from "react-router-dom";
import type { IProduct } from "../../../store/productSlide";
import URL from "../../../constrants/url";

const { Search } = Input;

interface SearchOverlayProps {
    openSearch: boolean;
    setOpenSearch: (val: boolean) => void;
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    suggestions: IProduct[];
}

const SearchOverlay = ({
    openSearch,
    setOpenSearch,
    searchTerm,
    setSearchTerm,
    suggestions,
}: SearchOverlayProps) => {
    const navigate = useNavigate();

    const handleSearch = (value: string) => {
        const q = value?.trim();
        if (!q) return;
        setOpenSearch(false);
        navigate(`${URL.Product}?q=${encodeURIComponent(q)}`);
    };

    return (
        <Drawer
            placement="top"
            closable={false}
            onClose={() => setOpenSearch(false)}
            open={openSearch}
            styles={{
                body: {
                    padding: 0,
                },
                wrapper: {
                    height: "auto",
                    maxHeight: "90vh",
                },
            }}

        >
            <div className="w-full px-4 py-4 flex justify-center border-b border-gray-200">
                <div className="w-1/2">
                    <Search
                        placeholder="Tìm theo tên sản phẩm..."
                        allowClear
                        enterButton
                        size="large"
                        onSearch={handleSearch}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                        className="[&>.ant-input-group>.ant-input-affix-wrapper]:rounded-none 
                       [&>.ant-input-group>.ant-input-affix-wrapper]:border-black 
                       [&>.ant-input-group>.ant-input-affix-wrapper]:focus-within:border-black 
                       [&>.ant-input-group>.ant-input-group-addon>.ant-btn]:!bg-black 
                       [&>.ant-input-group>.ant-input-group-addon>.ant-btn]:!text-white"
                    />

                    {suggestions.length > 0 && (
                        <div className="mt-2 max-h-60 overflow-auto bg-white border rounded shadow p-2">
                            {suggestions.map((p: IProduct) => (
                                <div
                                    key={p.productId}
                                    className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                                    onClick={() =>
                                        navigate(URL.Detail.replace(":id", p.productId.toString()))
                                    }
                                >
                                    <img
                                        src={p.imageUrl}
                                        alt={p.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium truncate">{p.name}</div>
                                        <div className="text-xs text-gray-500">
                                            {p.price?.toLocaleString?.()} đ
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Drawer>
    );
};

export default SearchOverlay;
