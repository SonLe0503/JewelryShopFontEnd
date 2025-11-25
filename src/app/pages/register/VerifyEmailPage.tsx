import { actionVerifyEmail } from "../../../store/authSlide";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store";
import { message } from "antd";
import { setOpenLogin } from "../../../store/uiSlide";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      dispatch(actionVerifyEmail(token))
        .unwrap()
        .then((res) => {
          alert(res.message || "Xác thực email thành công!");
          setLoading(false);
          setTimeout(() => {
            dispatch(setOpenLogin(true));
          }, 3000);
        })
        .catch((err) => {
          message.error(err?.response?.data?.message || "Xác thực thất bại");
          setLoading(false);
        });
    }
  }, [token, dispatch, navigate]);

  return (
    <div className="max-w-md mx-auto py-10 px-5 text-center">
      {loading ? "Đang xác thực email..." : "Bạn sẽ được chuyển đến trang đăng nhập."}
    </div>
  );
};

export default VerifyEmailPage;
