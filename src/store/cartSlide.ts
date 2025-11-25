/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { request } from "../utils/request";

import type { RootState } from "./index";

export interface ICart {
  cartId: number;
  userId: number;
  productId: number;
  productName: string;
  categoryName: string | null;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  imgUrl: string;
}

interface ICartState {
  carts: ICart[];
  loading: boolean;
  error: string | null;
}

const initialState: ICartState = {
  carts: [],
  loading: false,
  error: null,
};

// ✅ Lấy giỏ hàng theo userId
export const actionGetCartByUser = createAsyncThunk(
  "cart/getByUser",
  async (userId: number, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.infoLogin?.accessToken;
      const res = await request({
        url: `/Cart/GetCartByUser/${userId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Lỗi khi lấy giỏ hàng");
    }
  }
);

// ✅ Thêm sản phẩm vào giỏ hàng
export const actionAddOrUpdateCart = createAsyncThunk(
  "cart/addOrUpdate",
  async (
    data: { userId: number; productId: number; quantity: number; stockQuantity: number },
    { rejectWithValue, getState }
  ) => {
    try {
      const state: any = getState();
      const token = state.auth.infoLogin?.accessToken;

      // Gọi API backend AddOrUpdateCart
      const res = await request({
        url: `/Cart/AddOrUpdateCart`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        data
      });

      return res.data.cart;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Lỗi khi thêm/cập nhật giỏ hàng");
    }
  }
);


// ✅ Cập nhật số lượng sản phẩm
export const actionUpdateCartQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async (data: { cartId: number; quantity: number }, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.infoLogin?.accessToken;
      const res = await request({
        url: `/Cart/UpdateCartQuantity`,
        method: "PUT",
        data,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res.data.cart;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Lỗi khi cập nhật số lượng");
    }
  }
);

// ✅ Xóa 1 sản phẩm khỏi giỏ hàng
export const actionRemoveFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (cartId: number, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.infoLogin?.accessToken;
      await request({
        url: `/Cart/RemoveFromCart/${cartId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return cartId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Lỗi khi xóa sản phẩm khỏi giỏ hàng");
    }
  }
);

// ✅ Xóa toàn bộ giỏ hàng
export const actionClearCart = createAsyncThunk(
  "cart/clearCart",
  async (userId: number, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.infoLogin?.accessToken;
      await request({
        url: `/Cart/ClearCart/${userId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }); 
      return userId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Lỗi khi xóa toàn bộ giỏ hàng");
    }
  }
);

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get cart
      .addCase(actionGetCartByUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionGetCartByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.carts = action.payload;
      })
      .addCase(actionGetCartByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add to cart
      .addCase(actionAddOrUpdateCart.fulfilled, (state, action) => {
        const existing = state.carts.find((c) => c.cartId === action.payload.cartId);
        if (existing) {
          existing.quantity = action.payload.quantity;
          existing.totalPrice = action.payload.totalPrice;
        } else {
          state.carts.push(action.payload);
        }
      })
      .addCase(actionAddOrUpdateCart.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Update quantity
      .addCase(actionUpdateCartQuantity.fulfilled, (state, action) => {
        const index = state.carts.findIndex((c) => c.cartId === action.payload.cartId);
        if (index !== -1) {
          state.carts[index] = action.payload;
        }
      })
      .addCase(actionUpdateCartQuantity.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Remove one
      .addCase(actionRemoveFromCart.fulfilled, (state, action) => {
        state.carts = state.carts.filter((c) => c.cartId !== action.payload);
      })
      .addCase(actionRemoveFromCart.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Clear all
      .addCase(actionClearCart.fulfilled, (state) => {
        state.carts = [];
      })
      .addCase(actionClearCart.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const selectCart = (state: RootState) => state.cart;
export default slice.reducer;
