/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { request } from "../utils/request";

import type { RootState } from "./index";

// Interface cho OrderDetail
export interface IOrderDetail {
  orderDetailId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface IOrderDetailState {
  orderDetails: IOrderDetail[];
  loading: boolean;
  error: string | null;
}

const initialState: IOrderDetailState = {
  orderDetails: [],
  loading: false,
  error: null,
};

// ✅ Lấy chi tiết đơn hàng theo orderId
export const actionGetOrderDetails = createAsyncThunk(
  "orderDetail/getByOrder",
  async (orderId: number, { rejectWithValue }) => {
    try {
      const res = await request({
        url: `/OrderDetail/GetOrderDetails/${orderId}`,
        method: "GET",
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Lỗi khi lấy chi tiết đơn hàng");
    }
  }
);

// ✅ Thêm mới OrderDetail vào 1 order
export const actionAddOrderDetail = createAsyncThunk(
  "orderDetail/add",
  async (
    { orderId, data }: { orderId: number; data: { productId: number; quantity: number; unitPrice: number } },
    { rejectWithValue }
  ) => {
    try {
      const res = await request({
        url: `/OrderDetail/AddOrderDetail?orderId=${orderId}`,
        method: "POST",
        data,
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Lỗi khi thêm chi tiết đơn hàng");
    }
  }
);

// ================= Slice =================
const slice = createSlice({
  name: "orderDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Order Details
      .addCase(actionGetOrderDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionGetOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(actionGetOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add Order Detail
      .addCase(actionAddOrderDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionAddOrderDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails.push(action.payload);
      })
      .addCase(actionAddOrderDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectOrderDetails = (state: RootState) => state.orderDetail.orderDetails;
export default slice.reducer;
