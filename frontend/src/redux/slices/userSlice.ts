import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type UserState = {
  user: {id: string; email: string} | null;
  token: string | null;
  isAuthenticated: boolean;
};

const initialState: UserState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (
      state,
      action: PayloadAction<{user: {id: string; email: string}; token: string}>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logoutUser: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const {loginUser, logoutUser} = userSlice.actions;
export default userSlice.reducer;
