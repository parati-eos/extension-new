import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orgCreated: false,
};

const orgSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setOrgCreated: (state, action) => {
      state.orgCreated = action.payload; 
    },
  },
});

export const { setOrgCreated } = orgSlice.actions;
export default orgSlice.reducer;