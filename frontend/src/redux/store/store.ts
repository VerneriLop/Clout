import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import cameraReducer from '../slices/cameraSlice';
import voteImageReducer from '../slices/voteImageSlice';
import feedImageReducer from '../slices/feedImageSlice';
import likeReducer from '../slices/likeSlice';
import commentReducer from '../slices/commentSlice';
import profilePostsReducer from '../slices/profilePostsSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    camera: cameraReducer,
    voteImage: voteImageReducer,
    feedImage: feedImageReducer,
    like: likeReducer,
    comment: commentReducer,
    posts: profilePostsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;

export default store;
