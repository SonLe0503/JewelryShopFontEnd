import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { request } from "../utils/request";

import type { RootState } from "./index";

export interface IReview {
  reviewId: number;
  userId: number;
  userEmail: string;
  productId: number;
  productName: string;
  comment: string;
  rating: number;
  createdAt: string;
  status: string | null;
}

interface IInitialState {
  reviews: IReview[];
  loading: boolean;
  error: string | null;
}

const initialState: IInitialState = {
  reviews: [],
  loading: false,
  error: null,
};

// 🟢 GET ALL REVIEWS
export const actionGetAllReviews = createAsyncThunk(
  "review/actionGetAllReviews",
  async (_, { rejectWithValue }) => {
    try {
      const res = await request({
        url: `/Review/GetAllReviews`,
        method: "GET",
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 🟢 GET REVIEWS BY PRODUCT
export const actionGetReviewsByProduct = createAsyncThunk(
  "review/actionGetReviewsByProduct",
  async (productId: number, { rejectWithValue }) => {
    try {
      const res = await request({
        url: `/Review/GetReviewsByProduct/${productId}`,
        method: "GET",
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 🟢 GET REVIEWS BY USER
export const actionGetReviewsByUser = createAsyncThunk(
  "review/actionGetReviewsByUser",
  async (userId: number, { rejectWithValue }) => {
    try {
      const res = await request({
        url: `/Review/GetReviewsByUser/ByUser/${userId}`,
        method: "GET",
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 🟢 CREATE REVIEW
export const actionCreateReview = createAsyncThunk(
  "review/actionCreateReview",
  async (
    data: { userId: number; productId: number; rating: number; comment: string },
    { rejectWithValue, getState }
  ) => {
    try {
      const state: any = getState();
      const token = state.auth.infoLogin?.accessToken;
      const res = await request({
        url: `/Review/CreateReview`,
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 🟢 UPDATE REVIEW
export const actionUpdateReview = createAsyncThunk(
  "review/actionUpdateReview",
  async (
    {
      reviewId,
      data,
    }: {
      reviewId: number;
      data: { userId: number; productId: number; rating: number; comment: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await request({
        url: `/Review/UpdateReview/${reviewId}`,
        method: "PUT",
        data,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 🟢 DELETE REVIEW
export const actionDeleteReview = createAsyncThunk(
  "review/actionDeleteReview",
  async (reviewId: number, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.infoLogin?.accessToken;
      await request({
        url: `/Review/DeleteReview/${reviewId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return reviewId;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const slice = createSlice({
  name: "review",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Get All Reviews
      .addCase(actionGetAllReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionGetAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(actionGetAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔹 Get Reviews by Product
      .addCase(actionGetReviewsByProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionGetReviewsByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(actionGetReviewsByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔹 Get Reviews by User
      .addCase(actionGetReviewsByUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionGetReviewsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(actionGetReviewsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


      // 🔹 Create Review
      .addCase(actionCreateReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionCreateReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.push(action.payload);
      })
      .addCase(actionCreateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔹 Update Review
      .addCase(actionUpdateReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionUpdateReview.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.reviews.findIndex(
          (r) => r.reviewId === updated.reviewId
        );
        if (index !== -1) state.reviews[index] = updated;
      })
      .addCase(actionUpdateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔹 Delete Review
      .addCase(actionDeleteReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionDeleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter(
          (r) => r.reviewId !== action.payload
        );
      })
      .addCase(actionDeleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectReviews = (state: RootState) => state.review.reviews;
export const selectReviewLoading = (state: RootState) => state.review.loading;

export default slice.reducer;
