import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const getKey = (userId: number) => `wishlist_user_${userId}`;

const loadWishlist = (userId: number) => {
  const data = localStorage.getItem(getKey(userId));
  return data ? JSON.parse(data) : [];
};

const saveWishlist = (userId: number, list: number[]) => {
  localStorage.setItem(getKey(userId), JSON.stringify(list));
};

// 🧠 Lấy danh sách wishlist
export const actionGetWishlist = createAsyncThunk(
  "wishlist/get",
  async (userId: number) => {
    return loadWishlist(userId);
  }
);

// 🧠 Thêm / xóa sản phẩm khỏi wishlist
export const actionToggleWishlist = createAsyncThunk(
  "wishlist/toggle",
  async ({ userId, productId }: { userId: number; productId: number }) => {
    const current = loadWishlist(userId);
    const updated = current.includes(productId)
      ? current.filter((id: number) => id !== productId)
      : [...current, productId];
    saveWishlist(userId, updated);
    return updated;
  }
);

const slice = createSlice({
  name: "wishlist",
  initialState: { list: [] as number[] },
  reducers: {
    clearWishlist: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actionGetWishlist.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(actionToggleWishlist.fulfilled, (state, action) => {
        state.list = action.payload;
      });
  },
});

export const { clearWishlist } = slice.actions;
export const selectWishlist = (state: any) => state.wishlist.list;
export default slice.reducer;
