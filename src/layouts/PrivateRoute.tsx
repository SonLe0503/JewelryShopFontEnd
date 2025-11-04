import { useEffect, useState, type ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectInfoLogin, selectIsLogin } from "../store/authSlide";
import type { EUserRole } from "../interface/app";
import Login from "../app/pages/login";

interface PrivateRouteProps {
  children: ReactNode;
  role?: EUserRole; // optional nếu chỉ cần check login
}

const PrivateRoute = ({ children, role }: PrivateRouteProps) => {
  const isLogin = useSelector(selectIsLogin);
  const infoLogin = useSelector(selectInfoLogin);
  const [openLogin, setOpenLogin] = useState(false);

  useEffect(() => {
    if (!isLogin) {
      setOpenLogin(true);
    } else {
      setOpenLogin(false);
    }
  }, [isLogin]);

  if (!isLogin) {
    return (
      <>
        <Login openLogin={openLogin} setOpenLogin={setOpenLogin} />
      </>
    );
  }

  if (role && infoLogin.role !== role) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
};
export default PrivateRoute;
