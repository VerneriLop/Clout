import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type CameraState = {
  isCameraActive: boolean;
};

const initialState: CameraState = {
  isCameraActive: false,
};

const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    setCameraActive: (state, action: PayloadAction<boolean>) => {
      state.isCameraActive = action.payload;
    },
  },
});

export const {setCameraActive} = cameraSlice.actions;
export default cameraSlice.reducer;
