import { useEffect, type ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { logout, selectInfoLogin, selectIsLogin } from "../store/authSlide";
import type { EUserRole } from "../interface/app";
import Login from "../app/pages/login";
import { useAppDispatch } from "../store";
import { setOpenLogin, setOpenProfile } from "../store/uiSlide";
import URL from "../constrants/url";

interface PrivateRouteProps {
  children: ReactNode;
  role?: EUserRole;
}

const PrivateRoute = ({ children, role }: PrivateRouteProps) => {
  const isLogin = useSelector(selectIsLogin);
  const infoLogin = useSelector(selectInfoLogin);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin || !infoLogin.expiresTime) return;

    const currentTime = Date.now() / 1000;
    const timeout = (infoLogin.expiresTime - currentTime) * 1000;

    if (timeout <= 0) {
      handleLogout();
      return;
    }

    const timer = setTimeout(handleLogout, timeout);
    return () => clearTimeout(timer);

    function handleLogout() {
      dispatch(logout());
      localStorage.removeItem("persist:auth");
      dispatch(setOpenProfile(false));
      dispatch(setOpenLogin(true));
      navigate(URL.Home);
    }
  }, [isLogin, infoLogin, dispatch, navigate]);

  useEffect(() => {
    if (!isLogin) {
      dispatch(setOpenLogin(true));
    } else {
      dispatch(setOpenLogin(false));
    }
  }, [isLogin]);

  if (!isLogin) {
    return (
      <>
        <Login />
      </>
    );
  }

  if (role && infoLogin.role !== role) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
};
export default PrivateRoute;
