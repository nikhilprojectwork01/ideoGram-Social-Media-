import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "realTimeNoti",
  initialState: {
    LikeNotification: [],
  },
  reducers: {
    setLikeNotification: (state, action) => {
      //type sending form post slice
      if (action.payload.type === 'Like') {
        state.LikeNotification.push(action.payload)
      } else if (action.payload.type === 'Dislike') {
        state.LikeNotification = state.LikeNotification.filter((item) => item.userId !== action.payload.userId);
      }
    }
  }
})

export const { setLikeNotification, setrecievedMessage } = rtnSlice.actions;
export default rtnSlice.reducer
