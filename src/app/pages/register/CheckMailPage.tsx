import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setOpenLogin } from "../../../store/uiSlide";

const CheckEmailPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpenLogin(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="max-w-md mx-auto py-10 px-5 text-center">
      <h2 className="text-xl font-bold mb-3">Xác thực email</h2>
      <p className="text-gray-600 mb-5">
        Chúng tôi đã gửi một email xác thực tới địa chỉ của bạn. Vui lòng mở
        email và nhấn vào liên kết để kích hoạt tài khoản.
      </p>
      <p className="text-gray-400 text-sm">
        Bạn sẽ được chuyển đến trang đăng nhập sau 10 giây.
      </p>
    </div>
  );
};

export default CheckEmailPage;
