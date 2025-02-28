import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userAuthslice from './userAuthslice'
import postSlice from "./postslice"
import Socketslice from "./SocketSlice"
import ChatSlice from "./ChatSlice"
import rtnSlice from "./rtnSlice"
import followSlice from "./followSlice"
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { Socket } from 'socket.io-client'
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

const rootReducer = combineReducers({
  userAuth: userAuthslice,
  post: postSlice,
  socket: Socketslice,
  message: ChatSlice,
  realTimeNoti: rtnSlice,
  follow: followSlice
})




const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})


export default store;