import { configureStore } from '@reduxjs/toolkit'
import userReducer from './redux/slices/userSlice'
import creditReducer from './redux/slices/creditSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    credit: creditReducer
  },
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
