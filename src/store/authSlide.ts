/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { jwtDecode } from "jwt-decode";

import { EUserRole, type DynamicKeyObject } from "../interface/app";
import { request } from "../utils/request";

import type { RootState } from "./index";
import { message } from "antd";

interface IInfoLogin {
  accessToken: string;
  role: EUserRole;
  email: string;
  userId: string;
  expiresTime: number;
}

export interface IUser {
  userId: number;
  email: string;
  phoneNumber: string;
  role: EUserRole;
  createdAt: string;
  avatar: string | null;
  status: string | null;
}


type IInitialState = {
  infoLogin: IInfoLogin;
  isLogin: boolean;
  emailResend: {
    isCountDown: boolean;
    remaining: number;
  };
  users: IUser[];
  myProfile: IUser | null;
};

const initialState: IInitialState = {
  infoLogin: {
    accessToken: "",
    role: EUserRole.CUSTOMER,
    email: "",
    userId: "",
    expiresTime: 0,
  },
  isLogin: false,
  emailResend: {
    isCountDown: false,
    remaining: 0,
  },
  users: [],
  myProfile: null,
};

// ======================= VERIFY EMAIL =======================
export const actionVerifyEmail = createAsyncThunk(
  "auth/actionVerifyEmail",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await request({
        url: `/Auth/VerifyEmail?token=${token}`,
        method: "GET",
      });
      return response.data; // { message: "Email verified successfully" }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// ======================= FORGOT PASSWORD =======================
export const actionForgotPassword = createAsyncThunk(
  "auth/actionForgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await request({
        url: `/Auth/ForgotPassword`,
        method: "POST",
        data: { email },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


export const actionLogin = createAsyncThunk(
  "auth/actionLogin",
  async (data: DynamicKeyObject, { rejectWithValue }) => {
    const { ...payload } = data;
    try {
      return await request({
        url: `/Auth/Login`,
        method: "POST",
        data: payload,
      })
    } catch (error) {
      return rejectWithValue(error);
    }
  }
)

// ======================= GOOGLE LOGIN =======================
export const actionGoogleLogin = createAsyncThunk(
  "auth/actionGoogleLogin",
  async (idToken: string, { rejectWithValue }) => {
    try {
      const response = await request({
        url: `/Auth/GoogleLogin/Google`, // ✅ khớp backend endpoint
        method: "POST",
        data: { id_token: idToken },
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


export const actionRegister = createAsyncThunk(
  "auth/actionRegister",
  async (data: DynamicKeyObject, { rejectWithValue }) => {
    try {
      const response = await request({
        url: `/Auth/Register`,
        method: "POST",
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// ======================= GET ALL USERS =======================
export const actionGetAllUsers = createAsyncThunk(
  "auth/actionGetAllUsers",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.infoLogin?.accessToken;
      const response = await request({
        url: `/Auth/GetAllUsers`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data as IUser[];
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
// ======================= GET MY PROFILE =======================
export const actionGetMyProfile = createAsyncThunk(
  "auth/actionGetMyProfile",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.infoLogin?.accessToken;
      const response = await request({
        url: `/Auth/GetMyProfile`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data as IUser;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// ======================= UPDATE USER =======================
export const actionUpdateUser = createAsyncThunk(
  "auth/actionUpdateUser",
  async (
    { userId, data }: { userId: number; data: DynamicKeyObject },
    { rejectWithValue, getState }
  ) => {
    try {
      const state: any = getState();
      const token = state.auth.infoLogin?.accessToken;
      const response = await request({
        url: `/Auth/UpdateUser/${userId}`,
        method: "PUT",
        data,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.user as IUser;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// ======================= DELETE USER =======================
export const actionDeleteUser = createAsyncThunk(
  "auth/actionDeleteUser",
  async (userId: number, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.infoLogin?.accessToken;
      await request({
        url: `/Auth/DeleteUser/${userId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return userId;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// ======================= UPDATE AVATAR =======================
export const actionUpdateAvatar = createAsyncThunk(
  "auth/actionUpdateAvatar",
  async (
    { userId, file }: { userId: number; file: File },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await request({
        url: `/Auth/UpdateAvatar/${userId}`,
        method: "PUT",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);



export const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.infoLogin = initialState.infoLogin;
      state.isLogin = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(actionLogin.fulfilled, (state, action) => {
      const token = action.payload?.data?.token ?? "";
      if (token) {
        const decodedToken: any = jwtDecode(token);
        state.infoLogin = {
          ...state.infoLogin,
          accessToken: token,
          role: decodedToken["role"],        // "Admin" | "Customer"
          email: decodedToken["email"],
          userId: decodedToken["nameid"],
          expiresTime: decodedToken["exp"],  // số giây từ epoch
        };
        state.isLogin = true;
      }
    })
      .addCase(actionLogin.rejected, (state) => {
        state.infoLogin = initialState.infoLogin;
        state.isLogin = false;
      });
    builder.addCase(actionGoogleLogin.fulfilled, (state, action) => {
      const token = action.payload?.data?.token ?? "";
      if (token) {
        const decodedToken: any = jwtDecode(token);
        state.infoLogin = {
          ...state.infoLogin,
          accessToken: token,
          role: decodedToken["role"],
          email: decodedToken["email"],
          userId: decodedToken["nameid"],
          expiresTime: decodedToken["exp"],
        };
        state.isLogin = true;
      }
    })
      .addCase(actionGoogleLogin.rejected, (state) => {
        state.infoLogin = initialState.infoLogin;
        state.isLogin = false;
      });
    // === actionRegister ===
    builder
      .addCase(actionRegister.rejected, (state) => {
        state.infoLogin = initialState.infoLogin;
        state.isLogin = false;
      });

    // === actionVerifyEmail ===
    builder
      .addCase(actionVerifyEmail.fulfilled, (state) => {
        // Xác thực thành công → cập nhật trạng thái myProfile nếu có
        if (state.myProfile) {
          state.myProfile.status = "Active";
        }
        state.emailResend.isCountDown = false;
      })
      .addCase(actionVerifyEmail.rejected, (state, action) => {
        state.emailResend.isCountDown = false;
        console.error("Verify email failed", action.payload);
      });

    builder
      .addCase(actionForgotPassword.fulfilled, (_, action) => {
        message.success(action.payload?.message || "Gửi email thành công");
      })
      .addCase(actionForgotPassword.rejected, (_, action: any) => {
        message.error(action.payload?.message || "Gửi email thất bại");
      });


    // ======================= GET ALL USERS =======================
    builder
      .addCase(actionGetAllUsers.fulfilled, (state, action) => {
        state.users = action.payload ?? [];
      })
      .addCase(actionGetAllUsers.rejected, (state) => {
        state.users = [];
      });

    // ======================= GET MY PROFILE =======================
    builder
      .addCase(actionGetMyProfile.fulfilled, (state, action) => {
        state.myProfile = action.payload;
      })
      .addCase(actionGetMyProfile.rejected, (state) => {
        state.myProfile = null;
      });

    // ======================= UPDATE USER =======================
    builder.addCase(actionUpdateUser.fulfilled, (state, action) => {
      const updatedUser = action.payload;
      const index = state.users.findIndex(
        (u) => u.userId === updatedUser.userId
      );
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...updatedUser };
      }
    });

    // ======================= DELETE USER =======================
    builder.addCase(actionDeleteUser.fulfilled, (state, action) => {
      const userId = action.payload;
      state.users = state.users.filter((u) => u.userId !== userId);
    })
    // ======================= UPDATE AVATAR =======================
    builder.addCase(actionUpdateAvatar.fulfilled, (state, action) => {
      const updatedUser = action.payload?.user;
      if (updatedUser) {
        // Nếu đang có danh sách users → cập nhật ảnh mới
        const index = state.users.findIndex(
          (u) => u.userId === updatedUser.userId
        );
        if (index !== -1) {
          state.users[index] = { ...state.users[index], avatar: updatedUser.avatar };
        }

        // Nếu avatar của người dùng hiện tại thay đổi
        if (state.myProfile && state.myProfile.userId === updatedUser.userId) {
          state.myProfile = { ...state.myProfile, avatar: updatedUser.avatar };
        }

        // Nếu người dùng vừa đăng nhập là người thay đổi avatar
        if (Number(state.infoLogin.userId) === updatedUser.userId) {
          state.infoLogin = { ...state.infoLogin };
        }
      }
    });
  }
})

export const { logout } = slice.actions;

export const selectIsLogin = (state: RootState) => state.auth.isLogin;
export const selectInfoLogin = (state: RootState) => state.auth.infoLogin;
export const selectUsers = (state: RootState) => state.auth.users;
export const selectMyProfile = (state: RootState) => state.auth.myProfile;

export default slice.reducer