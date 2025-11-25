import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { request } from "../utils/request";

import type { RootState } from "./index";
import type { IProduct } from "./productSlide";

export interface ICategory {
  categoryId: number;
  categoryName: string;
  description: string;
  createdAt: string;
  status: string | null;
  productCount: number;
  products: IProduct[];
}

interface IInitialState {
  categories: ICategory[];
  categoryDetail: ICategory | null;
  loading: boolean;
  error: string | null;
}

const initialState: IInitialState = {
  categories: [],
  categoryDetail: null,
  loading: false,
  error: null,
};

// 🟢 GET ALL CATEGORIES
export const actionGetAllCategories = createAsyncThunk(
  "category/actionGetAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await request({
        url: `/Category/GetAllCategories`,
        method: "GET",
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 🟢 GET CATEGORY BY ID
export const actionGetCategoryById = createAsyncThunk(
  "category/actionGetCategoryById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await request({
        url: `/Category/GetCategoryById/${id}`,
        method: "GET",
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 🟢 CREATE CATEGORY
export const actionCreateCategory = createAsyncThunk(
  "category/actionCreateCategory",
  async (
    categoryData: { categoryName: string; description: string },
    { rejectWithValue, getState }
  ) => {
    try {
      const state: any = getState();
      const token = state.auth.infoLogin?.accessToken;
      const response = await request({
        url: `/Category/CreateCategory`,
        method: "POST",
        data: categoryData,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 🟢 EDIT CATEGORY
export const actionEditCategory = createAsyncThunk(
  "category/actionEditCategory",
  async (
    { id, data }: { id: number; data: { categoryName: string; description: string } },
    { rejectWithValue, getState }
  ) => {
    try {
       const state: any = getState();
      const token = state.auth.infoLogin?.accessToken;
      const response = await request({
        url: `/Category/EditCategory?id=${id}`,
        method: "PUT",
        data,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 🟢 DELETE CATEGORY
export const actionDeleteCategory = createAsyncThunk(
  "category/actionDeleteCategory",
  async (id: number, { rejectWithValue, getState }) => {
    try {
       const state: any = getState();
      const token = state.auth.infoLogin?.accessToken;
      await request({
        url: `/Category/DeleteCategory?id=${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return id; // Trả về id để xóa khỏi Redux state
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const slice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🟡 GetAll
      .addCase(actionGetAllCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionGetAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(actionGetAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Không thể tải danh mục";
      })

      // 🟡 GetById
      .addCase(actionGetCategoryById.pending, (state) => {
        state.loading = true;
        state.categoryDetail = null;
      })
      .addCase(actionGetCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryDetail = action.payload;
      })
      .addCase(actionGetCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Không thể tải chi tiết danh mục";
      })

      // 🟡 Create
      .addCase(actionCreateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionCreateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(actionCreateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Không thể tạo danh mục";
      })

      // 🟡 Edit
      .addCase(actionEditCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionEditCategory.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.categories.findIndex(
          (c) => c.categoryId === updated.categoryId
        );
        if (index !== -1) state.categories[index] = updated;
      })
      .addCase(actionEditCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Không thể cập nhật danh mục";
      })
      // 🟡 Delete
      .addCase(actionDeleteCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionDeleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (c) => c.categoryId !== action.payload
        );
      })
      .addCase(actionDeleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Không thể xóa danh mục";
      });
  },
});

export const selectCategories = (state: RootState) => state.category.categories;
export const selectCategoryDetail = (state: RootState) => state.category.categoryDetail;
export const selectCategoryLoading = (state: RootState) => state.category.loading;

export default slice.reducer;
