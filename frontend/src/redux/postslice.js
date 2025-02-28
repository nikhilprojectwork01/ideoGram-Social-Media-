import { createSlice } from "@reduxjs/toolkit";
const postSlice = createSlice({
  name: "post",
  initialState: {
    post: null,
    selectedPost: null
  },
  reducers: {
    setPost: (state, action) => {
      state.post = action.payload
    },
    setselectedPost: (state, action) => {
      state.selectedPost = action.payload
    }
  }
})

export const { setPost, setselectedPost } = postSlice.actions;
export default postSlice.reducer;