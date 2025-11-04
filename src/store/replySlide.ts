
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { request } from "../utils/request";

import type { RootState } from "./index";

// 🟢 Interface
export interface IReply {
  replyId: number;
  reviewId: number;
  userId: number;
  comment: string;
  createdAt: string;
  status: string | null;
}

// 🟢 State
interface IInitialState {
  replies: IReply[];
  loading: boolean;
  error: string | null;
}

const initialState: IInitialState = {
  replies: [],
  loading: false,
  error: null,
};

//
// ────────────────────────────────────────────────
//   Thunks
// ────────────────────────────────────────────────
//

// 🟢 GET ALL REPLIES
export const actionGetAllReplies = createAsyncThunk(
  "reply/actionGetAllReplies",
  async (_, { rejectWithValue }) => {
    try {
      const res = await request({
        url: `/Reply/GetAll`,
        method: "GET",
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 🟢 GET REPLY BY ID
export const actionGetReplyById = createAsyncThunk(
  "reply/actionGetReplyById",
  async (replyId: number, { rejectWithValue }) => {
    try {
      const res = await request({
        url: `/Reply/GetById/${replyId}`,
        method: "GET",
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 🟢 GET REPLIES BY REVIEW ID
export const actionGetRepliesByReviewId = createAsyncThunk(
  "reply/actionGetRepliesByReviewId",
  async (reviewId: number, { rejectWithValue }) => {
    try {
      const res = await request({
        url: `/Reply/GetByReviewId/${reviewId}`,
        method: "GET",
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 🟢 CREATE REPLY
export const actionCreateReply = createAsyncThunk(
  "reply/actionCreateReply",
  async (
    data: { reviewId: number; userId: number; comment: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await request({
        url: `/Reply/Create`,
        method: "POST",
        data,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 🟢 UPDATE REPLY
export const actionUpdateReply = createAsyncThunk(
  "reply/actionUpdateReply",
  async (
    {
      replyId,
      data,
    }: {
      replyId: number;
      data: { reviewId: number; userId: number; comment: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await request({
        url: `/Reply/Update/${replyId}`,
        method: "PUT",
        data,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 🟢 DELETE REPLY
export const actionDeleteReply = createAsyncThunk(
  "reply/actionDeleteReply",
  async (replyId: number, { rejectWithValue }) => {
    try {
      await request({
        url: `/Reply/Delete/${replyId}`,
        method: "DELETE",
      });
      return replyId;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//
// ────────────────────────────────────────────────
//   Slice
// ────────────────────────────────────────────────
//

export const slice = createSlice({
  name: "reply",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Get All Replies
      .addCase(actionGetAllReplies.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionGetAllReplies.fulfilled, (state, action) => {
        state.loading = false;
        state.replies = action.payload;
      })
      .addCase(actionGetAllReplies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔹 Get Replies by Review ID
      .addCase(actionGetRepliesByReviewId.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionGetRepliesByReviewId.fulfilled, (state, action) => {
        state.loading = false;
        state.replies = action.payload;
      })
      .addCase(actionGetRepliesByReviewId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔹 Create Reply
      .addCase(actionCreateReply.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionCreateReply.fulfilled, (state, action) => {
        state.loading = false;
        state.replies.push(action.payload);
      })
      .addCase(actionCreateReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔹 Update Reply
      .addCase(actionUpdateReply.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionUpdateReply.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.replies.findIndex(
          (r) => r.replyId === updated.replyId
        );
        if (index !== -1) state.replies[index] = updated;
      })
      .addCase(actionUpdateReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔹 Delete Reply
      .addCase(actionDeleteReply.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionDeleteReply.fulfilled, (state, action) => {
        state.loading = false;
        state.replies = state.replies.filter(
          (r) => r.replyId !== action.payload
        );
      })
      .addCase(actionDeleteReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectReplies = (state: RootState) => state.reply.replies;
export const selectReplyLoading = (state: RootState) => state.reply.loading;
export const selectReplyError = (state: RootState) => state.reply.error;

export default slice.reducer;
