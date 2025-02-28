import { createSlice } from "@reduxjs/toolkit";

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState: {
    user: null,
    suggesteduser: [],
    userprofile: null,
    selecteduser: null,
    searchName: "",
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    setsuggesteduser: (state, action) => {
      state.suggesteduser = action.payload
    },
    setuserprofile: (state, action) => {
      state.userprofile = action.payload
    },
    setselecteduser: (state, action) => {
      state.selecteduser = action.payload
    },
    setsearchName: (state, action) => {
      state.searchName = action.payload
    }
  }
})

export const { setUser, setsuggesteduser, setuserprofile, setselecteduser, setsearchName } = userAuthSlice.actions;
export default userAuthSlice.reducer;