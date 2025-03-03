import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CustomImage} from '../../services/image/images';

type ImageTuple = [CustomImage, CustomImage];

type StateType = {
  imageTupleList: ImageTuple[];
};

const initialState: StateType = {imageTupleList: []};

const voteImageSlice = createSlice({
  name: 'voteImage',
  initialState,
  reducers: {
    updateNewVoteImages: (
      state,
      action: PayloadAction<{imageTupleList: ImageTuple[]}>,
    ) => {
      state.imageTupleList = action.payload.imageTupleList;
    },
  },
});

export const {updateNewVoteImages} = voteImageSlice.actions;
export default voteImageSlice.reducer;
