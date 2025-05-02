import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authService from '../../../services/authService';
import { toast } from 'react-toastify';

const name = JSON.parse(localStorage.getItem("name"));

const initialState = {
  name: name ? name : "",
  user: {
    name: "",
    email: "",
    phone: "",
    bio: "",
    photo: "",
    isVerified: false,
  },
  userID: "",
  message: "",

  isError: false,
  isSuccess: false,
  isLoading: false,
  isLoggedIn: false,
}

// Send Verification Email
export const sendVerificationEmail = createAsyncThunk(
  "auth/sendVerificationEmail",
  async (_, thunkAPI) => {
    try {
      return await authService.sendVerificationEmail();
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    RESET(state) {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
    SET_LOGIN(state, action) {
      state.isLoggedIn = action.payload
    },
    SET_NAME(state, action) {
      localStorage.setItem("name", JSON.stringify(action.payload))
      state.name = action.payload
    },
    SET_USER(state, action) {
      const profile = action.payload
      state.user.name = profile.name
      state.user.email = profile.email
      state.user.phone = profile.phone
      state.user.bio = profile.bio
      state.user.photo = profile.photo
    }
  },
  extraReducers: (builder) => {
    builder
      // Send Verification Email
      .addCase(sendVerificationEmail.pending, (state) => {
          state.isLoading = true
      })
      .addCase(sendVerificationEmail.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;

          state.message = action.payload;
          toast.success(action.payload);
      })
      .addCase(sendVerificationEmail.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
  
          state.message = action.payload;
          toast.error(action.payload);
      })
  }
});

export const {SET_LOGIN, SET_NAME, SET_USER, RESET} = authSlice.actions

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectName = (state) => state.auth.name;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer