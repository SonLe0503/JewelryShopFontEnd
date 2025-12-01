import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";

import authSlide from "./authSlide";
import cartSlice from "./cartSlide";
import categorySlice  from "./categorySlide";
import collectionSlice from "./collectionSlide";
import orderDetailSlice from "./orderDetailSlide";
import orderSlice from "./orderSlide";
import paymentTransactionSlice from "./paymentTransactionSlide";
import productImageSlice from "./productImageSlide";
import productSlice from "./productSlide";
import replySlice from "./replySlide";
import reviewSlice from "./reviewSlide";
import uiSlice from "./uiSlide";
import wishlistSlice from "./wishlistSlide";
import chatSlice from "./chatSlide";
const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["infoLogin", "isLogin"],
};

const reducers = {
  auth: persistReducer(persistConfig, authSlide),
  product: productSlice,
  category: categorySlice,
  collection: collectionSlice,
  cart: cartSlice,
  order: orderSlice,
  orderDetail: orderDetailSlice,
  paymentTransaction: paymentTransactionSlice,
  productImage: productImageSlice,
  review: reviewSlice,
  reply: replySlice,
  ui: uiSlice,
  wishlist: wishlistSlice,
  chat: chatSlice,
};

const rootReducer = combineReducers(reducers);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
