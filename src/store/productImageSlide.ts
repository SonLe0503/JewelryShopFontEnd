/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { request } from "../utils/request";

import type { RootState } from "./index";

// Interface cho ProductImage
export interface IProductImage {
  productImageId: number;
  productId: number;
  imageUrl: string;
}

interface IProductImageState {
  images: IProductImage[];
  loading: boolean;
  error: string | null;
}

const initialState: IProductImageState = {
  images: [],
  loading: false,
  error: null,
};

// ✅ Lấy tất cả ảnh
export const actionGetAllImages = createAsyncThunk(
  "productImage/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await request({
        url: "/api/ProductImage/GetAll",
        method: "GET",
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Lỗi khi lấy danh sách ảnh");
    }
  }
);

// ✅ Lấy ảnh theo productId
export const actionGetImagesByProductId = createAsyncThunk(
  "productImage/getByProductId",
  async (productId: number, { rejectWithValue }) => {
    try {
      const res = await request({
        url: `/api/ProductImage/GetByProductId/${productId}`,
        method: "GET",
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Lỗi khi lấy ảnh theo productId");
    }
  }
);

// ✅ Upload ảnh (multipart/form-data)
export const actionUploadProductImage = createAsyncThunk(
  "productImage/upload",
  async ({ productId, file }: { productId: number; file: File }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("productId", productId.toString());
      formData.append("file", file);

      const res = await request({
        url: "/api/ProductImage/UploadImage",
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Lỗi khi upload ảnh sản phẩm");
    }
  }
);

// ✅ Xóa ảnh
export const actionDeleteProductImage = createAsyncThunk(
  "productImage/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await request({
        url: `/api/ProductImage/Delete/${id}`,
        method: "DELETE",
      });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Lỗi khi xóa ảnh sản phẩm");
    }
  }
);

// ================= Slice =================
const slice = createSlice({
  name: "productImage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(actionGetAllImages.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionGetAllImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
      })
      .addCase(actionGetAllImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get by ProductId
      .addCase(actionGetImagesByProductId.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionGetImagesByProductId.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
      })
      .addCase(actionGetImagesByProductId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Upload
      .addCase(actionUploadProductImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionUploadProductImage.fulfilled, (state, action) => {
        state.loading = false;
        state.images.push(action.payload);
      })
      .addCase(actionUploadProductImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete
      .addCase(actionDeleteProductImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionDeleteProductImage.fulfilled, (state, action) => {
        state.loading = false;
        state.images = state.images.filter(
          (img) => img.productImageId !== action.payload
        );
      })
      .addCase(actionDeleteProductImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectProductImages = (state: RootState) => state.productImage.images;
export default slice.reducer;
