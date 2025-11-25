/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { request } from "../utils/request";

import type { RootState } from "./index";

export interface IPaymentTransaction {
  transactionId: number;
  orderId: number;
  amount: number;
  paymentDate: string;
  paymentStatus: string;
  orderTotalPrice: number;
  orderStatus: string;
}

interface IPaymentTransactionState {
  transactions: IPaymentTransaction[];
  transactionDetail: IPaymentTransaction | null;
  loading: boolean;
  error: string | null;
}

const initialState: IPaymentTransactionState = {
  transactions: [],
  transactionDetail: null,
  loading: false,
  error: null,
};

// ✅ Lấy tất cả giao dịch
export const actionGetAllTransactions = createAsyncThunk(
  "paymentTransaction/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await request({
        url: `/PaymentTransaction/GetAllTransactions`,
        method: "GET",
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Lỗi khi lấy danh sách giao dịch"
      );
    }
  }
);

// ✅ Lấy giao dịch theo ID
export const actionGetTransactionById = createAsyncThunk(
  "paymentTransaction/getById",
  async (transactionId: number, { rejectWithValue }) => {
    try {
      const res = await request({
        url: `/PaymentTransaction/GetTransactionById/${transactionId}`,
        method: "GET",
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Lỗi khi lấy giao dịch theo ID"
      );
    }
  }
);

// ✅ Lấy giao dịch theo OrderId
export const actionGetTransactionByOrder = createAsyncThunk(
  "paymentTransaction/getByOrder",
  async (orderId: number, { rejectWithValue }) => {
    try {
      const res = await request({
        url: `/PaymentTransaction/GetTransactionByOrder/${orderId}`,
        method: "GET",
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Lỗi khi lấy giao dịch theo OrderId"
      );
    }
  }
);

// ✅ Tạo giao dịch mới
export const actionCreateTransaction = createAsyncThunk(
  "paymentTransaction/create",
  async (
    data: { orderId: number; amount: number; paymentStatus: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await request({
        url: `/PaymentTransaction/CreateTransaction/Create`,
        method: "POST",
        data,
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Lỗi khi tạo giao dịch");
    }
  }
);

// ✅ Cập nhật trạng thái giao dịch
export const actionUpdateTransactionStatus = createAsyncThunk(
  "paymentTransaction/updateStatus",
  async (
    { transactionId, status }: { transactionId: number; status: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await request({
        url: `/PaymentTransaction/UpdateTransactionStatus/${transactionId}`,
        method: "PUT",
        data: status,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return { id: transactionId, status, data: res.data };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Lỗi khi cập nhật trạng thái giao dịch"
      );
    }
  }
);

// ✅ Xóa giao dịch
export const actionDeleteTransaction = createAsyncThunk(
  "paymentTransaction/delete",
  async (transactionId: number, { rejectWithValue }) => {
    try {
      const res = await request({
        url: `/PaymentTransaction/DeleteTransaction/${transactionId}`,
        method: "DELETE",
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Lỗi khi xóa giao dịch");
    }
  }
);

// ================= Slice =================
const slice = createSlice({
  name: "paymentTransaction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(actionGetAllTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionGetAllTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(actionGetAllTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get By Id
      .addCase(actionGetTransactionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionGetTransactionById.fulfilled, (state, action) => {
        state.loading = false;
        state.transactionDetail = action.payload;
      })
      .addCase(actionGetTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get By Order
      .addCase(actionGetTransactionByOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionGetTransactionByOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(actionGetTransactionByOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Transaction
      .addCase(actionCreateTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionCreateTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.push(action.payload);
      })
      .addCase(actionCreateTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Transaction Status
      .addCase(actionUpdateTransactionStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionUpdateTransactionStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { id, status } = action.payload;
        const transaction = state.transactions.find(
          (t) => t.transactionId === id
        );
        if (transaction) {
          transaction.paymentStatus = status;
        }
      })
      .addCase(actionUpdateTransactionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Transaction
      .addCase(actionDeleteTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionDeleteTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = state.transactions.filter(
          (t) => t.transactionId !== action.meta.arg
        );
      })
      .addCase(actionDeleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectAllTransactions = (state: RootState) =>
  state.paymentTransaction.transactions;
export const selectTransactionDetail = (state: RootState) =>
  state.paymentTransaction.transactionDetail;

export default slice.reducer;
