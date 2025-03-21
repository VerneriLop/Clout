import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CustomImage, mockImageList} from '../../screens/Feed/mock';
import {logoutUser} from './userSlice';
import {RootState} from '../store/store';

// omit reactions and other types

interface PostsState {
  posts: CustomImage[];
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
  index: number | null;
}

const initialState: PostsState = {
  posts: [],
  status: 'idle',
  error: null,
  index: null,
};

const getImagesByUser = async (id: number) => {
  return mockImageList.filter(img => img.user.id === id);
};

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (id: number) => {
    const data = await getImagesByUser(id);
    return data;
  },
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setIndex: (state, action: PayloadAction<number>) => {
      state.index = state.posts.findIndex(post => post.id === action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(logoutUser, state => {
        // Clear out the list of posts whenever the user logs out
        return initialState;
      })
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'pending';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Unknown Error';
      });
  },
});

export const {setIndex} = postsSlice.actions;

export default postsSlice.reducer;

export const selectAllPosts = (state: RootState) => state.posts.posts;

export const selectPostIndexById = (state: RootState, imageId: number) =>
  state.posts.posts.findIndex(post => post.id === imageId);

export const selectPostsStatus = (state: RootState) => state.posts.status;
export const selectPostsError = (state: RootState) => state.posts.error;
export const selectPostsIndex = (state: RootState) => state.posts.index;
