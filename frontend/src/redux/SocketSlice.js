import { createSlice } from "@reduxjs/toolkit";

const Socketslice = createSlice({
  name: "socket",
  initialState: {
    socket: null,
    onlineuser: [null]
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload
    },
    setonlineuser: (state, action) => {
      state.onlineuser = action.payload
    }
  }
})

export const { setSocket, setonlineuser } = Socketslice.actions;
export default Socketslice.reducer
