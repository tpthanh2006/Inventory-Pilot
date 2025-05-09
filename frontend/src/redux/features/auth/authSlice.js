import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authService from '../../../services/authService';
import { toast } from 'react-toastify';

const name = JSON.parse(localStorage.getItem("name"));

const initialState = {
  name: name ? name : "",
  user: null,
  userID: "",
  message: "",

  isError: false,
  isSuccess: false,
  isLoading: false,
  isLoggedIn: false,

  users: [],
  verifiedUsers: 0,
  suspendedUsers: 0,
};

// Get User
export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, thunkAPI) => {
    try {
      return await authService.getUser();
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

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

// Verify User
export const verifyUser = createAsyncThunk(
  "auth/verifyUser",
  async (verificationToken, thunkAPI) => {
    try {
      return await authService.verifyUser(verificationToken);
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get All Users
export const getUsers = createAsyncThunk(
  "auth/getUsers",
  async (_, thunkAPI) => {
    try {
      return await authService.getUsers();
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete User
export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (id, thunkAPI) => {
    try {
      return await authService.deleteUser(id);
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Upgrade User
export const upgradeUser = createAsyncThunk(
  "auth/upgradeUser",
  async (userData, thunkAPI) => {
    try {
      return await authService.upgradeRole(userData);
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
    CALC_VERIFIED_USERS(state, action) {
      const array = [];

      state.users.map((user) => {
        const { role } = user;
        return array.push( role );
      });

      let count = 0;
      array.forEach((item) => {
        if (item === "suspended") {
          count++;
        };
      });

      state.suspendedUsers = count;
    },
    CALC_SUSPENDED_USERS(state, action) {
      const array = [];

      state.users.map((user) => {
        const { isVerified } = user;
        return array.push( isVerified );
      });

      let count = 0;
      array.forEach((item) => {
        if (item === true) {
          count++;
        };
      });

      state.verifiedUsers = count;
    },
    SET_LOGIN(state, action) {
      state.isLoggedIn = action.payload
    },
    SET_NAME(state, action) {
      localStorage.setItem("name", JSON.stringify(action.payload));
      state.name = action.payload;
    },
    SET_USER(state, action) {
      const profile = action.payload
      state.user = profile;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get User
      .addCase(getUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

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

      // Verify User
      .addCase(verifyUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;

          state.message = action.payload;
          toast.success(action.payload);
      })
      .addCase(verifyUser.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;

          state.message = action.payload;
          toast.error(action.payload);
      })

      // Get Users
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUsers.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          toast.error(action.payload);
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;

          state.message = action.payload;
          toast.success(action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;

          state.message = action.payload;
          toast.error(action.payload);
      })

      // Upgrade User
      .addCase(upgradeUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(upgradeUser.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;

          state.message = action.payload;
          toast.success(action.payload);
      })
      .addCase(upgradeUser.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;

          state.message = action.payload;
          toast.error(action.payload);
      })
  }
});

export const {
  SET_LOGIN,
  SET_NAME,
  SET_USER,
  RESET,
  CALC_VERIFIED_USERS,
  CALC_SUSPENDED_USERS
} = authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectName = (state) => state.auth.name;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer