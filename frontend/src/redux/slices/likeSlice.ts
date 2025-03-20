import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type LikeType = {
  id: number;
  user_id: number;
  image_id: number;
  created_at?: string;
};

type LikesState = {
  likes: LikeType[];
};

const initialState: LikesState = {
  likes: [],
};

export const likesSlice = createSlice({
  name: 'like',
  initialState,
  reducers: {
    setLikes: (state, action: PayloadAction<LikeType[]>) => {
      state.likes = action.payload;
    },
    addLike: (state, action: PayloadAction<LikeType>) => {
      state.likes = [...state.likes, action.payload];
    },
    removeLike: (state, action: PayloadAction<number>) => {
      state.likes = state.likes.filter(like => like.id !== action.payload);
    },
  },
});

export const {setLikes, addLike, removeLike} = likesSlice.actions;
export default likesSlice.reducer;
