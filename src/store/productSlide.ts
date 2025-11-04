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

export interface IProduct {
  productId: number;
  name: string;
  description: string;
  price: number;
  discount: number;
  stockQuantity: number;
  material: string;
  imageUrl: string;
  createdAt: string;
  status: string | null;
  categoryId: number;
  categoryName: string;
  productImages: string[];
  reviews: IReview[];
}

interface IInitialState {
  products: IProduct[];
  productDetail: IProduct | null;
  loading: boolean;
  error: string | null;
}

const initialState: IInitialState = {
  products: [],
  productDetail: null,
  loading: false,
  error: null,
};

// 🟢 GET ALL PRODUCTS
export const actionGetAllProducts = createAsyncThunk(
  "product/actionGetAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await request({
        url: `/Product/GetAllProducts`,
        method: "GET",
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 🟢 GET PRODUCT BY ID
export const actionGetProductById = createAsyncThunk(
  "product/actionGetProductById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await request({
        url: `/Product/GetProductById/${id}`,
        method: "GET",
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 🟢 CREATE PRODUCT (multipart/form-data)
export const actionCreateProduct = createAsyncThunk(
  "product/actionCreateProduct",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await request({
        url: `/Product/CreateProduct`,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 🟢 EDIT PRODUCT (multipart/form-data)
export const actionEditProduct = createAsyncThunk(
  "product/actionEditProduct",
  async (
    { id, formData }: { id: number; formData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await request({
        url: `/Product/EditProduct?productId=${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 🟢 DELETE PRODUCT
export const actionDeleteProduct = createAsyncThunk(
  "product/actionDeleteProduct",
  async (id: number, { rejectWithValue }) => {
    try {
      await request({
        url: `/Product/DeleteProduct?productId=${id}`,
        method: "DELETE",
      });
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const slice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GetAll
      .addCase(actionGetAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionGetAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(actionGetAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Không thể tải danh sách sản phẩm";
      })

      // GetById
      .addCase(actionGetProductById.pending, (state) => {
        state.loading = true;
        state.productDetail = null;
      })
      .addCase(actionGetProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetail = action.payload;
      })
      .addCase(actionGetProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Không thể tải chi tiết sản phẩm";
      })

      // Create
      .addCase(actionCreateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionCreateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(actionCreateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Không thể tạo sản phẩm";
      })

      // Edit
      .addCase(actionEditProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionEditProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.products.findIndex(
          (p) => p.productId === updated.productId
        );
        if (index !== -1) state.products[index] = updated;
      })
      .addCase(actionEditProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Không thể cập nhật sản phẩm";
      })

      // Delete
      .addCase(actionDeleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionDeleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (p) => p.productId !== action.payload
        );
      })
      .addCase(actionDeleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Không thể xóa sản phẩm";
      });
  },
});

export const selectProducts = (state: RootState) => state.product.products;
export const selectProductDetail = (state: RootState) => state.product.productDetail;
export const selectProductLoading = (state: RootState) => state.product.loading;
export const selectDiscountedProducts = (state: RootState) => 
  state.product.products.filter(product => product.discount > 0);

export default slice.reducer;
