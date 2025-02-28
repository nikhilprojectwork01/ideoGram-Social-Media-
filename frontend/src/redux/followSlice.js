import { createSlice } from "@reduxjs/toolkit";
const followSlice = createSlice({
  name: "follow",
  initialState: {
    follow: [],
  },
  reducers: {
    setfollow: (state, action) => {
      state.follow = action.payload
    }
  }
})
export const { setfollow } = followSlice.actions;
export default followSlice.reducer;