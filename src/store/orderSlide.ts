/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { request } from "../utils/request";

import type { RootState } from "./index";

// Interface cho Order Detail
export interface IOrderDetail {
  orderDetailId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Interface cho Order
export interface IOrder {
  orderId: number;
  userId: number;
  orderDate: string;
  totalPrice: number;
  status: string;
  orderDetails: IOrderDetail[];
}

interface IOrderState {
  orders: IOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: IOrderState = {
  orders: [],
  loading: false,
  error: null,
};

// ✅ Lấy tất cả đơn hàng
export const actionGetAllOrders = createAsyncThunk(
  "order/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await request({
        url: `/api/Order/GetAllOrders`,
        method: "GET",
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Lỗi khi lấy danh sách đơn hàng");
    }
  }
);

// ✅ Lấy đơn hàng theo userId
export const actionGetOrdersByUser = createAsyncThunk(
  "order/getByUser",
  async (userId: number, { rejectWithValue }) => {
    try {
      const res = await request({
        url: `/api/Order/GetOrdersByUser/${userId}`,
        method: "GET",
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Lỗi khi lấy đơn hàng của người dùng");
    }
  }
);

// ✅ Tạo đơn hàng mới
export const actionCreateOrder = createAsyncThunk(
  "order/create",
  async (
    data: {
      userId: number;
      totalPrice: number;
      status: string;
      orderDetails: { productId: number; quantity: number; unitPrice: number }[];
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await request({
        url: `/api/Order/CreateOrder`,
        method: "POST",
        data,
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Lỗi khi tạo đơn hàng");
    }
  }
);

// ✅ Cập nhật trạng thái đơn hàng
export const actionUpdateOrderStatus = createAsyncThunk(
  "order/updateStatus",
  async (data: { id: number; status: string }, { rejectWithValue }) => {
    try {
      const res = await request({
        url: `/api/Order/UpdateOrderStatus/${data.id}`,
        method: "PATCH",
        data: { status: data.status },
      });
      return { id: data.id, status: data.status, result: res.data };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Lỗi khi cập nhật trạng thái đơn hàng");
    }
  }
);

// ✅ Xóa đơn hàng
export const actionDeleteOrder = createAsyncThunk(
  "order/delete",
  async (orderId: number, { rejectWithValue }) => {
    try {
      await request({
        url: `/api/Order/DeleteOrder/${orderId}`,
        method: "DELETE",
      });
      return orderId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Lỗi khi xóa đơn hàng");
    }
  }
);

// ================= Slice =================
const slice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(actionGetAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionGetAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(actionGetAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get by user
      .addCase(actionGetOrdersByUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionGetOrdersByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(actionGetOrdersByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create order
      .addCase(actionCreateOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      .addCase(actionCreateOrder.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Update status
      .addCase(actionUpdateOrderStatus.fulfilled, (state, action) => {
        const order = state.orders.find((o) => o.orderId === action.payload.id);
        if (order) {
          order.status = action.payload.status;
        }
      })
      .addCase(actionUpdateOrderStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Delete order
      .addCase(actionDeleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o) => o.orderId !== action.payload);
      })
      .addCase(actionDeleteOrder.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const selectOrder = (state: RootState) => state.order;
export default slice.reducer;
