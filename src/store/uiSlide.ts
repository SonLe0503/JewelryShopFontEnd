import { createSlice } from "@reduxjs/toolkit";

import type { RootState } from "./index";

interface UIState {
  openLogin: boolean;
  openProfile: boolean;
}

const initialState: UIState = {
  openLogin: false,
  openProfile: false,
};

const slice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setOpenLogin: (state, action) => {
      state.openLogin = action.payload;
    },
    setOpenProfile: (state, action) => {
      state.openProfile = action.payload;
    },
  },
});

export const { setOpenLogin, setOpenProfile } = slice.actions;

export const selectOpenLogin = (state: RootState) => state.ui.openLogin;
export const selectOpenProfile = (state: RootState) => state.ui.openProfile;

export default slice.reducer;
