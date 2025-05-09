import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../redux/features/auth/authSlice";
import emailReducer from "../redux/features/email/emailSlice";
import filterReducer from "../redux/features/product/filterSlice";
import productReducer from "../redux/features/product/productSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    email: emailReducer,
    product: productReducer,
    filter: filterReducer,
  },
});