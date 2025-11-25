import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request } from "../utils/request";
import type { RootState } from "./index";
import type { IProduct } from "./productSlide";

// 🔹 Kiểu dữ liệu Collection
export interface ICollection {
  collectionId: number;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  productCount: number;
  products: IProduct[];
}

// 🔹 Trạng thái ban đầu
interface IInitialState {
  collections: ICollection[];
  collectionDetail: ICollection | null;
  loading: boolean;
  error: string | null;
}

const initialState: IInitialState = {
  collections: [],
  collectionDetail: null,
  loading: false,
  error: null,
};

// 🟢 GET ALL COLLECTIONS
export const actionGetAllCollections = createAsyncThunk(
  "collection/actionGetAllCollections",
  async (_, { rejectWithValue }) => {
    try {
      const response = await request({
        url: `/Collection/GetCollections`,
        method: "GET",
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 🟢 GET COLLECTION BY ID
export const actionGetCollectionById = createAsyncThunk(
  "collection/actionGetCollectionById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await request({
        url: `/Collection/GetCollection/${id}`,
        method: "GET",
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 🟢 CREATE COLLECTION
export const actionCreateCollection = createAsyncThunk(
  "collection/actionCreateCollection",
  async (
    collectionData: { name: string; description: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await request({
        url: `/Collection/CreateCollection`,
        method: "POST",
        data: collectionData,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 🟢 UPDATE COLLECTION
export const actionUpdateCollection = createAsyncThunk(
  "collection/actionUpdateCollection",
  async (
    {
      id,
      data,
    }: { id: number; data: { name: string; description: string } },
    { rejectWithValue }
  ) => {
    try {
      const response = await request({
        url: `/Collection/UpdateCollection/${id}`,
        method: "PUT",
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 🟢 DELETE COLLECTION
export const actionDeleteCollection = createAsyncThunk(
  "collection/actionDeleteCollection",
  async (id: number, { rejectWithValue }) => {
    try {
      await request({
        url: `/Collection/DeleteCollection/${id}`,
        method: "DELETE",
      });
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 🔹 Slice
export const collectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🟡 GetAll
      .addCase(actionGetAllCollections.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionGetAllCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.collections = action.payload;
      })
      .addCase(actionGetAllCollections.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ?? "Không thể tải bộ sưu tập";
      })

      // 🟡 GetById
      .addCase(actionGetCollectionById.pending, (state) => {
        state.loading = true;
        state.collectionDetail = null;
      })
      .addCase(actionGetCollectionById.fulfilled, (state, action) => {
        state.loading = false;
        state.collectionDetail = action.payload;
      })
      .addCase(actionGetCollectionById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ?? "Không thể tải chi tiết bộ sưu tập";
      })

      // 🟡 Create
      .addCase(actionCreateCollection.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionCreateCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.collections.push(action.payload);
      })
      .addCase(actionCreateCollection.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ?? "Không thể tạo bộ sưu tập";
      })

      // 🟡 Update
      .addCase(actionUpdateCollection.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionUpdateCollection.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.collections.findIndex(
          (c) => c.collectionId === updated.collectionId
        );
        if (index !== -1) state.collections[index] = updated;
      })
      .addCase(actionUpdateCollection.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ?? "Không thể cập nhật bộ sưu tập";
      })

      // 🟡 Delete
      .addCase(actionDeleteCollection.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionDeleteCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.collections = state.collections.filter(
          (c) => c.collectionId !== action.payload
        );
      })
      .addCase(actionDeleteCollection.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ?? "Không thể xóa bộ sưu tập";
      });
  },
});

// 🔹 Selector
export const selectCollections = (state: RootState) =>
  state.collection.collections;
export const selectCollectionDetail = (state: RootState) =>
  state.collection.collectionDetail;
export const selectCollectionLoading = (state: RootState) =>
  state.collection.loading;

export default collectionSlice.reducer;
