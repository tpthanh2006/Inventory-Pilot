import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  filteredUsers: []
}

const filterUserSlice = createSlice({
  name: "filterUser",
  initialState,
  reducers: {
    FILTER_USERS(state, action) {
      const { users, search } = action.payload;
      
      const tempUsers = users?.filter((user) => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      ) || [];

      state.filteredUsers = tempUsers;
    }
  },
});

export const { FILTER_USERS } = filterUserSlice.actions
export const selectFilteredUsers = (state) => state.filterUser.filteredUsers

export default filterUserSlice.reducer