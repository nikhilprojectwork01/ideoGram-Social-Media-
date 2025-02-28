import { createSlice } from "@reduxjs/toolkit";

const ChatSlice = createSlice({
  name: "message",
  initialState: {
    message: [],
    messagelength: null
  },
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setmessagelength: (state, action) => {
      state.messagelength = action.payload;
    }
  }
})

export const { setMessage, setmessagelength } = ChatSlice.actions;
export default ChatSlice.reducer;