import { Avatar, Divider, Drawer, message } from "antd";
import { MailOutlined, UserOutlined, UploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { logout, selectInfoLogin, selectMyProfile, actionUpdateAvatar, actionGetMyProfile } from "../../../store/authSlide";
import { useAppDispatch } from "../../../store";
import { useEffect } from "react";
import { BASE_URL } from "../../../utils/app";
import { selectOpenProfile, setOpenLogin, setOpenProfile } from "../../../store/uiSlide";
import { useNavigate } from "react-router-dom";
import URL from "../../../constrants/url";
import ChangePassword from "./ChangePassword";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userInfo = useSelector(selectInfoLogin);
  const myProfile = useSelector(selectMyProfile);
  const openProfile = useSelector(selectOpenProfile);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("persist:auth");
    dispatch(setOpenProfile(false));
    dispatch(setOpenLogin(true));
    navigate(URL.Home);
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await dispatch(
        actionUpdateAvatar({
          userId: Number(userInfo.userId),
          file,
        })
      ).unwrap();

      message.success("Cập nhật ảnh đại diện thành công!");
      dispatch(actionGetMyProfile());
    } catch {
      message.error("Cập nhật ảnh thất bại. Vui lòng thử lại!");
    }
  };


  useEffect(() => {
    if (openProfile) {
      dispatch(actionGetMyProfile());
    }
  }, [dispatch, openProfile]);

  return (
    <>
      <Drawer
        title="Thông tin cá nhân"
        placement="right"
        onClose={() => dispatch(setOpenProfile(false))}
        open={openProfile}
        size="default"
        styles={{
          header: {
            fontWeight: "bold",
            borderBottom: "1px solid #f0f0f0",
          },
          body: {
            padding: "20px",
            width: 350, maxWidth: "100%"
          },
        }}
      >
        <div className="flex flex-col items-center text-center">
          <Avatar
            size={100}
            src={myProfile?.avatar ? `${BASE_URL}/${myProfile.avatar}` : undefined}
            icon={!myProfile?.avatar && <UserOutlined />}
            className="bg-gray-300 mb-3"
          />

          {/* Upload Button */}
          <label className="cursor-pointer text-sm text-blue-600 hover:underline">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUploadAvatar}
            />
            <UploadOutlined className="mr-1" />
            Cập nhật ảnh đại diện
          </label>

          <Divider />

          <div className="w-full text-left space-y-3">
            <div className="flex items-center gap-2">
              <MailOutlined className="text-gray-500" />
              <span>{myProfile?.email || userInfo?.email || "Chưa cập nhật"}</span>
            </div>

            {myProfile?.phoneNumber && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">📞</span>
                <span>{myProfile.phoneNumber}</span>
              </div>
            )}
          </div>

          <Divider />
          <ChangePassword />
          <button
            onClick={handleLogout}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            Đăng xuất
          </button>
        </div>
      </Drawer>
    </>
  );
};

export default Profile;
