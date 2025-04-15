import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../redux/features/auth/authSlice";
import filterReducer from "../redux/features/product/filterSlice";
import productReducer from "../redux/features/product/productSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    filter: filterReducer,
  },
});