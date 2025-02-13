import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type User = {
  id: number;
  username: string;
  email: string;
  bio?: string | null;
};

type AuthState = {
  user: User | null;
  access: string | null;
  refresh: string | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  access: null,
  refresh: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (
      state,
      action: PayloadAction<{
        user: User;
        access: string;
        refresh: string;
      }>,
    ) => {
      state.user = action.payload.user;
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
      state.isAuthenticated = true;
    },

    logoutUser: state => {
      state.user = null;
      state.access = null;
      state.refresh = null;
      state.isAuthenticated = false;
    },

    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.access = action.payload;
    },
  },
});

export const {loginUser, logoutUser, updateAccessToken} = userSlice.actions;
export default userSlice.reducer;
