import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  load: false,
  moved: false,
  newsArray: [],
  newPage: true,
};

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    toLoad: (state) => {
      state.load = !state.load;
    },
    movedFromPostPage: (state, action) => {
      state.moved = action.payload;
    },
    rememberArray: (state, action) => {
      return { ...state, newsArray: [...state.newsArray, action.payload] };
    },
    movedFromNewPage: (state, action) => {
      state.newPage = action.payload;
    },
  },
});

export const { toLoad, movedFromPostPage, rememberArray, movedFromNewPage } = loadingSlice.actions;

export default loadingSlice.reducer;
