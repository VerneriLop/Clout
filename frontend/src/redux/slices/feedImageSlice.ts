import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type CustomUser = {
  id: number;
  username: string;
  email: string;
  bio?: string;
  num_followers: number;
  num_following: number;
  profile_picture_url: string;
  num_posts: number;
};

type CustomImage = {
  id: number;
  user: CustomUser;
  image_url: string;
  thumbnail_url: string | null;
  caption: string | null;
  created_at: string;
  is_visible: boolean;
  num_likes: number | null;
  num_comments: number | null;
};

type FeedImageState = {
  feedImages: CustomImage[];
};

const initialState: FeedImageState = {
  feedImages: [],
};

export const feedImageSlice = createSlice({
  name: 'feedImages',
  initialState,
  reducers: {
    setFeedImages: (state, action: PayloadAction<CustomImage[]>) => {
      state.feedImages = [...state.feedImages, ...action.payload];
    },
  },
});

export const {setFeedImages} = feedImageSlice.actions;

export default feedImageSlice.reducer;
